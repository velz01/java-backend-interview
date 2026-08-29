import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  base: process.env.BASE_PATH || '/',
  title: 'Java Backend Interview',
  description: 'Подготовка к Java Backend собеседованиям',
  cleanUrls: true,
  ignoreDeadLinks: [/^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/|$)/],
  markdown: { lineNumbers: true },
  themeConfig: {
    search: { provider: 'local' },
    nav: [{ text: 'Обучение', link: '/learn/' }],
    sidebar: { '/learn/': [
      { text: 'Основы Java', collapsed: false, items: [
        { text: 'Java Core', link: '/learn/java-core' },
        { text: 'ООП', link: '/learn/oop' },
        { text: 'Collections', link: '/learn/collections' },
        { text: 'Generics', link: '/learn/generics' },
        { text: 'Exceptions', link: '/learn/exceptions' },
        { text: 'JVM и память', link: '/learn/jvm' },
        { text: 'Multithreading', link: '/learn/multithreading' },
        { text: 'Java 8+', link: '/learn/java8' },
        { text: 'Functional', link: '/learn/functional' },
        { text: 'Stream API', link: '/learn/stream-api' },
        { text: 'I/O и Serialization', link: '/learn/io' },
      ]},
      { text: 'Данные', collapsed: false, items: [
        { text: 'SQL', link: '/learn/sql' },
        { text: 'Databases / JDBC / Migrations', link: '/learn/databases' },
        { text: 'Hibernate / ORM / JPA', link: '/learn/orm' },
      ]},
      { text: 'Backend', collapsed: false, items: [
        { text: 'Spring', link: '/learn/spring' },
        { text: 'Web / HTTP / REST', link: '/learn/web' },
        { text: 'Testing', link: '/learn/testing' },
        { text: 'Patterns / SOLID', link: '/learn/patterns' },
        { text: 'Microservices / Spring Cloud', link: '/learn/microservices' },
      ]},
      { text: 'Инфраструктура', collapsed: false, items: [
        { text: 'Kafka / Message Brokers', link: '/learn/kafka' },
        { text: 'NoSQL / ELK', link: '/learn/nosql' },
        { text: 'Logging', link: '/learn/logging' },
        { text: 'Deploy / Git / Linux', link: '/learn/deploy' },
      ]},
      { text: 'Дополнительно', collapsed: false, items: [
        { text: 'Reactive', link: '/learn/reactive' },
        { text: 'Algorithms / Live Coding', link: '/learn/algorithms' },
        { text: 'Дополнительные вопросы', link: '/learn/other' },
      ]},
    ] },
    outline: { level: [2,3], label: 'На странице' },
    docFooter: { prev: 'Предыдущая тема', next: 'Следующая тема' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Темы'
  }
})
