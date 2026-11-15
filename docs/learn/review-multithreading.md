---
title: "Code Review — Многопоточность"
outline: [2, 3]
---
# Code Review — Многопоточность

Теория: [перейти к соответствующей теме](/learn/multithreading).

## 1. Исправить BookingService для корректного конкурентного бронирования
**Условие задачи:**  
Дан Spring-сервис бронирования гостиничных номеров.

У номера есть два состояния:

- `VACANT` — свободен;
    
- `BOOKED` — забронирован.
    

Метод `bookRoom()` должен забронировать номер за текущим клиентом только в том случае, если номер ещё свободен.

Необходимо провести code review и объяснить, почему реализация может успешно проходить тесты, но некорректно работать в production при нескольких одновременных запросах.

**Код:**

```java
@Service
class BookingService {

    @Autowired
    private RoomRepository roomRepository;

    public boolean bookRoom(Integer roomId) {
        boolean roomBooked = false;

        Room room = roomRepository.findById(roomId);

        if (room.getStatus() == "VACANT") {
            room.setStatus("BOOKED");
            room.setClientId(SecurityContext.getClientId());

            roomRepository.save(room);
            roomBooked = true;
        }

        return roomBooked;
    }
}

@Entity
class Room {

    @Id
    private Integer id;

    private String status;
    private String clientId;
    private String roomNumber;
}

public interface RoomRepository
        extends JpaRepository<Room, Integer> {
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Главная проблема проявится, когда два запроса одновременно попытаются забронировать один номер.  
💡 Простого `@Transactional` недостаточно: две транзакции всё равно могут одновременно прочитать `VACANT`.  
💡 `synchronized` также не решает задачу в нескольких экземплярах приложения.  
💡 Самый простой вариант — выполнить атомарный `UPDATE ... WHERE status = VACANT` и проверить количество изменённых строк.  
💡 Статус лучше представить через `enum`, а не через `String`.  
:::

---

::: details Решение

Основная проблема — **race condition**.

Представим два одновременных запроса:

```text
Клиент A                     Клиент B
   │                            │
   ├─ читает Room              ├─ читает Room
   │  status = VACANT          │  status = VACANT
   │                            │
   ├─ status = BOOKED          ├─ status = BOOKED
   ├─ clientId = A             ├─ clientId = B
   │                            │
   └─ save()                   └─ save()
```

Оба запроса увидели свободный номер и оба считают, что успешно его забронировали.

В результате последний `UPDATE` перезапишет `clientId` первого клиента.

Именно поэтому проблема может почти не проявляться на тестовом стенде с небольшой нагрузкой, но регулярно возникать в production.

---

Оптимальный для данного случая вариант — выполнить проверку статуса и изменение записи **одной атомарной SQL-операцией**.

Сначала лучше заменить строковый статус на `enum`:

```java
public enum RoomStatus {
    VACANT,
    BOOKED
}
```

Сущность:

```java
@Entity
public class Room {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    private String clientId;
    private String roomNumber;
}
```

Репозиторий:

```java
public interface RoomRepository
        extends JpaRepository<Room, Integer> {

    @Modifying
    @Query("""
            update Room r
               set r.status = :booked,
                   r.clientId = :clientId
             where r.id = :roomId
               and r.status = :vacant
            """)
    int bookIfVacant(
            @Param("roomId") Integer roomId,
            @Param("clientId") String clientId,
            @Param("vacant") RoomStatus vacant,
            @Param("booked") RoomStatus booked
    );
}
```

Сервис:

```java
@Service
public class BookingService {

    private final RoomRepository roomRepository;

    public BookingService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Transactional
    public boolean bookRoom(Integer roomId) {
        Objects.requireNonNull(roomId, "roomId");

        String clientId = SecurityContext.getClientId();

        if (clientId == null || clientId.isBlank()) {
            throw new IllegalStateException(
                    "Не удалось определить клиента"
            );
        }

        int updated = roomRepository.bookIfVacant(
                roomId,
                clientId,
                RoomStatus.VACANT,
                RoomStatus.BOOKED
        );

        return updated == 1;
    }
}
```

Ключевая операция фактически сводится к:

```sql
UPDATE room
SET status = 'BOOKED',
    client_id = :clientId
