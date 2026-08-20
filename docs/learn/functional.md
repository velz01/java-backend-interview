---
title: "Java 8+ / Functional / Stream API"
outline: [2, 3]
---

# Java 8+ / Functional / Stream API

Всего вопросов: **82**

<span class="priority-badge priority-high">🔥 Высокий приоритет</span>

## 1. Что такое функциональный интерфейс?

<div class="answer-block">

Функциональный интерфейс - это интерфейс с одним абстрактным методом. Может так же содержать любое количество статических и дефолтных методов

</div>

---

<span class="priority-badge priority-high">🔥 Высокий приоритет</span>

## 2. Что такое лямбда выражение? Чем его можно заменить?

<div class="answer-block">

Лямбда-выражение - это сокращённая запись анонимного класса, реализующего функциональный интерфейс.

**Чем его можно заменить?**
1. Анонимным классом
2. Обычным классом, реализующим интерфейс
3. Ссылкой на метод (method reference)

**Анонимный класс vs лямбда**
Это два способа реализации интерфейсов или создания компактного кода в Java. Они имеют сходства, но различаются по способу использования, синтаксису и некоторым ограничениям
**Анонимный класс** - это локальный класс без имени, который объявляется и создаётся одновременно
**Лямбда** - это краткий способ объявления реализации функционального интерфейса

|**Критерий**|**Анонимный класс**|**Лямбда-выражение**|
|---|---|---|
|**Синтаксис**|Более громоздкий|Краткий и лаконичный|
|**Совместимость**|Любой интерфейс или класс|Только функциональный интерфейс|
|**Использование `this`**|Ссылается на экземпляр анонимного класса|Ссылается на экземпляр внешнего класса|
|**Многометодные интерфейсы**|Можно переопределять несколько методов|Не поддерживается (только один метод)|
|**Поддержка переменных**|Может содержать свои переменные и методы|Не может содержать свои методы или поля|
|**Производительность**|Более ресурсоёмкий (создаёт новый класс)|Оптимизирован JVM (не создаёт новый объект класса)|

</div>

---

<span class="priority-badge priority-high">🔥 Высокий приоритет</span>

## 3. Что такое Stream API и для чего нужны Stream?

<div class="answer-block">

Stream представляет из себя некоторый набор или “поток” данных
Stream API - это способ лаконичной обработки потоков данных (фильтрации, сортировки, преобразования типов) в декларативном стиле, появились в Java 8.

**С какими типами данных может работать?**
- **Объектами** - `Stream<T>`, где `T` - любой ссылочный тип (например, `String`, `Integer`, пользовательские классы)
- **Примитивами** — существуют специализированные стримы:
    - **IntStream** для работы с `int`
    - **LongStream** для работы с `long`
    - **DoubleStream** для работы с `double`
    Для других примитивов стримы не предусмотрены, их нужно упаковывать в объекты-обёртки (например, `Byte` для `byte`)

**Проблема с примитивами в стримах?**
Работа с примитивами через `Stream<T>` приводит к **автоупаковке и распаковке**. Это приводит к следующим проблемам:
1. **Снижение производительности** - упаковка/распаковка добавляют накладные расходы.
2. **Увеличение памяти** - вместо примитивов создаются объекты (например, `Integer`, `Double`)
Специализированные стримы (**IntStream, LongStream, DoubleStream**) решают эти проблемы, обеспечивая работу непосредственно с примитивами без автоупаковки

</div>

---

<span class="priority-badge priority-high">🔥 Высокий приоритет</span>

## 4. Типы методов в Stream API

<div class="answer-block">

Промежуточные и терминальные
- Промежуточный метод - метод, который НЕ запускает выполнение и возвращает объект типа Stream
- Терминальный метод - метод, который запускает выполнение цепочки и возвращает объект отличного от Stream типа. Может быть только один и обязательно последним в цепочке. После его вызова работать с цепочкой более нельзя

**Можно ли переиспользовать Stream после терминального метода?**
Нет. После выполнения терминального метода стрим закрывается, и любая последующая попытка вызова методов вызовет `IllegalStateException`

**Использование Stream без терминального метода?**
Если стрим не завершается терминальным методом, никакие операции с ним не будут выполнены. Причина в концепции **“ленивых” (отложенных) вычислений** (lazy evaluation): промежуточные методы не выполняются до вызова терминального метода

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 5. Что такое ссылка на метод?

<div class="answer-block">

Ссылка на метод (method reference) - это сокращенная запись для лямбда-выражений, которая позволяет ссылаться на уже существующий метод и использовать его как функциональный интерфейс

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 6. Какие встроенные функциональные интерфейсы вы знаете?

<div class="answer-block">

- `Predicate<T>` - принимает объект типа T, проверяет соблюдение некоторого условия и возвращает результат типа Boolean
- `BiPredicate<T, U>` - принимает два объекта типов T и U, проверяет соблюдение некоторого условия и возвращает результат типа Boolean
- `Consumer<T>` - принимает объект, совершает некоторые действия, но при этом ничего не возвращает
- `BiConsumer<T, U>` - принимает два объекта типов T и U, совершает некоторые действия, ничего не возвращает
- `Supplier<T>` - не принимает никаких аргументов, но возвращает некоторый объект T
- `Function<T, R>` - принимает аргумент T, выполняет над ним некоторые операции и возвращает результат типа R. Зачастую используется для приведения аргумента T к типу R
- `BiFunction<T, U, R>` - принимает два аргумента типа T и U, выполняет над ними некоторые операции и возвращает результат типа R
- `UnaryOperator<T>` - принимает в качестве параметра объект T, выполняет над ним некоторые операции и возвращает результат операций в виде объекта того же типа
- `BinaryOperator<T>` - принимает два аргумента типа T, выполняет над ними некоторые операции и возвращает объект того же типа

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 7. Почему Stream называют ленивым?

<div class="answer-block">

Потому что обработка не начнётся до вызова терминального метода

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 8. Для чего нужна аннотация @FunctionalInterface

<div class="answer-block">

Для гарантии того, что интерфейс является функциональным. Она не даст создать еще один абстрактный метод

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 9. Чем отличаются методы map() и flatMap()?

<div class="answer-block">

- `map()` применяет функцию к каждому элементу потока и возвращает новый стрим с результатами
- `flatMap()` применяет функцию к вложенным структурам (когда элемент стрима коллекция или другой стрим) и объединяет все полученные стримы в один (уплощает)

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 10. Что такое терминальные методы? Какие терминальные методы в стримах вы знаете?

<div class="answer-block">

*Терминальные методы* завершают работу с потоком, после их вызова дальнейшие операции невозможны. Основные терминальные методы:

