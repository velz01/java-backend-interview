---
title: "Live Coding — Java / Алгоритмы"
outline: [2, 3]
---
# Live Coding — Java / Алгоритмы

Теория: [перейти к соответствующей теме](/learn/java-core).

## 1. Проверить, является ли строка палиндромом
**Условие задачи:**  
Дана строка.

Необходимо определить, является ли она палиндромом.

При проверке:

- регистр символов не учитывается;
    
- пробелы и знаки препинания игнорируются;
    
- учитываются только буквы и цифры.
    

**Код:**

```java
String text = "A man, a plan, a canal, Panama!";
```

Для приведённой строки результат:

```text
true
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Используй два указателя: один в начале строки, второй — в конце.  
💡 Если текущий символ не является буквой или цифрой, пропусти его.  
💡 Сравнивай символы без учёта регистра.  
💡 Если хотя бы одна пара различается, строка не является палиндромом.  
:::

---

::: details Решение

```java
public static boolean isPalindrome(String text) {
    int left = 0;
    int right = text.length() - 1;

    while (left < right) {
        while (left < right
                && !Character.isLetterOrDigit(text.charAt(left))) {
            left++;
        }

        while (left < right
                && !Character.isLetterOrDigit(text.charAt(right))) {
            right--;
        }

        char leftChar = Character.toLowerCase(text.charAt(left));
        char rightChar = Character.toLowerCase(text.charAt(right));

        if (leftChar != rightChar) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}
```

Пример использования:

```java
public static void main(String[] args) {
    String text = "A man, a plan, a canal, Panama!";

    System.out.println(isPalindrome(text)); // true
}
```

Алгоритм использует два указателя:

```text
left  → начало строки
right → конец строки
```

Символы, которые не являются буквами или цифрами, пропускаются:

```java
Character.isLetterOrDigit(...)
```

Затем симметричные символы сравниваются без учёта регистра:

```java
Character.toLowerCase(text.charAt(left))
        == Character.toLowerCase(text.charAt(right))
```

Если все пары совпали, строка является палиндромом.

Временная сложность — `O(n)`, дополнительная память — `O(1)`.

Такой вариант не требует создавать очищенную копию строки и работает с буквами и цифрами Unicode, а не только с латиницей.

:::

---

## 2. Найти два числа в неотсортированном массиве с заданной суммой
**Условие задачи:**  
Дан неотсортированный массив целых чисел `nums` и целевое значение `target`.

Необходимо найти два разных элемента массива, сумма которых равна `target`, и вернуть найденную пару.

Если подходящей пары нет, вернуть пустой массив.

Пример 1:

```text
nums = [2, 7, 11, 15]
target = 9

Результат: [2, 7]
```

Пример 2:

```text
nums = [3, 2, 4]
target = 6

Результат: [2, 4]
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Поскольку массив не отсортирован, подход с двумя указателями напрямую не подходит.  
💡 Для каждого числа вычисли, какое значение нужно ему в пару: `target - num`.  
💡 Уже просмотренные элементы удобно хранить в `HashSet`.  
💡 Если нужное значение уже встречалось, пара найдена.  
:::

---

::: details Решение

```java
public static int[] findTwoSum(int[] nums, int target) {
    Set<Long> seen = new HashSet<>();

    for (int num : nums) {
        long complement = (long) target - num;

        if (seen.contains(complement)) {
            return new int[]{(int) complement, num};
        }

        seen.add((long) num);
    }

    return new int[0];
}
```

Для каждого элемента вычисляется недостающее число:

```java
long complement = (long) target - num;
```

Например, если:

```text
target = 9
num = 7
```

то нужно найти:

```text
9 - 7 = 2
```

Если `2` уже есть среди просмотренных элементов:

```java
if (seen.contains(complement))
```

значит подходящая пара найдена.

Для массива:

```text
[2, 7, 11, 15]
```

при обработке `7` множество уже содержит `2`, поэтому результат:

```text
[2, 7]
```

Используется `long` при вычислении разницы, чтобы избежать переполнения `int` на граничных значениях.

Временная сложность в среднем — `O(n)`, дополнительная память — `O(n)`.

Менее эффективный вариант — проверить все пары двумя вложенными циклами за `O(n²)`.

:::

---

## 3. Найти первый уникальный символ в строке
**Условие задачи:**  
Необходимо реализовать метод `findFirstUniqueLetter(String str)`, который возвращает первый символ строки, встречающийся ровно один раз.

Если уникальных символов нет, можно вернуть специальное значение, например пробел `' '`.

**Код:**

```java
public class Main {

    public static void main(String[] args) {
        test();
    }

    private static char findFirstUniqueLetter(String str) {
        // Write your code here
    }

    private static void test() {
        Map<String, Character> testInOut = new HashMap<>() {{
            put("summer time sadness", 'u');
            put("AA bb CC d", 'd');
        }};

        testInOut.forEach((input, expected) -> {
            char answer = findFirstUniqueLetter(input);

            if (answer == expected) {
                System.out.println("Passed");
            } else {
                System.out.printf(
                        "Not passed. Received %s but expected %s%n",
                        answer,
                        expected
                );
            }
        });
    }
}
```

Примеры:

```text
findFirstUniqueLetter("summer time sadness") → 'u'
findFirstUniqueLetter("AA bb CC d")           → 'd'
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сначала посчитай количество вхождений каждого символа.  
💡 Для подсчёта удобно использовать `HashMap<Character, Integer>`.  
💡 Затем ещё раз пройди по исходной строке слева направо.  
💡 Первый символ с частотой `1` и будет ответом.  
:::

---

::: details Решение

```java
private static char findFirstUniqueLetter(String str) {
    Map<Character, Integer> frequencies = new HashMap<>();

    for (char ch : str.toCharArray()) {
        frequencies.merge(ch, 1, Integer::sum);
    }

    for (char ch : str.toCharArray()) {
        if (frequencies.get(ch) == 1) {
            return ch;
        }
    }

    return ' ';
}
```

На первом проходе:

```java
frequencies.merge(ch, 1, Integer::sum);
```

подсчитывается количество появлений каждого символа.

На втором проходе строка просматривается в исходном порядке:

```java
for (char ch : str.toCharArray()) {
    if (frequencies.get(ch) == 1) {
        return ch;
    }
}
```

Поэтому возвращается именно **первый** уникальный символ.

Для строки:

```text
summer time sadness
```

первым символом, встречающимся один раз, является:

```text
u
```

`LinkedHashMap` здесь не требуется: порядок мы получаем из второго прохода по исходной строке.

Временная сложность в среднем — `O(n)`, дополнительная память — `O(k)`, где `k` — количество различных символов.

Возврат `' '` используется как специальное значение согласно условию. В реальном коде, если пробел сам может быть уникальным символом, лучше изменить контракт метода и возвращать `Optional<Character>`.

:::

---

## 4. Подсчитать количество повторений каждого слова в строке
**Условие задачи:**  
Необходимо реализовать метод `countWords(String text)`, который принимает строку и возвращает `HashMap<String, Integer>`:

- ключ — слово из строки;
    
- значение — количество вхождений этого слова.
    

Слова разделяются одним или несколькими пробельными символами.

**Код:**

```java
public class WordCounter {

    public static HashMap<String, Integer> countWords(String text) {
        // TODO
    }
}
```

Пример 1:

```text
Вход:
"тест тест1 нетест слово тест2 тест1 тест тест"

Результат:
"тест"   → 3
"тест1"  → 2
"нетест" → 1
"слово"  → 1
"тест2"  → 1
```

Пример 2:

```text
Вход:
"apple banana apple"

Результат:
"apple"  → 2
"banana" → 1
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Разбей строку на слова с помощью `split("\\s+")`.  
💡 Для хранения количества повторений используй `HashMap<String, Integer>`.  
💡 Метод `merge()` позволяет компактно увеличить счётчик существующего слова или добавить новое.  
💡 Для `null` или пустой строки можно вернуть пустую карту.  
:::

---

::: details Решение

```java
public static HashMap<String, Integer> countWords(String text) {
    HashMap<String, Integer> result = new HashMap<>();

    if (text == null || text.trim().isEmpty()) {
        return result;
    }

    String[] words = text.trim().split("\\s+");

    for (String word : words) {
        result.merge(word, 1, Integer::sum);
    }

    return result;
}
```

Строка сначала разбивается на слова:

```java
String[] words = text.trim().split("\\s+");
```

Регулярное выражение `\\s+` означает один или несколько пробельных символов, поэтому корректно обрабатываются несколько пробелов подряд, табуляции и переносы строк.

Для каждого слова выполняется:

```java
result.merge(word, 1, Integer::sum);
```

Если слова ещё нет в карте, оно добавляется со значением `1`. Если уже есть, текущее значение увеличивается на `1`.

Например:

```text
"apple banana apple"
```

даст следующие частоты:

```text
apple  → 2
banana → 1
```

Временная сложность в среднем — `O(n)`, где `n` — количество символов в строке. Дополнительная память — `O(k)`, где `k` — количество различных слов.

`HashMap` не гарантирует порядок элементов при обходе, поэтому порядок записей в возвращаемой карте может отличаться от порядка слов в примере.

:::

---

## 5. Сгруппировать анаграммы
**Условие задачи:**  
Дан массив строк. Необходимо сгруппировать слова, являющиеся анаграммами друг друга.

Внутри каждой группы слова должны быть отсортированы лексикографически. Повторяющиеся элементы необходимо сохранить.

Предполагается, что строки состоят из строчных латинских букв `a-z`.

**Код:**

```text
Ввод:
["eat", "tea", "tan", "ate", "nat", "batq"]

Вывод:
[
    ["ate", "eat", "tea"],
    ["batq"],
    ["nat", "tan"]
]
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Анаграммы содержат одинаковое количество каждой буквы.  
💡 Частоты букв можно хранить в массиве `int[26]`.  
💡 На основе массива частот сформируй ключ для `Map`.  
💡 Значением карты будет список слов с одинаковым ключом.  
💡 После группировки отсортируй слова внутри каждой группы.  
:::

---

::: details Решение

```java
public static List<List<String>> groupAnagrams(String[] words) {
    if (words == null || words.length == 0) {
        return List.of();
    }

    Map<String, List<String>> groups = new HashMap<>();

    for (String word : words) {
        int[] frequencies = new int[26];

        for (int i = 0; i < word.length(); i++) {
            frequencies[word.charAt(i) - 'a']++;
        }

        StringBuilder key = new StringBuilder();

        for (int frequency : frequencies) {
            key.append(frequency).append('#');
        }

        groups.computeIfAbsent(
                key.toString(),
                ignored -> new ArrayList<>()
        ).add(word);
    }

    List<List<String>> result =
            new ArrayList<>(groups.values());

    for (List<String> group : result) {
        Collections.sort(group);
    }

    result.sort(
            Comparator.comparing(group -> group.get(0))
    );

    return result;
}
```

`Map<String, List<String>>` подходит для группировки:

- ключ описывает количество каждой буквы в слове;
    
- значение содержит все слова с таким набором букв;
    
- повторяющиеся слова сохраняются в списке.
    

`List<List<String>>` естественно представляет итоговый список групп.

Построение групп выполняется за `O(S)`, где `S` — суммарное количество символов во всех строках. Дополнительно требуется время на обязательную лексикографическую сортировку слов внутри групп.

Дополнительная память — `O(S)` для хранения результата и ключей групп.

:::

---

## 6. Реализовать собственный MyArrayList
**Условие задачи:**  
Необходимо реализовать динамический список `MyArrayList<T>` с поведением, похожим на `ArrayList`.

Требуемые методы:

- `add(T element)`;
    
- `get(int index)`;
    
- `remove(int index)`;
    
- `size()`.
    

При заполнении внутреннего массива список должен автоматически увеличивать его размер.

**Код:**

```java
public class Main {

    public static void main(String[] args) {
        MyArrayList<String> list = new MyArrayList<>();

        list.add("Привет");
        list.add("Мир");
        list.add("Java");

        System.out.println(
                "Элемент по индексу 1: " + list.get(1)
        );
        System.out.println("Размер: " + list.size());

        list.remove(1);

        System.out.println("После удаления:");

        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i));
        }
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Элементы можно хранить во внутреннем массиве `Object[]`.  
💡 Поле `size` должно содержать фактическое количество элементов.  
💡 Перед добавлением проверяй, достаточно ли места в массиве.  
💡 При расширении можно увеличить вместимость примерно в 1.5 раза.  
💡 После удаления сдвинь оставшиеся элементы влево.  
💡 Проверяй индекс перед вызовами `get()` и `remove()`.  
:::

