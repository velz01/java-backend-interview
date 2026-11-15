---
title: "Live Coding — Stream API"
outline: [2, 3]
---
# Live Coding — Stream API

Теория: [перейти к соответствующей теме](/learn/stream-api).

## 1. Получить удвоенные нечётные числа
**Условие задачи:**  
Дан массив натуральных чисел от `0` до `100`.

Необходимо с помощью Stream API:

- оставить только нечётные числа;
    
- умножить каждое из них на `2`;
    
- собрать результат в коллекцию.
    

Пример:

```text
Вход:  [0, 1, 2, 3, 4, 5]
Выход: [2, 6, 10]
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для создания потока из массива `int[]` используй `Arrays.stream()`.  
💡 Нечётные числа можно определить через `number % 2 != 0`.  
💡 Для удвоения каждого числа используй `map()`.  
💡 `boxed()` преобразует `IntStream` в поток `Integer`, который можно собрать в `List<Integer>`.  
:::

---

::: details Решение

```java
int[] numbers = {0, 1, 2, 3, 4, 5};

List<Integer> result = Arrays.stream(numbers)
        .filter(number -> number % 2 != 0)
        .map(number -> number * 2)
        .boxed()
        .collect(Collectors.toList());
```

Сначала:

```java
Arrays.stream(numbers)
```

создаёт `IntStream` из исходного массива.

Затем:

```java
.filter(number -> number % 2 != 0)
```

оставляет только нечётные числа.

После этого:

```java
.map(number -> number * 2)
```

удваивает каждое из них.

`boxed()` преобразует значения типа `int` в `Integer`, после чего результат собирается в список.

Для массива:

```text
[0, 1, 2, 3, 4, 5]
```

получим:

```text
[2, 6, 10]
```

Временная сложность — `O(n)`, дополнительная память — `O(k)`, где `k` — количество нечётных элементов.

:::

---

## 2. Получить уникальные имена активных элементов
**Условие задачи:**  
Дан список объектов `Item`.

Необходимо с помощью Stream API получить коллекцию уникальных имён (`Item.name`) только тех элементов, у которых `active = true`.

**Код:**

```java
@Getter
@Setter
class Item {
    private final Long id;
    private String name;
    private boolean active;

    public Item(Long id) {
        this.id = id;
    }
}

List<Item> items = ...;

Collection<String> result = items.stream()...;
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Через `filter()` оставь только активные элементы.  
💡 Через `map()` преобразуй `Item` в его имя.  
💡 Для получения уникальных значений собери результат в `Set`.  
:::

---

::: details Решение

```java
Collection<String> result = items.stream()
        .filter(Item::isActive)
        .map(Item::getName)
        .collect(Collectors.toSet());
```

Сначала:

```java
.filter(Item::isActive)
```

оставляет только элементы с `active = true`.

Затем:

```java
.map(Item::getName)
```

преобразует каждый `Item` в его имя.

Наконец:

```java
.collect(Collectors.toSet())
```

собирает имена в `Set`, поэтому повторяющиеся значения автоматически исключаются.

Если порядок элементов важен, можно собрать результат в `LinkedHashSet`:

```java
Collection<String> result = items.stream()
        .filter(Item::isActive)
        .map(Item::getName)
        .collect(Collectors.toCollection(LinkedHashSet::new));
```

Временная сложность в среднем — `O(n)`, дополнительная память — `O(k)`, где `k` — количество уникальных имён активных элементов.

:::

---

## 3. Найти человека по имени
**Условие задачи:**  
Дан класс `Person` с полями `name` и `age`.

Необходимо реализовать метод, который:

- принимает список `List<Person>`;
    
- ищет человека по имени;
    
- возвращает первого найденного человека в виде `Optional<Person>`;
    
- использует Stream API.
    

**Код:**

