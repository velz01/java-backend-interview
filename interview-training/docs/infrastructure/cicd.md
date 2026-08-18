# CI/CD, артефакты и deployment

::: tip Приоритет
🟡 **Хороший рабочий блок.**
:::

## CI

Автоматическая сборка, tests, static checks на изменения.

## Continuous Delivery vs Deployment

Delivery — software всегда готово к release, production deploy может быть manual approval. Deployment — successful change автоматически идёт production.

## Типичный Java pipeline

```text
commit
 -> compile
 -> unit tests
 -> integration tests
 -> quality/security checks
 -> jar
 -> docker image
 -> registry
 -> deploy stage
 -> smoke tests
 -> prod
```

## Artifact

Результат build: JAR, report, package.

## Registry

Хранилище versioned Docker images.

## Почему tag `latest` плох как единственная идентификация?

Mutable и не говорит, какой commit реально deploy. Лучше immutable version/commit SHA и при необходимости human-friendly tag.

## Immutable artifact

Один и тот же binary/image продвигается по environments, а не пересобирается на каждом.

## Environment config

Config/secret должны приходить извне artifact. Один build — разные configs environments.

## Secret

Не коммитить в repo/image. Использовать secret manager/CI secrets/runtime mechanisms.

## Blue-Green

Две среды; новая версия проверяется отдельно, затем traffic переключается.

## Canary

Новая версия получает небольшой процент traffic, rollout расширяется при нормальных metrics.

## Rolling update

Instances обновляются постепенно, одновременно есть old/new versions — нужна backward compatibility.

## Database migration при rolling deploy

Schema changes должны быть совместимы с обеими версиями приложения. Часто expand → migrate → contract.

## Liveness vs Readiness

Liveness: process нужно перезапустить? Readiness: instance готов принимать traffic?

## Smoke test

Короткая проверка критичных paths после deployment.

## Rollback

Возврат previous app version. Но если schema/data migration irreversible, rollback приложения не всегда достаточен.

## Observability после deploy

Error rate, latency, saturation, business metrics. Успешный pipeline ещё не означает успешный release.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «CI/CD, артефакты и deployment»](/materials/infrastructure-cicd)
