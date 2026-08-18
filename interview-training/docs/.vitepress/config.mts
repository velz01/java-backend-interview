import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Java Backend Interview',
  description: 'Полная база подготовки к Java Backend собеседованиям',
  lang: 'ru-RU',
  base: process.env.BASE_PATH || '/',
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'На странице' },
    nav: [
      { text: 'План', link: '/learning-path' },
      { text: 'Java', link: '/java-core/' },
      { text: 'Spring', link: '/spring/' },
      { text: 'SQL', link: '/sql/' },
      { text: 'Kafka', link: '/kafka/' },
      { text: 'Моки', link: '/interviews/' }
    ],
    sidebar: [
      { text: 'Старт', collapsed: false, items: [
        { text: 'Главная', link: '/' },
        { text: 'План подготовки', link: '/learning-path' },
        { text: 'Чек-лист перед интервью', link: '/interview-checklist' }
      ]},
      { text: 'Java', collapsed: false, items: [
        { text: 'Java Core', link: '/java-core/' },
        { text: 'ООП', link: '/java-core/oop' },
        { text: 'equals / hashCode', link: '/java-core/equals-hashcode' },
        { text: 'String / String Pool', link: '/java-core/strings' },
        { text: 'Примитивы / Wrappers', link: '/java-core/primitives-wrappers' },
        { text: 'Annotations / Reflection', link: '/java-core/annotations-reflection' },
        { text: 'IO / NIO', link: '/java-core/io-nio' },
        { text: 'Collections', link: '/collections/' },
        { text: 'Выбор коллекции', link: '/collections/overview' },
        { text: 'HashMap', link: '/collections/hashmap' },
        { text: 'Ordering / TreeMap', link: '/collections/ordering' },
        { text: 'Generics', link: '/generics-streams/generics' },
        { text: 'Exceptions', link: '/generics-streams/exceptions' },
        { text: 'Streams', link: '/generics-streams/streams' }
      ]},
      { text: 'JVM / Concurrency', collapsed: true, items: [
        { text: 'JVM Memory / GC', link: '/jvm/memory-gc' },
        { text: 'ClassLoader / JIT', link: '/jvm/classloader-jit' },
        { text: 'synchronized / volatile / JMM', link: '/multithreading/basics' },
        { text: 'Atomic / CAS / ConcurrentHashMap', link: '/multithreading/concurrent' },
        { text: 'Executors / CompletableFuture', link: '/multithreading/executors' }
      ]},
      { text: 'Database', collapsed: true, items: [
        { text: 'SQL basics', link: '/sql/basics' },
        { text: 'Transactions / MVCC', link: '/sql/transactions' },
        { text: 'Indexes / EXPLAIN', link: '/sql/indexes' },
        { text: 'Scaling / Replication / Sharding', link: '/database/scaling' },
        { text: 'Liquibase / migrations', link: '/database/migrations' },
        { text: 'Redis / Cache', link: '/redis/cache' }
      ]},
      { text: 'Hibernate / JPA', collapsed: true, items: [
        { text: 'Persistence Context', link: '/jpa/persistence' },
        { text: 'N+1 / LAZY / EAGER', link: '/jpa/fetching' },
        { text: 'Mapping / locking', link: '/jpa/mapping-locking' }
      ]},
      { text: 'Spring', collapsed: true, items: [
        { text: 'Spring Core / Bean lifecycle', link: '/spring/core' },
        { text: '@Transactional / Proxy / AOP', link: '/spring/transactional' },
        { text: 'Spring Boot / MVC', link: '/spring/boot-web' },
        { text: 'Spring Security', link: '/spring/security' }
      ]},
      { text: 'WEB / Messaging', collapsed: true, items: [
        { text: 'HTTP / REST', link: '/web/http-rest' },
        { text: 'Auth / JWT / CORS', link: '/web/auth' },
        { text: 'Kafka fundamentals', link: '/kafka/fundamentals' },
        { text: 'Kafka delivery', link: '/kafka/delivery' },
        { text: 'Kafka rebalancing / lag', link: '/kafka/rebalancing' }
      ]},
      { text: 'Architecture', collapsed: true, items: [
        { text: 'Microservice boundaries', link: '/microservices/boundaries' },
        { text: 'Saga / Outbox / consistency', link: '/microservices/consistency' },
        { text: 'Resilience', link: '/microservices/resilience' },
        { text: 'SOLID', link: '/design/solid' },
        { text: 'Patterns', link: '/design/patterns' }
      ]},
      { text: 'Testing / Infra', collapsed: true, items: [
        { text: 'Unit tests', link: '/testing/unit' },
        { text: 'Integration / Testcontainers', link: '/testing/integration' },
        { text: 'Docker', link: '/infrastructure/docker' },
        { text: 'CI/CD', link: '/infrastructure/cicd' }
      ]},
      { text: 'Дополнительно', collapsed: true, items: [
        { text: 'Big O', link: '/other/algorithms' },
        { text: 'Performance / диагностика', link: '/other/performance' },
        { text: 'Реальные собеседования', link: '/interviews/' },
        { text: 'Материалы', link: '/materials/' }
      ]}
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    footer: { message: 'Учись понимать механизмы, а не заучивать определения.', copyright: 'Java Backend Interview Prep' }
  }
})
