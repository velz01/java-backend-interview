---
title: "Live Coding — Spring"
outline: [2, 3]
---
# Live Coding — Spring

Теория: [перейти к соответствующей теме](/learn/spring).

## 1. Спроектировать и реализовать REST API для управления пользователем
**Условие задачи:**  
Необходимо спроектировать REST API для управления пользователями.

API должно поддерживать:

- создание пользователя;
    
- получение пользователя по `id`;
    
- получение списка пользователей;
    
- обновление пользователя;
    
- удаление пользователя.
    

Данные можно хранить в памяти.

**Код:**

```java
public class User {

    private Long id;
    private String name;
    private String email;
    private Integer age;

    // getters / setters / constructors
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Используй `@RestController` и HTTP-методы `POST`, `GET`, `PUT`, `DELETE`.  
💡 Логику работы с пользователями вынеси в `@Service`.  
💡 Для хранения в памяти подойдёт `ConcurrentHashMap`.  
💡 Для генерации идентификаторов можно использовать `AtomicLong`.  
💡 Для входных данных удобно использовать отдельный DTO с валидацией.  
💡 Если пользователь не найден, возвращай `404 Not Found`.  
:::

---

::: details Решение

DTO для входных данных:

```java
public record UserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @Min(0) Integer age
) {
}
```

Модель:

```java
public record User(
        Long id,
        String name,
        String email,
        Integer age
) {
}
```

Сервис:

```java
@Service
public class UserService {

    private final Map<Long, User> users =
            new ConcurrentHashMap<>();

    private final AtomicLong idGenerator =
            new AtomicLong();

    public User create(UserRequest request) {
        long id = idGenerator.incrementAndGet();

        User user = new User(
                id,
                request.name(),
                request.email(),
                request.age()
        );

        users.put(id, user);

        return user;
    }

    public User getById(long id) {
        User user = users.get(id);

        if (user == null) {
            throw new NoSuchElementException(
                    "User not found: " + id
            );
        }

        return user;
    }

    public List<User> getAll() {
        return users.values().stream()
                .sorted(Comparator.comparing(User::id))
                .toList();
    }

    public User update(
            long id,
            UserRequest request
    ) {
        if (!users.containsKey(id)) {
            throw new NoSuchElementException(
                    "User not found: " + id
            );
        }

        User updated = new User(
                id,
                request.name(),
                request.email(),
                request.age()
        );

        users.put(id, updated);

        return updated;
    }

    public void delete(long id) {
        if (users.remove(id) == null) {
            throw new NoSuchElementException(
                    "User not found: " + id
            );
        }
    }
}
```

Контроллер:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User create(
            @Valid @RequestBody UserRequest request
    ) {
        return userService.create(request);
    }

    @GetMapping("/{id}")
    public User getById(
            @PathVariable long id
    ) {
        return userService.getById(id);
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @PutMapping("/{id}")
    public User update(
            @PathVariable long id,
            @Valid @RequestBody UserRequest request
    ) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable long id
    ) {
        userService.delete(id);
    }
}
```

Обработка `404`:

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(
            NoSuchElementException exception
    ) {
        return exception.getMessage();
    }
}
```

Получившийся API:

```text
POST   /api/users
GET    /api/users/{id}
GET    /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

Для реального приложения хранилище в памяти можно заменить на `JpaRepository`, не меняя контракт контроллера.

:::

---

## 2. Спроектировать и реализовать REST API для сущностей "Книги" и "Авторы"
**Условие задачи:**  
Необходимо спроектировать REST API для работы с книгами и авторами.

В базе данных используются таблицы:

```text
books
authors
books_authors
```

Для книг необходимо реализовать:

- получение всех книг;
    
- получение книги по `id`;
    
- создание книги;
    
- обновление книги;
    
- удаление книги.
    

Также нужно описать API в формате:

```text
GET /some/path 200;
```

Связь между книгами и авторами — `Many-to-Many`.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для книг и авторов создай отдельные JPA-сущности.  
💡 Связь можно описать через `@ManyToMany` и таблицу `books_authors`.  
💡 В REST API лучше использовать DTO, а не возвращать JPA-сущности напрямую.  
💡 При создании и обновлении книги получай авторов по переданным `authorIds`.  
💡 Для создания возвращай `201 Created`, для удаления — `204 No Content`.  
💡 Если книга не найдена — возвращай `404 Not Found`.  
:::

