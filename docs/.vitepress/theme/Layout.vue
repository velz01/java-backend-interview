<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme
const { page } = useData()
const isHome = computed(() => page.value.relativePath === 'index.md')
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <div class="author-card">
        <p class="author-card-title">
          Методичка подготовлена
          <a href="https://t.me/velz01" target="_blank" rel="noopener noreferrer">@velz01</a>
          и
          <a href="https://t.me/eternalqw" target="_blank" rel="noopener noreferrer">@eternalqw</a>
        </p>
        <p>
          Мы работаем Java-разработчиками и занимаемся менторством: помогаем с подготовкой к техническим собеседованиям, резюме, мок-собеседованиями, поиском работы и выходом на оффер.
        </p>
        <p>
          Подробнее о менторстве можно прочитать здесь:
          <a class="mentor-link" href="https://telegra.ph/Mentorstvo-eternalqw-08-23" target="_blank" rel="noopener noreferrer">Менторство Java</a>
        </p>
        <p>
          Если нужна помощь с подготовкой к собеседованиям —
          <a href="https://t.me/velz01" target="_blank" rel="noopener noreferrer">@velz01</a>
          /
          <a href="https://t.me/eternalqw" target="_blank" rel="noopener noreferrer">@eternalqw</a>
        </p>
      </div>
    </template>

    <template v-if="!isHome" #nav-bar-content-after>
      <div class="global-authors">
        <span>Авторы:</span>
        <a href="https://t.me/velz01" target="_blank" rel="noopener noreferrer">@velz01</a>
        <span>и</span>
        <a href="https://t.me/eternalqw" target="_blank" rel="noopener noreferrer">@eternalqw</a>
      </div>
    </template>

    <template v-if="!isHome" #nav-screen-content-before>
      <div class="mobile-authors">
        <span>Авторы:</span>
        <a href="https://t.me/velz01" target="_blank" rel="noopener noreferrer">@velz01</a>
        <span>и</span>
        <a href="https://t.me/eternalqw" target="_blank" rel="noopener noreferrer">@eternalqw</a>
      </div>
    </template>
  </Layout>
</template>