**Метод collect()**
Метод `collect(Collector<T, A, R> collector)` используется для преобразования стрима в коллекцию или другой тип данных. Чаще всего используется для сбора элементов в список, множество или строку
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> collectedList = numbers.stream()
    .collect(Collectors.toList());
System.out.println(collectedList); // [1, 2, 3, 4, 5]
```

**Метод forEach()**
Метод `forEach(Consumer<T> action)` выполняет действие над каждым элементом потока
```java
List<String> words = List.of("hi", "hi", "goodbye", "ok", "dog", "cat", "dog");
words.stream()
				.forEach(System.out::println);
```

**Метод reduce()**
Метод `reduce(BinaryOperator<T> accumulator)` сводит (агрегирует) элементы стрима к одному значению с помощью функции аккумулятора. Например, для вычисления суммы или произведения всех элементов
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
    .reduce(0, Integer::sum); // 0 — начальное значение
System.out.println(sum); // 15
```

**Метод count()**
Метод `count()` Возвращает количество элементов в потоке
```java
List<Integer> numbers = List.of(1, 2, 3, 4, 10, 1298, 27);
long counted = numbers.stream()
        .filter(n -> n % 2 == 0)
        .count(); // Посчитали четные числа
```

**Метод min()**
Метод `min(Comparator<T> comparator)` возвращает минимальный элемент потока по заданному компаратору (Optional)
```java
List<Integer> numbers = List.of(1, 2, 3, 4, 10, 1298, 27);
Optional<Integer> min = numbers.stream()
				.min(Integer::compareTo);
```

**Метод max()**
Метод `max(Comparator<T> comparator)` Возвращает максимальный элемент потока по заданному компаратору (Optional)

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 10, 1298, 27);
Optional<Integer> max = numbers.stream()
        .max(Integer::compareTo);
```

**Метод findFirst()**
Метод `findFirst()` возвращает первый элемент потока (Optional)
```java
List<Integer> numbers = List.of(1,2,3,4,5,6,10,120,130);
Optional<Integer> first = numbers.stream()
        .filter(n -> n > 10)
        .findFirst();
```

**Метод findAny()**
Метод `findAny()` возвращает любой элемент потока (Optional), полезно в параллельных потоках
```java
List<String> names = List.of("hello java", "goodBye");
Optional<String> name = names.stream()
        .filter(s -> s.contains("java"))
        .findAny();
```

**Метод anyMatch()**
Метод `anyMatch(Predicate<T> predicate)` возвращает true, если хотя бы один элемент соответствует условию
```java
List<Integer> nums = List.of(1,2,3,4,5,6);
boolean is = nums.stream()
        .anyMatch(n -> n % 2 == 0); //Вернет true
```

**Метод allMatch()**
Метод `allMatch(Predicate<T> predicate)` возвращает true, если все элементы соответствуют условию
```java
List<Integer> nums = List.of(-1,2,3,4,5,6);
boolean is = nums.stream()
        .allMatch(n -> n > 0); //Вернет false
```

**Метод noneMatch()**
Метод `noneMatch(Predicate<T> predicate)` возвращает true, если ни один элемент не соответствует условию
```java
List<Integer> nums = List.of(1,3,3,5,5,7);
boolean is = nums.stream()
        .noneMatch(n -> n % 2 == 0); //Вернет true 
```

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 11. Что такое промежуточные методы? Какие промежуточные методы в стримах вы знаете?

<div class="answer-block">

*Промежуточный метод* - метод, который возвращает Stream. Существуют:

**Метод peek()**
Метод `peek(Consumer<T> action)` используется для промежуточной обработки элементов стрима. Он позволяет выполнить действие над каждым элементом стрима без изменения самих элементов. Основное применение — это отладка или логирование данных перед выполнением конечной операции.
_Важно:_ метод `peek()` не изменяет поток и чаще всего используется для побочных эффектов (например, вывода информации о каждом элементе).
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> result = numbers.stream()
    .peek(n -> System.out.println("Processing: " + n))
    ...
    .collect(Collectors.toList());
```

**Метод map()**
Метод `map(Function<T, R> mapper)` применяется для преобразования каждого элемента стрима с помощью функции. Он берет входной элемент и возвращает новый элемент, который соответствует результату примененной функции
```java
List<Integer> numbers = Arrays.asList(1, 2, 3);
List<Integer> squares = numbers.stream()
    .map(n -> n * n)
    .collect(Collectors.toList());
System.out.println(squares); // [1, 4, 9]
```

**Метод flatMap()**
Метод `flatMap(Function<T, Stream<R>> mapper)` используется для преобразования каждого элемента стрима в другой стрим, а затем “выравнивания” полученных стримов в один плоский стрим. Это особенно полезно для работы с коллекциями внутри коллекций
```java
List<List<Integer>> numbers = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4),
    Arrays.asList(5)
);
List<Integer> flatNumbers = numbers.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
System.out.println(flatNumbers); // [1, 2, 3, 4, 5]
```

**Метод filter()**
Метод `filter(Predicate<T> predicate)` используется для фильтрации элементов стрима на основе условия (предиката). Он пропускает элементы, которые не удовлетворяют условию
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
System.out.println(evenNumbers); // [2, 4]
```

**Метод limit()**
Метод `limit(long maxSize)` возвращает стрим, состоящий не более чем из указанного количества элементов. Это полезно для ограничения размера стрима
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> limited = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());
System.out.println(limited); // [1, 2, 3]
```

**Метод skip()**
Метод `skip(long n)` пропускает указанное количество элементов и возвращает стрим из оставшихся элементов
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> skipped = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());
System.out.println(skipped); // [3, 4, 5]
```

**Метод concat()**
Метод `concat(Stream<T> a, Stream<T> b)` объединяет два потока в один
```java
List<String> listOne = List.of("Apple", "Banana", "Cherry");
List<String> listTwo = List.of("Orange", "Peach", "Plum");
Stream<String> combinedStream = Stream.concat(listOne.stream(), listTwo.stream());
        combinedStream.forEach(System.out::println);
```

**Метод sorted()**
Метод `sorted()` | `sorted(Comparator<T> comparator)` сортирует элементы стрима. По умолчанию элементы сортируются в естественном порядке, но можно задать компаратор для пользовательской сортировки
```java
List<String> names = Arrays.asList("John", "Anna", "Tom");
List<String> sortedNames = names.stream()
    .sorted()
    .collect(Collectors.toList());
