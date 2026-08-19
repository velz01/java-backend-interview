---
title: "ORM"
outline: [2, 3]
---

# ORM

**Источник:** Материалы Жукова  
**Вопросов:** 26

## 1. Что такое Hibernate, JPA, JDBC, ORM?

<span class="source-badge">Источник: Жуков</span>

**ORM (Object-Relational Mapping)** - концепция преобразования сущностей реляционной базы данных в объекты и обратно (применительно к объектно-ориентированным языкам программирования)
  **JPA (Java Persistence API)** - спецификация, описывающая концепцию ORM для Java
  **Hibernate** - одна из реализаций JPA
  **JDBC (Java DataBase Connectivity)** - стандарт взаимодействия Java-приложения и базы данных

---

## 2. Плюсы и минусы ORM

<span class="source-badge">Источник: Жуков</span>

**Плюсы:**
- **Ускорение разработки приложения**
- **Удобство разработки:**
    - позволяет бизнес методам обращаться не к БД, а к Java классам
    - cущности основаны на бизнес-задачах, а не на структуре БД
- **Переносимость** - ORM может работать с различными СУДБ, что делает его более переносимым, чем SQL
- **Управление транзакциями**

**Минусы:**
- **Сложность в освоении** - парадигма ORM нетривиальна и может быть контринтуитивна для новых разработчиков, имеющих опыт с SQL
- **Потенциальная потеря производительности** - автоматическая генерация SQL-запросов может быть менее оптимальной, чем ручное написание запросов
- **Плохо справляется со сложными запросы** - ORM плохо справляется с очень сложными SQL-запросами, такими как сложные агрегатные функции или многоуровневые JOIN’ы

---

## 3. Как создать Entity и что это такое?

<span class="source-badge">Источник: Жуков</span>

Entity - это класс, отражающий собой таблицу в реляционной БД. Для его создания необходимо выполнение условий
- Класс не является вложенным, интерфейсом, `enum`, или `final`
- Аннотация `@Entity` над классом
- Конструктор без параметров
- Хотя бы одно поле с аннотацией `@Id`
- Класс должен быть POJO (все поля private + getter-ы и setter-ы к ним)
*Примечание: несколько аннотаций @Id в Entity может быть только в случае использования составного первичного ключа*

---

## 4. Может ли Entity наследоваться от не-Entity классов?

<span class="source-badge">Источник: Жуков</span>

Да

---

## 5. Может ли Entity наследоваться от других Entity классов?

<span class="source-badge">Источник: Жуков</span>

Да

---

## 6. Почему мы не можем использовать final классы в качестве Entity?

<span class="source-badge">Источник: Жуков</span>

Потому что Hibernate делает прокси через наследование от класса-entity, `final` прямо этому препятствует.

---

## 7. Что такое Proxy и для чего используется?

<span class="source-badge">Источник: Жуков</span>

**Hibernate Proxy** - это объект-заместитель, наследующийся от целевого класса и использующийся для ленивой загрузки сущностей. Это значит, что Hibernate создает прокси-объект вместо настоящего объекта из базы данных, и реальные данные загружаются только при первом доступе к ним. Это помогает оптимизировать производительность, загружая данные только тогда, когда они действительно нужны

**Механизм**
Hibernate создаёт наследника запрашиваемого класса или реализацию интерфейса, который переопределяет методы, обеспечивая загрузку данных только при их вызове.
```java
Session session = sessionFactory.openSession();
User user = session.get(User.class, 1); // Полный объект
User lazyUser = session.load(User.class, 2); // Proxy-объект
```
- В случае `session.get()` объект загружается сразу.
- При использовании `session.load()` объект заменяется Proxy до момента фактического обращения к данным.

---

## 8. FetchType

<span class="source-badge">Источник: Жуков</span>

`LAZY` - вместо таких полей будут вставляться прокси, а сами они будут подгружаться при первом доступе к ним
`EAGER` (жадный) - связанные сущности загружаются сразу вместе с основной сущностью

