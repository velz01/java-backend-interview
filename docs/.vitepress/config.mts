import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  base: process.env.BASE_PATH || '/',
  title: 'Java Backend Interview',
  description: 'Подготовка к Java Backend собеседованиям',
  cleanUrls: true,
  ignoreDeadLinks: [/^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/|$)/],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    search: { provider: 'local' },
    nav: [{ text: 'Обучение', link: '/learn/' }],
    sidebar: {
      '/learn/': [{ text: 'Темы', collapsed: false, items: [
          { text: "Java Core", link: "/learn/java-core" },
          { text: "ООП", link: "/learn/oop" },
          { text: "Collections", link: "/learn/collections" },
          { text: "Generics", link: "/learn/generics" },
          { text: "Exceptions", link: "/learn/exceptions" },
          { text: "JVM и память", link: "/learn/jvm" },
          { text: "Java 8+ / Functional / Stream API", link: "/learn/functional" },
          { text: "Multithreading", link: "/learn/multithreading" },
          { text: "I/O и Serialization", link: "/learn/io" },
          { text: "Algorithms / Live Coding", link: "/learn/algorithms" },
          { text: "Testing", link: "/learn/testing" },
          { text: "SQL", link: "/learn/sql" },
          { text: "Databases / JDBC / Migrations", link: "/learn/databases" },
          { text: "Hibernate / ORM", link: "/learn/orm" },
          { text: "Spring", link: "/learn/spring" },
          { text: "Web / REST / Servlets", link: "/learn/web" },
          { text: "Patterns / SOLID", link: "/learn/patterns" },
          { text: "Microservices / Spring Cloud", link: "/learn/microservices" },
          { text: "Kafka / Message Brokers", link: "/learn/kafka" },
          { text: "NoSQL / ELK", link: "/learn/nosql" },
          { text: "Deploy / Git / Linux", link: "/learn/deploy" },
          { text: "Logging", link: "/learn/logging" },
          { text: "Reactive", link: "/learn/reactive" },
          { text: "UML / XML / HTML / CSS", link: "/learn/uml" },
          { text: "Дополнительные вопросы", link: "/learn/other" },
      ] }]
    },
    outline: { level: [2,3], label: 'На странице' },
    docFooter: { prev: 'Предыдущая тема', next: 'Следующая тема' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Темы'
  }
})
