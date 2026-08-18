# Миграции схемы: Liquibase и Flyway

## Зачем нужны migration tools?

Чтобы изменения schema были версионированы рядом с кодом и воспроизводимо применялись на dev/test/stage/prod. Ручное изменение production DB через GUI ломает auditability и repeatability.

## Что делает Liquibase?

Хранит changelog с changesets и ведёт служебные таблицы, где отмечает уже применённые изменения и блокирует параллельный запуск миграций. Это позволяет не выполнять один changeset повторно.

## Что обычно хранится в DATABASECHANGELOG?

Идентификатор changeset, автор, файл/путь, checksum, порядок/время выполнения и другой metadata. Конкретный набор колонок зависит от версии.

## Зачем DATABASECHANGELOGLOCK?

Чтобы два instance приложения не начали одновременно менять schema одной базы.

## Flyway vs Liquibase

Flyway часто проще и SQL-first; Liquibase предлагает богатый declarative changelog и много типов changes. Выбор зависит от команды. На интервью важнее понимать versioned migrations, ordering, rollback strategy и zero-downtime changes.

## Что такое backward-compatible migration?

Изменение, при котором старая и новая версии приложения могут некоторое время работать с одной схемой. Например: сначала добавить nullable column, затем выкатить код, заполнить данные и только потом ужесточить constraint. Это база безопасного rolling deployment.