---

::: details Решение

```java
public class MyArrayList<T> {

    private static final int DEFAULT_CAPACITY = 10;

    private Object[] elements;
    private int size;

    public MyArrayList() {
        elements = new Object[DEFAULT_CAPACITY];
    }

    public void add(T element) {
        ensureCapacity(size + 1);
        elements[size] = element;
        size++;
    }

    public T get(int index) {
        checkIndex(index);
        return elementAt(index);
    }

    public T remove(int index) {
        checkIndex(index);

        T removedElement = elementAt(index);
        int elementsToMove = size - index - 1;

        if (elementsToMove > 0) {
            System.arraycopy(
                    elements,
                    index + 1,
                    elements,
                    index,
                    elementsToMove
            );
        }

        elements[--size] = null;

        return removedElement;
    }

    public int size() {
        return size;
    }

    private void ensureCapacity(int requiredCapacity) {
        if (requiredCapacity <= elements.length) {
            return;
        }

        int newCapacity =
                elements.length + elements.length / 2;

        if (newCapacity < requiredCapacity) {
            newCapacity = requiredCapacity;
        }

        elements = Arrays.copyOf(
                elements,
                newCapacity
        );
    }

    private void checkIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException(
                    "Index: " + index + ", size: " + size
            );
        }
    }

    @SuppressWarnings("unchecked")
    private T elementAt(int index) {
        return (T) elements[index];
    }
}
```

