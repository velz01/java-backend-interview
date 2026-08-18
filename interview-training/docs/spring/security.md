# Spring Security — основы

::: tip Приоритет
🟡 Для backend middle полезно понимать pipeline, а не только `SecurityFilterChain` из копипаста.
:::

## Authentication vs Authorization

Authentication отвечает «кто ты?», authorization — «что тебе разрешено?». Сначала система устанавливает principal/Authentication, затем проверяет доступ к ресурсу.

## Где Spring Security находится в web request?

Перед controller работает цепочка servlet filters. Security filters извлекают credentials/token, создают Authentication, помещают security context и проверяют authorization.

## SecurityFilterChain

Набор security filters и правил, применяемый к подходящим requests. В современном Spring Security конфигурация обычно строится через bean `SecurityFilterChain`.

## Как хранить password?

Не plaintext и не reversible encryption. Хранят adaptive password hash (например BCrypt/Argon2/PBKDF2) с salt/параметрами. При login password снова прогоняется через password encoder и сравнивается с сохранённым hash.

## JWT — что внутри?

Header, payload, signature. Payload обычно **не шифруется**, поэтому туда нельзя класть секреты. Signature защищает целостность и authenticity при корректной проверке ключа/алгоритма.

## Stateless JWT значит logout невозможен?

Короткоживущий access token сам по себе остаётся валиден до expiry. Для logout/revocation используют short TTL + refresh token rotation/storage, denylist или смену key/version — в зависимости от threat model.
