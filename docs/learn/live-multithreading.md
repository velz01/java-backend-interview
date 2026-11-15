---
title: "Live Coding — Многопоточность"
outline: [2, 3]
---
# Live Coding — Многопоточность

Теория: [перейти к соответствующей теме](/learn/multithreading).

## 1. Синхронизировать вывод «Тик» и «Так» двумя потоками
**Условие задачи:**  
Необходимо реализовать программу с двумя потоками:

- первый поток выводит `Тик`;
    
- второй поток выводит `Так`;
    
- сообщения должны выводиться строго по очереди;
    
- между соседними выводами должна проходить примерно одна секунда.
    

Ожидаемый результат:

```text
Тик
Так
Тик
Так
Тик
Так
...
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для координации потоков можно использовать общий монитор и `wait()` / `notifyAll()`.  
💡 Нужен флаг, определяющий, чей сейчас ход.  
💡 Проверку условия перед `wait()` следует выполнять через `while`, поскольку возможны ложные пробуждения.  
💡 Чтобы между `Тик` и `Так` была пауза в одну секунду, следующий поток нельзя допускать к печати раньше времени.  
:::

---

::: details Решение

```java
public class TickTock {

    private final Object lock = new Object();
    private boolean tickTurn = true;

    public void tick() throws InterruptedException {
        print("Тик", true);
    }

    public void tock() throws InterruptedException {
        print("Так", false);
    }

    private void print(String text, boolean expectedTurn)
            throws InterruptedException {

        synchronized (lock) {
            while (tickTurn != expectedTurn) {
                lock.wait();
            }

            System.out.println(text);

            // Не позволяем второму потоку напечатать сообщение
            // раньше чем через одну секунду.
            Thread.sleep(1000);

            tickTurn = !tickTurn;
            lock.notifyAll();
        }
    }

    public static void main(String[] args)
            throws InterruptedException {

        TickTock tickTock = new TickTock();

        Thread tickThread = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    tickTock.tick();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread tockThread = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    tickTock.tock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        tickThread.start();
        tockThread.start();
    }
}
```

Флаг:

```java
private boolean tickTurn = true;
```

определяет, какой поток может выполнить печать.

Поток, для которого сейчас не его очередь, ожидает:

```java
while (tickTurn != expectedTurn) {
    lock.wait();
}
```

После вывода сообщения выполняется пауза:

```java
Thread.sleep(1000);
```

Затем очередь передаётся другому потоку:

```java
tickTurn = !tickTurn;
lock.notifyAll();
```

`while`, а не `if`, важен при работе с `wait()`: после пробуждения поток должен повторно проверить условие.

В данном учебном варианте `sleep()` выполняется внутри `synchronized` намеренно: пока текущий поток ждёт одну секунду, второй не сможет напечатать следующее сообщение раньше времени.

В исходной задаче одного `wait()` / `notify()` недостаточно — без отдельного признака очереди нельзя гарантировать, что первым будет именно `Тик` и что сообщения всегда будут строго чередоваться.

:::

---

## 2. Обеспечить чередование вывода foo и bar
**Условие задачи:**  
Дан класс `FooBar`. Одна и та же его инстанция используется двумя потоками:

- поток A вызывает метод `foo()`;
    
- поток B вызывает метод `bar()`.
    

Каждый метод должен выполнить вывод `n` раз.

Необходимо синхронизировать потоки так, чтобы строки `foo` и `bar` выводились строго по очереди:

```text
foobarfoobar...
```

Всего последовательность `foobar` должна повториться ровно `n` раз.

**Код:**

```java
class FooBar {
    private final int n;

    public FooBar(int n) {
        this.n = n;
    }

    public void foo() throws InterruptedException {
        for (int i = 0; i < n; i++) {
            System.out.print("foo");
        }
    }

    public void bar() throws InterruptedException {
        for (int i = 0; i < n; i++) {
            System.out.print("bar");
        }
    }
}
```

Примеры:

```text
n = 1
→ foobar

n = 2
→ foobarfoobar

n = 5
→ foobarfoobarfoobarfoobarfoobar
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Удобно использовать два `Semaphore`.  
💡 Для `foo` создай семафор с одним разрешением, чтобы этот поток мог начать первым.  
💡 Для `bar` создай семафор с нулём разрешений, чтобы он сначала ожидал.  
💡 После вывода `foo` нужно разрешить работу `bar`, а после `bar` — снова разрешить `foo`.  
:::

---

::: details Решение

