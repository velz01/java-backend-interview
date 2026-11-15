---
title: "Live Coding — SQL"
outline: [2, 3]
---
# Live Coding — SQL

Теория: [перейти к соответствующей теме](/learn/sql).

## 1. Найти департаменты без сотрудников
**Условие задачи:**  
Даны две таблицы:

- `Department(id, name)` — департаменты;
    
- `Employee(id, salary, department_id)` — сотрудники.
    

Необходимо вывести все департаменты, в которых нет ни одного сотрудника.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Удобно использовать `NOT EXISTS`: для каждого департамента проверить отсутствие связанных сотрудников.  
💡 Альтернативный вариант — `LEFT JOIN` с последующей проверкой, что соответствующая строка сотрудника не найдена.  
💡 `INNER JOIN` здесь не подходит, поскольку он исключит департаменты без сотрудников.  
:::

---

::: details Решение

Основной вариант через `NOT EXISTS`:

```sql
SELECT
    d.id,
    d.name
FROM Department d
WHERE NOT EXISTS (
    SELECT 1
    FROM Employee e
    WHERE e.department_id = d.id
);
```

Для каждого департамента подзапрос ищет хотя бы одного связанного сотрудника:

```sql
WHERE e.department_id = d.id
```

`NOT EXISTS` оставляет только те департаменты, для которых такой сотрудник не найден.

Альтернативный вариант через `LEFT JOIN`:

```sql
SELECT
    d.id,
    d.name
FROM Department d
LEFT JOIN Employee e
    ON e.department_id = d.id
WHERE e.department_id IS NULL;
```

`LEFT JOIN` сохраняет все департаменты. Если сотрудников в департаменте нет, соответствующей строки из `Employee` не будет, поэтому поля этой таблицы окажутся `NULL`.

Оба варианта решают задачу, но `NOT EXISTS` особенно хорошо отражает её смысл: выбрать департаменты, для которых не существует ни одного сотрудника.

:::

---

## 2. Найти второй по величине оклад
**Условие задачи:**  
Дана таблица `Employee(id, email, salary)`.

Необходимо получить второй по величине **уникальный** оклад сотрудника.

Если максимальный оклад встречается у нескольких сотрудников, он всё равно считается одним значением.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Можно найти максимальный оклад, который меньше максимального оклада в таблице.  
💡 Другой вариант — использовать `DENSE_RANK()` по убыванию зарплаты.  
💡 Повторяющиеся значения зарплаты должны иметь одинаковый ранг.  
💡 Значения `NULL` лучше исключить из поиска.  
:::

---

::: details Решение

Вариант через подзапрос:

```sql
SELECT MAX(salary) AS second_highest_salary
FROM Employee
WHERE salary < (
    SELECT MAX(salary)
    FROM Employee
);
```

Сначала определяется максимальный оклад, затем выбирается максимальное значение среди всех окладов, которые меньше него.

Вариант через `DENSE_RANK()`:

```sql
SELECT salary AS second_highest_salary
FROM (
    SELECT
        salary,
        DENSE_RANK() OVER (
            ORDER BY salary DESC
        ) AS salary_rank
    FROM (
        SELECT DISTINCT salary
        FROM Employee
        WHERE salary IS NOT NULL
    ) salaries
) ranked
WHERE salary_rank = 2;
```

`DENSE_RANK()` присваивает одинаковым зарплатам один и тот же ранг без пропусков:

```text
100000 → 1
100000 → 1
90000  → 2
80000  → 3
```

Если второго уникального оклада нет, оба варианта вернут отсутствие значения: первый — `NULL`, второй — пустой результат.

:::

---

## 3. Найти повторяющиеся email
**Условие задачи:**  
Дана таблица `Employee(id, email, salary)`.

Необходимо найти все `email`, которые встречаются в таблице более одного раза.

Пример:

```text
email
-----
a
b
c
a
```

Результат:

```text
a
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сгруппируй строки по `email`.  
💡 Для каждой группы посчитай количество записей через `COUNT(*)`.  
💡 Для фильтрации агрегированных данных используй `HAVING`.  
💡 Оставь только группы, в которых количество записей больше одного.  
:::

---

::: details Решение

Основной вариант через `GROUP BY` и `HAVING`:

```sql
SELECT email
FROM Employee
GROUP BY email
HAVING COUNT(*) > 1;
```

Сначала строки группируются по адресу электронной почты:

```sql
GROUP BY email
```

Затем остаются только те группы, в которых найдено больше одной записи:

```sql
HAVING COUNT(*) > 1
```

Если также нужно увидеть количество повторений:

```sql
SELECT
    email,
    COUNT(*) AS email_count
FROM Employee
GROUP BY email
HAVING COUNT(*) > 1;
```

Альтернативный вариант через оконную функцию:

```sql
SELECT DISTINCT email
FROM (
    SELECT
        email,
        COUNT(*) OVER (
            PARTITION BY email
        ) AS email_count
    FROM Employee
) e
WHERE email_count > 1;
```

Если `NULL` в поле `email` не должен считаться дубликатом, нужно дополнительно исключить такие строки через `WHERE email IS NOT NULL`.

:::

---

## 4. Показать разницу между WHERE и HAVING
**Условие задачи:**  
Необходимо привести реалистичный SQL-пример, в котором одновременно используются `WHERE` и `HAVING`, и показать разницу между ними.

`WHERE` должен фильтровать отдельные строки до группировки, а `HAVING` — получившиеся группы после `GROUP BY`.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 `WHERE` применяется до `GROUP BY` и отбрасывает отдельные строки.  
💡 `HAVING` применяется к уже сформированным группам.  
💡 Например, можно учитывать только активных сотрудников, а затем оставить отделы с высокой средней зарплатой и достаточным количеством сотрудников.  
:::

---

::: details Решение

Предположим, есть таблица `employees` с колонками `department_id`, `salary` и `status`.

```sql
SELECT
    department_id,
    AVG(salary) AS avg_salary,
    COUNT(*) AS employee_count
FROM employees
WHERE status = 'ACTIVE'
GROUP BY department_id
HAVING AVG(salary) > 50000
   AND COUNT(*) >= 3;
```

Условие:

```sql
WHERE status = 'ACTIVE'
```

срабатывает **до группировки** и оставляет только активных сотрудников.

Затем:

```sql
GROUP BY department_id
```

объединяет оставшиеся строки по отделам.

После вычисления агрегатов:

```sql
HAVING AVG(salary) > 50000
   AND COUNT(*) >= 3
```

оставляет только те отделы, где среди активных сотрудников:

- средняя зарплата превышает `50000`;
    
- количество сотрудников не меньше трёх.
    

Главное отличие:

```text
WHERE  — фильтрует строки до GROUP BY
HAVING — фильтрует группы после GROUP BY
```

Именно поэтому условие по обычному полю `status` естественно задавать через `WHERE`, а условия по `AVG()` и `COUNT()` — через `HAVING`.

:::

---

## 5. Найти сотрудников с максимальной зарплатой в каждом департаменте
**Условие задачи:**  
Даны таблицы `departments` и `employees`.

Необходимо для каждого департамента вывести сотрудников, получающих максимальную зарплату в своём департаменте:

- название департамента;
    
- имя сотрудника;
    
- зарплату.
    

Если несколько сотрудников получают одинаковую максимальную зарплату, нужно вывести их всех.

**Код:**

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT REFERENCES departments(id),
    salary NUMERIC(10, 2)
);
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Используй оконную функцию `RANK()` или `DENSE_RANK()`.  
💡 Раздели сотрудников по `department_id` через `PARTITION BY`.  
💡 Внутри каждого департамента отсортируй сотрудников по `salary DESC`.  
💡 Сотрудники с максимальной зарплатой получат ранг `1`.  
:::

---

::: details Решение

Вариант через оконную функцию:

```sql
WITH ranked_employees AS (
    SELECT
        d.name AS department,
        e.name AS employee,
        e.salary,
        RANK() OVER (
            PARTITION BY e.department_id
            ORDER BY e.salary DESC
        ) AS salary_rank
    FROM employees e
    JOIN departments d
        ON d.id = e.department_id
)
SELECT
    department,
    employee,
    salary