WHERE id = :roomId
  AND status = 'VACANT';
```

Если два запроса одновременно пытаются забронировать один номер, успешно изменить строку сможет только один из них.

Результат будет примерно таким:

```text
Клиент A:
UPDATE ... WHERE status = VACANT
→ updated = 1
→ true

Клиент B:
UPDATE ... WHERE status = VACANT
→ updated = 0
→ false
```

То есть проверка:

```text
свободен ли номер?
```

и действие:

```text
забронировать номер
```

больше не являются двумя отдельными операциями. Они выполняются атомарно на стороне БД.

Это особенно важно, если приложение запущено в нескольких pod'ах:

```text
pod-1 ─┐
pod-2 ─┤
pod-3 ─┼── PostgreSQL
...    │
pod-N ─┘
```

Использовать:

```java
synchronized
```

для решения этой проблемы недостаточно. Он синхронизирует потоки только внутри одного JVM-процесса и никак не защищает от параллельного запроса из другого pod'а.

---

Есть и другие проблемы в исходном коде.

`JpaRepository.findById()` возвращает:

```java
Optional<Room>
```

поэтому такой код некорректен:

```java
Room room = roomRepository.findById(roomId);
```

При обычном чтении требовалось бы:

```java
Room room = roomRepository.findById(roomId)
        .orElseThrow(() ->
                new EntityNotFoundException(
                        "Room not found: " + roomId
                )
        );
```

Но в предложенном варианте предварительное чтение вообще не требуется.

Также нельзя сравнивать строки так:

```java
room.getStatus() == "VACANT"
```

`==` сравнивает ссылки на объекты, а не содержимое строк.

Можно было бы написать:

```java
"VACANT".equals(room.getStatus())
```

но для конечного набора состояний лучше использовать `enum`.

---

Простое добавление:

```java
@Transactional
public boolean bookRoom(...)
```

**не решает гонку само по себе**.

При стандартном уровне изоляции две транзакции могут выполнить:

```text
T1: SELECT → VACANT
T2: SELECT → VACANT
```

и затем обе попытаться изменить запись.

Транзакция обеспечивает атомарность набора операций, но не превращает последовательность `SELECT → проверка → UPDATE` автоматически в взаимное исключение.

---

Альтернативный вариант — пессимистическая блокировка:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("select r from Room r where r.id = :id")
Optional<Room> findByIdForUpdate(
        @Param("id") Integer id
);
```

и затем:

```java
@Transactional
public boolean bookRoom(Integer roomId) {
    Room room = roomRepository.findByIdForUpdate(roomId)
            .orElseThrow();

    if (room.getStatus() != RoomStatus.VACANT) {
        return false;
    }

    room.setStatus(RoomStatus.BOOKED);
    room.setClientId(SecurityContext.getClientId());

    return true;
}
```

Вторая транзакция будет ждать освобождения блокировки первой.

Такой подход корректен, но для простой операции «забронировать, только если свободно» условный `UPDATE` обычно проще и требует меньше работы:

```text
SELECT + LOCK + UPDATE
```

против:

```text
UPDATE ... WHERE status = VACANT
```

---

Ещё один вариант — optimistic locking через:

```java
@Version
private Long version;
```

Тогда при конкурентном изменении одна из транзакций получит `OptimisticLockException`.

Это удобно для более сложной бизнес-логики, но для конкретной задачи атомарный conditional update является наиболее прямым решением.

Основные проблемы исходного кода:

- возможна двойная бронь из-за race condition;
    
- `@Transactional` без блокировки не устраняет гонку;
    
- `synchronized` не работает между pod'ами;
    
- `findById()` возвращает `Optional`;
    
- строки сравниваются через `==`;
    
- статус лучше хранить как `enum`;
    
- используется field injection;
    
- выполняются лишние `SELECT` и `save()`, хотя задачу можно решить одним `UPDATE`.
    

Для данного сценария предпочтительная схема:

```text
bookRoom()
    ↓
UPDATE room
WHERE id = ?
  AND status = VACANT
    ↓
updated == 1 → бронь успешна
updated == 0 → номер уже занят или отсутствует
```

