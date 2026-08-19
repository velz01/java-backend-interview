---
title: "Тестирование"
outline: [2, 3]
---

# Тестирование

**Источник:** Материалы Жукова  
**Вопросов/пунктов:** 9

## 1. На чем пишутся тесты?

**Источник:** Жуков

Unit-тесты - в основном на JUnit
Mock-тесты - Mockito, WireMock
Интеграционные - Testcontainers, Spring Test
UI-тесты - Selenium
Performance тесты - JMeter

---

## 2. Mock vs spy

**Источник:** Жуков

| **Критерий**             | **Mock**                                                                             | **Spy**                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Описание**             | Полностью имитирует поведение объекта. Вы задаёте ожидаемые ответы на вызовы методов | Реальный объект, но с возможностью “шпионить” за вызовами методов                   |
| **Подход**               | Заменяет объект, тестируется только взаимодействие (behavior verification)           | Используется реальный объект, но вы можете подменять результаты вызовов его методов |
| **Когда использовать**   | Когда необходимо полностью изолировать тестируемый объект от зависимости             | Когда хотите протестировать реальный объект, но также отследить вызовы его методов  |
| **Типы подмен**          | Вы задаёте возвращаемые значения для всех методов объекта                            | Реальные методы объекта выполняются, если не настроена их подмена                   |
| **Пример использования** | Проверка взаимодействия с внешней зависимостью, например, базой данных               | Проверка поведения конкретного метода объекта, оставаясь близко к реальной логике   |

---

## 3. Параметризованные тесты

**Источник:** Жуков

Параметризованные тесты позволяют запускать один и тот же тест с различными входными данными. Это удобно для проверки поведения метода на разных наборах значений
```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 4, 5})
void testWithParameters(int number) {
    assertTrue(number > 0);
}
```

**Типы источников в параметризованных тестах (JUnit 5)**
- `@ValueSource` - передаёт фиксированные наборы данных (массив значений)
- `@CsvSource` - передаёт данные в формате CSV
- `@CsvFileSource` - загружает данные из файла CSV
- `@MethodSource` - использует метод для предоставления набора данных
- `@EnumSource` - передаёт значения перечислений (enums)

---

## 4. Unit тесты. Что это и зачем?

**Источник:** Жуков

Unit-тестирование, оно же модульное - это тестирование отдельных компонентов (модулей, классов, методов) приложения в изоляции от остальной системы

Цели Unit-тестов:
- проверить корректность работы каждого модуля
- локализовать ошибки на уровне методов и классов
- упростить рефакторинг кода (помогает не сломать старую логику при изменениях)

---

## 5. Unit тесты vs интеграционные тесты

**Источник:** Жуков

| **Критерий**            | **Unit-тесты**            | **Интеграционные тесты**                         |
| ----------------------- | ------------------------- | ------------------------------------------------ |
| **Объект тестирования** | Отдельные методы, классы  | Взаимодействие компонентов                       |
| **Зависимости**         | Заменяются mock-объектами | Используются реальные сервисы (БД, API)          |
| **Скорость выполнения** | Быстро (миллисекунды)     | Медленно (секунды и больше)                      |
| **Пример**              | `Calculator.add(2, 3)`    | Spring сервис c обращением к БД + Testcontainers |

---

## 6. Mock. Как работает?

**Источник:** Жуков

Mock - это объект-заменитель реального объекта. Позволяет имитировать нужное поведение заменяемого объекта. Mock не выполняет логику, он просто возвращает заранее определённые значения.

Основное назначение Mock - тестирование кода в изоляции от реальных объектов и/или зависимостей (например, БД или внешнего API)

**Пример использования Mock (Mockito)**
Предположим, у нас есть сервис, который зависит от репозитория для получения данных. Вместо того чтобы подключаться к реальной базе данных, мы подменяем репозиторий на mock-объект, который будет просто возвращать заранее заданные данные
```java
public class UserService {
    private UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public String getUserName(int id) {
        return repository.findNameById(id);  // Ищем имя пользователя по id
    }
}

@Test
public void testMock() {
    // Создаем mock-объект
    UserRepository mockRepo = mock(UserRepository.class);

    // Указываем поведение mock-объекта
    when(mockRepo.findNameById(1)).thenReturn("Alice");

    // Используем mock-объект в сервисе
    UserService service = new UserService(mockRepo);

    // Проверяем результат
    assertEquals("Alice", service.getUserName(1));
}
```

В данном примере мы подменяем `UserRepository` с помощью **mock-объекта** и говорим ему, что он должен возвращать `"Alice"`, когда вызывается метод `findNameById(1)`

---

## 7. Spy. Как работает?

**Источник:** Жуков

Spy (шпион) - это объект, который ведет себя как настоящий объект, но позволяет изменить поведение некоторых методов или проверить, были ли вызваны методы

**Как работает Spy?**
- в отличие от Mock, где вы полностью контролируете поведение, Spy позволяет тестировать и реальную логику, и подменять метод, если это необходимо
- позволяет проверить, вызывался ли конкретный метод у объекта и кол-во вызовов за время выполнения теста