System.out.println(sortedNames); // [Anna, John, Tom]
```

**Метод distinct()**
Метод `distinct()` возвращает стрим, который содержит только уникальные элементы (без дубликатов)
```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3);
List<Integer> uniqueNumbers = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
System.out.println(uniqueNumbers); // [1, 2, 3]
```

Если стрим отсортирован и имеет соответствующую характеристику (её добавляет `sorted()`, например, сам стрим о сортированности данных узнать не может) то при вызове `distinct()` используется более эффективный алгоритм: он уже не будет собирать HashSet и смотреть наличие повторяющихся объектов, а просто сравнивает каждый следующий с предыдущим. Т.е. `sorted().distinct()` теоретически может ускорить выполнение метода, если входные данные уже отсортированы. _Прим._: `sorted()` для сортированных данных работает очень быстро, это дешёвая операция

</div>

---

<span class="priority-badge priority-medium">⭐ Средний приоритет</span>

## 12. Что такое параллельные стримы?

<div class="answer-block">

Параллельные стримы позволяют разделить обработку данных на несколько потоков, используя `ForkJoinPool`. Это ускоряет обработку больших объемов данных. Потоки забираются из пула `ForkJoinPool.commonPool`

**Когда использовать параллельные стримы?**
- данных очень много (миллионы записей)
- операции CPU-интенсивные (например, сложные вычисления)
- нет зависимостей между элементами (например, суммирование чисел)

**Когда НЕ использовать?**  
- коллекция маленькая (параллельность создаст накладные расходы).  
- порядок важен (параллельные стримы могут изменить порядок).  
- есть побочные эффекты (`forEach()` в `parallelStream` может работать непредсказуемо).

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 13. Разница между findAny() и findFirst()

<div class="answer-block">

| Критерий               | `findAny()`                                         | `findFirst()`                                                  |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| **Что возвращает**     | Любой элемент потока (если есть)                    | Первый элемент потока (если есть)                              |
| **Порядок**            | Не гарантирует порядок                              | Гарантирует, что вернёт именно первый элемент в порядке стрима |
| **Параллельный стрим** | Может работать быстрее (не нужно соблюдать порядок) | Может работать медленнее (должен сохранять порядок)            |
| **Когда использовать** | Если неважно, какой элемент получить                | Если нужно получить именно первый элемент в порядке            |
| **Пример**             | `stream.parallel().findAny()`                       | `stream.parallel().findFirst()`                                |

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 14. Для чего нужны операции Consumer, Function, Supplier?

<div class="answer-block">

В Java 8 появились **функциональные интерфейсы** из пакета `java.util.function`, которые используются в **лямбда-выражениях** и **Stream API**. Среди них важны:

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

## 15. Методы в Stream API

<div class="answer-block">

См. промежуточные и терминальные методы

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 16. В чём разница между parallel и parallelStream?

<div class="answer-block">

Оба метода дают один и тот же результат, но разница в способе вызова:
- `list.stream().parallel()` полезно, если сначала требуется настроить стрим (например, добавить фильтрацию), а затем переключить его в параллельный режим
- `list.parallelStream()` используется, если сразу нужен параллельный стрим

| Метод                 | Описание                                          |
| --------------------- | ------------------------------------------------- |
| `stream().parallel()` | Преобразует уже существующий стрим в параллельный |
| `parallelStream()`    | Cразу создаёт параллельный стрим из коллекции     |

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 17. Какие существуют способы создания Stream?

<div class="answer-block">

- Из коллекции (интерфейс Collection) - `collection.stream()`
- Пустой стрим - `Stream.empty()`
- Из массива - `Arrays.stream(array)`
- Из указанных элементов напрямую - `Stream.of(1, 2, 3)`
- Из строки - `“some_string”.chars()`
- Конкатенацией двух стримов

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 18. Расскажите про класс Collectors и его методы

<div class="answer-block">

Класс Collectors предоставляет ряд статических методов для создания коллекций, таких как списки, множества, мапы и другие, из элементов потока (Stream). Эти методы широко используются для агрегации данных в потоках. Основные методы:
- `toList()` - собирает элементы потока в список
- `toSet()` - собирает элементы потока в множество (Set)
- `toMap()` - собирает элементы потока в карту (Map), используя ключи и значения, которые задаются функциями
- `joining()` - объединяет элементы потока в одну строку, используя заданный разделитель и префикс/суффикс
- `counting()` - считает количество элементов в потоке
- `summarizingInt()` - собирает статистику по числовым значениям (например, сумма, среднее, максимальное и минимальное значение)
- `averagingInt()` - вычисляет среднее значение по числовым элементам
- `partitioningBy()` - разделяет элементы потока на две группы по заданному предикату
- `groupingBy()` - группирует элементы потока по заданному классификатору
- `reducing()` - выполняет редукцию элементов потока с использованием заданного бинарного оператора
- `toCollection(Supplier<C>)` - преобразует поток в коллекцию

**Для группировки элементов в Map какой Collector будешь использовать?**
- `toMap()` — собирает элементы потока в карту (Map), используя ключи и значения, которые задаются функциями, например
```java
List<String> strings = Arrays.asList("cat", "dog", "fish", "ant", "elephant");
Map<String, Integer> mappedByLength = strings.stream()
				.collect(Collectors.toMap(s -> s, String::length));
				
// mappedByLength = {ant=3, cat=3, fish=4, dog=3, elephant=8}
```

- `groupingBy()` — группирует элементы потока по заданному классификатору, например
  ```java
  List<String> strings = Arrays.asList("cat", "dog", "fish", "ant", "elephant");
  Map<Integer, List<String>> groupedByLength = strings.stream()
        .collect(Collectors.groupingBy(String::length));
       
// groupedByLength = {3=[cat, dog, ant], 4=[fish], 8=[elephant]}
  ```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 19. Что делает Интерфейс Function?

<div class="answer-block">

`java.util.function.Function`  - это встроенный функциональный интерфейс, добавленный в Java SE 8.

Принимает значение в качестве аргумента одного типа и возвращает другое значение. Часто используется для преобразования одного значения в другое:

```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
}
```

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 20. Что такое IntStream и DoubleStream?

<div class="answer-block">

IntStream, LongStream и DoubleStream — это специальные стримы в Java для работы с примитивами int, long и double. Поддерживают дополнительные терминальные методы:
- `sum()`
- `average()`
- `mapToObj()`

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 21. В чем разница между `Collection` и `Stream`?

<div class="answer-block">

Коллекции позволяют работать с элементами по-отдельности, тогда как стримы так делать не позволяют, но вместо этого предоставляют возможность выполнять функции над данными как над одним целым.

Также стоит отметить важность самой концепции сущностей: `Collection` - это прежде всего воплощение _Структуры Данных_. Например, `Set` не просто хранит в себе элементы, он реализует идею множества с уникальными элементами,
тогда как `Stream`, это прежде всего абстракция необходимая для реализации _конвейера вычислений_, собственно, поэтому, результатом работы конвейера являются те или иные _Структуры Данных_ или же результаты проверок/поиска и т.п. 

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 22. Для чего в стримах предназначен метод `limit()`?

<div class="answer-block">

Метод `limit()` является промежуточной операцией, которая позволяет ограничить выборку определенным количеством первых элементов.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 23. Для чего в стримах предназначен метод `sorted()`?

<div class="answer-block">

Метод `sorted()` является промежуточной операцией, которая позволяет сортировать значения либо в натуральном порядке, либо задавая `Comparator`.

Порядок элементов в исходной коллекции остается нетронутым - `sorted()` всего лишь создает его отсортированное представление.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 24. Для чего в стримах предназначены методы `flatMap()`, `flatMapToInt()`, `flatMapToDouble()`, `flatMapToLong()`?

<div class="answer-block">

Метод `flatMap()` похож на map, но может создавать из одного элемента несколько. Таким образом, каждый объект будет преобразован в ноль, один или несколько других объектов, поддерживаемых потоком.  Наиболее очевидный способ применения этой операции — преобразование элементов контейнера при помощи функций, которые возвращают контейнеры.

```java
Stream
    .of("H e l l o", "w o r l d !")
    .flatMap((p) -> Arrays.stream(p.split(" ")))
    .toArray(String[]::new);//["H", "e", "l", "l", "o", "w", "o", "r", "l", "d", "!"]