Она корректно работает и при нескольких потоках, и при нескольких экземплярах приложения.

:::

---

## 2. Сделать ревью потокобезопасного сервиса сохранения заданий и работ
**Условие задачи:**  
Дан Spring-сервис, который должен сохранять сущности двух типов — `Task` и `Work`. Сервис может вызываться одновременно из REST-контроллера и Kafka listener.

Нужно провести code review, проверить корректность многопоточной работы и выполнить рефакторинг так, чтобы сервис безопасно обрабатывал параллельные вызовы и корректно сохранял сущность нужного типа.

**Код:**

```java
@Component
public class MyShinyService {

    @Autowired
    private final TaskRepository taskRepository;

    @Autowired
    private final WorkRepository workRepository;

    // for concurrency safety
    private final Task task;

    @Transactional
    public synchronized accumulateTask(Task task) {
        this.task = task;
    }

    @Transactional
    public synchronized void saveTask() {
        System.out.println(""saving process has started"");

        String task = ""task"";

        if (this.task.type == task) {
            this.taskRepository.save(
                    new TaskEntity(
                            UUID.randomUUID(),
                            this.task.id.toString(),
                            this.task.name
                    )
            );
        } else {
            this.workRepository.save(
                    new WorkEntity(
                            UUID.randomUUID(),
                            this.task.id.toString(),
                            this.task.name
                    )
            );
        }

        System.out.println(""saved"");
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Проверь, компилируются ли `final`-поля и `accumulateTask()`.  
💡 Spring-сервис обычно singleton, поэтому хранить текущую задачу в поле опасно.  
💡 Два `synchronized`-метода не делают цепочку из двух вызовов атомарной.  
💡 Для REST и Kafka стоит учитывать повторную обработку одного задания.  
:::

---

::: details Решение

**Проблемы:**

- `accumulateTask()` не имеет возвращаемого типа;
    
- `taskRepository`, `workRepository` и `task` объявлены `final`, но не инициализируются конструктором;
    
- `this.task = task` невозможно для `final`-поля;
    
- сервис хранит изменяемое состояние в singleton-бине;
    
- `synchronized` защищает каждый метод отдельно, но не всю последовательность `accumulateTask()` → `saveTask()`;
    
- `saveTask()` может быть вызван до установки `task`;
    
- `synchronized` не защищает между несколькими экземплярами приложения;
    
- строки сравниваются через `==`;
    
- `@Transactional` на `accumulateTask()` не нужен — там нет работы с БД;
    
- field injection лучше заменить constructor injection;
    
- строковый тип лучше заменить на `enum`;
    
- `System.out.println()` лучше заменить логгером;
    
- при Kafka redelivery или REST retry возможны дубликаты.
    

**Главная проблема — состояние внутри сервиса.**

Например:

```text
Thread 1: accumulateTask(task1)
Thread 2: accumulateTask(task2)
Thread 1: saveTask()
```

К моменту `saveTask()` в поле уже находится `task2`. Поэтому безопаснее вообще не хранить текущую задачу в сервисе, а передавать её непосредственно в метод сохранения.

```java
@Service
@RequiredArgsConstructor
public class MyShinyService {

    private final TaskRepository taskRepository;
    private final WorkRepository workRepository;

    @Transactional
    public UUID save(Task task) {
        validate(task);

        UUID entityId = UUID.randomUUID();

        switch (task.getType()) {
            case TASK -> taskRepository.save(
                    new TaskEntity(
                            entityId,
                            task.getId().toString(),
                            task.getName()
                    )
            );

            case WORK -> workRepository.save(
                    new WorkEntity(
                            entityId,
                            task.getId().toString(),
                            task.getName()
                    )
            );
        }

        return entityId;
    }

