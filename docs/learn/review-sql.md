---
title: "Code Review — SQL / Оптимизация"
outline: [2, 3]
---
# Code Review — SQL / Оптимизация

Теория: [перейти к соответствующей теме](/learn/sql).

## 1. Оптимизировать медленный SQL-запрос
**Условие задачи:**  
Даны таблицы `customers` и `orders`.

**Код:**

```sql
CREATE TABLE customers (
    customer_id NUMERIC(15) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    registration_date TIMESTAMP,
    premium_member BOOLEAN
);

CREATE TABLE orders (
    order_id NUMERIC(15) PRIMARY KEY,
    customer_id NUMERIC(15) REFERENCES customers(customer_id),
    order_date TIMESTAMP,
    total_amount DECIMAL(12, 2),
    status VARCHAR(20)
);
```

Медленно выполняется запрос:

```sql
SELECT
    c.name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
WHERE o.status = 'Processing'
  AND c.premium_member = TRUE
ORDER BY o.order_date DESC;
```

Необходимо предложить способы его оптимизации.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Сначала посмотри реальный план выполнения через `EXPLAIN ANALYZE`.  
💡 Основная фильтрация выполняется по `orders.status` и `customers.premium_member`.  
💡 Также используются `customer_id` для `JOIN` и `order_date` для сортировки.  
💡 Подбирай индексы под фильтрацию, соединение и сортировку.  
💡 Наличие `Seq Scan` само по себе не означает проблему — на больших выборках он может быть оптимальным.  
:::

---

::: details Решение

Сам запрос переписывать необязательно — его логика уже достаточно простая. В первую очередь нужно проверить план выполнения:

```sql
EXPLAIN ANALYZE
SELECT
    c.name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
WHERE o.status = 'Processing'
  AND c.premium_member = TRUE
ORDER BY o.order_date DESC;
```

Для таблицы `orders` полезен составной индекс:

```sql
CREATE INDEX idx_orders_status_date_customer
    ON orders (
        status,
        order_date DESC,
        customer_id
    );
```

Он помогает:

- отфильтровать строки по `status`;
    
- получить строки в порядке `order_date DESC`;
    
- использовать `customer_id` для соединения с `customers`.
    

В PostgreSQL, если запрос почти всегда ищет именно статус `Processing`, можно создать более компактный частичный индекс:

```sql
CREATE INDEX idx_orders_processing_date_customer
    ON orders (
        order_date DESC,
        customer_id
    )
    WHERE status = 'Processing';
```

Для премиум-клиентов также можно использовать частичный индекс:

```sql
CREATE INDEX idx_customers_premium
    ON customers (customer_id)
    WHERE premium_member = TRUE;
```

При этом `customer_id` уже является `PRIMARY KEY`, поэтому отдельный индекс на него создавать не нужно.

После создания индексов необходимо повторно проверить план:

```sql
EXPLAIN ANALYZE
SELECT
    c.name,
    c.email,
    o.order_id,
    o.order_date,
    o.total_amount
FROM customers c
JOIN orders o
    ON c.customer_id = o.customer_id
WHERE o.status = 'Processing'
  AND c.premium_member = TRUE
ORDER BY o.order_date DESC;
```

Важно смотреть не только на `Seq Scan` или `Index Scan`, а на фактическое время выполнения, количество обработанных строк, способ соединения и наличие отдельной сортировки.

Для PostgreSQL также полезно обновить статистику:

```sql
ANALYZE customers;
ANALYZE orders;
```

Если запрос выполняется очень часто, а данные подходят для некоторой задержки обновления, можно дополнительно рассмотреть материализованное представление. Но начинать оптимизацию следует с `EXPLAIN ANALYZE` и подходящих индексов.

:::

---

## 2. Подобрать индекс для медленного запроса
**Условие задачи:**  
В приложении медленно выполняется запрос:

```sql
SELECT id, name
FROM users
WHERE name = 'Artem'
  AND create_date = '2024-10-28'
  AND status = 'ACTIVE';
```