`@OneToMany` `@ManyToMany` по-умолчанию применяется `FetchType.LAZY`
`@ManyToOne` `@OneToOne` по-умолчанию применяется `FetchType.EAGER`

---

## 9. Жизненный цикл сущности

<span class="source-badge">Источник: Жуков</span>

В Hibernate сущность может находиться в одном из четырех состояний:
- Transient
- Persistent
- Detached
- Removed

![](/hibernate_entity_life_cycle.png)

**Transient (Переходное состояние) (new)**
Сущность только что создана с помощью оператора new, но еще не сохранена в базе данных
```java
User user = new User(); // объект пока не связан с БД
user.setName("John");
```

**Persistent/managed (Постоянное состояние) (save, persist, update, get)**
Когда объект сохранён в базе данных через EntityManager или Session, он становится постоянным. В этом состоянии Hibernate следит за объектом. Любые изменения в объекте автоматически синхронизируются с базой данных
```java
Session session = sessionFactory.openSession();
session.beginTransaction();
session.save(user); // объект теперь в состоянии persistent
```

**Detached (Отсоединённое состояние) (session closed)**
Когда сессия закрыта, объект переходит в состояние detached. Он по-прежнему связан с данными в базе, но больше не синхронизируются с ней
```java
session.close(); //  объект можно использовать, но изменения не будут сохранены в бд
```

**Removed (Удалённое состояние) (delete(obj))**
Когда сущность удалена из базы данных она переходит в состояние removed. В этом состоянии объект по-прежнему существует в памяти, но уже удален из базы данных
```java
session.delete();
```

---

## 10. Кэширование

<span class="source-badge">Источник: Жуков</span>

**Кэш 1-го уровня**
- Этот кэш всегда включен и работает на уровне `Session` (у каждой сессии свой кэш и нельзя получить доступ к нему из другой сессии)
- В кэше хранятся только сущности, у которых состояние `persistent`
- Отслеживаемые сущности (`persistent`) хранятся в мапе, где ключ - ID сущности, а значение - сами объекты-сущности
- При повторных запросах Hibernate использует кэшированные данные вместо выполнения нового запроса к базе данных
- При закрытии сессии кэш удаляется

**Кэш 2-го уровня**
- Это дополнительный кэш, который надо включать вручную
- Работает на уровне `SessionFactory`
- Используется для кэширования данных между сессиями, что позволяет повторно использовать данные, уже загруженные из базы данных
- После закрытия `SessionFactory` весь кэш, связанный с ним, удаляется

**Кэш 3-го уровня**
- Кэширует результаты запросов на уровне SQL-запросов (кэширует результаты выборки)

---

## 11. HQL и JPQL

<span class="source-badge">Источник: Жуков</span>

**JPQL (Java Persistence Query Language)** - это объектно-ориентированный язык запросов спецификации JPA, который поддерживается всеми реализациями, очень похож на SQL, но вместо имён таблиц используются имена сущностей
**HQL (Hibernate Query Language)** - реализация JPQL от Hibernate

---

## 12. EntityManager + EntityManagerFactory / SessionFactory + session

<span class="source-badge">Источник: Жуков</span>

**EntityManager** - менеджер сущностей, определяется спецификацией JPA, **Session** от Hibernate - вариант его реализации
**EntityManagerFactory** - фабрика менеджеров JPA, **SessionFactory** - реализация от Hibernate

---

## 13. Проблема N + 1. Способы решения проблемы

<span class="source-badge">Источник: Жуков</span>

Это проблема, которая возникает при ленивой загрузке сущности из БД, когда вместо одного запроса, включающего основную сущность и все зависимые, происходит один запрос для основной сущности и N запросов для зависимых сущностей

**Пример:**
Есть две связанные сущности: User (пользователь) и Order (заказ). Каждый пользователь может иметь много заказов