При добавлении элемент записывается в первую свободную ячейку. Если места недостаточно, внутренний массив расширяется.

При удалении элементы справа от указанного индекса сдвигаются влево, а последняя занятная ячейка очищается.

Временная сложность:

- `get()` — `O(1)`;
    
- `add()` — амортизированно `O(1)`;
    
- `remove()` — `O(n)`;
    
- `size()` — `O(1)`.
    

:::

---

## 7. Сделать класс immutable
**Условие задачи:**  
Дан класс `A` с полями `Integer a` и `List<Object> b`. Необходимо сделать его неизменяемым.

**Код:**

```java
class A {
    Integer a;
    List<Object> b;
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Запрети наследование от класса.  
💡 Сделай все поля `private final`.  
💡 Устанавливай значения только через конструктор.  
💡 Не добавляй сеттеры.  
💡 Создавай защитную копию изменяемой коллекции.  
💡 Учитывай, что копирование списка не делает неизменяемыми его элементы.  
:::

---

::: details Решение

```java
public final class A {

    private final Integer a;
    private final List<Object> b;

    public A(Integer a, List<Object> b) {
        this.a = a;
        this.b = b == null
                ? List.of()
                : List.copyOf(b);
    }

    public Integer getA() {
        return a;
    }

    public List<Object> getB() {
        return b;
    }
}
```

Класс нельзя унаследовать, его поля нельзя переназначить после создания, а список копируется и хранится в неизменяемом виде.

Изменение исходного списка не повлияет на состояние объекта:

```java
List<Object> source = new ArrayList<>();
source.add("value");

