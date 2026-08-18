# SQL: JOIN, GROUP BY, CTE и окна

::: tip Приоритет
🔴 **Обязательно знать.** SQL на собеседованиях часто просят писать руками.
:::

## INNER JOIN vs LEFT JOIN

INNER JOIN оставляет только совпавшие строки. LEFT JOIN сохраняет все строки слева и подставляет NULL справа, если match нет.

## RIGHT/FULL JOIN

RIGHT — симметричен LEFT относительно сторон. FULL OUTER JOIN сохраняет несовпавшие строки с обеих сторон.

## WHERE vs HAVING

WHERE фильтрует строки до aggregation. HAVING фильтрует уже сформированные groups.

## GROUP BY

Группирует строки для aggregation. В SELECT обычно остаются grouped columns и aggregate expressions.

## UNION vs UNION ALL

UNION удаляет duplicates, что требует дополнительной работы. UNION ALL просто объединяет results и обычно дешевле.

## EXISTS vs IN

Оба могут выражать membership/existence. `NOT IN` с NULL легко даёт неожиданный UNKNOWN, поэтому `NOT EXISTS` часто безопаснее семантически.

## Подзапрос vs JOIN

Нет универсального «JOIN всегда быстрее». Optimizer может преобразовать запрос. Важно смотреть execution plan и ясность SQL.

## CTE

`WITH` задаёт именованный subquery, улучшает читаемость и позволяет recursive queries. Конкретное materialization behavior зависит от PostgreSQL/version/query.

## Window function

Считает значение по окну строк, не схлопывая их как GROUP BY.

## ROW_NUMBER / RANK / DENSE_RANK

- ROW_NUMBER — уникальная последовательность.
- RANK — одинаковый ранг ties + пропуски.
- DENSE_RANK — одинаковый ранг ties без пропусков.

## LAG / LEAD

Дают доступ к предыдущей/следующей строке внутри window order; полезны для сравнений с предыдущим событием.

## NULL и три значения логики

Сравнение `col = NULL` неправильно; используют `IS NULL`. SQL condition может быть TRUE/FALSE/UNKNOWN, что особенно важно в NOT IN и сложных predicates.

## DELETE vs TRUNCATE

DELETE — DML, может удалять по WHERE, логируется построчно в терминах операции и участвует в MVCC. TRUNCATE быстро очищает таблицу целиком и имеет другую locking/transaction semantics.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «SQL: JOIN, GROUP BY, CTE и окна»](/materials/sql-basics)

## Углубление для собеседования

### WHERE vs HAVING

`WHERE` фильтрует строки до группировки, `HAVING` — уже сформированные группы после `GROUP BY`. Их можно использовать вместе: сначала сократить исходные строки, потом отфильтровать агрегаты.

### INNER vs LEFT JOIN

INNER оставляет только совпавшие строки обеих сторон. LEFT возвращает все строки слева и совпадения справа; если совпадения нет — right columns будут `NULL`. Условие на right table в `WHERE` может случайно превратить LEFT JOIN по смыслу в INNER JOIN.

### UNION vs UNION ALL

`UNION ALL` просто объединяет результаты и сохраняет дубликаты. `UNION` дополнительно удаляет дубликаты, что требует лишней работы (sort/hash), поэтому если уникальность не нужна — `UNION ALL` обычно дешевле.

### CTE

`WITH` даёт имя подзапросу и улучшает читаемость сложных запросов; recursive CTE решает иерархии/графовые обходы. В современных PostgreSQL обычный CTE не стоит автоматически считать optimization barrier — planner умеет inline в подходящих случаях.

### Оконные функции

Считают значение по набору строк, **не схлопывая** строки как `GROUP BY`. `PARTITION BY` делит набор на окна, `ORDER BY` задаёт порядок внутри окна. Типичные функции: `row_number`, `rank`, `lag`, `lead`, агрегаты `sum(...) over (...)`.

### DELETE vs TRUNCATE

`DELETE` удаляет строки как DML и может фильтровать `WHERE`. `TRUNCATE` очищает таблицу целиком как отдельная операция, обычно быстрее для полного удаления и имеет другую locking/trigger/sequence semantics в зависимости от СУБД. На интервью лучше уточнить конкретную DB.

### PreparedStatement зачем нужен?

Отделяет SQL structure от parameters, помогает против SQL injection и позволяет driver/DB повторно использовать prepared plan/protocol optimizations. Нельзя безопасно строить SQL через конкатенацию пользовательского ввода.