FROM ranked_employees
WHERE salary_rank = 1
ORDER BY department, employee;
```

Оконная функция:

```sql
RANK() OVER (
    PARTITION BY e.department_id
    ORDER BY e.salary DESC
)
```

отдельно ранжирует сотрудников внутри каждого департамента.

Сотрудники с максимальной зарплатой получают ранг `1`.

Например:

```text
department | employee | salary
-----------+----------+-------
IT         | Alex     | 200000
IT         | Ivan     | 200000
HR         | Anna     | 150000
```

Если в одном департаменте несколько сотрудников имеют одинаковую максимальную зарплату, `RANK()` вернёт всех таких сотрудников.

:::

---

## 6. Посчитать выручку каждого продавца
**Условие задачи:**  
Даны таблицы `Salespersons`, `Customers` и `Orders`.

Необходимо вывести:

- идентификатор каждого продавца;
    
- общую сумму заказов его клиентов.
    

В результате должны присутствовать все продавцы, включая тех, у кого нет заказов. Для таких продавцов сумма должна быть равна `0`.

Результат нужно отсортировать по `id` продавца.

**Код:**

```sql
CREATE TABLE Salespersons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE Customers (
    id SERIAL PRIMARY KEY,
    salesperson_id INT
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    customer_id INT,
    price INT
);
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Начинай выборку с таблицы `Salespersons`, чтобы сохранить всех продавцов.  
💡 Соедини продавцов с клиентами, а клиентов — с заказами через `LEFT JOIN`.  
💡 Для подсчёта выручки используй `SUM(o.price)`.  
💡 Для продавцов без заказов `SUM()` вернёт `NULL`, поэтому используй `COALESCE()`.  
💡 Группируй результат по продавцу и отсортируй по его `id`.  
:::

---

::: details Решение

```sql
SELECT
    s.id AS salesperson_id,
    COALESCE(SUM(o.price), 0) AS total_earned
FROM Salespersons s
LEFT JOIN Customers c
    ON c.salesperson_id = s.id
LEFT JOIN Orders o
    ON o.customer_id = c.id
GROUP BY s.id
ORDER BY s.id;
```

Первый `LEFT JOIN` сохраняет продавцов, у которых нет клиентов:

```sql
LEFT JOIN Customers c
    ON c.salesperson_id = s.id
```

Второй `LEFT JOIN` сохраняет клиентов, у которых нет заказов:

```sql
LEFT JOIN Orders o
    ON o.customer_id = c.id
```

После этого `SUM(o.price)` подсчитывает общую стоимость всех заказов клиентов конкретного продавца.

Для продавца без заказов результат `SUM()` будет равен `NULL`, поэтому:

```sql
COALESCE(SUM(o.price), 0)
```

заменяет его на `0`.

:::

---

## 7. Удалить дублирующиеся email, оставив одну запись
**Условие задачи:**  
Дана таблица `emails(id, email)`, в которой один и тот же email может встречаться несколько раз.

Необходимо удалить дубликаты и оставить только одну запись для каждого уникального email.

**Код:**

