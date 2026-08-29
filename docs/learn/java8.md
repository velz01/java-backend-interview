---
title: "Java 8+"
outline: [2, 3]
---

# Java 8+

Всего вопросов: **21**


---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 1. Какие именно нововведения, появились в Java 8 и JDK 8?

+ Методы интерфейсов по умолчанию;
+ Лямбда-выражения;
+ Функциональные интерфейсы;
+ Ссылки на методы и конструкторы;
+ Повторяемые аннотации;
+ Аннотации на типы данных;
+ Рефлексия для параметров методов;
+ _Stream API_ для работы с коллекциями;
+ Параллельная сортировка массивов;
+ Новое API для работы с датами и временем;
+ Новый движок JavaScript _Nashorn_;
+ Добавлено несколько новых классов для потокобезопасной работы;
+ Добавлен новый API для `Calendar` и `Locale`;
+ Добавлена поддержка _Unicode 6.2.0_;
+ Добавлен стандартный класс для работы с _Base64_;
+ Добавлена поддержка беззнаковой арифметики;
+ Улучшена производительность конструктора `java.lang.String(byte[], *)` и метода `java.lang.String.getBytes()`;
+ Новая реализация `AccessController.doPrivileged`, позволяющая устанавливать подмножество привилегий без нужности проверки всех остальных уровней доступа;
+ _Password-based_ алгоритмы стали более устойчивыми;
+ Добавлена поддержка _SSL/TLS Server Name Indication (NSI)_ в _JSSE Server_;
+ Улучшено хранилище ключей (KeyStore);
+ Добавлен алгоритм _SHA-224_;
+ Удален мост _JDBC - ODBC_;
+ Удален _PermGen_, изменен способ хранения мета-данных классов;
+ Возможность создания профилей для платформы Java SE, которые включают в себя не всю платформу целиком, а некоторую ее часть;
+ Инструментарий
    + Добавлена утилита `jjs` для использования _JavaScript Nashorn_;
    + Команда `java` может запускать _JavaFX_ приложения;
    + Добавлена утилита `jdeps` для анализа _.class_-файлов.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 2. Поясните, что такое `default` методы интрефейса?

Java 8 даёт возможность добавлять неабстрактные реализации методов в интерфейс, используя ключевое слово `default`:

```java
interface Example {
    int process(int a);
    default void show() {
        System.out.println("default show()");
    }
}
```

+ Если класс реализует интерфейс, он может, но не обязан, реализовать методы по-умолчанию, уже реализованные в интерфейсе. Класс наследует реализацию по умолчанию.
+ Если некий класс реализует несколько интерфейсов, которые имеют одинаковый метод по умолчанию, то класс должен реализовать метод с совпадающей сигнатурой самостоятельно. Ситуация аналогична, если один интерфейс имеет метод по умолчанию, а в другом этот же метод является абстрактным - никакой реализации по умолчанию классом не наследуется.
+ Метод по умолчанию не может переопределить метод класса `java.lang.Object`.
+ Помогают реализовывать интерфейсы без страха нарушить работу других классов.
+ Позволяют избежать создания служебных классов, так как все необходимые методы могут быть представлены в самих интерфейсах.
+ Дают свободу классам выбрать метод, который нужно переопределить.
+ Одной из основных причин внедрения методов по умолчанию является возможность коллекций в Java 8 использовать лямбда-выражения.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 3. Каким образом вызывать `default` метод интерфейса в реализующем этот интерфейс классе?

Используя ключевое слово `super` вместе с именем интерфейса:

```java
interface Paper {
    default void show() {
        System.out.println("default show()");
    }
}

class Licence implements Paper {
    public void show() {
        Paper.super.show();
    }
}
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 4. Поясните, что такое `static` метод интерфейса?

Статические методы интерфейса похожи на методы по умолчанию, за исключением того, что для них отсутствует возможность переопределения в классах, реализующих интерфейс.

+ Статические методы в интерфейсе являются частью интерфейса без возможности переопределить их для объектов класса реализации;
+ Методы класса `java.lang.Object` нельзя переопределить как статические;
+ Статические методы в интерфейсе применяются для обеспечения вспомогательных методов, например, проверки на null, сортировки коллекций и т.д.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 5. Каким образом вызывать `static` метод интерфейса?

Используя имя интерфейса:

```java
interface Paper {
    static void show() {
        System.out.println("static show()");
    }
}

class Licence {
    public void showPaper() {
        Paper.show();
    }
}
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 6. Поясните, что такое `Optional`?

Опциональное значение `Optional` — это контейнер для объекта, который может содержать или не содержать значение `null`. Такая обёртка является удобным средством предотвращения `NullPointerException`, т.к.
имеет некоторые функции высшего порядка, избавляющие от добавления повторяющихся `if null/notNull` проверок:

```java
Optional<String> optional = Optional.of("hello");

optional.isPresent(); // true
optional.ifPresent(s -> System.out.println(s.length())); // 5
optional.get(); // "hello"
optional.orElse("ops..."); // "hello"
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 7. Каким образом получить текущую дату с использованием Date Time API из Java 8?

```java
LocalDate.now();
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 8. Поясните, что такое `LocalDateTime`?

`LocalDateTime` объединяет вместе `LocaleDate` и `LocalTime`, содержит дату и время в календарной системе ISO-8601 без привязки к часовому поясу. Время хранится с точностью до наносекунды. Содержит множество удобных методов, таких как plusMinutes, plusHours, isAfter, toSecondOfDay и т.д.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 9. Поясните, что такое `ZonedDateTime`?