    private void validate(Task task) {
        if (task == null
                || task.getId() == null
                || task.getType() == null
                || task.getName() == null
                || task.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid task"
            );
        }
    }
}
```

Тип лучше задать явно:

```java
public enum TaskType {
    TASK,
    WORK
}
```

Теперь сервис **stateless**: каждый вызов работает только со своим объектом, поэтому `synchronized` не нужен.

Если метод вызывается из Kafka или REST с возможными retry, дополнительно нужна идемпотентность. Например, исходный `task.id` можно хранить с `UNIQUE`-ограничением, чтобы повторная обработка не создавала вторую запись.

:::

---

## 3. Исправить синхронизацию критической секции между потоками
**Условие задачи:**  
Дан сервис, метод которого одновременно вызывается из двух потоков. Часть метода является критической секцией и должна выполняться только одним потоком в каждый момент времени.

Нужно провести code review, найти ошибки в запуске потоков и синхронизации, а затем предложить корректный вариант реализации.

**Код:**

```java
class Main{
void main(){
    execute(()->new Service.doSome());
    execute(()->new Service.doSome());
}
}

class Service{
    void doSome(){
        Object obj = new Object();
        //code
        synchronized(obj){
            //code
        }
        //code
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для взаимного исключения оба потока должны синхронизироваться на одном и том же объекте.  
💡 Проверь, где создаётся объект-монитор.  
💡 Если используется монитор экземпляра сервиса, оба потока должны работать с одним экземпляром `Service`.  
💡 Проверь синтаксис создания объекта и вызова `doSome()`.  
:::

---

::: details Решение

**Проблемы:**

- `Object obj = new Object()` создаётся при каждом вызове, поэтому потоки получают разные мониторы;
    
- критическая секция фактически не защищена от параллельного выполнения;
    
- `new Service.doSome()` — некорректный вызов конструктора и метода;
    
- если каждый поток создаст собственный `Service`, синхронизация на поле экземпляра или `this` тоже не поможет;
    
- блокировать весь `doSome()` необязательно, если защищать нужно только небольшую критическую секцию.
    

**Как лучше исправить**

Создать один объект `Service` и один общий монитор внутри него:

```java
class Main {

    public static void main(String[] args) {
        Service service = new Service();

        execute(service::doSome);
        execute(service::doSome);
    }

    static void execute(Runnable runnable) {
        new Thread(runnable).start();
    }
}

class Service {

    private final Object lock = new Object();

    void doSome() {
        // code

        synchronized (lock) {
            // critical section
        }

        // code
    }
}
```

Оба потока вызывают метод одного экземпляра `Service`, поэтому используют один и тот же `lock`. В критическую секцию одновременно сможет войти только один поток.

Если вся критическая логика вынесена в отдельный метод, можно синхронизироваться на `this`:

```java
class Service {

    void doSome() {
        // code
        critical();
        // code
    }

    private synchronized void critical() {
        // critical section
    }
}
```

Такой вариант также работает, пока оба потока используют **один экземпляр `Service`**.

Важно: `synchronized` обеспечивает синхронизацию только внутри одной JVM. Если приложение работает в нескольких экземплярах, для общей внешней критической секции потребуется другой механизм — например, блокировка на уровне БД или распределённый lock.

:::

---

## 4. Провести ревью PaymentService и исправить перевод между счетами
**Условие задачи:**  
Дан сервис перевода денег между двумя счетами. Метод должен получить счета из БД, изменить их балансы и отправить уведомления владельцам.

Нужно провести code review: найти ошибки компиляции и логики, проверить Dependency Injection и транзакционность операции, а также предложить исправленный вариант с сохранением общей структуры сервиса.

**Код:**

```java
@Component
public class PaymentService{

    @Autowired
    private ComissionServiceImpl comissionService;

    private NotificationService notificationService = new NotificationServiceImpl();

    @Autowired
    private AccountRepository accountRepository;

    public void makePayment(AccountDto acc1, AccountDto acc2, Integer moneyAmount){
        System.out.println(""Start payment"");
        var account1 = accountRepository.findById(acc1.getAccountId());
        var account2 = accountRepository.findById(acc1.getAccountId());
        transfer(account1, account2, moneyAmount);
        notificationService.sendNotification(account1.getAccountId());
        notificationService.sendNotification(account2.getAccountId());
        System.out.println(""End payment"");
    }

    @Transactional
    public void transfer(Account acc1, Account acc2, Integer moneyAmount){
        account1.setMoneyAmount(account1.getMoneyAmount() - moneyAmount);
        account2.setMoneyAmount(account2.getMoneyAmount() + moneyAmount);
    }

}

public class AccountDto {
    private UUID accountId;
    private Integer moneyAmount;
}

@Entity
@Table
public class Account{

    @Id
    private UUID accountId;
    private Integer moneyAmount;
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Проверь, какой тип возвращает `findById()`.  
💡 Обрати внимание, какой `accountId` используется при загрузке второго счёта.  
💡 `@Transactional` вызывается через Spring proxy — внутренний вызов метода имеет значение.  
💡 Для всех зависимостей лучше использовать один способ DI.  
💡 Подумай, что произойдёт при двух одновременных переводах с одного счёта.  
:::

---

::: details Решение

**Проблемы:**

- смешаны field injection и ручное создание зависимости через `new`;
    
- сервис зависит от конкретного `ComissionServiceImpl`, а не от интерфейса;
    
- `comissionService` вообще не используется;
    
- при загрузке второго счёта ошибочно используется `acc1.getAccountId()`;
    
- Spring Data `findById()` возвращает `Optional<Account>`, а код работает с результатом как с `Account`;
    
- в `transfer()` используются переменные `account1` и `account2`, которых в этом методе нет;
    
- `@Transactional` на `transfer()` не сработает при вызове из `makePayment()` того же объекта;
    
- нет проверки входных DTO, идентификаторов и суммы;
    
- не проверяется достаточность средств;
    
- не обработан перевод на тот же счёт;
    
- конкурентные переводы могут привести к lost update;
    
- уведомления нельзя считать частью транзакции БД: они могут уйти до commit;
    
- `System.out.println()` лучше заменить логгером;
    
- `AccountDto.moneyAmount` для команды перевода не нужен, если сумма передаётся отдельным параметром.
    

**Как лучше исправить**

Транзакционную операцию с БД лучше вынести в отдельный сервис. Это одновременно решает проблему self-invocation и позволяет не держать отправку уведомлений внутри транзакции.

```java
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionService transactionService;
    private final NotificationService notificationService;

    public void makePayment(
            AccountDto from,
            AccountDto to,
            Integer amount
    ) {
        if (from == null || to == null
                || from.getAccountId() == null
                || to.getAccountId() == null) {
            throw new IllegalArgumentException(
                    "Accounts must be specified"
            );
        }

        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException(
                    "Amount must be positive"
            );
        }

        if (from.getAccountId().equals(to.getAccountId())) {
            throw new IllegalArgumentException(
                    "Accounts must be different"
            );
        }

        transactionService.transfer(
                from.getAccountId(),
                to.getAccountId(),
                amount
        );

        notificationService.sendNotification(
                from.getAccountId()
        );
        notificationService.sendNotification(
                to.getAccountId()
        );
    }
}
```

Транзакционная часть:

```java
@Service
@RequiredArgsConstructor
public class PaymentTransactionService {

