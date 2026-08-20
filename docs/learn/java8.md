---
title: "Java 8+"
outline: [2, 3]
---

# Java 8+

Всего вопросов: **29**

<span class="priority-badge priority-medium">• Средний приоритет</span>

## 1. Зачем нужна аннотация @FunctionalInterface

<div class="answer-block">

Кратко: Для гарантии того, что интерфейс является функциональным. Она не даст создать еще один абстрактный метод

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 2. Зачем нужны операции Consumer, Function, Supplier?

<div class="answer-block">

Кратко: В Java 8 появились **функциональные интерфейсы** из пакета `java.util.function`, которые используются в **лямбда-выражениях** и **Stream API**. Среди них важны:

|Функциональный интерфейс|Входные данные|Возвращаемое значение|Применение|
|---|---|---|---|
|`Consumer<T>`|Принимает `T`|Ничего не возвращает (`void`)|Используется, когда нужно выполнить действие, но не вернуть результат.|
|`Function<T, R>`|Принимает `T`|Возвращает `R`|Преобразует один тип данных в другой.|
|`Supplier<T>`|Не принимает аргументов|Возвращает `T`|Используется для генерации значений.|

**`Consumer<T>` — потребитель**  

`Consumer<T>` используется, когда нужно выполнить операцию над объектом, но **ничего не возвращать**.

**Пример: печать списка элементов**

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

public class ConsumerExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

        Consumer<String> printName = name -> System.out.println("Hello, " + name);
        names.forEach(printName);
    }
}
```

**Вывод:**

```
Hello, Alice
Hello, Bob
Hello, Charlie
```

💡 **Где используется?**

- В `forEach()` коллекций
- Логирование (`Logger::info`)
- Работа с файлами (`Files.lines().forEach(...)`)

**`Function<T, R>` — преобразователь**

`Function<T, R>` принимает объект типа `T` и возвращает объект типа `R`.

**Пример: преобразование строки в ее длину**

```java
import java.util.function.Function;

public class FunctionExample {
    public static void main(String[] args) {
        Function<String, Integer> lengthFunction = str -> str.length();

        System.out.println(lengthFunction.apply("Java")); // 4
        System.out.println(lengthFunction.apply("Functional Interfaces")); // 21
    }
}
```

💡 **Где используется?**

- Преобразование данных в `Stream API`
- Маппинг объектов (`List<String>` → `List<Integer>`)
- Фильтрация и сортировка

**`Supplier<T>` — поставщик**  

`Supplier<T>` ничего не принимает, но **генерирует результат**.

**Пример: генерация случайного числа**

```java
import java.util.function.Supplier;
import java.util.Random;

public class SupplierExample {
    public static void main(String[] args) {
        Supplier<Integer> randomSupplier = () -> new Random().nextInt(100);

        System.out.println(randomSupplier.get()); // Например, 42
        System.out.println(randomSupplier.get()); // Например, 87
    }
}
```

💡 **Где используется?**

- Ленивая инициализация
- Генерация случайных данных
- Фабричные методы

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 3. Поясните: Что делает Интерфейс Function?

<div class="answer-block">

`java.util.function.Function`  - это встроенный функциональный интерфейс, добавленный в Java SE 8.

Принимает значение в качестве аргумента одного типа и возвращает другое значение. Часто применяется для преобразования одного значения в другое:

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 4. Каким образом вывести на экран 10 случайных чисел в порядке возрастания?

<div class="answer-block">

```java
Кратко: (new Random())
    .ints()
    .limit(10)
    .sorted()
    .forEach(System.out::println);
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 5. Каким образом вызывать `default` метод интерфейса в реализующем этот интерфейс классе?

<div class="answer-block">

Кратко: Используя ключевое слово `super` вместе с именем интерфейса:

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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 6. Каким образом вызывать `static` метод интерфейса?

<div class="answer-block">

Кратко: Используя имя интерфейса:

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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 7. Каким образом добавить 1 неделю, 1 месяц, 1 год, 10 лет к текущей дате с использованием Date Time API?

<div class="answer-block">

```java
Кратко: LocalDate.now().plusWeeks(1);
LocalDate.now().plusMonths(1);
LocalDate.now().plusYears(1);
LocalDate.now().plus(1, ChronoUnit.DECADES);
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 8. Каким образом найти максимальное число в наборе?

<div class="answer-block">

```java
Кратко: Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .max()
    .getAsInt(); //55
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 9. Каким образом найти минимальное число в наборе?

<div class="answer-block">

```java
Кратко: Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .min()
    .getAsInt(); //2
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 10. Каким образом определить повторяемую аннотацию?

<div class="answer-block">

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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 11. Каким образом получить вторую субботу текущего месяца используя Date Time API?

<div class="answer-block">

```java
Кратко: LocalDate
    .of(LocalDate.now().getYear(), LocalDate.now().getMonth(), 1)
    .with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY))
    .with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 12. Каким образом получить следующий вторник используя Date Time API?

<div class="answer-block">

```java
Кратко: LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.TUESDAY));
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 13. Каким образом получить среднее значение всех чисел?

<div class="answer-block">

```java
Кратко: Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .average()
    .getAsDouble(); //13.8
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 14. Каким образом получить сумму всех чисел в наборе?