Допустим, нужно получить список всех пользователей и их заказов. Проблема N+1 возникает, когда вместо одного запроса к базе данных для получения всех пользователей и их заказов приложение сначала делает 1 запрос, чтобы получить всех пользователей, а затем делает N дополнительных запросов - по одному для каждого пользователя, чтобы получить его заказы
```java
@Entity
public class User {
    @Id
    private Long id;
    private String name;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}

@Entity
public class Order {
    @Id
    private Long id;
    private String item;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

---
 **Как избежать проблемы N + 1**
- JOIN FETCH. Это способ сказать Hibernate загрузить связанные данные вместе с основными (типа обычного JOIN-а). Нюансы:
    - Необходимо использовать `DISTINCT`, чтобы избежать дубликатов (из-за JOIN с коллекцией будет происходить декартово произведение - для каждой связанной сущности будет добавлена главная сущность)
    - Не работает с пагинацией (`setFirstResult`, `setMaxResults`), если используется `JOIN FETCH` с коллекцией
```java
@Query("SELECT DISTINCT u FROM User u JOIN FETCH u.orders")
List<User> findAllUsersWithOrders();
```

- Использовать EntityGraph. Указываем, какие данные загружать в конкретных запросах, не изменяя сущности (как в случае с жадной загрузкой)
```java
@EntityGraph(attributePaths = {"orders"})
List<User> findAll();
```

- Использовать **`FetchMode.SUBSELECT`** - загружает все коллекции одним подзапросом при первом обращении
    ```java
        @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
        @Fetch(FetchMode.SUBSELECT)
        private List<Order> orders;
    ```
        Транслируется в
```sql
SELECT * FROM order WHERE user_id IN (SELECT id FROM user) 
```

- Использовать пакетную загрузку - `@BatchSize` позволяет загружать связанные сущности пачками
        ```java
    private List<Book> books;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @BatchSize(size = 50)
    private List<Order> orders;
    ```
    Для 100 заказов Hibernate выполнит 2 запроса:
```
    SELECT * FROM order WHERE user_id IN (?, ?, ..., ?) // 50 ID
    SELECT * FROM order WHERE user_id IN (?, ?, ..., ?) // Оставшиеся 50 ID
```

- Использовать `FetchType.EAGER` вместо `FetchType.LAZY`

---

## 14. Что такое Entity Graph?

<span class="source-badge">Источник: Жуков</span>

Entity Graph - это механизм в JPA, который позволяет управлять стратегией загрузки данных, определяя, какие связанные сущности должны быть загружены сразу (eager), а какие отложенно (lazy). Это дает гибкость в выборе полей для загрузки в зависимости от запроса

**Как создать?**
Создается аннотацией `@NamedEntityGraph` на уровне сущности или динамически через API

**Что под капотом?**
Entity Graph-ы работают на уровне SQL-запросов, добавляя нужные JOIN-ы и выбирая необходимые поля

**Использование имени графа**
```java
EntityManager entityManager = ...;

Map<String, Object> properties = new HashMap<>();
properties.put("javax.persistence.loadgraph", entityManager.getEntityGraph("User.withRoles"));

User user = entityManager.find(User.class, 1L, properties);
```

**Использование динамического графа**
```java
EntityManager entityManager = ...;

EntityGraph<User> entityGraph = entityManager.createEntityGraph(User.class);
entityGraph.addAttributeNodes("roles");

Map<String, Object> properties = new HashMap<>();
properties.put("javax.persistence.loadgraph", entityGraph);

User user = entityManager.find(User.class, 1L, properties);
```

**Использование в Spring Data JPA**
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"roles"})
    User findByName(String name);
}
```

---

## 15. Statement, Prepared statement, Callable statement

<span class="source-badge">Источник: Жуков</span>

- Statement - объект, который используется для формирования простых SQL запросов. Уязвим к SQL-инъекциям
- PreparedStatement - расширяет Statement, добавляет:
    - защиту от SQL-инъекций
    - возможность динамической вставки параметров
    - кэширование, что ускоряет запросы
- CallableStatement - расширяет PreparedStatement, нужен для вызова хранимых процедур