```java
class FooBar {

    private final int n;

    private final Semaphore fooSemaphore = new Semaphore(1);
    private final Semaphore barSemaphore = new Semaphore(0);

    public FooBar(int n) {
        this.n = n;
    }

    public void foo() throws InterruptedException {
        for (int i = 0; i < n; i++) {
            fooSemaphore.acquire();

            System.out.print("foo");

            barSemaphore.release();
        }
    }

    public void bar() throws InterruptedException {
        for (int i = 0; i < n; i++) {
            barSemaphore.acquire();

            System.out.print("bar");

            fooSemaphore.release();
        }
    }
}
```

Начальные значения семафоров:

```java
new Semaphore(1);
new Semaphore(0);
```

означают, что `foo()` может начать работу сразу, а `bar()` должен ждать.

Последовательность для первой итерации выглядит так:

```text
fooSemaphore = 1
barSemaphore = 0

foo:
acquire() → 0
print("foo")
barSemaphore.release() → 1

bar:
acquire() → 0
print("bar")
fooSemaphore.release() → 1
```

После этого цикл повторяется.

Таким образом, даже если поток `bar` запустится раньше потока `foo`, он остановится на:

```java
barSemaphore.acquire();
```

поскольку изначально разрешений у `barSemaphore` нет.

Для `n = 3` гарантируется порядок:

```text
foo → bar → foo → bar → foo → bar
```

и результат:

```text
foobarfoobarfoobar
```

Методы `acquire()` и `release()` обеспечивают необходимую синхронизацию и видимость изменений между потоками.

Для каждой итерации выполняется константное число операций, поэтому общая сложность — `O(n)`. Дополнительная память — `O(1)`.

Если один из потоков будет прерван и завершит работу раньше второго, второй поток потенциально может остаться ждать разрешения. Для базовой задачи это обычно не требуется обрабатывать отдельно, но в production-коде стоит предусмотреть общий механизм остановки обоих потоков.

:::

---

## 3. Разобраться с потоками и AtomicInteger
**Условие задачи:**  
Дан код с несколькими потоками. Необходимо:

1. определить, что может быть выведено в консоль;
    
2. объяснить проблему текущей реализации;
    
3. реализовать корректный счётчик с помощью `AtomicInteger`.
    

**Код:**

```java
public class Question9 {

    public static class TestClass extends Thread {

        private static int threadCounter = 0;

        @Override
        public void run() {
            ++threadCounter;
            System.out.println(threadCounter);
        }
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            synchronized (TestClass.class) {
                new TestClass().start();
            }
        }
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Блок `synchronized` защищает только вызов `start()`, но не выполнение `run()`.  
💡 Операция `++threadCounter` состоит из чтения, увеличения и записи.  
💡 Несколько потоков могут одновременно прочитать одно значение.  
💡 `volatile` обеспечит видимость, но не сделает инкремент атомарным.  
💡 Для счётчика можно использовать `AtomicInteger.incrementAndGet()`.  
:::

---

::: details Решение

Программа выведет десять строк, поскольку создаются десять потоков. Однако конкретные значения и их порядок не гарантированы.

Возможен корректный вывод:

```text
1
2
3
4
5
6
7
8
9
10
```

Но из-за гонки данных возможны повторяющиеся значения, пропуски и другой порядок:

```text
2
1
3
4
4
5
6
7
8
9
```

Проблема находится в операции:

```java
++threadCounter;
```

Она не является атомарной. Несколько потоков могут прочитать одинаковое значение счётчика и записать одинаковый результат.

Синхронизация в `main()` не решает проблему:

```java
synchronized (TestClass.class) {
    new TestClass().start();
}
```

Метод `start()` запускает поток асинхронно и завершается. Сам метод `run()` выполняется позже и не захватывает монитор `TestClass.class`.

Корректная реализация через `AtomicInteger`:

```java
public class Question9 {

    public static class TestClass extends Thread {

        private static final AtomicInteger THREAD_COUNTER =
                new AtomicInteger();

        @Override
        public void run() {
            int value = THREAD_COUNTER.incrementAndGet();
            System.out.println(value);
        }
    }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            new TestClass().start();
        }
    }
}
```

`incrementAndGet()` атомарно увеличивает счётчик и возвращает новое значение. Поэтому каждое число от `1` до `10` будет получено ровно одним потоком, хотя порядок вывода останется произвольным.

Альтернативный вариант через синхронизацию:

```java
@Override
public void run() {
    synchronized (TestClass.class) {
        threadCounter++;
        System.out.println(threadCounter);
    }
}
```

Здесь увеличение и вывод выполняются внутри одной критической секции.

:::

---

## 4. Сделать обработку задач потокобезопасной
**Условие задачи:**  
Задача сохраняется в общем поле, а затем обрабатывается отдельным методом.

Необходимо сделать составную операцию потокобезопасной и исключить ситуацию, при которой один поток обработает задачу другого.

**Код:**

```java
private Task task;