```

`flatMapToInt()`, `flatMapToDouble()`, `flatMapToLong()` - это аналоги `flatMap()`, возвращающие соответствующий числовой стрим.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 25. Для чего в стримах предназначены методы `map()` и `mapToInt()`, `mapToDouble()`, `mapToLong()`?

<div class="answer-block">

Метод `map()` является промежуточной операцией, которая заданным образом преобразует каждый элемент стрима.

`mapToInt()`, `mapToDouble()`, `mapToLong()` - аналоги `map()`, возвращающие соответствующий числовой стрим (то есть стрим из числовых примитивов):

```java
Stream
    .of("12", "22", "4", "444", "123")
    .mapToInt(Integer::parseInt)
    .toArray(); //[12, 22, 4, 444, 123]
```
[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 26. Для чего в стримах применяются методы `forEach()` и `forEachOrdered()`?

<div class="answer-block">

+ `forEach()` применяет функцию к каждому объекту стрима, порядок при параллельном выполнении не гарантируется;
+ `forEachOrdered()` применяет функцию к каждому объекту стрима с сохранением порядка элементов.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 27. Для чего нужен метод `collect()` в стримах?

<div class="answer-block">

Метод `collect()` является конечной операцией, которая используется для представления результата в виде коллекции или какой-либо другой структуры данных.

`collect()` принимает на вход `Collector<Тип_источника, Тип_аккумулятора, Тип_результата>`, который содержит четыре этапа: _supplier_ - инициализация аккумулятора, _accumulator_ - обработка каждого элемента, _combiner_ - соединение двух аккумуляторов при параллельном выполнении, _[finisher]_ - необязательный метод последней обработки аккумулятора. В Java 8 в классе `Collectors` реализовано несколько распространённых коллекторов:

+ `toList()`, `toCollection()`, `toSet()` - представляют стрим в виде списка, коллекции или множества;
+ `toConcurrentMap()`, `toMap()` - позволяют преобразовать стрим в `Map`;
+ `averagingInt()`, `averagingDouble()`, `averagingLong()` - возвращают среднее значение;
+ `summingInt()`, `summingDouble()`, `summingLong()` - возвращает сумму;
+ `summarizingInt()`, `summarizingDouble()`, `summarizingLong()` - возвращают `SummaryStatistics` с разными агрегатными значениями;
+ `partitioningBy()` - разделяет коллекцию на две части по соответствию условию и возвращает их как `Map<Boolean, List>`;
+ `groupingBy()` - разделяет коллекцию на несколько частей и возвращает `Map<N, List<T>>`;
+ `mapping()` - дополнительные преобразования значений для сложных `Collector`-ов.

Так же существует возможность создания собственного коллектора через `Collector.of()`:

```java
Collector<String, List<String>, List<String>> toList = Collector.of(
    ArrayList::new,
    List::add,
    (l1, l2) -> { l1.addAll(l2); return l1; }
);
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 28. Для чего нужен функциональный интерфейс `BiConsumer<T,U>`?

<div class="answer-block">

__`BiConsumer<T,U>`__ представляет собой операцию, которая принимает два аргумента классов `T` и `U` производит с ними некоторое действие и ничего не возвращает.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 29. Для чего нужен функциональный интерфейс `BiFunction<T,U,R>`?

<div class="answer-block">

__`BiFunction<T,U,R>`__ представляет собой операцию, которая принимает два аргумента классов `T` и `U` и возвращающая результат класса `R`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 30. Для чего нужен функциональный интерфейс `BiPredicate<T,U>`?

<div class="answer-block">

__`BiPredicate<T,U>`__ представляет собой операцию, которая принимает два аргумента классов `T` и `U` и возвращающая результат типа `boolean`. 

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 31. Для чего нужны функциональные интерфейсы `BinaryOperator<T>`, `DoubleBinaryOperator`, `IntBinaryOperator` и `LongBinaryOperator`?

<div class="answer-block">

__`BinaryOperator<T>` (бинарный оператор)__ - интерфейс, с помощью которого реализуется функция, получающая на вход два экземпляра класса `T` и возвращающая на выходе экземпляр класса `T`.
```java
BinaryOperator<Integer> operator = (a, b) -> a + b;
System.out.println(operator.apply(1, 2)); // 3
```

+ `DoubleBinaryOperator` - бинарный оператор, получающий на вход `Double`;
+ `IntBinaryOperator` - бинарный оператор, получающий на вход `Integer`;
+ `LongBinaryOperator` - бинарный оператор, получающий на вход `Long`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 32. Для чего нужны функциональные интерфейсы `Consumer<T>`, `DoubleConsumer`, `IntConsumer` и `LongConsumer`?

<div class="answer-block">

__`Consumer<T>` (потребитель)__ - интерфейс, с помощью которого реализуется функция, которая получает на вход экземпляр класса `T`, производит с ним некоторое действие и ничего не возвращает.

```java
Consumer<String> hello = (name) -> System.out.println("Hello, " + name);
hello.accept("world");
```

+ `DoubleConsumer` - потребитель, получающий на вход `Double`;
+ `IntConsumer` - потребитель, получающий на вход `Integer`;
+ `LongConsumer` - потребитель, получающий на вход `Long`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 33. Для чего нужны функциональные интерфейсы `Function<T,R>`, `DoubleFunction<R>`, `IntFunction<R>` и `LongFunction<R>`?

<div class="answer-block">

__`Function<T, R>`__ - интерфейс, с помощью которого реализуется функция, получающая на вход экземпляр класса `T` и возвращающая на выходе экземпляр класса `R`.

