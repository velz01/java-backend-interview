---
title: "Code Review — Spring"
outline: [2, 3]
---
# Code Review — Spring

Теория: [перейти к соответствующей теме](/learn/spring).

## 1. Исправить ошибки в Spring Boot приложении
**Условие задачи:**  
Необходимо провести рефакторинг Spring Boot приложения и исправить ошибки в структуре и коде.

Нужно обратить внимание на:

- расположение классов и пакетов;
    
- component scanning Spring Boot;
    
- корректные импорты аннотаций;
    
- синтаксис `@GetMapping`;
    
- корректную регистрацию контроллера в Spring Context.
    

**Код:**

```java
package com.home.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

package com.home.controller;

@Controller
public class Controller {

    @GetMapping("/")
    public String test() {
        return "test";
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 В одном `.java`-файле не может быть нескольких объявлений `package`.  
💡 `@Controller` находится в `org.springframework.stereotype`.  
💡 `@GetMapping` находится в `org.springframework.web.bind.annotation`.  
💡 Обрати внимание, от какого пакета Spring Boot начинает поиск компонентов.  
💡 Главный класс приложения лучше разместить в общем родительском пакете для остальных компонентов.  
:::

---

::: details Решение

Удобная структура проекта:

```text
com.home
├── App.java
└── controller
    └── HomeController.java
```

`App.java`:

```java
package com.home;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

`HomeController.java`:

```java
package com.home.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String test() {
        return "test";
    }
}
```

Каждый файл содержит только одно объявление:

```java
package ...
```

и находится в директории, соответствующей своему пакету.

Важная проблема исходной структуры связана с расположением главного класса:

```text
com.home.app.App
com.home.controller.Controller
```

`@SpringBootApplication` включает поиск компонентов начиная с пакета, в котором расположен класс приложения, и его подпакетов.

Если `App` находится в:

```text
com.home.app
```

то автоматически сканируются:

```text
com.home.app
com.home.app.*
```

Но пакет:

```text
com.home.controller
```

является соседним, а не дочерним. Поэтому контроллер может не попасть в Spring Context.

Размещение `App` в общем корневом пакете:

```text
com.home
```

решает эту проблему:

```text
com.home
├── App
└── controller
    └── HomeController
```

Теперь `com.home.controller` входит в область component scanning.

Также должны использоваться правильные импорты:

```java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
```

Аннотация маршрута записывается как:

```java
@GetMapping("/")
```

Метод:

```java
public String test() {
    return "test";
}
```

при использовании `@Controller` возвращает **имя представления** `test`. То есть Spring MVC будет искать соответствующий шаблон, например `test.html`, если подключён шаблонизатор.

Если задача состоит именно в том, чтобы по запросу `/` вернуть текст:

```text
test
```

то контроллер можно сделать REST-контроллером:

```java
package com.home.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String test() {
        return "test";
    }
}
```

В этом случае строка `"test"` будет записана непосредственно в HTTP response body.

Основные исправления:

- классы разделены по отдельным файлам;
    
- главный класс перенесён в общий родительский пакет;
    
- контроллер попадает в component scanning;
    
- добавлены правильные импорты;
    
- исправлен синтаксис `@GetMapping`;
    
- имя `Controller` заменено на более понятное `HomeController`;
    
- уточнена разница между `@Controller` и `@RestController`.
    

:::

---

## 2. Провести code review и рефакторинг OrderService
**Условие задачи:**  
Дан Spring-сервис обработки заказов.

Необходимо провести code review и ответить на вопросы:

- как валидировать входящий по REST `OrderDto`;
    
- где выполнять проверки на `null`;
    
- какие обязанности оставить в `OrderService`;
    
- когда откатится транзакция `processOrder()`;
    
- как разделить ответственность класса по SRP;
    
- какие данные сохранять в БД;
    
- какие проблемы возможны при сохранении заказа;
    
- что произойдёт при исключении из `saveOrder()`;
    
- как корректно уменьшать остатки товаров;
    
- будут ли автоматически сформированы методы Spring Data Repository;
    
- где писать кастомные запросы;
    
- какие ещё архитектурные и технические проблемы есть в коде.
    

**Код:**

