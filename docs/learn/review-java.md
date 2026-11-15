---
title: "Code Review — Java"
outline: [2, 3]
---
# Code Review — Java

Теория: [перейти к соответствующей теме](/learn/java-core).

## 1. Провести code review и исправить класс Test
**Условие задачи:**  
Необходимо провести code review класса `Test`, найти проблемы и предложить исправленную реализацию.

Нужно обратить внимание на:

- потокобезопасность;
    
- корректное закрытие файловых ресурсов;
    
- выбор структуры данных;
    
- эффективность формирования строки;
    
- безопасное предоставление содержимого списка наружу.
    

**Код:**

```java
public class Test {
    private List<String> list = new LinkedList<String>();

    public synchronized void addString(String s) {
        list.add(s);
    }

    public void addStringsFromFile(String pathToFile) throws IOException {
        File file = new File(pathToFile);
        FileInputStream fis = new FileInputStream(file);
        InputStreamReader isr =
                new InputStreamReader(fis, StandardCharsets.UTF_8);
        Scanner scanner = new Scanner(isr);

        String str;

        while (scanner.hasNextLine()) {
            str = scanner.nextLine();

            if (!str.isBlank()) {
                addString(str);
            }
        }
    }

    public void removeString(int i) {
        list.remove(i);
    }

    public List<String> getList() {
        return list;
    }

    public synchronized String formatString() {
        String s = "";

        for (int i = 0; i < list.size(); i++) {
            s = s + list.get(i);
        }

        return s;
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Синхронизация должна защищать все операции с общим изменяемым состоянием, а не только часть методов.  
💡 Возвращать внутренний изменяемый список напрямую нельзя — вызывающий код сможет менять его без синхронизации.  
💡 Для чтения файла удобно использовать `Files.newBufferedReader()` вместе с `try-with-resources`.  
💡 Последовательная конкатенация строк через `+` внутри цикла создаёт множество промежуточных объектов.  
💡 Здесь `ArrayList` подходит лучше `LinkedList`, особенно если список часто обходится целиком.  
:::

---

::: details Решение

Основные проблемы:

- `addString()` и `formatString()` синхронизированы, а `removeString()` и `getList()` — нет;
    
- `getList()` возвращает внутреннюю коллекцию, поэтому её можно изменить в обход любой синхронизации;
    
- файловые ресурсы не закрываются;
    
- используется слишком низкоуровневая цепочка `FileInputStream → InputStreamReader → Scanner`;
    
- конкатенация через `s = s + ...` внутри цикла неэффективна;
    
- `LinkedList` здесь не даёт преимуществ;
    
- обращение `list.get(i)` для `LinkedList` само по себе стоит `O(i)`, поэтому индексный обход дополнительно ухудшает производительность.
    

Один из вариантов рефакторинга:

```java
public class Test {

    private final List<String> list = new ArrayList<>();
    private final Object lock = new Object();

    public void addString(String value) {
        synchronized (lock) {
            list.add(value);
        }
    }

    public void addStringsFromFile(String pathToFile)
            throws IOException {

        try (BufferedReader reader = Files.newBufferedReader(
                Path.of(pathToFile),
                StandardCharsets.UTF_8
        )) {
            String line;

            while ((line = reader.readLine()) != null) {
                if (!line.isBlank()) {
                    addString(line);
                }
            }
        }
    }

    public void removeString(int index) {
        synchronized (lock) {
            list.remove(index);
        }
    }

    public List<String> getList() {
        synchronized (lock) {
            return Collections.unmodifiableList(
                    new ArrayList<>(list)
            );
        }
    }

    public String formatString() {
        synchronized (lock) {
            StringBuilder result = new StringBuilder();

            for (String value : list) {
                result.append(value);
            }

            return result.toString();
        }
    }
}
```

Все обращения к изменяемому состоянию:

```java
private final List<String> list
```

теперь выполняются под одним и тем же приватным монитором:

```java
private final Object lock = new Object();
```

Использование отдельного объекта блокировки предпочтительнее синхронизации на самой коллекции: внешний код не получает к нему доступа и не может случайно вмешаться в протокол синхронизации.

В `getList()` возвращается снимок:

```java
return Collections.unmodifiableList(
        new ArrayList<>(list)
);
```

Это важно. Вариант:

```java
Collections.unmodifiableList(list)
```

запрещает вызывающему коду изменять список напрямую, но всё равно возвращает представление над исходной изменяемой коллекцией. Её содержимое может параллельно изменяться самим `Test`.

Снимок полностью отделён от внутреннего списка.

Для файла используется:

```java
try (BufferedReader reader = Files.newBufferedReader(...))
```

`try-with-resources` гарантирует закрытие `BufferedReader` даже при возникновении `IOException`.

В `formatString()` вместо:

```java
s = s + list.get(i);
```

используется:

```java
StringBuilder result = new StringBuilder();