Методы по умолчанию могут использоваться для построения цепочек вызовов (`compose`, `andThen`).

```java
Function<String, Integer> toInteger = Integer::valueOf;
Function<String, String> backToString = toInteger.andThen(String::valueOf);
backToString.apply("123");     // "123"
```

+ `DoubleFunction<R>` - функция, получающая на вход `Double` и возвращающая на выходе экземпляр класса `R`;
+ `IntFunction<R>` - функция, получающая на вход `Integer` и возвращающая на выходе экземпляр класса `R`;
+ `LongFunction<R>` - функция, получающая на вход `Long` и возвращающая на выходе экземпляр класса `R`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 34. Для чего нужны функциональные интерфейсы `ObjDoubleConsumer<T>`, `ObjIntConsumer<T>` и `ObjLongConsumer<T>`?

<div class="answer-block">

+ `ObjDoubleConsumer<T>` - операция, которая принимает два аргумента классов `T` и `Double`, производит с ними некоторое действие и ничего не возвращает;
+ `ObjLongConsumer<T>` - операция, которая принимает два аргумента классов `T` и `Long`, производит с ними некоторое действие и ничего не возвращает;
+ `ObjIntConsumer<T>` - операция, которая принимает два аргумента классов `T` и `Integer`, производит с ними некоторое действие и ничего не возвращает.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 35. Для чего нужны функциональные интерфейсы `Predicate<T>`, `DoublePredicate`, `IntPredicate` и `LongPredicate`?

<div class="answer-block">

__`Predicate<T>` (предикат)__ - интерфейс, с помощью которого реализуется функция, получающая на вход экземпляр класса `T` и возвращающая на выходе значение типа `boolean`. 

Интерфейс содержит различные методы по умолчанию, позволяющие строить сложные условия (`and`, `or`, `negate`).

```java
Predicate<String> predicate = (s) -> s.length() > 0;
predicate.test("foo"); // true
predicate.negate().test("foo"); // false
```

+ `DoublePredicate` - предикат, получающий на вход `Double`;
+ `IntPredicate` - предикат, получающий на вход `Integer`;
+ `LongPredicate` - предикат, получающий на вход `Long`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 36. Для чего нужны функциональные интерфейсы `Supplier<T>`, `BooleanSupplier`, `DoubleSupplier`, `IntSupplier` и `LongSupplier`?

<div class="answer-block">

__`Supplier<T>` (поставщик)__ - интерфейс, с помощью которого реализуется функция, ничего не принимающая на вход, но возвращающая на выход результат класса `T`;

```java
Supplier<LocalDateTime> now = LocalDateTime::now;
now.get();
```

+ `DoubleSupplier` - поставщик, возвращающий `Double`;
+ `IntSupplier` - поставщик, возвращающий `Integer`;
+ `LongSupplier` - поставщик, возвращающий `Long`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 37. Для чего нужны функциональные интерфейсы `ToDoubleBiFunction<T,U>`, `ToIntBiFunction<T,U>` и `ToLongBiFunction<T,U>`?

<div class="answer-block">

+ `ToDoubleBiFunction<T,U>` - операция принимающая два аргумента классов `T` и `U` и возвращающая результат типа `Double`;
+ `ToLongBiFunction<T,U>` - операция принимающая два аргумента классов `T` и `U` и возвращающая результат типа `Long`;
+ `ToIntBiFunction<T,U>`  - операция принимающая два аргумента классов `T` и `U` и возвращающая результат типа `Integer`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 38. Для чего нужны функциональные интерфейсы `ToDoubleFunction<T>`, `ToIntFunction<T>` и `ToLongFunction<T>`?

<div class="answer-block">

+ `ToDoubleFunction<T>` - операция, принимающая аргумент класса `T` и возвращающая результат типа `Double`;
+ `ToLongFunction<T>` - операция, принимающая аргумент класса `T` и возвращающая результат типа `Long`;
+ `ToIntFunction<T>` - операция, принимающая аргумент класса `T` и возвращающая результат типа `Integer`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 39. Для чего нужны функциональные интерфейсы `UnaryOperator<T>`, `DoubleUnaryOperator`, `IntUnaryOperator` и `LongUnaryOperator`?

<div class="answer-block">

__`UnaryOperator<T>` (унарный оператор)__ принимает в качестве параметра объект типа `T`, выполняет над ними операции и возвращает результат операций в виде объекта типа `T`:

```java
UnaryOperator<Integer> operator = x -> x * x;
System.out.println(operator.apply(5)); // 25
```

+ `DoubleUnaryOperator` - унарный оператор, получающий на вход `Double`;
+ `IntUnaryOperator` - унарный оператор, получающий на вход `Integer`;
+ `LongUnaryOperator` - унарный оператор, получающий на вход `Long`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 40. Для чего нужны функциональные интерфейсы вида `_To_Function`?

<div class="answer-block">

+ `DoubleToIntFunction` - операция, принимающая аргумент класса `Double` и возвращающая результат типа `Integer`;
+ `DoubleToLongFunction` - операция, принимающая аргумент класса `Double` и возвращающая результат типа `Long`;
+ `IntToDoubleFunction` - операция, принимающая аргумент класса `Integer` и возвращающая результат типа `Double`; 
+ `IntToLongFunction` - операция, принимающая аргумент класса `Integer` и возвращающая результат типа `Long`;
+ `LongToDoubleFunction` - операция, принимающая аргумент класса `Long` и возвращающая результат типа `Double`;
+ `LongToIntFunction` - операция, принимающая аргумент класса `Long` и возвращающая результат типа `Integer`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 41. К каким переменным есть доступ у лямбда-выражений?

<div class="answer-block">

Доступ к переменным внешней области действия из лямбда-выражения очень схож к доступу из анонимных объектов. Можно ссылаться на:

+ неизменяемые (_effectively final_ - не обязательно помеченные как `final`) локальные переменные;
+ поля класса;
+ статические переменные.

К методам по умолчанию реализуемого функционального интерфейса обращаться внутри лямбда-выражения запрещено.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 42. Как вывести на экран 10 случайных чисел в порядке возрастания?

<div class="answer-block">

```java
(new Random())
    .ints()
    .limit(10)
    .sorted()
    .forEach(System.out::println);
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 43. Как вывести на экран 10 случайных чисел, используя `forEach()`?

<div class="answer-block">

```java
(new Random())
    .ints()
    .limit(10)
    .forEach(System.out::println);
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 44. Как вывести на экран количество пустых строк с помощью метода `filter()`?

<div class="answer-block">