```java
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void processOrder(Order order) {
        validateOrder(order);

        calculateTotalPrice(
                order.getItems(),
                order.getCustomerType()
        );

        saveOrder(order);
        notifyCustomer(order);
        updateInventory(order);
    }

    public double calculateTotalPrice(
            List<OrderItem> items,
            String customerType
    ) {
        double total = items.stream()
                .mapToDouble(
                        item -> item.getPrice()
                                * item.getQuantity()
                )
                .sum();

        if ("VIP".equals(customerType)) {
            total *= 0.9;
        } else if ("LOYALTY".equals(customerType)) {
            total *= 0.85;
        }

        if (orderRepository.countByCustomerType(
                customerType
        ) > 10) {
            total *= 0.95;
        }

        return total;
    }

    private void saveOrder(Order order) {
        orderRepository.save(order);
    }

    private void updateInventory(Order order) {
        order.getItems().forEach(item ->
                inventoryRepository.decreaseStock(
                        item.getProductId(),
                        item.getQuantity()
                )
        );
    }
}

@Repository
public interface OrderRepository
        extends JpaRepository<Order, Long> {

    int countByCustomerType(String customerType);

    Order findByOrderId(Long id);
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для REST DTO используй Bean Validation: `@NotNull`, `@NotEmpty`, `@Positive`, `@Valid`.  
💡 Для денег нельзя использовать `double` — лучше `BigDecimal`.  
💡 Результат `calculateTotalPrice()` сейчас вообще нигде не сохраняется.  
💡 `@Transactional` откатывает транзакцию по умолчанию при неперехваченном `RuntimeException` или `Error`.  
💡 Отправка уведомления внутри DB-транзакции создаёт проблему: внешний эффект нельзя откатить вместе с БД.  
💡 Остаток товара нужно уменьшать атомарно: `UPDATE ... WHERE stock >= quantity`.  
💡 Spring Data сможет создать derived query только тогда, когда указанные в имени метода свойства действительно существуют в `Order`.  
:::

---

::: details Решение

В классе есть несколько функциональных и архитектурных проблем.

**1. Рассчитанная стоимость заказа теряется**

Сейчас выполняется:

```java
calculateTotalPrice(
        order.getItems(),
        order.getCustomerType()
);
```

но результат метода игнорируется.

То есть даже если цена рассчитана правильно, в `Order` она не записывается.

Должно быть примерно так:

```java
BigDecimal total =
        pricingService.calculateTotalPrice(order);

order.setTotalPrice(total);
```

И уже после этого заказ сохраняется.

---

**2. Для денег нельзя использовать `double`**

Код:

```java
double total
```

и коэффициенты:

```java
0.9
0.85
0.95
```

могут приводить к ошибкам двоичной арифметики с плавающей точкой.

Для денежных значений лучше использовать:

```java
BigDecimal
```

Например:

```java
BigDecimal total = items.stream()
        .map(item ->
                item.getPrice().multiply(
                        BigDecimal.valueOf(
                                item.getQuantity()
                        )
                )
        )
        .reduce(
                BigDecimal.ZERO,
                BigDecimal::add
        );
```

Если `price` сейчас тоже `double`, его стоит заменить на `BigDecimal`.

---

**3. Как валидировать OrderDto**

В REST-слое удобно использовать Bean Validation.

Например:

```java
public class OrderDto {

    @NotNull
    private Long customerId;

    @NotNull
    private CustomerType customerType;

    @NotEmpty
    @Valid
    private List<OrderItemDto> items;
}
```

Элемент заказа:

```java
public class OrderItemDto {

    @NotNull
    private Long productId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal price;

    @Positive
    private int quantity;
}
```

Контроллер:

```java
@PostMapping("/orders")
public ResponseEntity<Void> create(
        @Valid @RequestBody OrderDto orderDto
) {
    orderService.processOrder(orderDto);

    return ResponseEntity.ok().build();
}
```

Для Spring Boot 3 используются аннотации из:

```text
jakarta.validation
```

Так следует проверять **структурную корректность входного запроса**:

- обязательные поля;
    
- пустые коллекции;
    
- положительные количества;
    
- формат значений.
    

Бизнес-валидация вроде:

```text
товар существует
товар доступен для продажи
клиент имеет право оформить заказ
остатка достаточно
```

должна выполняться уже в бизнес-слое.

---

**4. Где проверять параметры на null**

Основная проверка входящего REST DTO выполняется на границе приложения:

```java
@Valid @RequestBody OrderDto dto
```

Но публичный сервисный метод лучше не делать зависимым исключительно от того, что его всегда вызовет REST-контроллер.

Для критичных параметров допустимо дополнительно защищать контракт:

```java
Objects.requireNonNull(orderDto, "orderDto");
```

Не следует при этом хаотично дублировать `null`-проверки во всех приватных методах.

Общий принцип:

```text
REST boundary
    → синтаксическая валидация DTO

