---
title: "Code Review — Stream API"
outline: [2, 3]
---
# Code Review — Stream API

Теория: [перейти к соответствующей теме](/learn/stream-api).

## 1. Упростить вложенные лямбда-выражения
**Условие задачи:**  
Дан код, который ищет пользователей с правом редактирования.

Необходимо:

- разобраться, что делает метод `findEditors()`;
    
- улучшить читаемость кода;
    
- уменьшить сложность вложенных лямбда-выражений.
    

**Код:**

```java
public class AvoidComplexLambdas {
    private final Set<User> users = new HashSet<>();

    public Set<User> findEditors() {
        return users.stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> r.getPermissions().contains(Permission.EDIT)))
                .collect(Collectors.toSet());
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Метод оставляет пользователей, у которых хотя бы одна роль содержит разрешение `EDIT`.  
💡 Основная проблема читаемости — вложенная логика внутри `filter()`.  
💡 Её можно вынести в отдельный метод с говорящим названием.  
💡 После этого в `filter()` можно использовать ссылку на метод.  
:::

---

::: details Решение

Метод ищет пользователей, у которых есть хотя бы одна роль с разрешением `Permission.EDIT`.

Вложенную проверку лучше вынести в отдельный метод:

```java
public class AvoidComplexLambdas {
    private final Set<User> users = new HashSet<>();

    public Set<User> findEditors() {
        return users.stream()
                .filter(this::hasEditPermission)
                .collect(Collectors.toSet());
    }

    private boolean hasEditPermission(User user) {
        return user.getRoles().stream()
                .anyMatch(role ->
                        role.getPermissions().contains(Permission.EDIT));
    }
}
```

Теперь основной метод читается практически как описание бизнес-логики:

```java
.filter(this::hasEditPermission)
```

Отдельный метод:

```java
private boolean hasEditPermission(User user)
```

скрывает детали обхода ролей и явно сообщает, что именно проверяется.

Такой рефакторинг:

- уменьшает вложенность;
    
- делает `findEditors()` проще для чтения;
    
- позволяет отдельно тестировать проверку наличия разрешения;
    
- упрощает изменение логики проверки в будущем.
    

:::

---

## 2. Сделать ревью метода поиска товаров по фильтру
**Условие задачи:**  
Интернет-магазин обрабатывает около 200 запросов в секунду. Пользователь задаёт фильтры по цене, рейтингу и другим параметрам, после чего сервис ищет подходящие товары.

Примерно в половине запросов подходящих товаров нет. Нужно провести code review метода и определить, как уменьшить лишнюю нагрузку на БД и улучшить API метода.

**Код:**

```java
class ServiceImpl {

