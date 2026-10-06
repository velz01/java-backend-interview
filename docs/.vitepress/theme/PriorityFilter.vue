<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const active = ref('difficulty')

let docElement = null
let blocks = []
let anchorAfterQuestions = null
let refreshTimer = null

const options = [
  { value: 'difficulty', label: 'По сложности' },
  { value: 'priority', label: 'По приоритету' }
]

function getPriority(badge) {
  if (badge.classList.contains('priority-high')) return 0
  if (badge.classList.contains('priority-medium')) return 1
  if (badge.classList.contains('priority-low')) return 2
  if (badge.classList.contains('priority-very-low')) return 3
  return 4
}

function captureQuestionBlocks() {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return false

  const children = [...doc.children]
  const starts = children.filter((element) => element.matches?.('.priority-badge'))
  if (!starts.length) return false

  const startIndexes = starts.map((start) => children.indexOf(start))
  const captured = []

  for (let i = 0; i < starts.length; i++) {
    const from = startIndexes[i]
    const to = i + 1 < starts.length ? startIndexes[i + 1] : children.length
    const nodes = children.slice(from, to)

    // A question block must contain its numbered H2 heading.
    const heading = nodes.find((node) => node.matches?.('h2'))
    if (!heading || !/^\d+\.\s/.test(heading.textContent?.trim() || '')) continue

    captured.push({
      nodes,
      priority: getPriority(starts[i]),
      originalIndex: captured.length
    })
  }

  if (!captured.length) return false

  docElement = doc
  blocks = captured
  const lastBlock = captured[captured.length - 1]
  const lastNode = lastBlock.nodes[lastBlock.nodes.length - 1]
  anchorAfterQuestions = lastNode?.nextSibling || null
  return true
}

function renderOrder() {
  if (!docElement || !blocks.length) return

  const ordered = active.value === 'priority'
    ? [...blocks].sort((a, b) => a.priority - b.priority || a.originalIndex - b.originalIndex)
    : [...blocks].sort((a, b) => a.originalIndex - b.originalIndex)

  const fragment = document.createDocumentFragment()
  for (const block of ordered) {
    for (const node of block.nodes) fragment.appendChild(node)
  }

  docElement.insertBefore(fragment, anchorAfterQuestions)
}

async function selectOrder(value) {
  if (active.value === value) return
  active.value = value
  await nextTick()
  renderOrder()
}

async function refreshPage() {
  active.value = 'difficulty'
  blocks = []
  docElement = null
  anchorAfterQuestions = null

  await nextTick()
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    if (captureQuestionBlocks()) renderOrder()
  }, 0)
}

onMounted(refreshPage)
watch(() => route.path, refreshPage)
</script>

<template>
  <div class="priority-filter question-order" role="group" aria-label="Порядок вопросов">
    <span class="priority-filter-label">Порядок вопросов:</span>
    <div class="priority-filter-buttons">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="priority-filter-button"
        :class="{ active: active === option.value }"
        :aria-pressed="active === option.value"
        @click="selectOrder(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <span class="question-order-hint">
      {{ active === 'difficulty'
        ? 'от базовых вопросов к более сложным'
        : '🔴 высокий → 🟡 средний → 🟢 низкий → ⚪ очень низкий' }}
    </span>
  </div>
</template>