---

::: details Решение

REST API:

```text
GET    /api/books       200;
GET    /api/books/{id}  200;
POST   /api/books       201;
PUT    /api/books/{id}  200;
DELETE /api/books/{id}  204;
```

Сущность автора:

```java
@Entity
@Table(name = "authors")
public class AuthorEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // getters / setters
}
```

Сущность книги:

```java
@Entity
@Table(name = "books")
public class BookEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Integer publishYear;

    @ManyToMany
    @JoinTable(
            name = "books_authors",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private Set<AuthorEntity> authors = new HashSet<>();

    // getters / setters
}
```

DTO для создания и обновления:

```java
public record BookRequestDto(
        @NotBlank String title,
        @NotNull Integer publishYear,
        @NotNull Set<Long> authorIds
) {
}
```

DTO ответа:

```java
public record BookResponseDto(
        Long id,
        String title,
        Integer publishYear,
        Set<Long> authorIds
) {
}
```

Репозитории:

```java
public interface BookRepository
        extends JpaRepository<BookEntity, Long> {
}
```

```java
public interface AuthorRepository
        extends JpaRepository<AuthorEntity, Long> {
}
```

Сервис:

```java
@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookService(
            BookRepository bookRepository,
            AuthorRepository authorRepository
    ) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional(readOnly = true)
    public List<BookResponseDto> getAll() {
        return bookRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponseDto getById(long id) {
        return toResponse(findBook(id));
    }

    public BookResponseDto create(BookRequestDto request) {
        BookEntity book = new BookEntity();

        book.setTitle(request.title());
        book.setPublishYear(request.publishYear());
        book.setAuthors(findAuthors(request.authorIds()));

        return toResponse(bookRepository.save(book));
    }

    public BookResponseDto update(
            long id,
            BookRequestDto request
    ) {
        BookEntity book = findBook(id);

        book.setTitle(request.title());
        book.setPublishYear(request.publishYear());
        book.setAuthors(findAuthors(request.authorIds()));

        return toResponse(book);
    }

    public void delete(long id) {
        BookEntity book = findBook(id);
        bookRepository.delete(book);
    }

    private BookEntity findBook(long id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Book not found: " + id
                        )
                );
    }

    private Set<AuthorEntity> findAuthors(
            Set<Long> authorIds
    ) {
        List<AuthorEntity> authors =
                authorRepository.findAllById(authorIds);

        if (authors.size() != authorIds.size()) {
            throw new NoSuchElementException(
                    "One or more authors not found"
            );
        }

        return new HashSet<>(authors);
    }

    private BookResponseDto toResponse(BookEntity book) {
        Set<Long> authorIds = book.getAuthors()
                .stream()
                .map(AuthorEntity::getId)
                .collect(Collectors.toSet());

        return new BookResponseDto(
                book.getId(),
                book.getTitle(),
                book.getPublishYear(),
                authorIds
        );
    }
}
```

Контроллер:

```java
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<BookResponseDto> getAll() {
        return bookService.getAll();
    }

    @GetMapping("/{id}")
    public BookResponseDto getById(
            @PathVariable long id
    ) {
        return bookService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDto create(
            @Valid @RequestBody BookRequestDto request
    ) {
        return bookService.create(request);
    }

    @PutMapping("/{id}")
    public BookResponseDto update(
            @PathVariable long id,
            @Valid @RequestBody BookRequestDto request
    ) {
        return bookService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable long id
    ) {
        bookService.delete(id);
    }
}
```

Обработка `404`:

```java
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(
            NoSuchElementException exception
    ) {
        return exception.getMessage();
    }
}
```

При создании и обновлении книги список `authorIds` преобразуется в набор сущностей `AuthorEntity`, а Hibernate самостоятельно поддерживает записи в таблице `books_authors`.

Для операций, изменяющих книгу и её связи с авторами, используется одна транзакция.

:::

---

