---
title: "Паттерны проектирования"
outline: [2, 3]
---

# Паттерны проектирования

**Источник:** Материалы Жукова  
**Вопросов/пунктов:** 13

## 1. GOF паттерны

**Источник:** Жуков

GOF паттерны - это классические паттерны проектирования, описанные в книге _“Design Patterns: Elements of Reusable Object-Oriented Software”_, написанной четырьмя авторами (так называемой “Бандой четырёх”). Эти паттерны решают распространённые проблемы проектирования в объектно-ориентированном программировании (ООП) и помогают создавать гибкую и поддерживаемую архитектуру

---

## 2. Что такое паттерн?

**Источник:** Жуков

Паттерн - готовый шаблон/подход к решению какой-то популярной проблемы

---

## 3. Плюсы и минусы использования паттернов

**Источник:** Жуков

**Плюсы:**
- не нужно изобретать велосипед
- ускорение разработки
**Минусы:**
- бездумное внедрение паттернов может ухудшить читаемость кода и/или ненужному усложнению

---

## 4. Какие существуют группы паттернов?

**Источник:** Жуков

По GoF:
- Порождающие
- Структурные
- Поведенческие

Отдельно выделяют так же архитектурные паттерны.

---

## 5. Какие паттерны в какую группу входят?

**Источник:** Жуков

Порождающие:
- Singletone (синглтон, одиночка)
- Prototype (прототип)
- Builder (строитель)
- Factory | factory method (фабрика)
- Abstract factory (абстрактная фабрика)

Структурные:
- Adapter (адаптер)
- Decorator (декоратор)
- Proxy (заместитель)
- Facade (фасад)

Поведенческие:
- Chain of Responsibility (цепочка обязанностей)
- Strategy (стратегия)
- Iterator (итератор)
- Command (команда)

*Архитектурные:
- MVC (model-view-controller) или MVSC (model-view-service-controller)
- Front controller

---

## 6. Adapter vs Decorator

**Источник:** Жуков

|**Критерий**|**Adapter**|**Decorator**|
|---|---|---|
|**Цель**|Преобразовать интерфейс одного класса в интерфейс, который ожидает клиент|Добавить новую функциональность объекту без изменения его структуры|
|**Взаимодействие**|Адаптирует существующий класс к новому интерфейсу|Оборачивает объект, добавляя или изменяя его поведение|
|**Структура**|Реализует интерфейс, который ожидает клиент, и делегирует вызовы адаптируемому классу|Оборачивает объект одного и того же интерфейса, добавляя новую логику|
|**Пример использования**|Используется, когда у нас есть несовместимые интерфейсы, которые нужно связать|Используется, когда нужно динамически добавлять новые возможности объектам|
|**Пример в реальной жизни**|Электрический адаптер-переходник с евророзетки на китайскую|Подарочная упаковка на коробке, которая не меняет содержимое, но добавляет украшение|

**Паттерн Decorator**
Декоратор - это структурный паттерн проектирования, который позволяет добавлять объектам новые обязанности на лету, помещая их в специальные обёртки

**Ключевые особенности:**
- динамическое добавление функциональности - не изменяя код исходного объекта
- композиция вместо наследования - декоратор оборачивает объект, вместо того чтобы расширять его через наследование
- прозрачность для клиента - декоратор использует тот же интерфейс, что и объект, который он оборачивает

---

## 7. Паттерн MVC

**Источник:** Жуков

**MVC** (Model-View-Controller) - это архитектурный паттерн, который разделяет приложение на три компонента:
- **Model** - отвечает за данные и логику приложения
- **View** - отображает данные пользователю (UI)
- **Controller** - управляет взаимодействием пользователя с моделью и обновляет представление

_Примечание: иногда добавляют букву S (Service) - отвечает за бизнес-логику, получается MVSC_

---

## 8. Паттерн Command

**Источник:** Жуков

Command (команда) - это поведенческий паттерн проектирования, который превращает запросы в объекты, позволяя передавать их как аргументы при вызове методов, ставить запросы в очередь, логировать их, а также поддерживать отмену операций

---

## 9. Паттерн Chain of responsibility

**Источник:** Жуков

Цепочка обязанностей (Chain of Responsibility) - это поведенческий паттерн проектирования, который позволяет передавать запросы последовательно по цепочке обработчиков. Каждый последующий обработчик решает, может ли он обработать запрос сам и стоит ли передавать запрос дальше по цепочке

---

