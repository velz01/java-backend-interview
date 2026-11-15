---
layout: false
search: false
head:
  - - meta
    - http-equiv: refresh
      content: '0; url=./learn/'
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/learn/') + window.location.search + window.location.hash)
})
</script>

<a :href="withBase('/learn/')">Перейти к плану изучения</a>
