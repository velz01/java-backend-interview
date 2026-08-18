# IO / NIO

::: tip Приоритет
⚪ Реже Spring/SQL, но встречается в Java Core базах вопросов.
:::

## Byte streams vs character streams

`InputStream/OutputStream` работают с байтами. `Reader/Writer` — с символами и charset conversion. Для текста нужно явно понимать encoding, обычно UTF-8.

## Buffered streams зачем?

Снижают число дорогих обращений к underlying resource, читая/записывая данные крупными блоками. Без буфера множество маленьких операций может сильно ухудшить performance.

## IO vs NIO

Classic IO исторически строится вокруг streams. NIO предлагает channels, buffers, selectors и richer file APIs. Selectors позволяют одному thread координировать множество non-blocking channels.

## Channel vs Stream

Channel — двунаправленный абстрактный канал данных и работает через `Buffer`. Stream обычно однонаправлен и предоставляет последовательные read/write methods.

## try-with-resources

Любой `AutoCloseable` resource можно объявить в `try(...)`; Java гарантирует вызов `close()` и корректно хранит suppressed exceptions, если исключение возникло и в body, и при close.