<div class="answer-block">

```java
Кратко: Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt()
    .sum(); //69
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 15. Каким образом получить текущее время по местному времени с точностью до миллисекунд используя Date Time API?

<div class="answer-block">

```java
Кратко: LocalDateTime.ofInstant(new Date().toInstant(), ZoneId.systemDefault());
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 16. Каким образом получить текущее время с точностью до миллисекунд используя Date Time API?

<div class="answer-block">

```java
Кратко: new Date().toInstant();
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 17. Каким образом получить текущую дату с использованием Date Time API из Java 8?

<div class="answer-block">

```java
Кратко: LocalDate.now();
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 18. Каким образом создать Base64 кодировщик и декодировщик?

<div class="answer-block">

```java
Кратко: // Encode
String b64 = Base64.getEncoder().encodeToString("input".getBytes("utf-8")); //aW5wdXQ==
// Decode
new String(Base64.getDecoder().decode("aW5wdXQ=="), "utf-8"); //input
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 19. Какие именно дополнительные методы для работы с ассоциативными массивами (maps) появились в Java 8?

<div class="answer-block">

Кратко по сути:
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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 20. Какие именно нововведения, появились в Java 8 и JDK 8?

<div class="answer-block">

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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 21. Поясните: Какой класс появился в Java 8 для кодирования/декодирования данных?

<div class="answer-block">

Кратко: `Base64` - потокобезопасный класс, который реализует кодировщик и декодировщик данных, используя схему кодирования base64 согласно _RFC 4648_ и _RFC 2045_.

Base64 содержит 6 основных методов:

`getEncoder()`/`getDecoder()` - возвращает кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getUrlEncoder()`/`getUrlDecoder()` - возвращает URL-safe кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getMimeEncoder()`/`getMimeDecoder()` - возвращает MIME кодировщик/декодировщик, соответствующий стандарту _RFC 2045_.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 22. Поясните, что такое `default` методы интрефейса?

<div class="answer-block">

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

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 23. Поясните, что такое `jjs`?

<div class="answer-block">

`jjs` это утилита командной строки, которая даёт возможность исполнять программы на языке JavaScript прямо в консоли.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 24. Поясните, что такое `LocalDateTime`?

<div class="answer-block">

Кратко: `LocalDateTime` объединяет вместе `LocaleDate` и `LocalTime`, содержит дату и время в календарной системе ISO-8601 без привязки к часовому поясу. Время хранится с точностью до наносекунды. Содержит множество удобных методов, таких как plusMinutes, plusHours, isAfter, toSecondOfDay и т.д.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 25. Поясните, что такое `Nashorn`?

<div class="answer-block">

Кратко: __Nashorn__ - это движок JavaScript, разрабатываемый на Java компанией Oracle. Призван дать возможность встраивать код JavaScript в приложения Java. В сравнении с _Rhino_, который поддерживается Mozilla Foundation, Nashorn обеспечивает от 2 до 10 раз более высокую производительность, так как он компилирует код и передает байт-код виртуальной машине Java непосредственно в памяти. Nashorn умеет компилировать код JavaScript и генерировать классы Java, которые загружаются специальным загрузчиком. Так же возможен вызов кода Java прямо из JavaScript.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 26. Поясните, что такое `Optional`?

<div class="answer-block">

Кратко: Опциональное значение `Optional` — это контейнер для объекта, который может содержать или не содержать значение `null`. Такая обёртка является удобным средством предотвращения `NullPointerException`, т.к.
имеет некоторые функции высшего порядка, избавляющие от добавления повторяющихся `if null/notNull` проверок:

```java
Optional<String> optional = Optional.of("hello");

optional.isPresent(); // true
optional.ifPresent(s -> System.out.println(s.length())); // 5
optional.get(); // "hello"
optional.orElse("ops..."); // "hello"
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 27. Поясните, что такое `static` метод интерфейса?

<div class="answer-block">

Статические методы интерфейса похожи на методы по умолчанию, за исключением того, что для них отсутствует возможность переопределения в классах, реализующих интерфейс.

+ Статические методы в интерфейсе являются частью интерфейса без возможности переопределить их для объектов класса реализации;
+ Методы класса `java.lang.Object` нельзя переопределить как статические;
+ Статические методы в интерфейсе применяются для обеспечения вспомогательных методов, например, проверки на null, сортировки коллекций и т.д.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 28. Поясните, что такое `StringJoiner`?

<div class="answer-block">

Кратко: Класс `StringJoiner` используется, чтобы создать последовательность строк, разделенных разделителем с возможностью присоединить к полученной строке префикс и суффикс:

```java
StringJoiner joiner = new StringJoiner(".", "prefix-", "-suffix");
for (String s : "Hello the brave world".split(" ")) {
    joiner.add(s);
}
System.out.println(joiner); //prefix-Hello.the.brave.world-suffix
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 29. Поясните, что такое `ZonedDateTime`?

<div class="answer-block">

Кратко: `java.time.ZonedDateTime` — аналог `java.util.Calendar`, класс с самым полным объемом информации о временном контексте в календарной системе ISO-8601. Включает временную зону, поэтому все операции с временными сдвигами этот класс проводит с её учётом.

</div>

---

