---
title: "Spring Cloud"
outline: [2, 3]
---

# Spring Cloud

Всего вопросов: **6**

В этом разделе собраны вопросы по Spring Cloud, выделенные из темы микросервисов.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 1. Поясните: Spring Cloud Gateway

Единая точка доступа (API gateway). Spring Cloud Gateway нацелен на предоставление простого, но эффективного способа маршрутизации к API-интерфейсам и предоставления им решение проблем, таких как безопасность, мониторинг / метрики и отказоустойчивость.

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 2. Поясните: Spring Cloud Netflix Eureka

Обнаружение сервисов (Service discovery)  (Eureka Server — это приложение, которое содержит информацию обо всех клиентских сервисных приложениях. Каждый микросервис регистрируется на сервере Eureka, и Eureka знает все клиентские приложения, работающие на каждом порту и IP-адресе. Eureka Server также известен как Discovery Server.)

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 3. Поясните: Spring Cloud OpenFeign

Декларативный HTTP клиент (Declarative HTTP client) (декларативное описание REST-клиента и
балансировка нагрузки на стороне клиента)

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 4. Поясните: Spring Cloud Config

Может хранить настройки в своем локальном application.properties и отдавать их другим микросервисам из него, но это не лучший вариант. Потому что при изменении настроек пришлось бы перезапускать Configuration Server, а мы стремимся к бесперебойной работе. Поэтому самое популярное — хранить их в репозитории (к примеру, Git)

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 5. Поясните: Spring Cloud Netflix Ribbon

Клиентская балансировка нагрузки (Client-side load balancing) (Ribbon — это балансировщик нагрузки. Из коробки он интегрирован с механизмом Service Discovery, который предоставляет динамический список доступных инстансов для балансировки между ними.)

---

<span class="priority-badge priority-low">🟢 Низкий приоритет</span>

## 6. Поясните: Spring Cloud Netflix Hystrix

Предохранитель (Circuit breaker) (Другими словами можно сказать, что Hystrix — это имплементация паттерна Circuit Breaker. Основная идея состоит в том, чтобы остановить каскадный отказ в распределенной системе сервисов, состоящей из их большого числа.)

---

