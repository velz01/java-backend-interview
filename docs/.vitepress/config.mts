import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'ru-RU',
  base: process.env.BASE_PATH || '/',
  title: 'Java Backend Interview',
  description: 'Вопросы и ответы из предоставленных источников',
  cleanUrls: true,
  markdown: {
    lineNumbers: false,
    // Source materials contain many XML/JSP/HTML examples. Treat raw HTML as text
    // so Vue does not try to compile source snippets as Vue templates.
    config(md) {
      md.set({ html: false })
    }
  },
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Жуков', link: '/zhukov/' },
      { text: 'enhorse', link: '/enhorse/' },
      { text: 'Таблица', link: '/table/' }
    ],
    sidebar: {
    '/zhukov/': [{ text: "Жуков", collapsed: false, items: [
          { text: "Java Core", link: "/zhukov/java-core-887c4f" },
          { text: "NoSQL", link: "/zhukov/nosql-02225e" },
          { text: "ORM", link: "/zhukov/orm-d5f8c6" },
          { text: "SOLID", link: "/zhukov/solid-4dc47c" },
          { text: "Spring", link: "/zhukov/spring-896776" },
          { text: "SQL", link: "/zhukov/sql-2064cb" },
          { text: "Stream API", link: "/zhukov/stream-api-1f0fac" },
          { text: "WEB", link: "/zhukov/web-f1e29c" },
          { text: "Базы данных", link: "/zhukov/bazy-dannyh-3a9c04" },
          { text: "Брокеры сообщений", link: "/zhukov/brokery-soobseniy-cdcd35" },
          { text: "Деплой", link: "/zhukov/deploy-d5523a" },
          { text: "Дженерики", link: "/zhukov/djeneriki-8fb3ef" },
          { text: "Другое", link: "/zhukov/drugoe-8f96ca" },
          { text: "Исключения", link: "/zhukov/isklucenia-ea6553" },
          { text: "Коллекции", link: "/zhukov/kollekcii-a9a189" },
          { text: "Миграции", link: "/zhukov/migracii-aa1d28" },
          { text: "Микросервисы", link: "/zhukov/mikroservisy-491f57" },
          { text: "Многопоточность", link: "/zhukov/mnogopotocnost-39422c" },
          { text: "ООП", link: "/zhukov/oop-03f603" },
          { text: "Паттерны проектирования", link: "/zhukov/patterny-proektirovania-14528e" },
          { text: "Тестирование", link: "/zhukov/testirovanie-490e80" },
          { text: "Функциональные интерфейсы", link: "/zhukov/funkcional-nye-interfeysy-46804b" }
        ] }],
    '/enhorse/': [{ text: "enhorse/java-interview", collapsed: false, items: [
          { text: "Apache Kafka", link: "/enhorse/apache-kafka-d646e9" },
          { text: "Java 8", link: "/enhorse/java-8-c287a1" },
          { text: "Java Collections Framework", link: "/enhorse/java-collections-framework-f37c79" },
          { text: "Java Core", link: "/enhorse/java-core-887c4f" },
          { text: "JDBC", link: "/enhorse/jdbc-1f1062" },
          { text: "jvm", link: "/enhorse/jvm-f3b543" },
          { text: "Servlets, JSP, JSTL", link: "/enhorse/servlets-jsp-jstl-9a3d77" },
          { text: "SQL", link: "/enhorse/sql-2064cb" },
          { text: "UML", link: "/enhorse/uml-e14567" },
          { text: "XML", link: "/enhorse/xml-c0aa9e" },
          { text: "Базы данных", link: "/enhorse/bazy-dannyh-3a9c04" },
          { text: "Журналирование", link: "/enhorse/jurnalirovanie-009e1d" },
          { text: "Многопоточность", link: "/enhorse/mnogopotocnost-39422c" },
          { text: "ООП", link: "/enhorse/oop-03f603" },
          { text: "Основы CSS", link: "/enhorse/osnovy-css-1804c2" },
          { text: "Основы HTML", link: "/enhorse/osnovy-html-8e91f6" },
          { text: "Основы Web", link: "/enhorse/osnovy-web-626243" },
          { text: "Потоки ввода/вывода в Java", link: "/enhorse/potoki-vvoda-vyvoda-v-java-763a77" },
          { text: "Реактивное программирование", link: "/enhorse/reaktivnoe-programmirovanie-6fcc11" },
          { text: "Сериализация", link: "/enhorse/serializacia-03a900" },
          { text: "Тестирование", link: "/enhorse/testirovanie-490e80" },
          { text: "Шаблоны проектирования", link: "/enhorse/sablony-proektirovania-9aa115" }
        ] }],
    '/table/': [{ text: "Таблица", collapsed: false, items: [
          { text: "ELK", link: "/table/elk-38c4cf" },
          { text: "Hibernate", link: "/table/hibernate-abe4b5" },
          { text: "Java", link: "/table/java-e027e5" },
          { text: "Java 8", link: "/table/java-8-c287a1" },
          { text: "KAFKA", link: "/table/kafka-3c4627" },
          { text: "Multithreading", link: "/table/multithreading-8a86ac" },
          { text: "Spring", link: "/table/spring-896776" },
          { text: "SQL", link: "/table/sql-2064cb" },
          { text: "Stream API", link: "/table/stream-api-1f0fac" },
          { text: "Алгоритмы", link: "/table/algoritmy-7f063e" },
          { text: "Вычисление глубины дерева", link: "/table/vycislenie-glubiny-dereva-a6780b" },
          { text: "Дженерики", link: "/table/djeneriki-8fb3ef" },
          { text: "ДопВопросы", link: "/table/dopvoprosy-eff28e" },
          { text: "Исключения", link: "/table/isklucenia-ea6553" },
          { text: "Как устроен ArrayList, сложность основных операций.", link: "/table/kak-ustroen-arraylist-slojnost-osnovnyh-operaciy-db6d19" },
          { text: "Как устроен TreeSet, сложность основных операций.", link: "/table/kak-ustroen-treeset-slojnost-osnovnyh-operaciy-e56a0f" },
          { text: "Как устроена TreeMap, сложность основных операций?", link: "/table/kak-ustroena-treemap-slojnost-osnovnyh-operaciy-a276cf" },
          { text: "Коллекции", link: "/table/kollekcii-a9a189" },
          { text: "Лайфкодинг", link: "/table/layfkoding-c88519" },
          { text: "ООП", link: "/table/oop-03f603" },
          { text: "ООП в Java", link: "/table/oop-v-java-aef263" },
          { text: "Паттерны", link: "/table/patterny-3848a7" },
          { text: "Паттерны декомпозиции на микросервисы", link: "/table/patterny-dekompozicii-na-mikroservisy-343d91" },
          { text: "Паттерны коммуникации микросервисов", link: "/table/patterny-kommunikacii-mikroservisov-2bce21" },
          { text: "Паттерны мониторинга микросервисов", link: "/table/patterny-monitoringa-mikroservisov-64dfc6" },
          { text: "Паттерны обнаружения сервисов в микросервисной архитектуре", link: "/table/patterny-obnarujenia-servisov-v-mikroservisnoy-arhitekture-10dc16" },
          { text: "Паттерны повышения отказоустойчивости", link: "/table/patterny-povysenia-otkazoustoycivosti-d4b742" },
          { text: "Паттерны построения пользовательского интерфейса", link: "/table/patterny-postroenia-pol-zovatel-skogo-interfeysa-dd5111" },
          { text: "Паттерны рефакторинга для перехода на микросервисы", link: "/table/patterny-refaktoringa-dla-perehoda-na-mikroservisy-aa31b4" },
          { text: "Паттерны управления данными в микросервисной архитектуре", link: "/table/patterny-upravlenia-dannymi-v-mikroservisnoy-arhitekture-f146c0" },
          { text: "Процедурная Java", link: "/table/procedurnaa-java-e29f54" },
          { text: "Прочие паттерны проектирования микросервисов", link: "/table/procie-patterny-proektirovania-mikroservisov-6e7053" },
          { text: "Расскажите про ApplicationContext и BeanFactory, чем отличаются? В каких случаях что стоит использовать?", link: "/table/rasskajite-pro-applicationcontext-i-beanfactory-cem-otlicaut-e96d61" },
          { text: "Расскажите про иерархию коллекций", link: "/table/rasskajite-pro-ierarhiu-kollekciy-474383" },
          { text: "Сериализация и копирование", link: "/table/serializacia-i-kopirovanie-aafb8a" },
          { text: "Функциональные интерфейсы", link: "/table/funkcional-nye-interfeysy-46804b" },
          { text: "Является ли число простым", link: "/table/avlaetsa-li-cislo-prostym-b32a41" }
        ] }]
    },
    outline: { level: [2, 3], label: 'На странице' },
    docFooter: { prev: 'Назад', next: 'Далее' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема'
  }
})
