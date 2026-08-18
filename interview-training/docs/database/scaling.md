# Масштабирование БД

::: tip Приоритет
🟡 **Часто спрашивают на middle**, особенно в связке с System Design.
:::

## Vertical vs horizontal scaling

Vertical scaling — дать одному серверу больше CPU/RAM/IO. Horizontal — добавить узлы и распределять нагрузку/данные. Vertical проще, но имеет физический потолок; horizontal сложнее из-за consistency, routing и operations.

## Что такое replication?

Хранение копий данных на нескольких узлах. Частый сценарий: primary принимает writes, replicas обслуживают reads. Репликация повышает availability/read scalability, но появляется replication lag и вопрос, где читать после записи.

## Что такое replication lag?

Задержка между commit на primary и применением изменений на replica. Поэтому сразу после write чтение с replica может вернуть старые данные. Решения: read-your-writes routing на primary, ожидание позиции репликации, архитектурная терпимость к eventual consistency.

## Что такое sharding?

Разделение **разных строк/ключей** по независимым узлам. Shard key определяет, где живёт запись. Это масштабирует объём и write throughput, но усложняет joins, transactions, resharding и hotspots.

## Хороший shard key

Должен равномерно распределять нагрузку, часто участвовать в запросах и не создавать один «горячий» shard. Например, `tenantId` может быть хорош для tenant-local запросов, но очень крупный tenant создаст hotspot.

## Partitioning vs sharding

Partitioning часто означает логическое/физическое разбиение внутри одной СУБД/кластера, которым управляет сама DB. Sharding обычно распределяет данные между отдельными database nodes с routing на уровне платформы/приложения.

## Зачем table partitioning в PostgreSQL?

Управление большими таблицами по диапазону/list/hash, pruning ненужных partitions, удобное удаление старых данных и maintenance. Partitioning не является «бесплатным ускорителем каждого SELECT» — схема должна соответствовать реальным access patterns.

## SQL vs NoSQL

Выбирают не по моде. Relational DB сильны в constraints, joins, transactions и зрелом SQL. Key-value/document/column stores могут быть удобнее для определённых масштабов и access patterns. На интервью важно назвать trade-offs, а не «NoSQL быстрее».
