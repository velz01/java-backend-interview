# Docker и Docker Compose

::: tip Приоритет
🟡 **Часто спрашивают базу.**
:::

## Image vs Container

Image — immutable template/layers. Container — running instance image с writable layer/runtime config.

## Dockerfile

Описывает build: base image, files, commands, env, entrypoint.

## Layer

Результат instruction/build step в image filesystem. Layer cache ускоряет rebuild.

## COPY dependency files раньше source — зачем?

Если dependencies меняются реже source, Docker build cache может переиспользовать дорогой dependency layer.

## CMD vs ENTRYPOINT

ENTRYPOINT задаёт основной executable, CMD — default command/args, которые можно переопределить.

## Shell form vs Exec form

Exec form (`["java","-jar","app.jar"]`) не запускает лишний shell и лучше передаёт signals процессу.

## ARG vs ENV

ARG — build time. ENV — runtime/image environment. Не хранить secrets в Dockerfile layers.

## Volume

Persistent/shared data вне writable container layer.

## Bind mount vs volume

Bind mount напрямую мапит host path. Named volume управляется Docker и меньше зависит от конкретной host path.

## Network

Containers могут общаться через virtual networks и DNS service names.

## EXPOSE

Документирует intended port, но сам не публикует port на host.

## `-p`

Публикует container port на host.

## Multi-stage build

Build stage с Maven/JDK → runtime stage с только JRE/app. Меньше final image и attack surface.

## Docker Compose

Декларативно запускает несколько services/networks/volumes для local/dev/test.

## Container vs VM

VM имеет guest OS/kernel. Containers делят kernel host и изолируют processes namespaces/cgroups.

## Почему container может завершиться сразу?

Когда PID 1/main process завершился, container считается завершённым. Container — не «маленькая VM, которая должна жить сама».

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Docker и Docker Compose»](/materials/infrastructure-docker)