Application/Domain layer
    → бизнес-инварианты
```

---

**5. Что оставить в OrderService**

`OrderService` разумно оставить application service, то есть координатором сценария:

```text
проверить бизнес-правила
        ↓
посчитать стоимость
        ↓
уменьшить остатки
        ↓
сохранить заказ
        ↓
зафиксировать событие о создании заказа
```

Сам `OrderService` не должен знать детали:

- расчёта всех скидок;
    
- SQL обновления склада;
    
- отправки email/push;
    
- сложной бизнес-валидации.
    

---

**6. Нарушение SRP**

Сейчас один класс одновременно:

```text
валидирует заказ
+
считает стоимость
+
считает скидки
+
ходит в OrderRepository
+
управляет складом
+
отправляет уведомления
```

Это несколько причин для изменения одного класса.

Можно разделить ответственность:

```text
OrderService
    → orchestration

OrderValidator
    → бизнес-валидация

PricingService
    → цена

DiscountPolicy
    → конкретная скидка

InventoryService
    → остатки

OrderRepository
    → persistence

Notification / Outbox
    → уведомления
```

---

**7. Скидки также реализованы проблемно**

Сейчас:

```java
if ("VIP".equals(customerType)) {
    ...
} else if ("LOYALTY".equals(customerType)) {
    ...
}
```

При добавлении нового типа клиента приходится менять существующий метод.

Здесь хорошо подходит Strategy:

```java
public interface DiscountPolicy {

    CustomerType supports();

    BigDecimal apply(
            BigDecimal price,
            Customer customer
    );
}
```

Например:

```text
VipDiscountPolicy
LoyaltyDiscountPolicy
RegularDiscountPolicy
```

---

**8. Проверка постоянного клиента выглядит логически неверной**

В коде:

```java
orderRepository.countByCustomerType(customerType)
```

и далее:

```java
if (...) > 10 {
    total *= 0.95;
}
```

Комментарий говорит:

```text
Доп. скидка для постоянных клиентов
```

Но запрос считает заказы **всех клиентов данного типа**.

Например, если в системе есть 1000 VIP-заказов разных людей, любой новый VIP сразу получит скидку «за постоянство».

Если правило действительно относится к конкретному клиенту, вероятнее нужен запрос вроде:

```java
long countByCustomerId(Long customerId);
```

а ещё лучше учитывать только успешно завершённые заказы:

```java
long countByCustomerIdAndStatus(
        Long customerId,
        OrderStatus status
);
```

---

**9. Когда откатится processOrder()**

По умолчанию:

```java
@Transactional
```

откатывает транзакцию, если наружу из метода выйдет:

```text
RuntimeException
или
Error
```

Например:

```java
throw new IllegalStateException();
```

приведёт к rollback.

Checked exception по умолчанию rollback не вызывает.

Если нужно:

```java
@Transactional(rollbackFor = Exception.class)
```

Также транзакция должна быть вызвана через Spring proxy. Если `processOrder()` вызывается через:

```java
this.processOrder(...)
```

из другого метода того же класса, стандартный proxy-based `@Transactional` не сработает.

Если исключение поймано:

```java
try {
    ...
} catch (RuntimeException e) {
    // ничего
}
```

и не проброшено дальше, транзакция обычно продолжит выполнение, если она отдельно не была помечена `rollbackOnly`.

---

**10. Что произойдёт, если saveOrder() выбросит exception**

Если:

```java
orderRepository.save(order);
```

выбросит неперехваченный `RuntimeException`, например Spring `DataAccessException`, выполнение `processOrder()` прекратится.

То есть:

```text
saveOrder()
   ↓ exception