Необходимо определить, какой индекс стоит добавить для ускорения этого запроса.

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Запрос фильтрует строки одновременно по трём колонкам.  
💡 Для такого запроса обычно подходит составной индекс по колонкам из `WHERE`.  
💡 Все три условия используют сравнение по равенству, поэтому для данного конкретного запроса порядок этих колонок в индексе обычно не является критичным.  
💡 Порядок становится важнее, если этот же индекс должен использоваться и другими запросами только по части колонок.  
💡 После создания индекса проверь план выполнения через `EXPLAIN ANALYZE`.  
:::

---

::: details Решение

Для данного запроса можно создать составной индекс:

```sql
CREATE INDEX idx_users_name_create_date_status
    ON users (name, create_date, status);
```

Он соответствует условиям фильтрации:

```sql
WHERE name = 'Artem'
  AND create_date = '2024-10-28'
  AND status = 'ACTIVE'
```

и позволяет СУБД искать подходящие строки по индексу вместо полного просмотра таблицы, если использование индекса действительно выгодно для имеющихся данных.

Поскольку во всех трёх условиях используется `=`, для именно этого запроса варианты:

```sql
(name, create_date, status)
```

и, например:

```sql
(create_date, status, name)
```

могут одинаково эффективно ограничивать выборку по всем трём колонкам.

Выбирать порядок только по правилу «самая селективная колонка всегда первая» не обязательно. Порядок особенно важен, если индекс должен поддерживать также запросы по его левому префиксу. Например, индекс:

```sql
CREATE INDEX idx_users_name_create_date_status
    ON users (name, create_date, status);
```

может быть полезен и для запросов только по `name` или по `name` вместе с `create_date`.

После создания индекса следует проверить реальный план:

```sql
EXPLAIN ANALYZE
SELECT id, name
FROM users
WHERE name = 'Artem'
  AND create_date = '2024-10-28'
  AND status = 'ACTIVE';
```

При этом наличие `Seq Scan` само по себе не означает проблему: если таблица небольшая или условию соответствует значительная часть строк, полный просмотр таблицы может оказаться дешевле использования индекса.

:::

---

## 3. Оптимизировать частый запрос заказов пользователя
**Условие задачи:**  
В системе часто выполняется запрос к таблице `orders`. При его выполнении наблюдается высокая нагрузка на диск.

Необходимо объяснить, как оптимизировать запрос и уменьшить количество операций чтения.

**Код:**

```sql
SELECT
    status,
    created_at
FROM orders
WHERE user_id = :userId
  AND created_at >= now() - interval '30 days'
ORDER BY created_at DESC
LIMIT 20;
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Индекс должен учитывать одновременно фильтрацию по `user_id`, диапазон по `created_at` и сортировку по дате.  
💡 Здесь подходит составной индекс `(user_id, created_at DESC)`.  
💡 Благодаря `LIMIT 20` СУБД сможет остановить чтение после нахождения первых подходящих строк.  
💡 В PostgreSQL можно добавить `status` через `INCLUDE`, чтобы создать покрывающий индекс.  
💡 Реальный эффект нужно проверить через `EXPLAIN (ANALYZE, BUFFERS)`.  
:::

---

::: details Решение

Основная оптимизация — создать составной индекс:

```sql
CREATE INDEX idx_orders_user_created_at
    ON orders (user_id, created_at DESC);
```

Такой индекс хорошо соответствует запросу:

```text
user_id = ...         → точное условие
created_at >= ...     → диапазон
ORDER BY created_at   → порядок внутри user_id
LIMIT 20              → нужны только первые 20 строк
```

СУБД может быстро найти записи конкретного пользователя и читать их начиная с самых свежих, вместо сканирования большого количества строк и отдельной сортировки.

Для PostgreSQL можно сделать покрывающий индекс:

```sql
CREATE INDEX idx_orders_user_created_at_cover
    ON orders (user_id, created_at DESC)
    INCLUDE (status);
```

Все данные, необходимые запросу, тогда находятся в индексе:

- `user_id`;
    
- `created_at`;
    
- `status`.
    

Это создаёт возможность для `Index Only Scan`, то есть чтения результата непосредственно из индекса без обращения к основной таблице.

Однако `Index Only Scan` не гарантирован: в PostgreSQL он также зависит от состояния visibility map и активности изменений в таблице.

Проверять результат оптимизации лучше так:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT
    status,
    created_at
FROM orders
WHERE user_id = :userId
  AND created_at >= now() - interval '30 days'
ORDER BY created_at DESC
LIMIT 20;
```

