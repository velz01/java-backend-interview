# Kafka: Topic, Partition, Consumer Group

::: tip Приоритет
🔴 **Must know, если Kafka есть в резюме.**
:::

## Что такое Kafka?

Distributed log/event streaming platform для высокой throughput, durable event storage в retention window, replay и decoupling producers/consumers.

## Broker

Kafka server/node.

## Topic

Логический stream/category records.

## Partition

Упорядоченный append-only log внутри topic. Partition — единица порядка, параллелизма и распределения.

## Где гарантируется порядок?

Только внутри одной partition. Глобальный order по topic с несколькими partitions не гарантируется.

## Offset

Последовательная позиция record внутри partition.

## Consumer Group

Consumers с одним group.id делят partitions. Одна partition в момент времени назначена одному consumer member внутри группы.

## Что если consumers больше partitions?

Лишние consumers idle. Partition count ограничивает max parallelism одной group.

## Что если partitions больше consumers?

Один consumer получает несколько partitions.

## Key

Partitioner использует key, чтобы связанные records обычно попадали в одну partition и сохраняли порядок для entity.

## Что если key = null?

Partitioner может распределять records без привязки к entity key, используя свою strategy. Нельзя рассчитывать на порядок между такими records по всему topic.

## Replication Factor

Число replicas partition на brokers.

## Leader / Follower

Leader обслуживает main read/write path; followers реплицируют log и могут стать leaders при failover.

## ISR

In-Sync Replicas — replicas, считающиеся достаточно синхронизированными с leader.

## Retention

Records могут храниться по времени/размеру даже после consumption. Consumer чтение не «удаляет сообщение» как типичная queue semantics.

## Log compaction

Для compacted topic Kafka старается сохранять последнее value по key (и tombstones в соответствии с semantics), что подходит для state/changelog use cases.

## Kafka vs RabbitMQ

Kafka — durable log/replay/partition scale. RabbitMQ — традиционный message broker с rich routing/queue semantics. Выбор по требованиям, а не «кто быстрее».

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Kafka: Topic, Partition, Consumer Group»](/materials/kafka-fundamentals)
## Углубление для собеседования

### Зачем Kafka делит topic на partitions?

Partition — единица параллелизма и упорядочивания. Несколько partitions позволяют producer/consumer обрабатывать данные параллельно и распределять их по brokers. Но глобального порядка между partitions нет.

### Как выбирается partition для сообщения?

Если partition указана явно — используется она. Если есть key — producer стабильно хэширует ключ, чтобы одинаковые keys обычно попадали в одну partition. Без key producer распределяет записи по алгоритму batching/sticky partitioning реализации.

### Как гарантировать порядок сообщений одного пользователя?

Использовать стабильный key вроде `userId/orderId`, чтобы связанные события шли в одну partition. Kafka гарантирует порядок **внутри partition**, а не во всём topic.

### Что такое Consumer Group?

Группа — набор consumers, совместно читающих topic как один логический подписчик. В пределах группы одну partition в конкретный момент обрабатывает максимум один consumer. Разные consumer groups читают topic независимо.

### Что если consumers больше, чем partitions?

Лишние consumers в группе будут idle для этого topic. Поэтому число partitions ограничивает максимальный параллелизм одной consumer group.

### Что такое offset?

Позиция записи внутри partition. Consumer group сохраняет committed offsets и на их основе понимает, откуда продолжать после restart/rebalance.

### Broker, leader, replica — как связаны?

Partition имеет leader replica и follower replicas. Producer/consumer обычно работают с leader, followers реплицируют данные. При отказе leader кластер может выбрать новую leader replica согласно своим правилам.