```java
class Person {
    String name;
    Integer age;
}

Optional<Person> findPersonByName(List<Person> persons, String name) {
    // ...
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Создай поток из списка через `stream()`.  
💡 Через `filter()` оставь только людей с нужным именем.  
💡 Для безопасного сравнения строк можно использовать `Objects.equals()`.  
💡 `findFirst()` вернёт первый подходящий элемент в виде `Optional<Person>`.  
:::

---

::: details Решение

```java
Optional<Person> findPersonByName(List<Person> persons, String name) {
    return persons.stream()
            .filter(person -> Objects.equals(person.name, name))
            .findFirst();
}
```

Условие:

```java
.filter(person -> Objects.equals(person.name, name))
```

оставляет только людей с нужным именем.

`Objects.equals()` корректно сравнивает значения даже в случае, если одно или оба имени равны `null`.

Затем:

```java
.findFirst()
```

возвращает первого найденного человека как `Optional<Person>`. Если подходящего человека нет, результатом будет `Optional.empty()`.

Временная сложность — `O(n)` в худшем случае, дополнительная память — `O(1)`.

:::

---

## 4. Найти средний возраст мужчин в списке
**Условие задачи:**  
Дан список объектов `Person` с полями:

- `name`;
    
- `age`;
    
- `sex`.
    

Необходимо с помощью Stream API найти средний возраст всех мужчин из списка.

Если мужчин в списке нет, результат должен быть пустым `OptionalDouble`.

**Код:**

```java
List<Person> persons = Arrays.asList(
        new Person("Alice", 25, "female"),
        new Person("Bob", 30, "male"),
        new Person("Eve", 35, "female"),
        new Person("Jack", 28, "male")
);
```

Пример результата:

```text
29.0
```

Если мужчин нет:

```text
OptionalDouble.empty
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Через `filter()` оставь только мужчин.  
💡 Через `mapToInt()` преобразуй поток `Person` в поток возрастов.  
💡 Метод `average()` возвращает `OptionalDouble`.  
💡 `OptionalDouble` позволяет корректно обработать случай, когда подходящих элементов нет.  
:::

---

::: details Решение

```java
OptionalDouble averageAgeOfMales = persons.stream()
        .filter(person -> "male".equalsIgnoreCase(person.getSex()))
        .mapToInt(Person::getAge)
        .average();
```

Сначала:

```java
.filter(person -> "male".equalsIgnoreCase(person.getSex()))
```

оставляет только мужчин.

Вызов `equalsIgnoreCase()` выполняется у строкового литерала `"male"`, поэтому код не выбросит `NullPointerException`, если `person.getSex()` вернёт `null`.

Затем:

```java
.mapToInt(Person::getAge)
```

преобразует объекты `Person` в их возраст, а:

```java
.average()
```

вычисляет среднее значение и возвращает `OptionalDouble`.

Для возрастов `30` и `28` результат:

```text
29.0
```

Если мужчин в списке нет, `average()` вернёт:

```text
OptionalDouble.empty
```

Если по условию обязательно требуется получить именно `double`, можно задать значение для случая отсутствия мужчин:

```java
double averageAgeOfMales = persons.stream()
        .filter(person -> "male".equalsIgnoreCase(person.getSex()))
        .mapToInt(Person::getAge)
        .average()
        .orElse(0.0);
```

Но если отсутствие мужчин должно отличаться от реального среднего возраста `0`, предпочтительнее сохранить `OptionalDouble`.

Временная сложность — `O(n)`, дополнительная память — `O(1)`.

:::

---

## 5. Отфильтровать и сгруппировать имена по длине
**Условие задачи:**  
Дан список имён пользователей.

Необходимо с помощью Stream API:

- оставить только имена, начинающиеся с буквы `А`;
    
- сгруппировать их по длине;
    
- вернуть результат в виде `Map<Integer, List<String>>`, где:
    
    - ключ — длина имени;
        
    - значение — список имён такой длины.
        

**Код:**

```java
public class Main {

    public static void main(String[] args) {
        List<String> names = List.of(
                "Анна",
                "Александр",
                "Андрей",
                "Антон",
                "Борис",
                "Богдан",
                "Мария",
                "Максим",
                "Артём"
        );

        System.out.println(processNames(names));
    }

    public static Map<Integer, List<String>> processNames(List<String> names) {
        return null;
    }
}
```

Ожидаемый результат:

```text
{4=[Анна], 5=[Антон, Артём], 6=[Андрей], 9=[Александр]}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Создай поток через `stream()`.  
💡 Через `filter()` оставь только строки, начинающиеся с `"А"`.  
💡 Для группировки используй `Collectors.groupingBy()`.  
💡 Ключом группы будет длина строки — `String::length`.  
:::

---

::: details Решение

```java
public static Map<Integer, List<String>> processNames(List<String> names) {
    return names.stream()
            .filter(name -> name.startsWith("А"))
            .collect(Collectors.groupingBy(String::length));
}
```

Сначала:

```java
.filter(name -> name.startsWith("А"))
```

оставляет только имена, начинающиеся с буквы `А`.

Затем:

```java
.collect(Collectors.groupingBy(String::length))
```

группирует имена по их длине.

Для исходных данных группы будут такими:

```text
4 -> [Анна]
5 -> [Антон, Артём]
6 -> [Андрей]
9 -> [Александр]
```

Тип результата:

```java
Map<Integer, List<String>>
```

Временная сложность — `O(n)`, дополнительная память — `O(n)` для результата.

:::

---

## 6. Получить уникальные значения со всех складов
**Условие задачи:**  
Дана карта складов `Map<String, List<String>> storage`, где:

- ключ — название склада;
    
- значение — список номеров, находящихся на этом складе.
    

Необходимо с помощью Stream API получить все уникальные номера со всех складов.

**Код:**

```java
Map<String, List<String>> storage = new HashMap<>();