notifyCustomer()   ← уже не вызывается
updateInventory()  ← уже не вызывается
```

Транзакция будет откатываться.

Но с JPA есть важный нюанс.

Вызов:

```java
repository.save(order);
```

не всегда означает, что SQL уже отправлен в БД.

Hibernate может выполнить реальный `INSERT` только во время:

```text
flush
или
commit
```

Поэтому нарушение constraint может обнаружиться **после выполнения следующего кода**.

Это особенно важно из-за `notifyCustomer()`.

---

**11. notifyCustomer() внутри транзакции опасен**

Сейчас последовательность:

```text
saveOrder
↓
notifyCustomer
↓
updateInventory
↓
COMMIT
```

Представим:

```text
saveOrder()          → пока всё нормально
notifyCustomer()     → клиенту отправлено "Заказ создан"
updateInventory()    → exception
transaction          → ROLLBACK
```

В БД заказа нет, но клиент уже получил уведомление.

Внешний вызов невозможно откатить вместе с JDBC-транзакцией.

Для надёжной системы лучше использовать **Transactional Outbox**:

```text
DB transaction:
    сохранить Order
    изменить Inventory
    сохранить OutboxEvent

COMMIT

отдельный worker:
    читает Outbox
    отправляет notification
```

Тогда заказ и событие фиксируются атомарно в одной БД.

---

**12. Что уменьшается в updateInventory()**

Метод:

```java
inventoryRepository.decreaseStock(
        item.getProductId(),
        item.getQuantity()
);
```

по названию должен **уменьшать** остаток.

То есть:

```text
stock = stock - quantity
```

Если было:

```text
stock = 10
quantity = 3
```

после операции ожидается:

```text
stock = 7
```

---

**13. Как должен работать decreaseStock()**

Просто сначала прочитать остаток, а потом сохранить новое значение — недостаточно при конкурентных заказах.

Например:

```text
stock = 1

Order A читает 1
Order B читает 1

A списывает 1
B списывает 1
```

Оба могут считать товар доступным.

Лучше выполнить атомарный запрос:

```java
@Modifying
@Query("""
        update Inventory i
           set i.stock = i.stock - :quantity
         where i.productId = :productId
           and i.stock >= :quantity
        """)
int decreaseStock(
        @Param("productId") Long productId,
        @Param("quantity") int quantity
);
```

И проверить результат:

```java
int updated = repository.decreaseStock(
        productId,
        quantity
);

if (updated != 1) {
    throw new OutOfStockException(productId);
}
```

Таким образом, БД атомарно проверяет наличие товара и уменьшает остаток.

---

**14. Будет ли работать countByCustomerType()**

Метод:

```java
int countByCustomerType(String customerType);
```

может быть автоматически реализован Spring Data **только если в `Order` существует свойство `customerType`**.

Например:

```java
private String customerType;
```

или совместимое поле с соответствующим property accessor.

Тогда Spring Data построит derived query самостоятельно.

Если такого свойства у `Order` нет, приложение получит ошибку при создании repository bean.

Компилятор Java такую проблему не обнаружит.

Также для количества записей естественнее возвращать:

```java
long
```

поскольку Spring Data `count...` обычно семантически соответствует `long`.

---

**15. Будет ли работать findByOrderId()**

Это зависит от полей сущности.

```java
Order findByOrderId(Long id);
```

ищет property path, соответствующий `orderId`.

Если сущность содержит:

```java
private Long orderId;
```

такой derived query возможен.

Но если первичный ключ выглядит стандартно:

```java
@Id
private Long id;
```

то этот метод лишний.

`JpaRepository` уже предоставляет:

```java
Optional<Order> findById(Long id);
```

Следует использовать:

```java
orderRepository.findById(id);
```

Если свойства `orderId` или подходящего property path в `Order` нет, Spring Data не сможет создать запрос и repository может не подняться при старте приложения.

---

**16. Где писать SQL в Repository**

Для стандартных запросов SQL вообще не нужен.

Можно использовать derived query:

```java
long countByCustomerId(Long customerId);
```

Spring Data сформирует запрос самостоятельно.

Если нужен собственный JPQL:

```java
@Query("""
        select count(o)
        from Order o
        where o.customer.id = :customerId
        """)