```java
System.out.println(
    Stream
        .of("Hello", "", ", ", "world", "!")
        .filter(String::isEmpty)
        .count());
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 45. Как вызывать `default` метод интерфейса в реализующем этот интерфейс классе?

<div class="answer-block">

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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 46. Как вызывать `static` метод интерфейса?

<div class="answer-block">

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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 47. Как добавить 1 неделю, 1 месяц, 1 год, 10 лет к текущей дате с использованием Date Time API?

<div class="answer-block">

```java
LocalDate.now().plusWeeks(1);
LocalDate.now().plusMonths(1);
LocalDate.now().plusYears(1);
LocalDate.now().plus(1, ChronoUnit.DECADES);
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 48. Как можно вывести на экран уникальные квадраты чисел используя метод `map()`?

<div class="answer-block">

```java
Stream
    .of(1, 2, 3, 2, 1)
    .map(s -> s * s)
    .distinct()
    .forEach(System.out::println);
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 49. Как найти максимальное число в наборе?

<div class="answer-block">

```java
Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .max()
    .getAsInt(); //55
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 50. Как найти минимальное число в наборе?

<div class="answer-block">

```java
Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .min()
    .getAsInt(); //2
```
[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 51. Как определить повторяемую аннотацию?

<div class="answer-block">

Чтобы определить повторяемую аннотацию, необходимо создать аннотацию-контейнер для списка повторяемых аннотаций и обозначить повторяемую мета-аннотацией `@Repeatable`:

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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 52. Как отсортировать список строк с помощью лямбда-выражения?

<div class="answer-block">

```java
public static List<String> sort(List<String> list){
    Collections.sort(list, (a, b) -> a.compareTo(b));
    return list;
}
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 53. Как получить вторую субботу текущего месяца используя Date Time API?

<div class="answer-block">

```java
LocalDate
    .of(LocalDate.now().getYear(), LocalDate.now().getMonth(), 1)
    .with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY))
    .with(TemporalAdjusters.next(DayOfWeek.SATURDAY));
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 54. Как получить следующий вторник используя Date Time API?

<div class="answer-block">

```java
LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.TUESDAY));
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 55. Как получить среднее значение всех чисел?

<div class="answer-block">

```java
Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt(a -> a)
    .average()
    .getAsDouble(); //13.8
```
[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 56. Как получить сумму всех чисел в наборе?

<div class="answer-block">

```java
Stream
    .of(5, 3, 4, 55, 2)
    .mapToInt()
    .sum(); //69
```
[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 57. Как получить текущее время по местному времени с точностью до миллисекунд используя Date Time API?

<div class="answer-block">

```java
LocalDateTime.ofInstant(new Date().toInstant(), ZoneId.systemDefault());
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 58. Как получить текущее время с точностью до миллисекунд используя Date Time API?

<div class="answer-block">

```java
new Date().toInstant();
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 59. Как получить текущую дату с использованием Date Time API из Java 8?

<div class="answer-block">

```java
LocalDate.now();
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 60. Как создать Base64 кодировщик и декодировщик?

<div class="answer-block">

```java
// Encode
String b64 = Base64.getEncoder().encodeToString("input".getBytes("utf-8")); //aW5wdXQ==
// Decode
new String(Base64.getDecoder().decode("aW5wdXQ=="), "utf-8"); //input
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 61. Какие виды ссылок на методы вы знаете?

<div class="answer-block">

+ на статический метод;
+ на метод экземпляра;
+ на конструктор.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 62. Какие дополнительные методы для работы с ассоциативными массивами (maps) появились в Java 8?

<div class="answer-block">

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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 63. Какие конечные методы работы со стримами вы знаете?

<div class="answer-block">

+ `findFirst()` возвращает первый элемент;
+ `findAny()` возвращает любой подходящий элемент;
+ `collect()` представление результатов в виде коллекций и других структур данных;
+ `count()` возвращает количество элементов;
+ `anyMatch()` возвращает `true`, если условие выполняется хотя бы для одного элемента;
+ `noneMatch()` возвращает `true`, если условие не выполняется ни для одного элемента;
+ `allMatch()` возвращает `true`, если условие выполняется для всех элементов;
+ `min()` возвращает минимальный элемент, используя в качестве условия `Comparator`;
+ `max()` возвращает максимальный элемент, используя в качестве условия `Comparator`;
+ `forEach()` применяет функцию к каждому объекту (порядок при параллельном выполнении не гарантируется);
+ `forEachOrdered()` применяет функцию к каждому объекту с сохранением порядка элементов;
+ `toArray()` возвращает массив значений;
+ `reduce()`позволяет выполнять агрегатные функции и возвращать один результат.

Для числовых стримов дополнительно доступны:

+ `sum()` возвращает сумму всех чисел;
+ `average()` возвращает среднее арифметическое всех чисел.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 64. Какие нововведения, появились в Java 8 и JDK 8?

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
+ Новая реализация `AccessController.doPrivileged`, позволяющая устанавливать подмножество привилегий без необходимости проверки всех остальных уровней доступа;
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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 65. Какие промежуточные методы работы со стримами вы знаете?

<div class="answer-block">

+ `filter()` отфильтровывает записи, возвращая только записи, соответствующие условию;
+ `skip()` позволяет пропустить определённое количество элементов в начале;
+ `distinct()` возвращает стрим без дубликатов (для метода `equals()`);
+ `map()` преобразует каждый элемент;
+ `peek()` возвращает тот же стрим, применяя к каждому элементу функцию;
+ `limit()` позволяет ограничить выборку определенным количеством первых элементов;
+ `sorted()` позволяет сортировать значения либо в натуральном порядке, либо задавая `Comparator`;
+ `mapToInt()`, `mapToDouble()`, `mapToLong()` - аналоги `map()` возвращающие стрим числовых примитивов;
+ `flatMap()`, `flatMapToInt()`, `flatMapToDouble()`, `flatMapToLong()` - похожи на `map()`, но могут создавать из одного элемента несколько.

Для числовых стримов дополнительно доступен метод `mapToObj()`, который преобразует числовой стрим обратно в объектный.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 66. Какие существуют способы создания стрима?

<div class="answer-block">

1. Из коллекции:
```java 
Stream<String> fromCollection = Arrays.asList("x", "y", "z").stream();
```
2. Из набора значений:
```java 
Stream<String> fromValues = Stream.of("x", "y", "z");
```
3. Из массива:
```java 
Stream<String> fromArray = Arrays.stream(new String[]{"x", "y", "z"});
```
4. Из файла (каждая строка в файле будет отдельным элементом в стриме):
```java 
Stream<String> fromFile = Files.lines(Paths.get("input.txt"));
```
5. Из строки:
```java 
IntStream fromString = "0123456789".chars();
```
6. С помощью `Stream.builder()`:
```java 
Stream<String> fromBuilder = Stream.builder().add("z").add("y").add("z").build();
```
7. С помощью `Stream.iterate()` (бесконечный):
```java 
Stream<Integer> fromIterate = Stream.iterate(1, n -> n + 1);
```
8. С помощью `Stream.generate()` (бесконечный):
```java 
Stream<String> fromGenerate = Stream.generate(() -> "0");
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 67. Какова цель метода `filter()` в стримах?