storage.put("s1", Arrays.asList("555-1123", "555-3389"));
storage.put("s2", Arrays.asList("555-1123", "555-5264"));
storage.put("s3", Arrays.asList("555-6654", "555-3242"));
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Через `storage.values()` получи списки значений всех складов.  
💡 С помощью `flatMap()` объедини несколько списков в один поток строк.  
💡 Для получения уникальных значений можно собрать результат в `Set`.  
:::

---

::: details Решение

```java
Set<String> uniqueNumbers = storage.values().stream()
        .flatMap(List::stream)
        .collect(Collectors.toSet());
```

Сначала:

```java
storage.values().stream()
```

создаёт поток списков:

```text
Stream<List<String>>
```

Затем:

```java
.flatMap(List::stream)
```

разворачивает их в один поток номеров:

```text
Stream<String>
```

После этого:

```java
.collect(Collectors.toSet())
```

собирает значения в `Set`, который автоматически исключает дубликаты.

Если нужно сразу вывести уникальные номера, можно использовать `distinct()`:

```java
storage.values().stream()
        .flatMap(List::stream)
        .distinct()
        .forEach(System.out::println);
```

Для приведённых данных будут получены значения:

```text
555-1123
555-3389
555-5264
555-6654
555-3242
```

Порядок вывода не гарантирован, поскольку исходная карта — `HashMap`.

Временная сложность в среднем — `O(n)`, дополнительная память — `O(k)`, где `k` — количество уникальных значений.

:::

---

## 7. Сгруппировать названия книг по авторам
**Условие задачи:**  
Дана коллекция объектов `Book`, где:

- `author` — имя автора;
    
- `names` — список названий книг.
    

Необходимо:

1. получить `Map<String, List<String>>`, где ключ — автор, а значение — список всех названий его книг;
    
2. дополнительно получить для каждого автора только уникальные названия книг.
    

**Код:**

```java
public class Main {

    private record Book(String author, List<String> names) {
    }

    public static void main(String[] args) {
        Set<Book> books = Set.of(
                new Book("Author1", List.of("Name1")),
                new Book("Author1", List.of("Name2")),
                new Book("Author2", List.of("Name3")),
                new Book("Author2", List.of("Name4", "Name3")),
                new Book("Author3", List.of("Name5"))
        );
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сгруппируй объекты по `author` через `Collectors.groupingBy()`.  
💡 У каждого `Book` хранится список названий, поэтому вложенные списки нужно развернуть.  
💡 Для этого можно использовать `Collectors.flatMapping()`.  
💡 Для обычного результата собирай названия в `List`, а для уникального — в `Set`.  
:::

---

::: details Решение

1. Список названий книг по каждому автору:
    

```java
Map<String, List<String>> booksByAuthor = books.stream()
        .collect(Collectors.groupingBy(
                Book::author,
                Collectors.flatMapping(
                        book -> book.names().stream(),
                        Collectors.toList()
                )
        ));
```

`groupingBy()` группирует объекты `Book` по автору:

```java
Book::author
```

А `flatMapping()` разворачивает все списки `names` внутри одной группы в единый поток названий:

```java
book -> book.names().stream()
```

Для приведённых данных результат будет содержать:

```text
Author1 -> [Name1, Name2]
Author2 -> [Name3, Name4, Name3]
Author3 -> [Name5]
```

2. Уникальные названия книг по каждому автору:
    

```java
Map<String, Set<String>> uniqueBooksByAuthor = books.stream()
        .collect(Collectors.groupingBy(
                Book::author,
                Collectors.flatMapping(
                        book -> book.names().stream(),
                        Collectors.toSet()
                )
        ));
```

Теперь названия собираются в `Set`, поэтому повторяющиеся значения исключаются:

```text
Author1 -> [Name1, Name2]
Author2 -> [Name3, Name4]
Author3 -> [Name5]
```

Если используется Java 8, где `Collectors.flatMapping()` ещё нет, ту же задачу можно решить через `toMap()`:

```java
Map<String, List<String>> booksByAuthor = books.stream()
        .collect(Collectors.toMap(
                Book::author,
                book -> new ArrayList<>(book.names()),
                (left, right) -> {
                    left.addAll(right);
                    return left;
                }
        ));
```

Временная сложность — `O(m)`, где `m` — общее количество названий книг во всех объектах `Book`. Дополнительная память также зависит от количества собранных названий.

:::

---