    private final AccountRepository accountRepository;

    @Transactional
    public void transfer(
            UUID fromId,
            UUID toId,
            Integer amount
    ) {
        Account from = accountRepository.findById(fromId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Account not found: " + fromId
                        )
                );

        Account to = accountRepository.findById(toId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Account not found: " + toId
                        )
                );

        if (from.getMoneyAmount() < amount) {
            throw new IllegalStateException(
                    "Insufficient funds"
            );
        }

        from.setMoneyAmount(
                from.getMoneyAmount() - amount
        );

        to.setMoneyAmount(
                to.getMoneyAmount() + amount
        );
    }
}
```

Так как `Account` загружены внутри транзакции и остаются managed entity, отдельный `save()` обычно не требуется — изменения будут сохранены через dirty checking.

При реальных конкурентных переводах одной `@Transactional` недостаточно. Два запроса могут одновременно прочитать один баланс и потерять обновление. Для банковского сценария нужна стратегия конкурентного доступа: например, pessimistic locking с одинаковым порядком блокировки счетов либо optimistic locking через `@Version` и retry.

Уведомление также лучше отправлять только **после успешного commit** — через `@TransactionalEventListener(AFTER_COMMIT)` или outbox, если требуется надёжная доставка.

Для денежных значений тип должен соответствовать модели хранения: если `Integer` означает минимальные денежные единицы, например копейки, это допустимо; если хранятся дробные суммы, нужен `BigDecimal`.

:::

---