---

## 16. Связи между таблицами в ORM

<span class="source-badge">Источник: Жуков</span>

1. OneToOne - один экземпляр сущности может быть связан не больше чем с одним экземпляром другой сущности
2. OneToMany - одна сущность может ссылаться ко многим сущностям
3. ManyToOne - несколько сущностей может ссылаться к одной сущности
4. ManyToMany - много сущностей могут относится ко многим сущностям. 
   - **Bidirectional** (с использованием MappedBy) - ссылка на связь устанавливается у всех сущностей, т.е. в сущности 1 будет ссылка на сущность 2 и наоборот. Сущность 1 будет владельцем этой связи (важно при каскадном удалении) 
   - **Unidirectional** - ссылка на связь устанавливается только у одной стороны

**Как реализована связь OneToMany?**
Одному объекту одной сущности соответствует множество объектов другой сущности
```java
@Entity
public class Department {
    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    private List<Employee> employees;
}

@Entity
public class Employee {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    private Department department;
}
```

**Как реализована связь ManyToOne?**
Множеству объектов одной сущности соответствует один объект другой сущности
```java
@Entity
public class Employee {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}

@Entity
public class Department {
    @Id @GeneratedValue
    private Long id;
}
```

**Как реализована связь ManyToMany?**
Для реализации такого вида связи создается промежуточная таблица для хранения идентификаторов обеих сущностей

**Пример**: учителя могут преподавать несколько предметов, каждый предмет может преподаваться несколькими преподавателями
```java
@Entity
public class Student {
    @Id @GeneratedValue
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses;
}

@Entity
public class Course {
    @Id @GeneratedValue
    private Long id;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students;
}
```

|**Тип связи**|**Суть**|**Пример отношений**|**Особенности**|**Реализация в базе данных**|
|---|---|---|---|---|
|OneToOne|Один к одному|Паспорт и владелец|Каждая сущность связана с одной другой сущностью|Один из объектов содержит внешний ключ|
|OneToMany|Один ко многим|Департамент и сотрудники|Один объект связан с несколькими объектами другой сущности|Один внешний ключ на стороне “многих”|
|ManyToOne|Многие к одному|Сотрудники и департамент|Обратное отношение к `OneToMany`|Внешний ключ на стороне “многих”|
|ManyToMany|Многие ко многим|Студенты и курсы|Множеству объектов одной сущности соответствует множество другой|Промежуточная таблица|

**OneToMany: разница между List и Set**

|**Характеристика**|`List`|`Set`|
|---|---|---|
|Уникальность|Допускает дубликаты|Гарантирует уникальность элементов|
|Порядок|Сохраняет порядок добавления|Не гарантирует порядок|
|Производительность|Медленнее при проверке наличия|Быстрее при проверке наличия|
|Используемая реализация|`ArrayList` или `LinkedList`|Обычно `HashSet` или `TreeSet`|

**Что такое `Cascade`?**
`Cascade` в JPA определяет, что делать с зависимыми объектами при изменении основного объекта.

**Пример:**
```java
@Entity
class Parent {
    @Id @GeneratedValue
    private Long id;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Child> children;
}

@Entity
class Child {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Parent parent;
}
```
Если удалить `Parent`, то все `Child` объекты тоже удалятся.

|**Тип**|**Описание**|
|---|---|
|`ALL`|Применяет все виды каскада (`PERSIST`, `REMOVE`, `MERGE`, `REFRESH`, `DETACH`)|
|`PERSIST`|Автоматически сохраняет зависимые сущности|
|`REMOVE`|Удаляет зависимые сущности|
|`MERGE`|Обновляет зависимые сущности|
|`REFRESH`|Перезаписывает зависимые сущности из БД|
|`DETACH`|Удаляет зависимые сущности из контекста (но не из БД)|

**Плюсы:**
- Упрощает работу с зависимыми объектами
- Автоматизирует `save()` и `delete()`
- Уменьшает количество `EntityManager` вызовов