long countOrders(
        @Param("customerId") Long customerId
);
```

Если нужен именно native SQL:

```java
@Query(
        value = """
                select count(*)
                from orders
                where customer_id = :customerId
                """,
        nativeQuery = true
)
long countOrders(
        @Param("customerId") Long customerId
);
```

Для `UPDATE`/`DELETE` дополнительно нужен:

```java
@Modifying
```

---

**17. Что записывать в таблицу**

Конкретная структура `Order` в условии не показана, поэтому полный набор колонок определить нельзя.

Но как минимум сохраняемый заказ должен содержать результат бизнес-расчётов, а не только исходный request.

Например:

```text
Order
----------------
id
customer_id
customer_type
total_price
status
created_at
```

Товары обычно хранят отдельно:

```text
OrderItem
----------------
order_id
product_id
quantity
unit_price
```

Критично то, что вычисленная:

```java
totalPrice
```

должна быть записана в `Order`.

Сейчас этого не происходит.

---

**18. Какие риски есть при сохранении в БД**

В production нужно учитывать:

- нарушение `NOT NULL`;
    
- нарушение `UNIQUE`;
    
- нарушение FK;
    
- optimistic locking conflict;
    
- deadlock;
    
- lock timeout;
    
- потерю соединения;
    
- превышение connection pool;
    
- duplicate request;
    
- повторную отправку одного заказа;
    
- недостаточный остаток товара;
    
- конкурентное изменение остатков;
    
- exception на flush/commit, а не непосредственно на `save()`.
    

Для создания заказа также полезно иметь idempotency key, если вызывающий клиент может повторить HTTP-запрос после timeout.

---

**19. Вариант структуры после рефакторинга**

`OrderService` оставляем координатором use case:

```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderValidator orderValidator;
    private final PricingService pricingService;
    private final InventoryService inventoryService;
    private final OutboxService outboxService;

    public OrderService(
            OrderRepository orderRepository,
            OrderValidator orderValidator,
            PricingService pricingService,
            InventoryService inventoryService,
            OutboxService outboxService
    ) {
        this.orderRepository = orderRepository;
        this.orderValidator = orderValidator;
        this.pricingService = pricingService;
        this.inventoryService = inventoryService;
        this.outboxService = outboxService;
    }

    @Transactional
    public Long processOrder(Order order) {
        Objects.requireNonNull(order, "order");

        orderValidator.validate(order);

        BigDecimal totalPrice =
                pricingService.calculateTotalPrice(order);

        order.setTotalPrice(totalPrice);

        inventoryService.decreaseStock(
                order.getItems()
        );

        Order saved =
                orderRepository.save(order);

        outboxService.saveOrderCreatedEvent(
                saved.getId()
        );

        return saved.getId();
    }
}
```

Если `InventoryRepository`, `OrderRepository` и outbox используют одну БД и один transaction manager, то:

```text
уменьшение stock
+
сохранение order
+
сохранение outbox event
```

фиксируются одной транзакцией.

При ошибке любой из этих операций изменения откатываются вместе.

---

**20. Какие принципы нарушены**

Основной — **SRP**:

```text
OrderService знает слишком много и делает слишком много.
```

Также нарушается **OCP**:

```java
if ("VIP".equals(...)) {
    ...
} else if ("LOYALTY".equals(...)) {
    ...
}
```

Каждый новый тип скидки требует изменения метода.

Поэтому скидки естественно вынести в Strategy.

Есть и нарушение Separation of Concerns: orchestration, pricing, persistence, inventory и notification смешаны в одном классе.

Дополнительно стоит исправить:

- field injection → constructor injection;
    
- `String customerType` → `enum CustomerType`;
    
- `double` → `BigDecimal`;
    
- синхронный notification внутри транзакции → outbox;
    
- неиспользуемый результат `calculateTotalPrice()`;
    
- запрос скидки по `customerType`, если бизнес-правило относится к конкретному клиенту;
    
- конкурентное списание остатков.
    

Главная целевая структура:

```text
Controller
    │
    │ @Valid OrderDto
    ▼
OrderService
    │
    ├── OrderValidator
    ├── PricingService
    │      └── DiscountStrategy
    │
    ├── InventoryService
    │
    ├── OrderRepository
    │
    └── Outbox
             │
             ▼
        Notification