`java.time.ZonedDateTime` — аналог `java.util.Calendar`, класс с самым полным объемом информации о временном контексте в календарной системе ISO-8601. Включает временную зону, поэтому все операции с временными сдвигами этот класс проводит с её учётом.

---

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 10. Каким образом добавить 1 неделю, 1 месяц, 1 год, 10 лет к текущей дате с использованием Date Time API?

```java
LocalDate.now().plusWeeks(1);
LocalDate.now().plusMonths(1);
LocalDate.now().plusYears(1);
LocalDate.now().plus(1, ChronoUnit.DECADES);
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 11. Каким образом получить вторую субботу текущего месяца используя Date Time API?

```java
LocalDate
    .of(LocalDate.now().getYear(), LocalDate.now().getMonth(), 1)
    .with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY))
    .with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 12. Каким образом получить следующий вторник используя Date Time API?

```java
LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.TUESDAY));
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 13. Каким образом получить текущее время по местному времени с точностью до миллисекунд используя Date Time API?

```java
LocalDateTime.ofInstant(new Date().toInstant(), ZoneId.systemDefault());
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 14. Каким образом получить текущее время с точностью до миллисекунд используя Date Time API?

```java
new Date().toInstant();
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 15. Каким образом создать Base64 кодировщик и декодировщик?

```java
// Encode
String b64 = Base64.getEncoder().encodeToString("input".getBytes("utf-8")); //aW5wdXQ==
// Decode
new String(Base64.getDecoder().decode("aW5wdXQ=="), "utf-8"); //input
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 16. Какие именно дополнительные методы для работы с ассоциативными массивами (maps) появились в Java 8?

+ `putIfAbsent()` добавляет пару «ключ-значение», только если ключ отсутствовал:

`map.putIfAbsent("a", "Aa");`

+ `forEach()` принимает функцию, которая производит операцию над каждым элементом:

`map.forEach((k, v) -> System.out.println(v));`

+ `compute()` создаёт или обновляет текущее значение на полученное в результате вычисления (возможно использовать ключ и текущее значение):

`map.compute("a", (k, v) -> String.valueOf(k).concat(v)); //["a", "aAa"]`

+ `computeIfPresent()` если ключ существует, обновляет текущее значение на полученное в результате вычисления (возможно использовать ключ и текущее значение):

`map.computeIfPresent("a", (k, v) -> k.concat(v));`

+ `computeIfAbsent()` если ключ отсутствует, создаёт его со значением, которое вычисляется (возможно использовать ключ):

`map.computeIfAbsent("a", k -> "A".concat(k)); //["a","Aa"]`

+ `getOrDefault()` в случае отсутствия ключа, возвращает переданное значение по-умолчанию:

`map.getOrDefault("a", "not found");`

+ `merge()` принимает ключ, значение и функцию, которая объединяет передаваемое и текущее значения. Если под заданным ключем значение отсутствует, то записывает туда передаваемое значение. 

`map.merge("a", "z", (value, newValue) -> value.concat(newValue)); //["a","Aaz"]`

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 17. Поясните, что такое `StringJoiner`?

Класс `StringJoiner` используется, чтобы создать последовательность строк, разделенных разделителем с возможностью присоединить к полученной строке префикс и суффикс:

```java
StringJoiner joiner = new StringJoiner(".", "prefix-", "-suffix");
for (String s : "Hello the brave world".split(" ")) {
    joiner.add(s);
}
System.out.println(joiner); //prefix-Hello.the.brave.world-suffix
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 18. Каким образом определить повторяемую аннотацию?

Чтобы определить повторяемую аннотацию, нужно создать аннотацию-контейнер для списка повторяемых аннотаций и обозначить повторяемую мета-аннотацией `@Repeatable`:

```java
@interface Schedulers
{
    Scheduler[] value();
}

@Repeatable(Schedulers.class)
@interface Scheduler
{
    String birthday() default "Jan 8 1935";
}
```

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 19. Поясните, что такое `jjs`?

`jjs` это утилита командной строки, которая даёт возможность исполнять программы на языке JavaScript прямо в консоли.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 20. Поясните, что такое `Nashorn`?

__Nashorn__ - это движок JavaScript, разрабатываемый на Java компанией Oracle. Призван дать возможность встраивать код JavaScript в приложения Java. В сравнении с _Rhino_, который поддерживается Mozilla Foundation, Nashorn обеспечивает от 2 до 10 раз более высокую производительность, так как он компилирует код и передает байт-код виртуальной машине Java непосредственно в памяти. Nashorn умеет компилировать код JavaScript и генерировать классы Java, которые загружаются специальным загрузчиком. Так же возможен вызов кода Java прямо из JavaScript.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 21. Поясните: Какой класс появился в Java 8 для кодирования/декодирования данных?

`Base64` - потокобезопасный класс, который реализует кодировщик и декодировщик данных, используя схему кодирования base64 согласно _RFC 4648_ и _RFC 2045_.

Base64 содержит 6 основных методов:

`getEncoder()`/`getDecoder()` - возвращает кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getUrlEncoder()`/`getUrlDecoder()` - возвращает URL-safe кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getMimeEncoder()`/`getMimeDecoder()` - возвращает MIME кодировщик/декодировщик, соответствующий стандарту _RFC 2045_.

---
