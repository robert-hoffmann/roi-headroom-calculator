import { computed } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore'

/**
 * Composable for theme management
 */
export function useTheme() {
  const store = useCalculatorStore()

  const currentTheme = computed(() => store.currentTheme)
  const isDark = computed(() => store.currentTheme === 'dark')

  function toggleTheme() {
    store.toggleTheme()
  }

  function setTheme(theme: 'light' | 'dark') {
    store.setTheme(theme)
  }

  function initializeTheme() {
    store.initializeTheme()
  }

  /**
   * Gets a CSS custom property value
   */
  function getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
    initializeTheme,
    getCSSVariable
  }
}