Стоит обратить внимание на:

- `Index Scan` или `Index Only Scan`;
    
- отсутствие лишней операции `Sort`;
    
- количество прочитанных страниц (`shared read`);
    
- фактическое количество обработанных строк;
    
- время выполнения.
    

Если таблица очень большая, дополнительно можно рассмотреть партиционирование по `created_at`, особенно если большинство запросов работают только с ограниченным диапазоном дат. Но начинать оптимизацию следует именно с подходящего составного индекса и проверки плана выполнения.

:::

---

## 4. Оптимизировать запрос к большой таблице orders
**Условие задачи:**  
В PostgreSQL есть таблица `orders`, содержащая миллионы записей.

Запрос:

- фильтрует заказы по `status`;
    
- выбирает записи за заданный диапазон дат;
    
- сортирует их по `created_at` в порядке убывания;
    
- возвращает первые 100 строк.
    

Необходимо определить причину медленной работы запроса и предложить оптимизацию.

**Код:**

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);
```

```sql
SELECT *
FROM orders
WHERE status = 'COMPLETED'
  AND created_at BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY created_at DESC
LIMIT 100;
```

---

**Спойлеры к решению**  
---

::: details Подсказки  
💡 Для начала проверь план выполнения через `EXPLAIN (ANALYZE, BUFFERS)`.  
💡 Индекс должен учитывать точное условие по `status` и диапазон по `created_at`.  
💡 Составной индекс `(status, created_at DESC)` также помогает получить строки сразу в нужном порядке.  
💡 Для диапазона по `TIMESTAMP` лучше использовать полуоткрытый интервал: `>=` начало периода и `<` начало следующего периода.  
💡 Если запросы почти всегда выполняются только для `status = 'COMPLETED'`, можно рассмотреть частичный индекс.  
:::

---

::: details Решение

Для такого запроса подходит составной индекс:

```sql
CREATE INDEX idx_orders_status_created_at
    ON orders (status, created_at DESC);
```

В индексе сначала идёт `status`, по которому используется точное сравнение:

```sql
status = 'COMPLETED'
```

После него расположен `created_at`, по которому одновременно выполняются диапазонная фильтрация и сортировка:

```sql
created_at >= ...
created_at < ...
ORDER BY created_at DESC
```

Благодаря этому PostgreSQL может читать подходящие строки уже в нужном порядке и остановиться после получения первых `100` записей.

Сам запрос лучше записать через полуоткрытый диапазон:

```sql
SELECT *
FROM orders
WHERE status = 'COMPLETED'
  AND created_at >= TIMESTAMP '2024-01-01'
  AND created_at < TIMESTAMP '2024-02-01'
ORDER BY created_at DESC
LIMIT 100;
```

Исходное условие:

```sql
created_at BETWEEN '2024-01-01' AND '2024-01-31'
```

для поля `TIMESTAMP` эквивалентно верхней границе около:

```text
2024-01-31 00:00:00
```

поэтому записи позднее полуночи 31 января не попадут в результат.

Если запросы часто выполняются именно для `COMPLETED`, можно использовать более компактный частичный индекс:

```sql
CREATE INDEX idx_orders_completed_created_at
    ON orders (created_at DESC)
    WHERE status = 'COMPLETED';
```

Он содержит только завершённые заказы и поэтому может занимать меньше места и требовать меньше чтений.

Проверить результат оптимизации можно так:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE status = 'COMPLETED'
  AND created_at >= TIMESTAMP '2024-01-01'
  AND created_at < TIMESTAMP '2024-02-01'
ORDER BY created_at DESC
LIMIT 100;
```

В плане стоит проверить:

- используется ли `Index Scan`;
    
- отсутствует ли лишняя операция `Sort`;
    
- сколько строк реально просматривается до получения `LIMIT 100`;
    
- сколько страниц пришлось прочитать с диска.
    

Основная оптимизация для этого запроса — индекс `(status, created_at DESC)` либо частичный индекс по `created_at` для `status = 'COMPLETED'`.

:::

---

