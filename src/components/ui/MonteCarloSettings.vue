<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside, useElementBounding } from '@vueuse/core'
import { useCalculatorStore } from '../../stores/calculatorStore'
import RangeInput from './RangeInput.vue'

const store = useCalculatorStore()

const isOpen = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const popoverRef = ref<HTMLDivElement | null>(null)

const { bottom, left, width } = useElementBounding(triggerRef)

const popoverStyle = computed(() => ({
  top: `${bottom.value + 8}px`,
  left: `${left.value + width.value - 320}px`
}))

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

onClickOutside(popoverRef, close, { ignore: [triggerRef] })
</script>

<template>
  <div class="mc-settings">
    <button
      ref="triggerRef"
      class="settings-trigger"
      :class="{ active: isOpen }"
      @click="toggle"
      aria-label="Monte Carlo settings"
      title="Monte Carlo settings"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        />
      </svg>
    </button>

    <Teleport to="body">
      <Transition name="fade-slide">
        <div
          v-if="isOpen"
          ref="popoverRef"
          class="mc-popover"
          :style="popoverStyle"
        >
          <div class="mc-popover-header">
            <h4>Monte Carlo Settings</h4>
            <button class="close-btn" @click="close" aria-label="Close">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="mc-popover-body">
            <div class="control">
              <label class="toggle">
                <input type="checkbox" v-model="store.monteCarlo.enabled" />
                Show volatility band
              </label>
            </div>

            <template v-if="store.monteCarlo.enabled">
              <RangeInput
                v-model="store.monteCarlo.volatility"
                :min="0"
                :max="40"
                :step="1"
                label="Volatility (annual %)"
              />

              <RangeInput
                v-model="store.monteCarlo.runs"
                :min="50"
                :max="500"
                :step="10"
                label="Simulation runs"
              />

              <p class="hint">
                Higher volatility widens the probability band.
              </p>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.mc-settings {
  position: relative;
}

.settings-trigger {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--interactive-surface);
  border: 1px solid var(--border-base);
  color: var(--interactive-base);
  transition: all 0.2s ease;
}

.settings-trigger:hover,
.settings-trigger.active {
  background: var(--interactive-base);
  color: var(--surface-raised);
}

.mc-popover {
  position: fixed;
  z-index: 200;
  width: 320px;
  background: var(--surface-raised);
  border: 1px solid var(--border-base);
  border-radius: var(--radius);
  box-shadow: var(--shadow-elevated);
  backdrop-filter: blur(var(--glass-blur));
}

.mc-popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.mc-popover-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  font-family: var(--font-serif);
}

.mc-popover-body {
  padding: 16px 20px;
  display: grid;
  gap: 16px;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--interactive-surface);
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