public synchronized void accumulateTask(Task task) {
    this.task = task;
}

public synchronized void processTask() {
    // обработка task
}

public void doWork(Task task) {
    accumulateTask(task);
    processTask();
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Синхронизация отдельных методов не делает атомарной последовательность их вызовов.  
💡 Между `accumulateTask()` и `processTask()` может выполниться другой поток.  
💡 Можно синхронизировать весь метод `doWork()`.  
💡 Надёжнее отказаться от общего изменяемого поля и передавать задачу напрямую.  
:::

---

::: details Решение

Минимальный вариант — синхронизировать всю составную операцию:

```java
private Task task;

private void accumulateTask(Task task) {
    this.task = task;
}

private void processTask() {
    // обработка this.task
}

public synchronized void doWork(Task task) {
    accumulateTask(task);
    processTask();
}
```

Монитор удерживается на протяжении обоих вызовов, поэтому другой поток не сможет перезаписать поле между сохранением и обработкой задачи.

Предпочтительный вариант — убрать общее изменяемое состояние:

```java
public void doWork(Task task) {
    processTask(task);
}

private void processTask(Task task) {
    // обработка переданной задачи
}
```

Теперь каждый вызов работает со своим аргументом и не зависит от общего поля.

Такой вариант не требует `synchronized`, если `processTask()` не изменяет другое общее состояние и используемые зависимости также потокобезопасны.

:::

---

## 5. Исправить конкурентную запись в ConcurrentHashMap
**Условие задачи:**  
В коде используется `ConcurrentHashMap`, но операция «добавить значение, только если ключ отсутствует» реализована некорректно.

Нужно объяснить проблему и исправить код так, чтобы операция была атомарной.

**Код:**

```java
class Scratch {

    public static void main(String[] args) {
        var concurrentMap =
                new ConcurrentHashMap<String, String>();

        new Thread(() ->
                putValue(concurrentMap, "key", "value1")
        ).start();

        new Thread(() ->
                putValue(concurrentMap, "key", "value2")
        ).start();
    }

    private static void putValue(
            ConcurrentHashMap<String, String> map,
            String key,
            String value
    ) {
        if (!map.containsKey(key)) {
            map.put(key, value);
        }
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 `ConcurrentHashMap` делает потокобезопасными отдельные операции, но не последовательность `containsKey()` + `put()`.  
💡 Для операции «положить, если ключ отсутствует» есть атомарный `putIfAbsent()`.  
:::

---

::: details Решение

Проблема — race condition:

```text
Thread 1: containsKey → false
Thread 2: containsKey → false
Thread 1: put("key", "value1")
Thread 2: put("key", "value2")
```

Оба потока проходят проверку, и второй `put()` может перезаписать значение первого.

Правильный вариант:

```java
class Scratch {

    public static void main(String[] args)
            throws InterruptedException {

        var concurrentMap =
                new ConcurrentHashMap<String, String>();

        Thread t1 = new Thread(() ->
                putValue(concurrentMap, "key", "value1")
        );

        Thread t2 = new Thread(() ->
                putValue(concurrentMap, "key", "value2")
        );

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println(concurrentMap);
    }

    private static void putValue(
            ConcurrentHashMap<String, String> map,
            String key,
            String value
    ) {
        map.putIfAbsent(key, value);
    }
}
```

`putIfAbsent()` атомарно выполняет проверку и запись. В мапе останется значение того потока, который первым успешно записал ключ.

Если значение нужно вычислять только при отсутствии ключа, можно использовать:

```java
map.computeIfAbsent(key, k -> value);
```

Для данной задачи достаточно `putIfAbsent()`.

:::

---

## 6. Реализовать потокобезопасный перевод денег без дедлоков
**Условие задачи:**  
Есть сервис `MoneyTransferService`, работающий в многопоточной среде.

Необходимо реализовать метод:

```java
transfer(Account from, Account to, BigDecimal amount)
```

который:

- атомарно списывает деньги со счёта `from` и зачисляет их на счёт `to`;
    
- не позволяет счёту `from` уйти в минус;
    
- корректно работает при одновременных переводах;
    
- не допускает дедлоков;
    
- принимает только положительную сумму перевода.
    

**Код:**

```java
public class MoneyTransferService {

    public void transfer(
            Account from,
            Account to,
            BigDecimal amount
    ) {
        // TODO
    }
}

public class Account {
    private final int id;
    private BigDecimal balance;

    public Account(int id, BigDecimal initial) {
        this.id = id;
        this.balance = initial;
    }

    public int getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void debit(BigDecimal amount) {
        balance = balance.subtract(amount);
    }

    public void credit(BigDecimal amount) {
        balance = balance.add(amount);
    }
}
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Проверка баланса и изменение обоих счетов должны выполняться внутри одной критической секции.  
💡 Блокировать два счёта нужно всегда в одинаковом порядке.  
💡 Обычно порядок можно определить по `id`.  
💡 Если уникальность `id` не гарантирована, одного сравнения по `id` недостаточно — нужен дополнительный порядок для счетов с одинаковыми `id`.  
💡 Отрицательную или нулевую сумму перевода нужно отклонять.  
:::

---

::: details Решение

```java
public class MoneyTransferService {

    private static final Object TIE_LOCK = new Object();

    public void transfer(
            Account from,
            Account to,
            BigDecimal amount
    ) {
        Objects.requireNonNull(from);
        Objects.requireNonNull(to);
        Objects.requireNonNull(amount);

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Сумма перевода должна быть положительной"
            );
        }

        if (from == to) {
            return;
        }

        if (from.getId() < to.getId()) {
            transferWithLocks(from, to, from, to, amount);
            return;
        }

        if (from.getId() > to.getId()) {
            transferWithLocks(to, from, from, to, amount);
            return;
        }

        int fromHash = System.identityHashCode(from);
        int toHash = System.identityHashCode(to);

        if (fromHash < toHash) {
            transferWithLocks(from, to, from, to, amount);
        } else if (fromHash > toHash) {
            transferWithLocks(to, from, from, to, amount);
        } else {
            synchronized (TIE_LOCK) {
                transferWithLocks(from, to, from, to, amount);
            }
        }
    }

    private void transferWithLocks(
            Account first,
            Account second,
            Account from,
            Account to,
            BigDecimal amount
    ) {
        synchronized (first) {
            synchronized (second) {
                if (from.getBalance().compareTo(amount) < 0) {
                    throw new IllegalArgumentException(
                            "Недостаточно средств на счёте " + from.getId()
                    );
                }

                from.debit(amount);
                to.credit(amount);
            }
        }
    }
}
```

Главная проблема при блокировке двух объектов — возможность дедлока.

Например, два потока выполняют противоположные переводы:

```text
Поток 1: A → B
Поток 2: B → A
```

Если первый поток сначала заблокирует `A`, а второй — `B`, оба могут начать ждать друг друга.

Поэтому счета блокируются в едином порядке:

```java
if (from.getId() < to.getId()) {
    // сначала from, затем to
} else {
    // сначала to, затем from
}
```

Внутри обеих блокировок выполняются и проверка баланса, и изменение счетов:

```java
if (from.getBalance().compareTo(amount) < 0) {
    throw new IllegalArgumentException("Недостаточно средств");
}

from.debit(amount);
to.credit(amount);
```

Это принципиально важно. Если проверить баланс до получения блокировки, два потока могут одновременно увидеть достаточно средств и оба выполнить списание.

Например:

```text
Баланс: 100

Поток 1 хочет списать 80
Поток 2 хочет списать 80
```

Без атомарной проверки оба потока могли бы увидеть `100`, после чего баланс ушёл бы в минус.

Дополнительная обработка:

```java
System.identityHashCode(account)
```

нужна для счетов с одинаковыми `id`. Она задаёт стабильный порядок блокировок и для них.

Теоретически `identityHashCode` двух разных объектов также может совпасть. Для такого редкого случая используется общий:

```java
TIE_LOCK
```

Благодаря этому порядок получения блокировок остаётся однозначным и дедлок не возникает.

Проверка:

```java
if (amount.compareTo(BigDecimal.ZERO) <= 0)
```

тоже необходима: отрицательный перевод фактически поменял бы направление движения денег и мог бы нарушить инвариант баланса.

Сложность одного перевода — `O(1)`, дополнительная память — `O(1)`.

Потокобезопасность такого решения предполагает, что изменение `balance` выполняется только под блокировкой соответствующего `Account`. В реальном коде методы изменения баланса лучше не предоставлять для произвольного внешнего вызова, а инкапсулировать их внутри потокобезопасной модели счёта.

:::

---