A object = new A(10, source);

source.add("another");

System.out.println(object.getB()); // [value]
```

Попытка изменить список через геттер завершится исключением:

```java
object.getB().add("new value");
```

`List.copyOf()` выполняет поверхностное копирование. Поэтому для полной неизменяемости элементы списка тоже должны быть immutable. Если внутри находятся изменяемые объекты, для них необходимо создавать глубокие защитные копии.

:::

---

## 8. Объединить два отсортированных массива
**Условие задачи:**  
Даны два отсортированных массива `nums1` и `nums2`. Необходимо объединить их в один отсортированный массив.

Использовать встроенную сортировку нельзя.

**Код:**

```java
public int[] mergeSortedArrays(int[] nums1, int[] nums2) {
    // код тут
}
```

Примеры:

```text
[1, 3, 5] и [2, 4, 6] → [1, 2, 3, 4, 5, 6]

[1, 2, 7] и [3, 4, 5] → [1, 2, 3, 4, 5, 7]

[] и [1, 2, 3] → [1, 2, 3]
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Используй отдельный указатель для каждого входного массива.  
💡 Сравнивай текущие элементы и записывай меньший в результат.  
💡 После добавления элемента передвигай соответствующий указатель.  
💡 Когда один массив закончится, скопируй остаток второго.  
:::