**Пример использования Spy (Mockito)**
Предположим, у нас есть объект, который взаимодействует с реальной коллекцией, и нам нужно изменить только один метод, чтобы протестировать его
```java
@Test  
public void testSpy() {  
    // Создаем реальный объект  
    List<String> list = new ArrayList<>();  
  
    // Создаем spy-объект для этого списка  
    List<String> spyList = spy(list);  
  
    // Добавляем элемент в реальный список  
    spyList.add("Hello");  
  
    // Переопределяем метод size(), чтобы он всегда возвращал 100  
    when(spyList.size()).thenReturn(100);  
  
    // Проверяем результат  
    assertEquals(100, spyList.size());      // Мы подменили размер  
    assertEquals("Hello", spyList.get(0));  // Но добавление осталось реальным  
    
    // Проверяем, что метода add вызвался ровно 1 раз  
    verify(spyList, times(1)).add(anyString());  
}
```

---

## 8. Каким образом проверяются результаты тестов?

**Источник:** Жуков

**Проверка значений (Assertions)**
JUnit
```java
assertEquals(5, calculator.add(2, 3)); // Проверка, что результат 5
assertTrue(user.isActive()); // Проверка, что юзер активен
```

AssertJ
```java
// Проверка чисел
assertThat(calculator.add(2, 3)).isEqualTo(5)
								.isGreaterThan(0)
							    .isLessThan(20);

// Проверка boolean
assertThat(user.isActive()).isTrue();

// Проверка строк
String message = "Hello, AssertJ!";
assertThat(message).isNotEmpty()
                   .startsWith("Hello")
                   .contains("AssertJ")
                   .endsWith("!");
                   
// Проверка размера и содержимого списка
assertThat(names).hasSize(3)
                 .contains("Alice", "Charlie")
                 .doesNotContain("David")
                 .startsWith("Alice")
                 .endsWith("Charlie");
```

**Проверка исключений**
JUnit 5
```java
assertThrows(IllegalArgumentException.class, () -> service.findUser(-1));
```

AssertJ
```java
assertThatThrownBy(() -> service.findUser(-1))
					.isInstanceOf(IllegalArgumentException.class)
          .hasMessageContaining("Invalid");
```

**Проверка вызовов Mock (Mockito)**
Убедимся, что метод `findNameById(1)` был вызван ровно 1 раз
```java
verify(mockRepo, times(1)).findNameById(1);
```

---

## 9. Основные аннотации в тестировании

**Источник:** Жуков

Основные аннотации JUnit 5

| Аннотация            | Назначение                                                                         |
| -------------------- | ---------------------------------------------------------------------------------- |
| `@Test`              | Обозначает метод как тестовый                                                      |
| `@BeforeEach`        | Метод выполняется **перед каждым** тестом                                          |
| `@AfterEach`         | Метод выполняется **после каждого** теста                                          |
| `@BeforeAll`         | Выполняется **один раз перед всеми тестами** (должен быть `static`)                |
| `@AfterAll`          | Выполняется **один раз после всех тестов** (должен быть `static`)                  |
| `@DisplayName`       | Назначает удобное имя тесту, отображается в отчётах                                |
| `@Disabled`          | Отключает тест (временно пропускает)                                               |
| `@Nested`            | Позволяет группировать тесты во вложенные классы                                   |
| `@Tag`               | Помечает тест определённым тегом (удобно для фильтрации)                           |
| `@ParameterizedTest` | Используется для **параметризованных тестов** (с разными входами)                  |
| `@Order`             | Порядок выполнения тестовых методов                                                |
| `@TestMethodOrder`   | Стратегия определения последовательности запуска тестовых методов для всего класса |

```java
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;  
import org.junit.jupiter.params.provider.ValueSource;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)  
public class UserServiceTest {  
  
    @BeforeAll  
    static void initAll() {  
        System.out.println("Before all tests");  
    }  
  
    @BeforeEach  
    void init() {  
        System.out.println("Before each test");  
    }  
  
    @Order(3)  
    @Test  
    @DisplayName("Проверка регистрации пользователя")  
    void testUserRegistration() {  
        Assertions.assertEquals(2, 1 + 1);  
    }  
  
    @Order(1)  
    @Test  
    @Disabled("Временно отключен")  
    void disabledTest() {  
        Assertions.fail("Этот тест не будет выполнен");  
    }  
  
    @Order(2)  
    @ParameterizedTest  
    @ValueSource(strings = {"admin", "user", "guest"})  
    void testRoles(String role) {  
        Assertions.assertTrue(role.length() > 0);  
    }  
  
    @Nested  
    class NestedTestClass{  
        @Test  
        @Tag("any")  
        void nestedTest() {  
            Assertions.assertTrue("1" == "1");  
        }  
    }  
  
    @AfterEach  
    void tearDown() {  
        System.out.println("After each test");  
    }  
  
    @AfterAll  
    static void tearDownAll() {  
        System.out.println("After all tests");  
    }  
}
```

Отображение после запуска:

![](/junit-test-run.png)

---