```

Так `OrderService` остаётся координатором бизнес-сценария, а конкретные обязанности разделены между специализированными компонентами.

:::

---

## 3. Провести code review ProductService и ProductController
**Условие задачи:**  
Дан Spring Boot-сервис работы с товарами. Нужно провести code review `ProductController`, `ProductService` и связанных классов: найти ошибки, риски для production и предложить рефакторинг.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Проверь сигнатуру `main()`, Dependency Injection и `final` у Spring-сервиса.  
💡 `parallelStream()` и Spring-транзакции плохо сочетаются: транзакционный контекст привязан к потоку.  
💡 `@Transactional` на `saveProduct()` не сработает при self-invocation.  
💡 Внешний вызов и отправку уведомления не стоит выполнять внутри долгой DB-транзакции.  
💡 Для `getAll()` нужна пагинация.  
:::

---

::: details Решение

Основные проблемы:

- `main()` должен принимать `String[] args`;
    
- field injection вместо constructor injection;
    
- `@RequiredArgsConstructor` в контроллере бесполезен, пока поле не `final`;
    
- `ProductService` лучше не делать `final`, если используются proxy-based `@Transactional`;
    
- `parallelStream()` выполняет работу в других потоках, поэтому одна транзакция `createProducts()` не охватывает весь batch;
    
- `@Transactional` на `saveProduct()` не применяется при вызове `this::saveProduct`;
    
- вызов `inventoryService` внутри транзакции увеличивает её длительность;
    
- уведомление может уйти до commit, а БД затем откатиться;
    
- нет полноценной Bean Validation;
    
- `findAll()` без пагинации плохо масштабируется;
    
- `InterruptedException` нужно обрабатывать с восстановлением interrupt flag;
    
- `@Data` на JPA entity нежелателен из-за автоматически сгенерированных `equals/hashCode/toString`;
    
- логировать целую entity обычно хуже, чем её идентификатор;
    
- опечатки в Lombok-аннотациях не дадут коду скомпилироваться.
    

Исправленная точка входа:

```java
@SpringBootApplication
public class TaskApp {

    public static void main(String[] args) {
        SpringApplication.run(TaskApp.class, args);
    }
}
```

Контроллер:

```java
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
class ProductController {

    private final ProductService productService;

    @PostMapping
    public List<ProductResponse> createProducts(
            @RequestBody @NotEmpty
            @Valid List<ProductCreationRequest> products
    ) {
        return productService.createProducts(products);
    }

    @GetMapping
    public Page<ProductResponse> fetchAll(Pageable pageable) {
        return productService.getAll(pageable);
    }
}
```

DTO лучше валидировать декларативно:

```java
record ProductCreationRequest(
        @NotNull Long productId,
        @NotBlank String productName,
        @NotNull @PositiveOrZero Long price
) {
}
```

Сервис:

```java
@Service
@RequiredArgsConstructor
@Slf4j
class ProductService {

    private final ProductRepository repository;
    private final InventoryService inventoryService;

    @Transactional
    public List<ProductResponse> createProducts(
            List<ProductCreationRequest> products
    ) {
        return products.stream()
                .map(this::saveProduct)
                .toList();
    }

    private ProductResponse saveProduct(
            ProductCreationRequest request
    ) {
        Product product =
                ProductMapper.fromRequest(request);

        product.setQuantity(
                inventoryService.getQuantityForProduct(
                        request.productId()
                )
        );

        log.info(
                "Saving product with id={}",
                product.getProductId()
        );

        return ProductMapper.fromEntity(
                repository.save(product)
        );
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAll(
            Pageable pageable
    ) {
        return repository.findAll(pageable)
                .map(ProductMapper::fromEntity);
    }
}
```

Главный момент: `parallelStream()` здесь лучше убрать. Spring-транзакция привязана к текущему потоку, поэтому worker-потоки `parallelStream()` не участвуют в одной транзакции `createProducts()`.

Также уведомления лучше отправлять **после успешного commit**, например через `@TransactionalEventListener(phase = AFTER_COMMIT)` или outbox, иначе можно уведомить о товаре, сохранение которого затем откатилось.

Если `inventoryService` — действительно удалённый вызов, его желательно выполнять до открытия короткой DB-транзакции либо разделить сценарий на этапы, чтобы не держать соединение с БД во время ожидания сети.

Для `InterruptedException`:

```java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new IllegalStateException(
            "Inventory request was interrupted",
            e
    );
}
```

Итого самые важные production-риски:

- `parallelStream()` + транзакции;
    
- self-invocation `@Transactional`;
    
- долгий внешний вызов внутри транзакции;
    
- уведомление до commit;
    
- отсутствие пагинации и валидации.
    

:::

---

## 4. Разделить внешний HTTP-вызов и транзакцию БД
**Условие задачи:**  
Дан Spring-сервис, который сначала выполняет внешний HTTP-запрос, а затем сохраняет полученный результат в базу данных. Весь метод помечен `@Transactional`.

Нужно провести code review: оценить корректность транзакционной границы, обработку ошибок внешнего сервиса и возможные проблемы согласованности между HTTP-вызовом и записью в БД.

**Код:**

```java
@Service
public class RestClient {