---

::: details Решение

```java
public int[] mergeSortedArrays(int[] nums1, int[] nums2) {
    int[] result = new int[nums1.length + nums2.length];

    int firstIndex = 0;
    int secondIndex = 0;
    int resultIndex = 0;

    while (firstIndex < nums1.length
            && secondIndex < nums2.length) {

        if (nums1[firstIndex] <= nums2[secondIndex]) {
            result[resultIndex++] = nums1[firstIndex++];
        } else {
            result[resultIndex++] = nums2[secondIndex++];
        }
    }

    while (firstIndex < nums1.length) {
        result[resultIndex++] = nums1[firstIndex++];
    }

    while (secondIndex < nums2.length) {
        result[resultIndex++] = nums2[secondIndex++];
    }

    return result;
}
```

Каждый элемент обоих массивов обрабатывается ровно один раз. Повторяющиеся значения сохраняются.

Временная сложность — `O(n + m)`, дополнительная память — `O(n + m)` для результирующего массива.

:::

---

## 9. Реализовать односвязный список
**Условие задачи:**  
Необходимо реализовать собственный односвязный список на Java.

Список должен поддерживать:

- добавление элемента в конец;
    
- получение элемента по индексу;
    
- удаление элемента по индексу;
    
- получение количества элементов.
    

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Каждый элемент списка хранится в отдельном узле `Node`.  
💡 Узел содержит значение и ссылку на следующий узел.  
💡 Поле `head` указывает на первый элемент списка.  
💡 Поле `tail` позволяет добавлять элементы в конец за `O(1)`.  
💡 При удалении первого или последнего элемента нужно обновить `head` или `tail`.  
:::

---

::: details Решение

```java
public class SinglyLinkedList<T> {

    private Node<T> head;
    private Node<T> tail;
    private int size;

    public void add(T value) {
        Node<T> newNode = new Node<>(value);

        if (head == null) {
            head = newNode;
            tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }

        size++;
    }

    public T get(int index) {
        checkIndex(index);
        return getNode(index).value;
    }

    public T remove(int index) {
        checkIndex(index);

        if (index == 0) {
            T removedValue = head.value;
            head = head.next;
            size--;

            if (size == 0) {
                tail = null;
            }

            return removedValue;
        }

        Node<T> previous = getNode(index - 1);
        Node<T> removed = previous.next;

        previous.next = removed.next;

        if (removed == tail) {
            tail = previous;
        }

        removed.next = null;
        size--;

        return removed.value;
    }

    public int size() {
        return size;
    }

    private Node<T> getNode(int index) {
        Node<T> current = head;

        for (int i = 0; i < index; i++) {
            current = current.next;
        }

        return current;
    }

    private void checkIndex(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException(
                    "Index: " + index + ", size: " + size
            );
        }
    }

    private static class Node<T> {

        private final T value;
        private Node<T> next;

        private Node(T value) {
            this.value = value;
        }
    }
}
```

Пример использования:

```java
SinglyLinkedList<String> list = new SinglyLinkedList<>();

list.add("one");
list.add("two");
list.add("three");

System.out.println(list.get(1)); // two

list.remove(1);

System.out.println(list.get(1)); // three
System.out.println(list.size()); // 2
```

Сложность операций:

- `add()` — `O(1)`;
    
- `get()` — `O(n)`;
    
- `remove()` — `O(n)`;
    
- `size()` — `O(1)`.
    

:::

---

