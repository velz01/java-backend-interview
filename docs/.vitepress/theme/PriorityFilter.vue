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

function findPriorityBadge(element) {
  if (element.matches?.('.priority-badge')) return element
  return element.querySelector?.('.priority-badge') || null
}

function getContentRoot() {
  const vpDoc = document.querySelector('.vp-doc')
  if (!vpDoc) return null

  // VitePress normally renders Markdown inside an extra direct <div>:
  // .vp-doc > div > h1/h2/p/...
  // Find the direct child that actually contains numbered question headings.
  const candidates = [vpDoc, ...vpDoc.querySelectorAll(':scope > div')]
  for (const candidate of candidates) {
    const hasQuestionHeading = [...candidate.children].some((node) =>
      node.matches?.('h2') && /^\d+\.\s/.test(node.textContent?.trim() || '')
    )
    const hasPriorityBadge = [...candidate.children].some((node) => findPriorityBadge(node))
    if (hasQuestionHeading && hasPriorityBadge) return candidate
  }

  // Fallback for a future VitePress wrapper change: use the direct parent of
  // the first numbered H2 if that parent also contains priority badges.
  const heading = [...vpDoc.querySelectorAll('h2')].find((node) =>
    /^\d+\.\s/.test(node.textContent?.trim() || '')
  )
  if (heading?.parentElement && heading.parentElement.querySelector('.priority-badge')) {
    return heading.parentElement
  }

  return null
}

function captureQuestionBlocks() {
  const doc = getContentRoot()
  if (!doc) return false

  const children = [...doc.children]

  // Markdown/VitePress may render a standalone <span> badge either directly
  // or wrap it in a <p>. Treat the whole direct child as the block start.
  const starts = children
    .map((element) => ({ element, badge: findPriorityBadge(element) }))
    .filter(({ badge }) => badge)

  if (!starts.length) return false

  const startIndexes = starts.map(({ element }) => children.indexOf(element))
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
      priority: getPriority(starts[i].badge),
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

  // The doc content can appear a little later than the layout slot on client
  // navigation. Retry briefly instead of silently leaving the buttons inert.
  let attempts = 0
  const tryCapture = () => {
    if (captureQuestionBlocks()) {
      renderOrder()
      return
    }

    attempts += 1
    if (attempts < 10) {
      refreshTimer = window.setTimeout(tryCapture, 50)
    }
  }

  refreshTimer = window.setTimeout(tryCapture, 0)
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