**Минусы:**
- Может неожиданно удалить важные данные (`REMOVE` без проверки)
- `ALL` может привести к непредвиденным каскадным операциям
- Может нагружать базу данных, если слишком много зависимостей

---

## 17. LazyInitializationException

<span class="source-badge">Источник: Жуков</span>

Это происходит, когда объект был загружен с ленивой загрузкой, но его данные пытаются быть использованы после закрытия сессии

```java
public void printAuthorBooks(Long authorId) {
    Session session = sessionFactory.openSession();
    Author author = session.get(Author.class, authorId);
    session.close();

    // Попытка доступа к ленивой коллекции после закрытия сессии
    System.out.println(author.getBooks());  // Может вызвать LazyInitializationException
}
```

Как решить?
- JOIN FETCH. Это способ сказать Hibernate загрузить связанные данные вместе с основными (типа обычного JOIN-а)
- Использовать EntityGraph. Указываем, какие данные загружать в конкретных запросах, не изменяя сущности (как в случае с жадной загрузкой)

---

## 18. Что такое SQL-инъекция?

<span class="source-badge">Источник: Жуков</span>

Это тип уязвимости, который позволяет злоумышленникам изменять запросы к базе данных путём внесения в параметры запроса кода, изменяющего поведение оригинального SQL-запроса
```sql
SELECT * FROM users WHERE username = 'user' OR '1'='1';
```

Последствия SQL инъекций
- Вход в систему без проверки логина и пароля
- Возможность удалить важные данные из БД
- Возможность изменить данные в БД
- Доступ к конфиденциальной информации

Как избежать:
- Использовать PreparedStatement
- Использовать Hibernate

---

## 19. Проблемы JOIN FETCH

<span class="source-badge">Источник: Жуков</span>

**Проблема**
Дублирование данных. При загрузке основной сущности с её связанными сущностями результаты могут содержать дубликаты

**Решение**
- Использовать DISTINCT, чтобы избежать дубликатов
```sql
SELECT DISTINCT o FROM Order o JOIN FETCH o.items
```
- Использовать Set для хранения связных элементов

---

## 20. Логи в Hibernate

<span class="source-badge">Источник: Жуков</span>

Hibernate предоставляет детализированные логи через категорию `org.hibernate.SQL`. Это помогает отслеживать сгенерированные SQL-запросы, параметры и выполнение транзакций. Включение логов может помочь отладить проблемы с производительностью или запросами, но может замедлить выполнение при большом количестве запросов

```java
log4j.logger.org.hibernate.SQL=DEBUG
log4j.logger.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

---

## 21. Аннотация @Query, что это такое?

<span class="source-badge">Источник: Жуков</span>

Аннотация `@Query` - аннотация из Spring Data JPA, устанавливающаяся над методом репозитория (JpaRepository), - позволяет писать JPQL или SQL запрос.

**JPQL-запросы** (Java Persistence Query Language)
```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Использование JPQL для выборки данных
    @Query("SELECT u FROM User u WHERE u.name = :name")
    List<User> findByName(@Param("name") String name);
}
```

**Native SQL-запросы**
```java
public interface UserRepository extends JpaRepository<User, Long> {

