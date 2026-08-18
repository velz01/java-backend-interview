# HTTP, REST и идемпотентность

::: tip Приоритет
🔴 **Обязательная база backend-разработчика.**
:::

## Из чего состоит HTTP request?

Method, URI/path, headers и optional body. Response: status code, headers, optional body.

## Stateless

HTTP сам по себе request-response. REST stateless означает, что server не должен полагаться на скрытое conversational state между requests для понимания запроса; вся необходимая информация должна быть доступна из request/context.

## GET

Safe и idempotent по semantics: получение представления ресурса не должно менять business state.

## POST

Обычно создание subordinate resource или command/action. По умолчанию не считается idempotent.

## PUT

Полная запись/замена ресурса по известному URI; idempotent.

## PATCH

Частичное изменение. Может быть idempotent, а может нет — зависит от patch document/operation.

## DELETE

Идемпотентен по intended state: повторный DELETE оставляет ресурс удалённым, даже если status code повторного вызова отличается.

## Что такое идемпотентность?

Повтор одного и того же запроса приводит к тому же intended server state, что и один вызов. Это не «всегда одинаковый response».

## 200 / 201 / 202 / 204

- 200 — success с обычным response.
- 201 — resource created.
- 202 — request принят, обработка асинхронная/ещё не завершена.
- 204 — success без body.

## 400 / 401 / 403 / 404 / 409 / 422

- 400 — malformed/invalid request.
- 401 — нет корректной authentication.
- 403 — identity есть, доступа нет.
- 404 — resource not found.
- 409 — conflict с текущим state.
- 422 — семантически request понятен, но validation/business constraints не проходят (если такой contract выбран).

## 500 vs 503

500 — internal unexpected server error. 503 — service временно unavailable, например overload/dependency outage.

## HTTPS

HTTP поверх TLS: confidentiality, integrity, server authentication certificate. Не заменяет authorization/business security.

## REST constraints

Client-server, stateless, cacheable, uniform interface, layered system, optional code-on-demand.

## Resource URI

Лучше существительные и hierarchy ресурсов (`/orders/123/items`), а business commands оформлять осознанно, а не пытаться любой action насильно сделать CRUD.

## REST vs RPC

REST ориентирован на resources и uniform interface. RPC — на операции. В реальных systems оба подхода могут быть разумны.

## Cache-Control

Управляет caching semantics: `max-age`, `no-store`, `private/public` и т.д.

## ETag / If-Match

ETag идентифицирует version representation. `If-Match` можно использовать для optimistic concurrency на HTTP уровне.

## Content-Type vs Accept

Content-Type — формат body текущего сообщения. Accept — какие media types client готов получить.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «HTTP, REST и идемпотентность»](/materials/web-http-rest)

## Углубление для собеседования

### Что значит идемпотентность HTTP метода?

Повтор одного и того же запроса должен иметь тот же intended server-side effect, что и один запрос. GET/PUT/DELETE по семантике должны быть идемпотентными; POST обычно нет. Это не означает, что response всегда байт-в-байт одинаковый.

### PUT vs PATCH

PUT обычно трактуется как полная замена representation ресурса по известному URI, PATCH — частичное изменение. Реальное API должно чётко документировать semantics, validation и idempotency.

### Безопасный (safe) method и idempotent — одно?

Нет. Safe означает не должен менять состояние ресурса как intended effect (GET/HEAD). Idempotent может менять состояние, но повтор не добавляет новый эффект (например DELETE).

### Основные группы HTTP status codes

1xx informational, 2xx success, 3xx redirect/cache, 4xx client-side request problem, 5xx server-side failure. Для backend важно уверенно различать 200/201/204, 400/401/403/404/409/422, 500/502/503/504.

### 401 vs 403

401 — запрос не имеет корректной authentication (название «Unauthorized» исторически сбивает с толку). 403 — identity может быть известна, но доступ запрещён.

### HTTP vs HTTPS

HTTPS — HTTP поверх TLS: шифрование канала, integrity и server authentication по certificate chain. TLS не делает небезопасную application authorization автоматически безопасной.