```sql
CREATE TABLE emails (
    id INT,
    email VARCHAR(30)
);

INSERT INTO emails(id, email)
VALUES
    (1, 'aa@yandex.ru'),
    (2, 'bb@yandex.ru'),
    (3, 'aa@yandex.ru');
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сначала пронумеруй строки внутри каждой группы одинаковых `email`.  
💡 Для этого удобно использовать `ROW_NUMBER()`.  
💡 Первую строку в каждой группе нужно оставить, остальные удалить.  
💡 В PostgreSQL для однозначного удаления конкретной строки можно использовать `ctid`.  
:::

---

::: details Решение

В PostgreSQL можно использовать `ROW_NUMBER()` вместе с `ctid`:

```sql
WITH duplicates AS (
    SELECT
        ctid,
        ROW_NUMBER() OVER (
            PARTITION BY email
            ORDER BY id
        ) AS rn
    FROM emails
)
DELETE FROM emails
WHERE ctid IN (
    SELECT ctid
    FROM duplicates
    WHERE rn > 1
);
```

`ROW_NUMBER()` нумерует записи отдельно для каждого email:

```text
email         | rn
--------------+---
aa@yandex.ru  | 1
aa@yandex.ru  | 2
bb@yandex.ru  | 1
```

Удаляются только строки с:

```sql
rn > 1
```

В результате останется:

```text
id | email
---+-------------
1  | aa@yandex.ru
2  | bb@yandex.ru
```

Если `id` гарантированно уникален, запрос можно написать проще:

```sql
WITH duplicates AS (
    SELECT
        id,
        ROW_NUMBER() OVER (
            PARTITION BY email
            ORDER BY id
        ) AS rn
    FROM emails
)
DELETE FROM emails
WHERE id IN (
    SELECT id
    FROM duplicates
    WHERE rn > 1
);
```

После удаления дублей имеет смысл добавить ограничение, чтобы они больше не появлялись:

```sql
ALTER TABLE emails
ADD CONSTRAINT uq_emails_email UNIQUE (email);
```

:::

---

## 8. Найти сотрудников с зарплатой выше, чем у руководителя
**Условие задачи:**  
Дана таблица `EMPLOYEE(ID, NAME, SALARY, DEPARTMENT_ID, CHIEF_ID)`.

Необходимо вывести сотрудников, чья зарплата выше зарплаты их непосредственного руководителя.

Поле `CHIEF_ID` содержит `ID` руководителя сотрудника.

**Код:**

```sql
CREATE TABLE EMPLOYEE (
    ID INT,
    NAME VARCHAR(256),
    SALARY INT,
    DEPARTMENT_ID INT,
    CHIEF_ID INT
);

-- Пример данных
-- ID | NAME      | SALARY | DEPARTMENT_ID | CHIEF_ID
-- ---+-----------+--------+---------------+---------
-- 1  | Иванов    | 150    | 1             | NULL
-- 2  | Петров    | 250    | 1             | 1
-- 3  | Сидоров   | 550    | 1             | 1
-- 4  | Медведев  | 350    | 2             | 6
-- 5  | Соколов   | 350    | 2             | 6
-- 6  | Рыбников  | 150    | 2             | NULL
-- 7  | Арбузов   | 450    | 3             | NULL
-- 8  | Орехов    | 650    | 3             | 7
-- 9  | Дынин     | 50     | 3             | 7
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Используй `self join`: соедини таблицу `EMPLOYEE` саму с собой.  
💡 Один алиас будет представлять сотрудника, второй — его руководителя.  
💡 Связь между ними задаётся условием `e.CHIEF_ID = c.ID`.  
💡 После соединения сравни зарплаты сотрудника и руководителя.  
:::

---

::: details Решение

```sql
SELECT
    e.NAME AS employee_name,
    e.SALARY AS employee_salary,
    c.NAME AS chief_name,
    c.SALARY AS chief_salary
FROM EMPLOYEE e
JOIN EMPLOYEE c
    ON c.ID = e.CHIEF_ID
WHERE e.SALARY > c.SALARY;
```

Таблица соединяется сама с собой:

```sql
JOIN EMPLOYEE c
    ON c.ID = e.CHIEF_ID
```

`e` представляет сотрудника, а `c` — его непосредственного руководителя.

После этого остаются только сотрудники, чья зарплата выше зарплаты руководителя:

```sql
WHERE e.SALARY > c.SALARY
```

Для приведённых данных результат будет таким:

```text
employee_name | employee_salary | chief_name | chief_salary
--------------+-----------------+------------+-------------
Петров        | 250             | Иванов     | 150
Сидоров       | 550             | Иванов     | 150
Медведев      | 350             | Рыбников   | 150
Соколов       | 350             | Рыбников   | 150
Орехов        | 650             | Арбузов    | 450
```

Сотрудники с `CHIEF_ID = NULL` автоматически не попадут в результат, поскольку для них не найдётся строка руководителя при `INNER JOIN`.

:::

---