## 10. Как реализуется паттер Abstract Factory?

**Источник:** Жуков

Abstract Factory - это порождающий паттерн проектирования, который предоставляет интерфейс для создания семейств взаимосвязанных объектов без указания их конкретных классов. Он позволяет легко добавлять новые семейства объектов, сохраняя код гибким и расширяемым


**Сценарий:** Предположим, мы создаем интерфейсы для двух семейств GUI-компонентов: Windows и MacOS. Каждое семейство включает кнопку (`Button`) и чекбокс (`Checkbox`)

1. **Интерфейсы для компонентов**
	```java
    public interface Button {
        void render();
    }
    
    public interface Checkbox {
        void render();
    }
    ```
    
2. **Реализации компонентов для Windows**
	```java
    public class WindowsButton implements Button {
        @Override
        public void render() {
            System.out.println("Rendering Windows Button");
        }
    }
    
    public class WindowsCheckbox implements Checkbox {
        @Override
        public void render() {
            System.out.println("Rendering Windows Checkbox");
        }
    }
    ```
    
3. **Реализации компонентов для MacOS**
    ```java
    public class MacOSButton implements Button {
        @Override
        public void render() {
            System.out.println("Rendering MacOS Button");
        }
    }
    
    public class MacOSCheckbox implements Checkbox {
        @Override
        public void render() {
            System.out.println("Rendering MacOS Checkbox");
        }
    }
    ```
    
4. **Интерфейс Abstract Factory**
    ```java
    public interface GUIFactory {
        Button createButton();
        Checkbox createCheckbox();
    }
    ```
    
5. **Реализации фабрик для Windows и MacOS**
    ```java
    public class WindowsFactory implements GUIFactory {
        @Override
        public Button createButton() {
            return new WindowsButton();
        }
    
        @Override
        public Checkbox createCheckbox() {
            return new WindowsCheckbox();
        }
    }
    
    public class MacOSFactory implements GUIFactory {
        @Override
        public Button createButton() {
            return new MacOSButton();
        }
    
        @Override
        public Checkbox createCheckbox() {
            return new MacOSCheckbox();
        }
    }
    ```
    
6. **Клиентский код**
    Клиент работает с фабрикой через интерфейс, что позволяет легко переключаться между семействами
    ```java
    public class Application {
        private Button button;
        private Checkbox checkbox;
    
        public Application(GUIFactory factory) {
            button = factory.createButton();
            checkbox = factory.createCheckbox();
        }
    
        public void render() {
            button.render();
            checkbox.render();
        }
    }
    
    public class Main {
        public static void main(String[] args) {
            GUIFactory factory;
            String os = "Windows"; // Можно заменить на "MacOS" для другого семейства
    
            if (os.equals("Windows")) {
                factory = new WindowsFactory();
            } else {
                factory = new MacOSFactory();
            }
    
            Application app = new Application(factory);
            app.render();
        }
    }
    ```

---

## 11. Какие паттерны проектирования используются в Spring

**Источник:** Жуков

