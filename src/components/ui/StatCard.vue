<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  label: string
  value: string
  meta?: string
  warning?: boolean
  success?: boolean
  tooltip?: string
}>()

const showTooltip = ref(false)
const iconRef = ref<HTMLElement | null>(null)
const popoverPosition = ref({ top: '0px', left: '0px' })

function updatePopoverPosition() {
  if (!iconRef.value) return

  const rect = iconRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Position below the icon by default
  let top = rect.bottom + 8
  let left = rect.left + rect.width / 2

  // Keep popover within viewport bounds
  const popoverWidth = Math.min(280, viewportWidth - 32)

  // Adjust horizontal position
  if (left - popoverWidth / 2 < 16) {
    left = popoverWidth / 2 + 16
  } else if (left + popoverWidth / 2 > viewportWidth - 16) {
    left = viewportWidth - popoverWidth / 2 - 16
  }

  // If too close to bottom, position above
  if (top + 100 > viewportHeight) {
    top = rect.top - 8
    popoverPosition.value = {
      top: `${top}px`,
      left: `${left}px`,
    }
  } else {
    popoverPosition.value = {
      top: `${top}px`,
      left: `${left}px`,
    }
  }
}

async function toggleTooltip(event: Event) {
  event.stopPropagation()
  showTooltip.value = !showTooltip.value

  if (showTooltip.value) {
    await nextTick()
    updatePopoverPosition()
  }
}

function closeTooltip() {
  showTooltip.value = false
}

// Close on scroll
function handleScroll() {
  if (showTooltip.value) {
    closeTooltip()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true)
})
</script>

<template>
  <div class="stat-card" :class="{ warning, success }">
    <div class="stat-label">
      {{ label }}
      <span
        v-if="tooltip"
        ref="iconRef"
        class="info-icon"
        :class="{ active: showTooltip }"
        @click="toggleTooltip"
        role="button"
        tabindex="0"
        :aria-label="`More info about ${label}`"
        :aria-expanded="showTooltip"
      >i</span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="meta" class="stat-meta">{{ meta }}</div>

    <!-- Tooltip popover -->
    <Teleport to="body">
      <Transition name="popover">
        <div
          v-if="showTooltip && tooltip"
          class="info-popover-overlay"
          @click="closeTooltip"
        ></div>
      </Transition>
      <Transition name="popover">
        <div
          v-if="showTooltip && tooltip"
          class="info-popover"
          :style="popoverPosition"
          role="tooltip"
        >
          {{ tooltip }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  font-size: 10px;
  font-style: italic;
  font-weight: 600;
  color: var(--text-tertiary);
  border: 1px solid var(--text-tertiary);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s, background-color 0.2s, color 0.2s;
  user-select: none;
}

.info-icon:hover,
.info-icon.active {
  opacity: 1;
  background-color: var(--interactive-base);
  color: var(--surface-raised);
  border-color: var(--interactive-base);
}
</style>

<style>
/* Global styles for teleported elements */
.info-popover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
}

.info-popover {
  position: fixed;
  transform: translateX(-50%);
  max-width: 280px;
  padding: 12px 16px;
  background: var(--surface-raised);
  border: 1px solid var(--border-base);
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-elevated);
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  z-index: 1000;
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

/* Popover transition */
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}

.popover-enter-from .info-popover,
.popover-leave-to .info-popover {
  transform: translateX(-50%) translateY(-4px);
}
</style>