## 3. Переименовать JSON-поле с сохранением обратной совместимости
**Условие задачи:**  
Необходимо изменить название поля в JSON с `title` на `name`, сохранив обратную совместимость.

Старые клиенты должны продолжать отправлять:

```json
{
  "title": "..."
}
```

Новые клиенты должны использовать:

```json
{
  "name": "..."
}
```

При сериализации ответа необходимо использовать новое название `name`.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Новое основное имя поля можно задать через `@JsonProperty`.  
💡 Старое имя можно оставить для десериализации через `@JsonAlias`.  
💡 `@JsonAlias` влияет на чтение JSON, но не меняет имя поля при сериализации.  
:::

---

::: details Решение

```java
public class BookDto {

    @JsonProperty("name")
    @JsonAlias("title")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

Теперь оба входных варианта будут корректно десериализованы:

```json
{
  "name": "Clean Code"
}
```

и:

```json
{
  "title": "Clean Code"
}
```

В обоих случаях значение попадёт в поле:

```java
private String name;
```

При сериализации объекта наружу Jackson будет использовать новое имя:

```json
{
  "name": "Clean Code"
}
```

Таким образом, `@JsonProperty("name")` задаёт актуальное имя поля, а `@JsonAlias("title")` позволяет временно поддерживать старый контракт API.

:::

---

## 4. Реализовать расширяемый сервис отправки уведомлений
**Условие задачи:**  
Необходимо реализовать сервис `Notificator`, который отправляет сообщение через несколько внешних сервисов, например Email и SMS.

При добавлении нового канала уведомлений код `Notificator` не должен изменяться.

**Код:**

```java
public class EmailNotificationService {

    public void sendEmail(String message) {
        System.out.println("Send from email service");
        System.out.println(message);
    }
}

public class SmsNotificationService {

