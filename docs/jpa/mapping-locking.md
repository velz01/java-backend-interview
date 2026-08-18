# Entity mapping, cascade и locking

::: tip Приоритет
🟡 **Частые уточнения.**
:::

## owning side / mappedBy

Owning side управляет relationship persistence (foreign key/join table). `mappedBy` указывает inverse side.

## Почему нужно синхронизировать обе стороны bidirectional relation?

Hibernate смотрит на owning side для SQL, но in-memory graph должен оставаться консистентным, иначе application logic видит странное состояние.

## Cascade

Передаёт EntityManager operations на associated entity: PERSIST, MERGE, REMOVE и др.

## Почему CascadeType.ALL опасно ставить автоматически?

REMOVE может удалить shared entity, а cascade semantics должны отражать aggregate ownership, не удобство.

## orphanRemoval

Удаляет child, который исключён из owning aggregate relationship. Это отличается от cascade REMOVE при удалении parent.

## ManyToMany

Удобно для простой join table, но в реальном домене связь часто имеет собственные fields. Тогда join table лучше сделать отдельной Entity.

## @Version

Optimistic locking. UPDATE проверяет version; если row уже изменена, update count не совпадает и provider выбрасывает optimistic lock exception.

## Когда optimistic locking хорош?

Когда conflicts редкие, а держать DB lock долго не хочется.

## Pessimistic locking

DB-level lock на row/resources. Подходит, когда conflict дорогой/частый, но повышает contention/deadlock risk.

## Optimistic retry

Retry должен повторять всю логическую transaction с новым read, а не просто повторно отправлять старый UPDATE.

## equals/hashCode Entity

Опасная тема из-за generated IDs и mutable state. Нельзя механически включать все fields. Стратегия зависит от business key/ID lifecycle и использования Entity в Sets/Maps.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Entity mapping, cascade и locking»](/materials/jpa-mapping-locking)

## Углубление для собеседования

### Owning side и mappedBy

В bidirectional association owning side определяет, какая сторона управляет foreign key/join table. `mappedBy` указывает inverse side. Если менять только inverse collection и не синхронизировать owning side, ожидаемый SQL может не появиться.

### cascade vs orphanRemoval

Cascade передаёт lifecycle operation (persist/remove/merge...) от parent к relation. `orphanRemoval=true` удаляет child, когда он перестал принадлежать parent association. Это разные concepts и их нельзя путать.

### Почему CascadeType.ALL опасно ставить везде?

Remove может неожиданно каскадировать удаление большого графа; в many-to-many особенно легко удалить shared entity. Cascade выбирают по ownership lifecycle, а не как boilerplate.

### Optimistic locking через @Version

UPDATE включает старую version в WHERE и увеличивает version. Если другая transaction уже изменила строку, affected rows = 0 и ORM выбрасывает optimistic lock exception. Это предотвращает silent lost update без долгого DB lock.

### Pessimistic locking

ORM просит DB lock, например аналог `SELECT FOR UPDATE`. Конкурент ждёт или получает timeout. Полезно при частых конфликтах и критических read-modify-write сценариях, но увеличивает contention/deadlock risk.