    @Transactional
    public void doWork() {
        var obj = restTemplate.postForObject(...);
        dbService.saveObj(obj);
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Не стоит держать транзакцию БД открытой во время сетевого вызова.  
💡 Транзакция БД не может откатить уже выполненный HTTP-запрос.  
💡 Для HTTP-клиента нужны таймауты и понятная стратегия обработки ошибок.  
💡 Если вынести `@Transactional` в другой метод того же класса, вспомни про self-invocation Spring AOP.  
💡 При retry важно продумать идемпотентность внешней операции.  
:::

---

::: details Решение

**Проблемы:**

- транзакция охватывает внешний HTTP-вызов и может оставаться открытой значительно дольше необходимого;
    
- скорость транзакции начинает зависеть от внешнего сервиса;
    
- сетевой timeout увеличивает время жизни транзакции;
    
- транзакция БД не обеспечивает атомарность между БД и внешним HTTP-сервисом;
    
- если HTTP-вызов успешен, а сохранение в БД упало, внешний эффект уже нельзя откатить;
    
- не показаны connect/read timeout для HTTP-клиента;
    
- не определена обработка `4xx`, `5xx`, сетевых ошибок и timeout;
    
- без идемпотентности retry для `POST` может повторить внешнюю операцию;
    
- `null` или некорректный ответ внешнего сервиса нужно валидировать.
    

**Как лучше исправить**

Внешний вызов выполнить без транзакции, а транзакцию оставить только на операции с БД.

```java
@Service
@RequiredArgsConstructor
public class RestClient {

    private final RemoteClient remoteClient;
    private final DbService dbService;

    public void doWork() {
        ResponseDto response = remoteClient.call();
        dbService.saveObj(response);
    }
}
```

Транзакционную границу можно разместить в отдельном Spring-бине:

```java
@Service
@RequiredArgsConstructor
public class DbService {

    private final ObjRepository repository;

    @Transactional
    public void saveObj(ResponseDto response) {
        if (response == null) {
            throw new IllegalArgumentException(
                    "Response must not be null"
            );
        }

        repository.save(map(response));
    }
}
```

Это важно: вариант

```java
public void doWork() {
    ResponseDto response = callRemote();
    save(response);
}

@Transactional
void save(ResponseDto response) {
    ...
}
```

в том же классе обычно не даст ожидаемой транзакции, потому что внутренний вызов `save()` обходит Spring proxy.

Для HTTP-клиента обязательно задать разумные connect/read timeout и отдельно обрабатывать сетевые ошибки и HTTP-ошибки.

Если внешний `POST` изменяет состояние, нужно учитывать сценарий:

```text
HTTP успешно выполнен
        ↓
сохранение в БД завершилось ошибкой
        ↓
doWork() запускается повторно
        ↓
HTTP-операция может выполниться второй раз
```

Поэтому для повторов нужен идемпотентный контракт внешнего API. Если используется `Idempotency-Key`, один и тот же логический запрос должен повторяться **с тем же ключом** — генерация нового UUID на каждую попытку проблему не решает.

Главная идея — **не пытаться объединить HTTP и БД одной `@Transactional`: внешний вызов выполняется отдельно, а работа с БД помещается в короткую локальную транзакцию**.

:::

---

## 5. Провести ревью получения полисов клиента
**Условие задачи:**  
Дан REST-контроллер, который должен вернуть оплаченные полисы указанного клиента с ограничением на количество результатов.

Нужно провести code review: найти ошибки компиляции, проблемы в REST API, Dependency Injection, транзакционности и фильтрации данных, а затем предложить более корректную реализацию.

**Код:**

```java
@RestController
public class ClientController {

    @Value(""policy.limit"")
    private int policyLimit;

    @Autowired
    private PolicyService policyService;

    @RequestMapping(path = ""client/{clientId}/policies"", method = RequestMethod.POST)
    public Response getClientPolicies(@PathVariable(""clientId"") String clientId) {
        List<PolicyDTO> policies = getPolicies().stream()
            .limit(policyLimit)
            .filter(p -> p.getClientIds().contains(clientId))
            .filter(p -> p.isPaid())
            .toList();
        return new Response(policies);
    }

    @Transactional
    private List<PolicyDTO> getPolicies() {
        return policyService.getPolicies();
    }

    @Data
    @AllArgsConstructor
    public class Response {
        private List<PolicyDTO> policies;
    }
}

@Data
public class PolicyDTO {
    private String id;
    private String name;
    private List<String> clientId;
    private Boolean isPaid;
}

@RequiredArgsConstructor
@Component
public class PolicyService {
    private final PolicyDbRepository repository;
    /**
     *  Читает полисы из БД
     */
    List<PolicyDTO> getPolicies() {
        return repository.getPolicies();
    }
}

public interface PolicyDbRepository {
    List<PolicyDTO> getPolicies();
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Проверь выражение в `@Value` и HTTP-метод для операции чтения.  
💡 Сравни поля `PolicyDTO` с методами, которые вызываются в Stream.  
💡 Обрати внимание на порядок `limit()` и `filter()`.  
💡 `@Transactional` работает через Spring proxy.  
💡 Лучше не загружать все полисы из БД, если нужен небольшой отфильтрованный набор.  
:::

---

::: details Решение

**Проблемы:**

- `@Value("policy.limit")` содержит литерал вместо `${...}`;
    
- используется field injection;
    
- для чтения данных выбран `POST` вместо `GET`;
    
- `@Transactional` стоит на `private`-методе и вызывается внутри того же класса, поэтому через Spring AOP не сработает;
    
- сначала выполняется `limit()`, а потом фильтрация — часть подходящих полисов может не попасть в результат;
    
- `PolicyDTO` содержит поле `clientId`, но вызывается `getClientIds()` — код не компилируется;
    
- для `Boolean isPaid` вызов `isPaid()` также не соответствует обычному Lombok-геттеру;
    
- `clientIds` потенциально может быть `null`;
    
- контроллер содержит бизнес-логику фильтрации;
    
- все полисы загружаются из БД и фильтруются в памяти;
    
- без явной сортировки набор первых `policyLimit` записей может быть недетерминированным;
    
- `Response` лучше сделать отдельным `record` или `static`-классом;
    
- отрицательный `policyLimit` приведёт к ошибке и должен быть исключён конфигурацией/валидацией.
    

**Как лучше исправить**

Контроллер должен только принять запрос и передать его сервису:

```java
@RestController
@RequiredArgsConstructor
@RequestMapping("/clients")
public class ClientController {

    private final PolicyService policyService;

    @GetMapping("/{clientId}/policies")
    public Response getClientPolicies(
            @PathVariable String clientId
    ) {
        return new Response(
                policyService.getClientPolicies(clientId)
        );
    }

    public record Response(List<PolicyDTO> policies) {
    }
}
```

DTO лучше привести к именам, которые соответствуют его смыслу:

```java
@Data
public class PolicyDTO {

    private String id;
    private String name;
    private List<String> clientIds;
    private boolean paid;
}
```

Лимит и транзакцию перенести в сервис:

```java
@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyDbRepository repository;

    @Value("${policy.limit:100}")
    private int policyLimit;

    @Transactional(readOnly = true)
    public List<PolicyDTO> getClientPolicies(
            String clientId
    ) {
        if (clientId == null || clientId.isBlank()) {
            throw new IllegalArgumentException(
                    "clientId must not be blank"
            );
        }

        return repository.getPolicies().stream()
                .filter(p -> p.getClientIds() != null)
                .filter(p ->
                        p.getClientIds().contains(clientId)
                )
                .filter(PolicyDTO::isPaid)
                .limit(policyLimit)
                .toList();
    }
}
```

Но это всё ещё загружает **все полисы** в память. Лучше сразу фильтровать и ограничивать выборку в БД:

```java
public List<PolicyDTO> getClientPolicies(
        String clientId
) {
    return repository.findPaidByClientId(
            clientId,
            policyLimit
    );
}
```

Репозиторий должен выполнять запрос примерно по смыслу:

```sql
SELECT ...
FROM policy
...
WHERE client_id = :clientId
  AND paid = true
ORDER BY ...
LIMIT :limit
```

Так БД сразу вернёт только нужные записи, вместо загрузки всей таблицы и последующей фильтрации в Java.

Главные исправления — **перенести фильтрацию из контроллера, применять лимит после отбора подходящих записей и по возможности выполнять фильтрацию/лимит непосредственно в БД**.

:::

---