for (String value : list) {
    result.append(value);
}
```

Это устраняет создание множества промежуточных строк.

Также `ArrayList` лучше соответствует текущему сценарию использования: элементы добавляются в конец и список часто обходится целиком.

Для некорректного индекса:

```java
list.remove(index);
```

естественным образом будет выброшен `IndexOutOfBoundsException`. Молча игнорировать неправильный индекс обычно не стоит, если такое поведение явно не требуется контрактом.

После рефакторинга:

- доступ к общему состоянию синхронизирован единообразно;
    
- внутренний список не утекает наружу;
    
- ресурсы закрываются автоматически;
    
- убрана лишняя низкоуровневая работа с потоками;
    
- формирование строки выполняется эффективно;
    
- коллекция выбрана в соответствии с характером операций.
    

:::

---

## 2. Оптимизировать построение сообщения об ошибках
**Условие задачи:**  
Дан Spring-компонент, который формирует строковое сообщение со списком ошибок.

Необходимо исправить проблемы в реализации:

- убрать неэффективную конкатенацию строк внутри цикла;
    
- корректно оформить строковые литералы;
    
- сохранить исходный формат сообщения.
    

**Код:**

```java
@Component
public class Task2 {

    public String buildAuditMessage(List<String> errors) {
        String msg =
                "В процессе обработки возникли следующие проблемы: \n";

        for (String error : errors) {
            msg += error + "\n";
        }

        return msg;
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 `String` в Java неизменяемый, поэтому конкатенация через `+=` в цикле создаёт новые объекты.  
💡 Для последовательного построения строки лучше использовать `StringBuilder`.  
💡 Добавлять перенос строки можно через `append('\n')`.  
:::

---

::: details Решение

```java
@Component
public class Task2 {

    public String buildAuditMessage(List<String> errors) {
        StringBuilder message = new StringBuilder(
                "В процессе обработки возникли следующие проблемы:\n"
        );

        for (String error : errors) {
            message.append(error)
                    .append('\n');
        }

        return message.toString();
    }
}
```

В исходном варианте внутри цикла выполнялась операция:

```java
msg += error + "\n";
```

Поскольку `String` неизменяемый, при каждой такой конкатенации создаётся новая строка и копируется уже накопленное содержимое.

`StringBuilder` изменяет внутренний буфер:

```java
message.append(error)
        .append('\n');
```

поэтому подходит для построения строки в цикле значительно лучше.

Также для одиночного символа переноса строки используется:

```java
'\n'
```

а не строка `"\n"`.

В результате код становится проще и эффективнее.

Для `n` ошибок и суммарной длины результата `L` построение сообщения через `StringBuilder` работает за `O(L)`. При многократной конкатенации через `+=` объём копирования может расти квадратично относительно размера формируемой строки.

:::

---

## 3. Оптимизировать вычисление числа Фибоначчи
**Условие задачи:**  
Дана рекурсивная реализация функции Фибоначчи:

```java
int fib(int n) {
    if (n <= 1) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
}
```

Необходимо провести рефакторинг:

- устранить повторные вычисления;
    
- улучшить производительность;
    
- корректно обработать отрицательные значения `n`;
    
- оценить временную и пространственную сложность решения.
    

Последовательность Фибоначчи:

```text
n: 0, 1, 2, 3, 4, 5, 6, ...
f: 0, 1, 1, 2, 3, 5, 8, ...
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 В исходной рекурсии одни и те же значения вычисляются много раз.  
💡 Например, при вычислении `fib(5)` значение `fib(3)` будет вычислено несколько раз.  
💡 Если рекурсия не является требованием, проще всего заменить её итерацией.  
💡 Для вычисления очередного числа достаточно хранить только два предыдущих значения.  
:::

---

::: details Решение

Предпочтительный вариант — итеративное решение:

```java
public static int fib(int n) {
    if (n < 0) {
        throw new IllegalArgumentException(
                "n должен быть неотрицательным"
        );
    }

    if (n <= 1) {
        return n;
    }

    int previous = 0;
    int current = 1;

    for (int i = 2; i <= n; i++) {
        int next = previous + current;

        previous = current;
        current = next;
    }

    return current;
}
```

Например:

```java
System.out.println(fib(0));  // 0
System.out.println(fib(1));  // 1
System.out.println(fib(5));  // 5
System.out.println(fib(10)); // 55
```

В исходном варианте:

```java
return fib(n - 1) + fib(n - 2);
```

строится дерево рекурсивных вызовов, в котором одни и те же значения вычисляются повторно.

Например:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)
```

`fib(3)` уже вычисляется как минимум дважды, а с ростом `n` число повторных вызовов быстро увеличивается.

Временная сложность такой рекурсии экспоненциальная — `O(φⁿ)`, где `φ ≈ 1.618`. Её также часто упрощённо оценивают сверху как `O(2ⁿ)`.

Итеративный вариант выполняет один проход:

```java
for (int i = 2; i <= n; i++)
```

и хранит только два предыдущих значения.

Сложность после рефакторинга:

- время — `O(n)`;
    
- дополнительная память — `O(1)`.
    

Если требуется сохранить рекурсивный подход, можно использовать мемоизацию:

```java
public static int fib(int n) {
    if (n < 0) {
        throw new IllegalArgumentException(
                "n должен быть неотрицательным"
        );
    }

    Integer[] cache = new Integer[n + 1];

    return fib(n, cache);
}

private static int fib(int n, Integer[] cache) {
    if (n <= 1) {
        return n;
    }

    if (cache[n] != null) {
        return cache[n];
    }

    cache[n] = fib(n - 1, cache)
            + fib(n - 2, cache);

    return cache[n];
}
```

У варианта с мемоизацией:

- время — `O(n)`;
    
- память — `O(n)` на кэш и стек рекурсии.
    

Для обычной задачи итеративная версия проще и экономнее по памяти.

Важно также учитывать диапазон типа `int`: `F(46)` ещё помещается в `int`, а `F(47)` уже приводит к переполнению. Для больших значений следует использовать `long`, а затем при необходимости `BigInteger`.

:::

---

## 4. Провести код-ревью переименования файла
**Условие задачи:**  
Система хранит файлы на файловой системе, а их метаданные — в PostgreSQL.

Необходимо провести код-ревью метода, который переименовывает файл и обновляет его имя в базе данных.

**Код:**

```java
@Transactional
public void process(String oldName, String newName) {
    Long id = exec(
            "select id from file where name='"
                    + oldName + "'"
    );

    processFile(oldName, newName);

    exec(
            "update file set name=\""
                    + newName
                    + "\" where id = "
                    + id
    );
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 `@Transactional` управляет транзакцией базы данных, но не файловой системой.  
💡 SQL нельзя собирать конкатенацией строк.  
💡 Переименовывать файл надёжнее по идентификатору, а не по имени.  
💡 Необходимо проверить новое имя и возможные коллизии.  
💡 Между чтением записи и её обновлением возможны конкурентные изменения.  
💡 Для сбоя между операциями нужен откат, повторная обработка или механизм сверки.  
:::

---

::: details Решение

Основные проблемы:

1. SQL-инъекция из-за конкатенации параметров:
    

```java
"where name='" + oldName + "'"
```

Нужно использовать параметризованные запросы или Spring Data Repository.

2. Аннотация `@Transactional` распространяется только на PostgreSQL. Если файл уже переименован, а обновление базы завершилось ошибкой, файловая система автоматически не откатится.
    
3. Поиск по имени ненадёжен. Имя может быть неуникальным или измениться конкурентным запросом. Метод лучше принимать `fileId`.
    
4. Необходимо проверять `newName`:
    

- пустое значение;
    
- запрещённые символы;
    
- `../`, `/` и `\`;
    
- превышение допустимой длины;
    
- существование файла с таким именем.
    

5. Уникальность имени должна обеспечиваться ограничением в базе данных, например по паре `(directory_id, name)`.
    

Минимальный вариант с блокировкой записи и компенсацией:

```java
@Transactional
public void rename(long fileId, String newName) {
    validateFileName(newName);

    FileMetadata file = repository.findByIdForUpdate(fileId)
            .orElseThrow(() ->
                    new IllegalArgumentException("File not found")
            );

    String oldName = file.getName();

    if (oldName.equals(newName)) {
        return;
    }

    storage.rename(oldName, newName);

    try {
        file.setName(newName);
        repository.saveAndFlush(file);
    } catch (RuntimeException exception) {
        try {
            storage.rename(newName, oldName);
        } catch (RuntimeException rollbackException) {
            exception.addSuppressed(rollbackException);
        }

        throw exception;
    }
}
```

Репозиторий с блокировкой:

```java
public interface FileMetadataRepository
        extends JpaRepository<FileMetadata, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select file
            from FileMetadata file
            where file.id = :id
            """)
    Optional<FileMetadata> findByIdForUpdate(long id);
}
```

Такой вариант уменьшает риск рассинхронизации, но не обеспечивает абсолютную атомарность. Например, процесс может завершиться аварийно после переименования файла, но до обновления базы.

Для production-решения лучше использовать последовательность состояний:

```text
READY → RENAMING → READY
                  ↘ ERROR
```

Запрос создаёт операцию переименования в базе. Отдельный обработчик выполняет операцию на файловой системе, поддерживает повторные попытки и после успеха обновляет метаданные.

Дополнительно нужна фоновая сверка базы данных и файловой системы, которая обнаруживает и исправляет незавершённые операции.

:::

---