    // Использование SQL-запроса
    @Query(value = "SELECT * FROM users WHERE name = :name", nativeQuery = true)
    List<User> findByNameNative(@Param("name") String name);
}
```

**Параметры в запросах**
```java
@Query("SELECT u FROM User u WHERE u.name = :name")
List<User> findByName(@Param("name") String name);
```

---

## 22. Как Hibernate генерирует SQL запросы?

<span class="source-badge">Источник: Жуков</span>

Hibernate генерирует SQL-запросы для выполнения операций с сущностями на основе конфигурации и аннотаций, таких как `@Entity`, `@OneToMany`, `@ManyToOne`, и других.

Основные SQL-запросы включают `INSERT`, `SELECT`, `UPDATE`, `DELETE`. Также Hibernate поддерживает использование JPQL для запросов на уровне сущностей и нативных SQL-запросов для выполнения специфических операций
1. Hibernate анализирует метамодель сущностей, чтобы понять, как объекты сопоставляются с таблицами
2. Тип операции (CRUD) определяет, какой SQL-запрос нужно сгенерировать
3. Диалект базы данных задаёт особенности синтаксиса SQL
4. Запросы строятся с учётом аннотаций (`@Lazy`, `@Eager`) и используемого API (JPQL, Criteria или Native SQL)
5. Hibernate оптимизирует SQL-запросы с учётом связей, ленивой загрузки и кэширования

---

## 23. Hibernate. Что хранится в Persistence Context? Сколько времени объект хранится в Persistence Context?

<span class="source-badge">Источник: Жуков</span>

**Persistence Context** (контекст персистентности) - это механизм Hibernate, который управляет состоянием сущностей (entities) в рамках сессии (Session). Он отслеживает изменения в сущностях и синхронизирует их с базой данных. Persistence Context можно рассматривать как кэш первого уровня, который существует на протяжении жизни сессии.

В Persistence Context хранятся:
1. **Управляемые сущности (Managed Entities)**:
    - это объекты, которые были загружены в текущую сессию (например, с помощью `session.get()`, `session.load()`, или через запросы `HQL`, `Criteria API`)
    - Hibernate отслеживает изменения в этих объектах и автоматически синхронизирует их с базой данных при коммите транзакции
2. **Сущности, добавленные для сохранения**:
    - объекты, которые были добавлены в Persistence Context с помощью `session.save()`, `session.persist()`, или `session.update()`
3. **Сущности, помеченные на удаление**:
    - объекты, которые были помечены на удаление с помощью `session.delete()`
4. **Снимки состояния (Snapshots)**:
    - Hibernate сохраняет снимки состояния сущностей на момент их загрузки. Эти снимки используются для определения изменений в объектах и генерации соответствующих SQL-запросов при синхронизации с базой данных
5. **Идентификаторы сущностей**:
    - Persistence Context хранит идентификаторы (ID) всех управляемых сущностей, чтобы быстро находить их в кэше

**Сколько времени объект хранится в Psersistence Context?**
- До окончания сессии
- До явного удаления (`evict` или `clear`)
- До того, как объект переходит в состояние `detached`

---

## 24. Hibernate и Lombok

<span class="source-badge">Источник: Жуков</span>

**Проблема аннотации `@Data` в Hibernate**
`@Data` генерирует:  
 - геттеры и сеттеры
 - `toString()`  
 - `equals()` и `hashCode()`

 **Проблема `toString()`**
Если в entity с `@Data` есть `@OneToMany(fetch = FetchType.LAZY)`, то Hibernate создаст прокси-объект, а Lombok генерирует `toString()` с участием всех полей, что приводит к `LazyInitializationException`
```java
@Entity
@Data
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders;
}

User user = session.get(User.class, 1L);
System.out.println(user); // ❌ LazyInitializationException
```

**Решение:**  
Использовать `@ToString.Exclude`
```java
@Entity
@Data
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Order> orders;
}
```

 **Проблема с `equals()` и `hashCode()`**
Lombok генерирует эти методы с участием всех полей, в том числе `@OneToMany`, что может привести к бесконечной рекурсии

**Решение:** 
Использовать `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` или `@EqualsAndHashCode.Exclude`
```java
@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Id @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;

    private String name;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Order> orders;
}
```

---

## 25. Как JPA делает запросы?

<span class="source-badge">Источник: Жуков</span>

- базовые методы интерфейса `JpaRepository` (`save()`, `findAll()` и т.д.)
- magic-методы - генерация запросов по имени метода (`findAllByXOrderByZ` и т.п.),  `JpaReposiory` расширяет `QueryByExample`
- `@Query` с JPQL/HQL
- `@Query` с `native=true`

---

## 26. Стратегии наследования в Hibernate

<span class="source-badge">Источник: Жуков</span>

**`SINGLE_TABLE` (Одна таблица на иерархию)**
Одна таблица на всю иерархию. Все сущности со всеми наследниками записываются в одну таблицу, где определяется дополнительная колонка для идентификации типа сущности. Главный минус - в таблице будут созданы все поля, которые для некоторых сущностей уникальны, а для других - пустые

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
public abstract class Vehicle {
    @Id @GeneratedValue
    private Long id;
    private String manufacturer;
    // getters/setters...
}

@Entity
@DiscriminatorValue("CAR")
public class Car extends Vehicle {
    private int seatingCapacity;
    // getters/setters...
}

@Entity
@DiscriminatorValue("TRUCK")
public class Truck extends Vehicle {
    private double payloadCapacity;
    // getters/setters...
}
```