[Статья на хабре с примерами применения паттернов в Spring](https://habr.com/ru/companies/otus/articles/451516/)

| **Паттерн**              | **Описание**                                                                              | **Применение в Spring**                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Factory**              | Создает объекты через фабричный метод                                                     | `BeanFactory` и `ApplicationContext` для создания и управления бинами            |
| **Singleton**            | Гарантирует, что существует только один экземпляр класса                                  | Бины Spring по умолчанию создаются как `Singleton`                               |
| **Prototype**            | Создает новый экземпляр объекта при каждом запросе                                        | Используется для бинов с областью видимости `Prototype`                          |
| **Proxy**                | Управляет доступом к объекту через подставной объект                                      | Реализуется в AOP для аспектов, транзакций, кэширования и других прокси-настроек |
| **Dependency Injection** | Внедрение зависимостей для уменьшения связности классов                                   | Основной принцип Spring Framework для управления зависимостями                   |
| **Template Method**      | Определяет основу алгоритма и позволяет подклассам переопределять определенные шаги       | `JdbcTemplate`, `RestTemplate` и другие “шаблоны”                                |
| **Observer**             | Оповещает подписчиков о событиях                                                          | Spring Event Handling для работы с событиями (например, ApplicationEvent)        |
| **Adapter**              | Преобразует интерфейс класса в другой, ожидаемый клиентом                                 | `HandlerAdapter` в Spring MVC                                                    |
| **Decorator**            | Добавляет дополнительное поведение объекту динамически                                    | В Spring AOP для добавления аспектов к методам или классам                       |
| **Strategy**             | Определяет набор алгоритмов, которые можно заменять друг другом в зависимости от ситуации | Интерфейсы, такие как `PlatformTransactionManager`, с разными реализациями       |
| **Builder**              | Упрощает создание сложных объектов, разделяя их построение на шаги                        | `UriComponentsBuilder` для построения URI в Spring Web                           |

**Подробности реализации некоторых паттернов в Spring**

1. **Factory:**
    `BeanFactory` - реализация фабричного паттерна для управления созданием и инициализацией бинов
    `MyBean myBean = context.getBean(MyBean.class);`
    
2. **Proxy** используется для аспектов (AOP), например, для логирования, транзакций или кэширования
3. **Observer** - события, такие как `ContextRefreshedEvent`, используются для уведомления бинов о состоянии контекста
    ```java
    @Component
    public class MyEventListener implements ApplicationListener<ContextRefreshedEvent> {
        @Override
        public void onApplicationEvent(ContextRefreshedEvent event) {
            System.out.println("Context Refreshed!");
        }
    }
    ```
4. **Strategy** - разные реализации интерфейсов используются в зависимости от ситуации. Например, `PlatformTransactionManager` имеет реализации для JPA, JDBC и Hibernate
	```java
	@Bean
	public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
	    return new JpaTransactionManager(emf);
	}
	```

---

## 12. Плюсы и минусы паттерна Singleton?

**Источник:** Жуков

Singleton - это паттерн, который гарантирует, что у класса есть только один экземпляр и предоставляет к нему глобальную точку доступа.

**Реализация Singleton**
Простой ленивый Singleton (не потокобезопасен!)
```java
public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

Потокобезопасный Singleton (Double-Checked Locking)
```java
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```
Использует `volatile` и `synchronized`, чтобы избежать проблем в многопоточности.

Singleton через `enum` ( преимущество - защищен от сериализации и рефлексии)
```java
public enum Singleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("Singleton через enum");
    }
}
```

 *Плюсы и минусы Singleton*

**Плюсы:**
- глобальный доступ - один объект доступен во всей программе. 
- экономия ресурсов - объект создается только один раз
- ленивая инициализация (если используется `getInstance()`) 
- подходит для логирования, кеша, конфигураций, пулов соединений
- рри `enum` защита от рефлексии и сериализации

**Минусы:**
- нарушает принцип SOLID (Single Responsibility Principle) – класс отвечает и за бизнес-логику, и за контроль экземпляра
- сложность в тестировании - из-за глобального состояния сложно **мокировать (mock)** объект
- может вызывать утечки памяти - если объект долго живет и содержит ресурсы
- проблемы с многопоточностью - если реализация не потокобезопасна
- может скрывать зависимости - если используется в `getInstance()` внутри классов

**Когда использовать Singleton?**
Если нужен единый объект для всего приложения, а DI фреймворки не используются:
- логирование (`Logger`)
- кеширование (`CacheManager`)
- пулы соединений (`ConnectionPool`)
- конфигурации (`AppConfig`)

**Когда НЕ стоит использовать:**
- если объект содержит разное состояние для разных частей программы
- когда проще передавать зависимость через DI (Dependency Injection)

---

## 13. Паттерн Builder

**Источник:** Жуков

Builder (строитель) - это порождающий паттерн проектирования, который позволяет пошагово и удобно создавать сложные объекты, скрывая детали их построения.

**Когда нужен?**
- у объекта много параметров, часть которых необязательная
- важна читаемость и гибкость конфигурации объекта

**Преимущества**
- Уменьшает количество конструкторов
- Код становится читаемым
- Позволяет создавать immutable объекты
- Позволяет валидировать данные при сборке

Пример кода
```java
public class User {
    private final String name; // допустим, это обязательное поле
    private int age;
    private String email;

    private User(Builder builder) {
        this.name = builder.name;
        this.age = builder.age;
        this.email = builder.email;
    }

    public static class Builder {
	    // хорошая практика - в билдере делать его неизменяемым
        private final String name; 
        private int age;
        private String email;
		
		// и добавлять в конструктор
		public Builder (String name) {
			this.name = name;
		}

        public Builder age(int age) {
            this.age = age;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}
```

Использование:
```java
User user = new User.Builder("Alex")
        .age(30)
        .email("test@gmail.com")
        .build();
```

---