    public void sendSms(String message) {
        System.out.println("Send from sms service");
        System.out.println(message);
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Введи общий интерфейс для всех каналов уведомлений.  
💡 Внешние библиотеки можно обернуть адаптерами.  
💡 Spring умеет внедрять сразу `List` всех бинов одного интерфейса.  
💡 Внешние сервисы также нужно зарегистрировать как Spring-бины.  
💡 Для добавления нового канала достаточно создать новую реализацию интерфейса.  
:::

---

::: details Решение

Общий интерфейс:

```java
public interface NotificationService {

    void send(String message);
}
```

Адаптер для Email:

```java
@Service
public class EmailNotificationAdapter
        implements NotificationService {

    private final EmailNotificationService emailService;

    public EmailNotificationAdapter(
            EmailNotificationService emailService
    ) {
        this.emailService = emailService;
    }

    @Override
    public void send(String message) {
        emailService.sendEmail(message);
    }
}
```

Адаптер для SMS:

```java
@Service
public class SmsNotificationAdapter
        implements NotificationService {

    private final SmsNotificationService smsService;

    public SmsNotificationAdapter(
            SmsNotificationService smsService
    ) {
        this.smsService = smsService;
    }

    @Override
    public void send(String message) {
        smsService.sendSms(message);
    }
}
```

Регистрация классов внешних библиотек:

```java
@Configuration
public class NotificationConfiguration {

    @Bean
    public EmailNotificationService emailNotificationService() {
        return new EmailNotificationService();
    }

    @Bean
    public SmsNotificationService smsNotificationService() {
        return new SmsNotificationService();
    }
}
```

Сервис отправки уведомлений:

```java
@Service
public class Notificator {

    private final List<NotificationService> channels;

    public Notificator(
            List<NotificationService> channels
    ) {
        this.channels = channels;
    }

    public void notifyAll(String message) {
        for (NotificationService channel : channels) {
            channel.send(message);
        }
    }
}
```

Spring автоматически передаст в `List<NotificationService>` все зарегистрированные реализации интерфейса.

Чтобы добавить новый канал, например Telegram, достаточно создать новый адаптер:

```java
@Service
public class TelegramNotificationAdapter
        implements NotificationService {

    @Override
    public void send(String message) {
        // отправка сообщения
    }
}
```

Изменять `Notificator` при этом не потребуется.

Здесь используется паттерн Adapter для приведения разных внешних API к общему интерфейсу и соблюдается принцип Open/Closed: систему можно расширять новыми каналами без изменения основной логики.

:::

---

## 5. Обеспечить выполнение метода в новой транзакции через Spring-прокси
**Условие задачи:**  
Дан сервис с двумя транзакционными методами. Метод `methodB()` должен выполняться в отдельной транзакции с `Propagation.REQUIRES_NEW`.

При прямом вызове `methodB()` из `methodA()` вызов не проходит через Spring-прокси, поэтому новая транзакция не создаётся.

**Код:**

```java
@Service
public class TransactionService {

    @Transactional
    public void methodA() {
        methodB();
    }

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void methodB() {
        // some logic
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 `@Transactional` в стандартном proxy-режиме применяется при вызове через Spring-прокси.  
💡 Вызов `this.methodB()` является self-invocation и обходит прокси.  
💡 Можно получить прокси текущего объекта через `AopContext`.  
💡 Другой вариант — внедрить прокси самого сервиса через `@Lazy`.  
💡 Для `AopContext.currentProxy()` необходимо включить `exposeProxy = true`.  
:::

---

::: details Решение

Вариант через `AopContext`:

```java
@Service
public class TransactionService {

    @Transactional
    public void methodA() {
        TransactionService proxy =
                (TransactionService) AopContext.currentProxy();

        proxy.methodB();
    }

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void methodB() {
        // выполнение в новой транзакции
    }
}
```

Для доступа к текущему прокси необходимо включить его публикацию:

```java
@Configuration
@EnableTransactionManagement
@EnableAspectJAutoProxy(exposeProxy = true)
public class AppConfig {
}
```

Теперь вызов:

```java
proxy.methodB();
```

проходит через Spring AOP, поэтому `REQUIRES_NEW` срабатывает.

Транзакция `methodA()` временно приостанавливается, создаётся новая транзакция для `methodB()`, а после её завершения продолжается первая транзакция.

Альтернативный вариант — self-injection:

```java
@Service
public class TransactionService {

    private final TransactionService self;

    public TransactionService(
            @Lazy TransactionService self
    ) {
        this.self = self;
    }

    @Transactional
    public void methodA() {
        self.methodB();
    }

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void methodB() {
        // выполнение в новой транзакции
    }
}
```

Здесь `self` содержит ссылку на Spring-прокси, поэтому вызов `methodB()` также перехватывается транзакционным interceptor.

На практике ещё более простым вариантом часто является вынесение `methodB()` в отдельный Spring-сервис и вызов его через внедрённый бин.

:::

---

## 6. Получить ID сущностей через Spring Data JPA
**Условие задачи:**  
В репозитории `HeavyDataRepository` необходимо реализовать метод, который возвращает список только идентификаторов сущностей `HeavyData`, не загружая объекты целиком.

**Код:**

```java
public interface HeavyDataRepository
        extends JpaRepository<HeavyData, Integer> {

    List<Integer> getHeavyDataIds();

    List<HeavyData> findAllByIsActive(Boolean isActive);
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для выборки отдельных полей можно использовать `@Query`.  
💡 В JPQL нужно обращаться к сущности и её полям, а не к таблице.  
💡 Запрос `select h.id from HeavyData h` загрузит только значения `id`.  
💡 Возвращаемый тип должен соответствовать типу поля `id`.  
:::

---

::: details Решение

```java
public interface HeavyDataRepository
        extends JpaRepository<HeavyData, Integer> {

    @Query("select h.id from HeavyData h")
    List<Integer> getHeavyDataIds();

    List<HeavyData> findAllByIsActive(Boolean isActive);
}
```

JPQL-запрос:

```java
@Query("select h.id from HeavyData h")
```

выбирает только поле `id`, поэтому Hibernate не создаёт и не загружает целиком объекты `HeavyData`.

Если необходимо использовать нативный SQL:

```java
@Query(
        value = "select id from heavy_data",
        nativeQuery = true
)
List<Integer> getHeavyDataIds();
```

Для JPQL используется имя сущности `HeavyData`, а для нативного SQL — реальное имя таблицы в базе данных.

:::

---