**Плюсы**: 
- единая таблица, простой запрос (без `JOIN`)
- высокая производительность чтения
**Минусы**: 
- много nullable‑колонок (для полей всех подклассов)
- таблица растёт “шириной”

**`TABLE_PER_CLASS` (Отдельная таблица для каждого класса)**
Каждый класс-сущность сохраняет данные в свою таблицу, но только уникальные поля и первичный ключ, а все унаследованные поля записываются в таблицы класса-предка. 

```java
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Vehicle {
    @Id @GeneratedValue
    private Long id;
    private String manufacturer;
}

@Entity
public class Car extends Vehicle {
    private int seatingCapacity;
}

@Entity
public class Truck extends Vehicle {
    private double payloadCapacity;
}
```

**Плюсы**: 
- нет лишних nullable‑полей, модель “чистой” объектно‑реляционной композиции
**Минусы**: 
- `UNION`‑запросы при выборке всех `Vehicle`
- сложнее поддержка авто‑инкрементов (не во всех СУБД)


**`JOINED` (По‑таблицам с `JOIN`)**
Корневой класс хранится в одной таблице, каждый подкласс - в своей, причём таблица подкласса содержит поле‑FK на корневую
```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Vehicle {
    @Id @GeneratedValue
    private Long id;
    private String manufacturer;
}

@Entity
@Table(name = "car")
public class Car extends Vehicle {
    private int seatingCapacity;
}

@Entity
@Table(name = "truck")
public class Truck extends Vehicle {
    private double payloadCapacity;
}
```

**Плюсы**: 
- нет nullable‑полей, структура реляционно “чистая”, легко расширять и модифицировать.
**Минусы**: 
- плохая поддержка полиморфизма
- `JOIN`‑ы при загрузке подклассов 
- чуть более низкая производительность выборки


4. **`@MappedSuperclass` (Не таблица‑суперкласс)**
Аннотированный суперкласс не является сущностью и не получает своей таблицы; его поля унаследуют таблицы подклассов. Используется, когда общие поля и методы нужно “раздать” нескольким сущностям, но сама иерархия не хранится.
```java
@MappedSuperclass
public abstract class BaseEntity {
    @Id @GeneratedValue
    private Long id;
    private LocalDateTime createdAt;
}

@Entity
public class User extends BaseEntity {
    private String username;
    private String email;
}

@Entity
public class Product extends BaseEntity {
    private String name;
    private BigDecimal price;
}
```

Когда выбирать какую стратегию

| Стратегия           | Подходит для…                                       | Основные преимущества                      |
| ------------------- | --------------------------------------------------- | ------------------------------------------ |
| `SINGLE_TABLE`      | Быстрых операций чтения, небольшой иерархии         | Нет `JOIN`, простота запросов              |
| `TABLE_PER_CLASS`   | Много разных подклассов с уникальными полями        | Чистая ORM модель, нет `null`              |
| `JOINED`            | Чёткая нормализация данных, частые обновления схемы | Нет лишних колонок, гибкость               |
| `@MappedSuperclass` | Общие поля для разных сущностей без таблицы‑супер   | Переиспользование кода без влияния на СУБД |

---