<div class="answer-block">

Метод `filter()` является промежуточной операцией принимающей предикат, который фильтрует все элементы, возвращая только те, что соответствуют условию.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 68. Какой класс появился в Java 8 для кодирования/декодирования данных?

<div class="answer-block">

`Base64` - потокобезопасный класс, который реализует кодировщик и декодировщик данных, используя схему кодирования base64 согласно _RFC 4648_ и _RFC 2045_.

Base64 содержит 6 основных методов:

`getEncoder()`/`getDecoder()` - возвращает кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getUrlEncoder()`/`getUrlDecoder()` - возвращает URL-safe кодировщик/декодировщик base64, соответствующий стандарту _RFC 4648_;
`getMimeEncoder()`/`getMimeDecoder()` - возвращает MIME кодировщик/декодировщик, соответствующий стандарту _RFC 2045_.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 69. Объясните выражение `System.out::println`.

<div class="answer-block">

Данное выражение иллюстрирует механизм _instance method reference_: передачи ссылки на метод `println()` статического поля `out` класса `System`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 70. Расскажите о параллельной обработке в Java 8.

<div class="answer-block">

Стримы могут быть последовательными и параллельными. Операции над последовательными стримами выполняются в одном потоке процессора, над параллельными — используя несколько потоков процессора. Параллельные стримы используют общий `ForkJoinPool` доступный через статический `ForkJoinPool.commonPool()` метод. При этом, если окружение не является многоядерным, то поток будет выполняться как последовательный. Фактически применение параллельных стримов сводится к тому, что данные в стримах будут разделены на части, каждая часть обрабатывается на отдельном ядре процессора, и в конце эти части соединяются, и над ними выполняются конечные операции.

Для создания параллельного потока из коллекции можно также использовать метод `parallelStream()` интерфейса `Collection`. 

Чтобы сделать обычный последовательный стрим параллельным, надо вызвать у объекта `Stream` метод `parallel()`. Метод `isParallel()` позволяет узнать является ли стрим параллельным. 

С помощью, методов `parallel()` и `sequential()` можно определять какие операции могут быть параллельными, а какие только последовательными. Так же из любого последовательного стрима можно сделать параллельный и наоборот: 

```java
collection
.stream()
.peek(...) // операция последовательна
.parallel()
.map(...) // операция может выполняться параллельно,
.sequential()
.reduce(...) // операция снова последовательна 
```

Как правило, элементы передаются в стрим в том же порядке, в котором они определены в источнике данных. При работе с параллельными стримами система сохраняет порядок следования элементов. Исключение составляет метод `forEach()`, который может выводить элементы в произвольном порядке. И чтобы сохранить порядок следования, необходимо применять метод `forEachOrdered()`.

Критерии, которые могут повлиять на производительность в параллельных стримах:

+ Размер данных - чем больше данных, тем сложнее сначала разделять данные, а потом их соединять.
+ Количество ядер процессора. Теоретически, чем больше ядер в компьютере, тем быстрее программа будет работать. Если на машине одно ядро, нет смысла применять параллельные потоки.
+ Чем проще структура данных, с которой работает поток, тем быстрее будут происходить операции. Например, данные из `ArrayList` легко использовать, так как структура данной коллекции предполагает последовательность несвязанных данных. А вот коллекция типа `LinkedList` - не лучший вариант, так как в последовательном списке все элементы связаны с предыдущими/последующими. И такие данные трудно распараллелить.
+ Над данными примитивных типов операции будут производиться быстрее, чем над объектами классов.
+ Крайне не рекомендуется использовать параллельные стримы для скольких-нибудь долгих операций (например, сетевых соединений), так как все параллельные стримы работают c одним ForkJoinPool, то такие долгие операции могут остановить работу всех параллельных стримов в JVM из-за отсутствия доступных потоков в пуле, т.е. параллельные стримы стоит использовать лишь для коротких операций, где счет идет на миллисекунды, но не для тех где счет может идти на секунды и минуты;
+ Сохранение порядка в параллельных стримах увеличивает издержки при выполнении и если порядок не важен, то имеется возможность отключить его сохранение и тем самым увеличить производительность, использовав промежуточную операцию `unordered()`:

```java
collection.parallelStream()
    .sorted()
    .unordered()
    .collect(Collectors.toList());
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 71. Что такое _«лямбда»_? Какова структура и особенности использования лямбда-выражения?

<div class="answer-block">

__Лямбда__ представляет собой набор инструкций, которые можно выделить в отдельную переменную и затем многократно вызвать в различных местах программы.

Основу лямбда-выражения составляет _лямбда-оператор_, который представляет стрелку `->`. Этот оператор разделяет лямбда-выражение на две части: левая часть содержит список параметров выражения, а правая, собственно, представляет тело лямбда-выражения, где выполняются все действия.

Лямбда-выражение не выполняется само по себе, а образует реализацию метода, определенного в функциональном интерфейсе. При этом важно, что функциональный интерфейс должен содержать только один единственный метод без реализации.

```java
interface Operationable {
    int calculate(int x, int y);
}

public static void main(String[] args) {
    Operationable operation = (x, y) -> x + y;     
    int result = operation.calculate(10, 20);
    System.out.println(result); //30
}
```

По факту лямбда-выражения являются в некотором роде сокращенной формой внутренних анонимных классов, которые ранее применялись в Java.

+ _Отложенное выполнение (deferred execution) лямбда-выражения_- определяется один раз в одном месте программы, вызываются при необходимости, любое количество раз и в произвольном месте программы.

+ _Параметры лямбда-выражения_ должны соответствовать по типу параметрам метода функционального интерфейса:

```java
operation = (int x, int y) -> x + y;
//При написании самого лямбда-выражения тип параметров разрешается не указывать:
(x, y) -> x + y;
//Если метод не принимает никаких параметров, то пишутся пустые скобки, например,
() -> 30 + 20;
//Если метод принимает только один параметр, то скобки можно опустить:
n -> n * n;
```

+ _Конечные лямбда-выражения_ не обязаны возвращать какое-либо значение.

```java
interface Printable {
    void print(String s);
}
 
public static void main(String[] args) {
    Printable printer = s -> System.out.println(s);
    printer.print("Hello, world");
}
```

+ _Блочные лямбда-выражения_ обрамляются фигурными скобками. В блочных лямбда-выражениях можно использовать внутренние вложенные блоки, циклы, конструкции `if`, `switch`, создавать переменные и т.д. Если блочное лямбда-выражение должно возвращать значение, то явным образом применяется оператор `return`:

```java
Operationable operation = (int x, int y) -> {       
    if (y == 0) {
        return 0;
    }
    else {
        return x / y;
    }
};
```

+ _Передача лямбда-выражения в качестве параметра метода_:

```java
interface Condition {
    boolean isAppropriate(int n);
}

private static int sum(int[] numbers, Condition condition) {
    int result = 0;
    for (int i : numbers) {
        if (condition.isAppropriate(i)) {
            result += i;
        }
    }
    return result;
}

public static void main(String[] args) {
    System.out.println(sum(new int[] {0, 1, 0, 3, 0, 5, 0, 7, 0, 9}, (n) -> n != 0));
} 
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 72. Что такое `default` методы интрефейса?

<div class="answer-block">

Java 8 позволяет добавлять неабстрактные реализации методов в интерфейс, используя ключевое слово `default`:

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

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 73. Что такое `jjs`?

<div class="answer-block">

`jjs` это утилита командной строки, которая позволяет исполнять программы на языке JavaScript прямо в консоли.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 74. Что такое `LocalDateTime`?

<div class="answer-block">

`LocalDateTime` объединяет вместе `LocaleDate` и `LocalTime`, содержит дату и время в календарной системе ISO-8601 без привязки к часовому поясу. Время хранится с точностью до наносекунды. Содержит множество удобных методов, таких как plusMinutes, plusHours, isAfter, toSecondOfDay и т.д.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 75. Что такое `Nashorn`?

<div class="answer-block">

__Nashorn__ - это движок JavaScript, разрабатываемый на Java компанией Oracle. Призван дать возможность встраивать код JavaScript в приложения Java. В сравнении с _Rhino_, который поддерживается Mozilla Foundation, Nashorn обеспечивает от 2 до 10 раз более высокую производительность, так как он компилирует код и передает байт-код виртуальной машине Java непосредственно в памяти. Nashorn умеет компилировать код JavaScript и генерировать классы Java, которые загружаются специальным загрузчиком. Так же возможен вызов кода Java прямо из JavaScript.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 76. Что такое `Optional`?

<div class="answer-block">

Опциональное значение `Optional` — это контейнер для объекта, который может содержать или не содержать значение `null`. Такая обёртка является удобным средством предотвращения `NullPointerException`, т.к.
имеет некоторые функции высшего порядка, избавляющие от добавления повторяющихся `if null/notNull` проверок:

```java
Optional<String> optional = Optional.of("hello");

optional.isPresent(); // true
optional.ifPresent(s -> System.out.println(s.length())); // 5
optional.get(); // "hello"
optional.orElse("ops..."); // "hello"
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 77. Что такое `static` метод интерфейса?

<div class="answer-block">

Статические методы интерфейса похожи на методы по умолчанию, за исключением того, что для них отсутствует возможность переопределения в классах, реализующих интерфейс.

+ Статические методы в интерфейсе являются частью интерфейса без возможности переопределить их для объектов класса реализации;
+ Методы класса `java.lang.Object` нельзя переопределить как статические;
+ Статические методы в интерфейсе используются для обеспечения вспомогательных методов, например, проверки на null, сортировки коллекций и т.д.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 78. Что такое `Stream`?

<div class="answer-block">

Интерфейс `java.util.Stream` представляет собой последовательность элементов, над которой можно производить различные операции.

Операции над стримами бывают или _промежуточными (intermediate)_ или _конечными (terminal)_. Конечные операции возвращают результат определенного типа, а промежуточные операции возвращают тот же стрим. Таким образом вы можете строить цепочки из несколько операций над одним и тем же стримом. 

У стрима может быть сколько угодно вызовов промежуточных операций и последним вызов конечной операции. При этом все промежуточные операции выполняются лениво и пока не будет вызвана конечная операция никаких действий на самом деле не происходит (похоже на создание объекта `Thread` или `Runnable`, без вызова `start()`).

Стримы создаются на основе каких-либо источников, например классов из `java.util.Collection`. 

Ассоциативные массивы (maps), например, `HashMap`, не поддерживаются.

Операции над стримами могут выполняться как последовательно, так и параллельно.

Потоки не могут быть использованы повторно. Как только была вызвана какая-нибудь конечная операция, поток закрывается.

Кроме универсальных объектных существуют особые виды стримов для работы с примитивными типами данных `int`, `long` и `double`: `IntStream`, `LongStream` и `DoubleStream`. Эти примитивные стримы работают так же, как и обычные объектные, но со следующими отличиями: 

+ используют специализированные лямбда-выражения, например, `IntFunction` или `IntPredicate` вместо `Function` и `Predicate`; 
+ поддерживают дополнительные конечные операции `sum()`, `average()`, `mapToObj()`.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 79. Что такое `StringJoiner`?

<div class="answer-block">

Класс `StringJoiner` используется, чтобы создать последовательность строк, разделенных разделителем с возможностью присоединить к полученной строке префикс и суффикс:

```java
StringJoiner joiner = new StringJoiner(".", "prefix-", "-suffix");
for (String s : "Hello the brave world".split(" ")) {
    joiner.add(s);
}
System.out.println(joiner); //prefix-Hello.the.brave.world-suffix
```

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 80. Что такое `ZonedDateTime`?

<div class="answer-block">

`java.time.ZonedDateTime` — аналог `java.util.Calendar`, класс с самым полным объемом информации о временном контексте в календарной системе ISO-8601. Включает временную зону, поэтому все операции с временными сдвигами этот класс проводит с её учётом.

[к оглавлению](#java-8)

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 81. Что такое Stream API? Для чего нужны стримы?

<div class="answer-block">

Интерфейс java.util.Stream представляет собой последовательность элементов, над которой можно производить различные операции.
Операции над стримами бывают или промежуточными или терминальными. Терминальные операции возвращают результат определенного типа, а промежуточные операции возвращают тот же стрим. Таким образом вы можете строить цепочки из несколько операций над одним и тем же стримом.
Его задача - упростить работу с наборами данных, в частности, упростить операции фильтрации, сортировки и другие манипуляции с данными.

</div>

---

<span class="priority-badge priority-low">• Низкий приоритет</span>

## 82. Что такое «функциональные интерфейсы»?

<div class="answer-block">

__Функциональный интерфейс__ - это интерфейс, который определяет только один абстрактный метод. 

Чтобы точно определить интерфейс как функциональный, добавлена аннотация `@FunctionalInterface`, работающая по принципу `@Override`. Она обозначит замысел и не даст определить второй абстрактный метод в интерфейсе.

Интерфейс может включать сколько угодно `default` методов и при этом оставаться функциональным, потому что `default` методы - не абстрактные.

[к оглавлению](#java-8)

</div>

---
