# Authentication, Authorization, JWT и CORS

::: tip Приоритет
🟡 **Частый web/security блок.**
:::

## Authentication vs Authorization

Authentication — кто пользователь. Authorization — какие действия ему разрешены.

## Session-based auth

Server хранит session state, client отправляет opaque session id, обычно cookie.

## JWT

Самодостаточный signed token с claims. Удобен для stateless validation, но revocation, rotation, expiration и compromise требуют отдельного дизайна.

## JWT зашифрован?

Обычный JWS JWT подписан, но payload не секретный. Его можно декодировать. Confidential data туда класть нельзя.

## Access vs Refresh token

Access token короткоживущий для API. Refresh token дольше живёт и используется для получения нового access token.

## Почему refresh token нужно защищать строже?

Его compromise даёт возможность выпускать новые access tokens длительное время.

## Где хранить token в browser?

Нет universal answer. HttpOnly Secure SameSite cookie защищает от чтения JavaScript, но нужно учитывать CSRF. LocalStorage доступен JS и чувствителен к XSS.

## XSS

Выполнение attacker-controlled script в origin приложения. Может красть доступные JS tokens/данные и выполнять действия от пользователя.

## CSRF

Browser отправляет credentials автоматически на attacker-triggered request к другому сайту. Защита: SameSite, CSRF token и правильная API architecture.

## CORS

Browser security policy для cross-origin frontend requests. Не является authentication/authorization и не защищает server-to-server API.

## Preflight

Browser отправляет OPTIONS для проверки разрешённых method/headers/origin перед некоторыми cross-origin requests.

## Password hashing

Пароли не шифруют обратимо для хранения; используют slow password hashing functions с salt (например bcrypt/Argon2 в зависимости от системы).

## Role vs Permission

Role — набор/группа прав. Permission/authority — конкретное разрешение. Fine-grained authorization лучше не сводить к десяткам `if (role == ...)`.

## OAuth2 vs JWT

OAuth2 — authorization framework/protocol family. JWT — token format. OAuth2 может использовать JWT access token, но это разные понятия.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Authentication, Authorization, JWT и CORS»](/materials/web-auth)

## Углубление для собеседования

### Session cookie vs JWT

Session approach хранит server-side session state, клиент носит случайный session id cookie. JWT может нести claims и проверяться без central session lookup, но revocation/logout сложнее, а token нельзя бездумно наполнять sensitive data.

### Cookie flags

`HttpOnly` закрывает cookie от JavaScript, снижая риск кражи через XSS. `Secure` отправляет только по HTTPS. `SameSite` помогает контролировать cross-site отправку и снижает CSRF risk.

### CORS — это защита backend от любых запросов?

Нет. CORS — browser policy, ограничивающая JS чтение cross-origin responses. Не-browser client может послать HTTP request независимо от CORS. Authorization всё равно обязана проверяться на сервере.

### CSRF когда актуален?

Особенно при credential, автоматически прикрепляемых browser-ом (cookies). Если state-changing request можно заставить browser отправить с auth cookie с чужого сайта, нужна CSRF mitigation: SameSite, CSRF token и правильный API design.
