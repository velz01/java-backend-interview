import { defineConfig } from 'vitepress'

const base = process.env.BASE_PATH || '/'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Java Backend Interview',
  description: 'Полная база вопросов и ответов для подготовки к Java Backend собеседованиям',
  base,
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Материалы', link: '/materials/' }
    ],
    sidebar: [
      { text: 'Java', collapsed: false, items: [
        { text: 'ООП', link: '/java/oop' },
        { text: 'Java Core', link: '/java/core' },
        { text: 'JVM и GC', link: '/jvm/' },
        { text: 'Исключения', link: '/java/exceptions' },
        { text: 'Сериализация', link: '/java/serialization' },
        { text: 'Generics', link: '/java/generics' },
        { text: 'Collections', link: '/java/collections' },
        { text: 'Функциональные интерфейсы', link: '/java/functional' },
        { text: 'Stream API', link: '/java/streams' },
        { text: 'Java 8+', link: '/java/java8' },
        { text: 'IO / NIO', link: '/java/io' },
        { text: 'Reactive', link: '/java/reactive' }
      ]},
      { text: 'Многопоточность', items: [
        { text: 'Concurrency', link: '/concurrency/' }
      ]},
      { text: 'Базы данных', items: [
        { text: 'Основы БД', link: '/database/fundamentals' },
        { text: 'SQL', link: '/database/sql' },
        { text: 'JDBC', link: '/database/jdbc' },
        { text: 'NoSQL / Redis / кэш', link: '/database/nosql' },
        { text: 'Миграции / Liquibase', link: '/database/migrations' },
        { text: 'Hibernate / JPA', link: '/jpa/hibernate' }
      ]},
      { text: 'Spring', items: [
        { text: 'Spring Framework / Boot / Security', link: '/spring/' }
      ]},
      { text: 'WEB', items: [
        { text: 'HTTP / REST / Web', link: '/web/' },
        { text: 'Servlets / JSP / JSTL', link: '/legacy/servlets' }
      ]},
      { text: 'Архитектура и messaging', items: [
        { text: 'Паттерны проектирования', link: '/architecture/patterns' },
        { text: 'Микросервисы', link: '/architecture/microservices' },
        { text: 'Kafka', link: '/messaging/kafka' }
      ]},
      { text: 'Тестирование и инфраструктура', items: [
        { text: 'Testing', link: '/testing/' },
        { text: 'Docker / CI/CD / Deploy', link: '/infrastructure/deployment' },
        { text: 'ELK / Spring Cloud', link: '/observability/elk' },
        { text: 'Logging', link: '/other/logging' }
      ]},
      { text: 'Дополнительно', items: [
        { text: 'Алгоритмы', link: '/algorithms/' },
        { text: 'Дополнительные вопросы', link: '/extra/questions' },
        { text: 'Лайвкодинг', link: '/extra/livecoding' },
        { text: 'UML', link: '/other/uml' },
        { text: 'XML', link: '/other/xml' },
        { text: 'HTML', link: '/other/html' },
        { text: 'CSS', link: '/other/css' }
      ]}
    ],
    outline: { level: [2, 3], label: 'На странице' },
    docFooter: { prev: 'Назад', next: 'Далее' },
    lastUpdated: { text: 'Обновлено' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема'
  }
})
