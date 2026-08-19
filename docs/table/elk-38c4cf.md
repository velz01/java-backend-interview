---
title: "ELK"
outline: [2, 3]
---

# ELK

**Источник:** Improved table Java  
**Вопросов:** 8

## 1. Spring Cloud

<span class="source-badge">Источник: Таблица</span>

https://habr.com/ru/post/431474/

---

## 2. Spring Cloud Gateway

<span class="source-badge">Источник: Таблица</span>

Единая точка доступа (API gateway). Spring Cloud Gateway нацелен на предоставление простого, но эффективного способа маршрутизации к API-интерфейсам и предоставления им решение проблем, таких как безопасность, мониторинг / метрики и отказоустойчивость.

---

## 3. Spring Cloud Config

<span class="source-badge">Источник: Таблица</span>

Может хранить настройки в своем локальном application.properties и отдавать их другим микросервисам из него, но это не лучший вариант. Потому что при изменении настроек пришлось бы перезапускать Configuration Server, а мы стремимся к бесперебойной работе. Поэтому самое популярное — хранить их в репозитории (например, Git)

---

## 4. Spring Cloud Sleuth

<span class="source-badge">Источник: Таблица</span>

Трассировка запросов (Distributed tracing) (нужен для трассировки логов в вашем приложении.)

---

## 5. Spring Cloud OpenFeign

<span class="source-badge">Источник: Таблица</span>

Декларативный HTTP клиент (Declarative HTTP client) (декларативное описание REST-клиента и
балансировка нагрузки на стороне клиента)

---

## 6. Spring Cloud Netflix Eureka

<span class="source-badge">Источник: Таблица</span>

Обнаружение сервисов (Service discovery)  (Eureka Server — это приложение, которое содержит информацию обо всех клиентских сервисных приложениях. Каждый микросервис регистрируется на сервере Eureka, и Eureka знает все клиентские приложения, работающие на каждом порту и IP-адресе. Eureka Server также известен как Discovery Server.)

---

## 7. Spring Cloud Netflix Hystrix

<span class="source-badge">Источник: Таблица</span>

Предохранитель (Circuit breaker) (Другими словами можно сказать, что Hystrix — это имплементация паттерна Circuit Breaker. Основная идея состоит в том, чтобы остановить каскадный отказ в распределенной системе сервисов, состоящей из их большого числа.)

---

## 8. Spring Cloud Netflix Ribbon

<span class="source-badge">Источник: Таблица</span>

Клиентская балансировка нагрузки (Client-side load balancing) (Ribbon — это балансировщик нагрузки. Из коробки он интегрирован с механизмом Service Discovery, который предоставляет динамический список доступных инстансов для балансировки между ними.)

---