    // 200 RPS
    // 50% -> return new ArrayList<>();
    ArrayList<Product> find(Filter filter) {
        int count = productRepo.count(filter);

        if (count > 0) {
            return productRepo.find(filter);
        }

        return new ArrayList<>();
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Предварительный `count()` здесь не нужен.  
💡 Для найденных товаров сейчас выполняются два запроса в БД.  
💡 Лучше зависеть от `List<Product>`, а не от конкретного `ArrayList`.  
💡 Для большого каталога стоит подумать о пагинации и индексах.  
:::

---

::: details Решение

**Проблемы:**

- перед поиском выполняется лишний `count()`;
    
- для непустого результата получается два запроса: `COUNT` + `SELECT`;
    
- при 200 RPS и 50% непустых результатов это примерно 300 запросов к БД вместо 200;
    
- возвращается конкретный `ArrayList<Product>` вместо интерфейса `List<Product>`;
    
- вручную создаётся пустой список, хотя поиск сам может вернуть пустой результат;
    
- нет проверки `filter`;
    
- при большом количестве результатов отсутствует пагинация;
    
- для часто используемых условий фильтрации могут потребоваться подходящие индексы.
    

**Как лучше исправить**

Предварительный `count()` не нужен — сразу выполняем поиск:

```java
class ServiceImpl {

    List<Product> find(Filter filter) {
        if (filter == null) {
            throw new IllegalArgumentException(
                    "Filter must not be null"
            );
        }

        return productRepo.find(filter);
    }
}
```

Если товаров нет, нормальный контракт repository — вернуть пустую коллекцию.

Для большого каталога лучше добавить пагинацию:

```java
Page<Product> find(
        Filter filter,
        Pageable pageable
) {
    return productRepo.find(filter, pageable);
}
```

Если общее количество найденных товаров клиенту не требуется, лучше рассмотреть `Slice<Product>`: тогда не нужен дополнительный запрос для подсчёта общего количества записей.

Также стоит проверить индексы по наиболее селективным и часто используемым полям фильтрации и ограничить максимальный размер страницы.

Главное исправление — **не выполнять `COUNT` перед `SELECT`, если данные всё равно нужно получить**.

:::

---

## 3. Оптимизировать расчёт статистики по заказам клиентов
**Условие задачи:**  
Дан Spring-сервис, который для активных пользователей рассчитывает статистику по заказам: количество заказов и их общую стоимость, после чего отправляет результат в Kafka.

Нужно провести code review: найти проблемы с Dependency Injection, работой с БД, транзакциями и производительностью, а затем предложить более эффективную реализацию, сохранив корректное поведение в том числе для пользователей без заказов.

**Код:**

```java
@Component
@RequiredArgsConstructor
public class StatService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private StatRepository statRepository;
    @Autowired
    private KafkaService kafkaService;

    public void calculate() {
        List<User> users = userRepository.findAll().stream().filter(u -> u.isActive()).collect(Collectors.toList());

        if (!users.isEmpty()) {
            for(User user : users) {
                List<Order> orders = orderRepository.findByUser(user.getId());

                if (orders.isEmpty()) {
                    System.out.println(""У пользователя нет заказов"");
                }

                int totalOrders = 0;
                int totalCost = 0;
                for(Order order : orders) {
                    totalOrders++;
                    totalCost += order.getCost();
                }

                save(user.getId(), totalOrders, totalCost);
            }
        }
    }
@Transactional
private void save(Long userId, int totalOrders, int totalCost) {
    kafkaService.send(userId, totalOrders, totalCost, Instant.now());
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сейчас сначала загружаются все пользователи, а активные отбираются уже в Java.  
💡 На каждого пользователя выполняется отдельный запрос заказов — проверь количество запросов при большом числе пользователей.  
💡 `@Transactional` на `private`-методе, вызываемом из того же класса, не создаст транзакцию через Spring proxy.  
💡 Обрати внимание на `statRepository`: используется ли он вообще?  
💡 При оптимизации не потеряй активных пользователей, у которых нет заказов.  
:::

---

::: details Решение

**Проблемы:**

- смешаны `@RequiredArgsConstructor` и field injection через `@Autowired`;
    
- поля зависимостей не `final`, поэтому `@RequiredArgsConstructor` здесь фактически бесполезен;
    
- `statRepository` объявлен, но нигде не используется;
    
- загружаются все пользователи, а фильтрация по `active` выполняется в памяти;
    
- возникает N+1: после запроса пользователей выполняется отдельный запрос заказов для каждого пользователя;
    
- все заказы загружаются в Java только ради `COUNT` и `SUM`;
    
- `@Transactional` на `private save()` не сработает через Spring AOP;
    
- более того, `save()` ничего не сохраняет в БД — он только отправляет сообщение в Kafka;
    
- название `save()` не соответствует фактическому поведению;
    
- `System.out.println()` лучше заменить логгером;
    
- пустой `if (!users.isEmpty())` не нужен — цикл и так ничего не выполнит для пустого списка;
    
- `totalCost` в `int` может быть неподходящим для денежных сумм или больших агрегатов;
    
- `Instant.now()` вызывается отдельно для каждого пользователя, хотя статистика может относиться к одному запуску расчёта;
    
- в показанном фрагменте отсутствует закрывающая `}` класса `StatService`.
    

**Как лучше исправить**

Главная оптимизация — считать статистику сразу в БД, а не загружать пользователей и все их заказы по отдельности.

При этом важно сохранить текущее поведение: активный пользователь **без заказов тоже получает статистику `0 / 0`**. Поэтому запрос должен использовать `LEFT JOIN`, а не обычный `INNER JOIN`.

Например, репозиторий может сразу вернуть проекцию:

```java
public record UserOrderStat(
        Long userId,
        long totalOrders,
        long totalCost
) {
}
```

```java
public interface StatRepository {

    List<UserOrderStat> calculateForActiveUsers();
}
```

Запрос по смыслу:

```sql
SELECT u.id,
       COUNT(o.id),
       COALESCE(SUM(o.cost), 0)
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.id
```

Тогда сервис становится значительно проще:

```java
@Service
@RequiredArgsConstructor
public class StatService {

    private final StatRepository statRepository;
    private final KafkaService kafkaService;

    public void calculate() {
        Instant calculatedAt = Instant.now();

        List<UserOrderStat> stats =
                statRepository.calculateForActiveUsers();

        for (UserOrderStat stat : stats) {
            kafkaService.send(
                    stat.userId(),
                    stat.totalOrders(),
                    stat.totalCost(),
                    calculatedAt
            );
        }
    }
}
```

Так вместо схемы:

```text
1 запрос пользователей
+ N запросов заказов
```

можно получить статистику одним агрегирующим запросом.

`@Transactional` для простого вызова Kafka здесь не нужен. Если по требованиям статистику нужно одновременно **сохранить в БД и отправить в Kafka**, появляется другая задача: обычная DB-транзакция не делает эти две операции атомарными. Для надёжного сценария лучше сохранять статистику и outbox-запись в одной транзакции, а Kafka отправлять отдельным обработчиком.

Для стоимости стоит выбрать тип согласно модели денег: `long` подходит, если сумма хранится в минимальных денежных единицах, например копейках; для дробных денежных значений обычно используют `BigDecimal`.

Главное исправление — **перенести фильтрацию и агрегацию в БД, избавиться от N+1 и не использовать фиктивную `@Transactional` вокруг отправки в Kafka**.

:::

---

