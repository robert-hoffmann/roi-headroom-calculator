import { ref, onMounted, onBeforeUnmount } from 'vue'
import { driver, type DriveStep, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { TourStep, TourState } from '../types'

const TOUR_STEPS: TourStep[] = [
  {
    element: '.app-header',
    popover: {
      title: 'Welcome to ROI Headroom Studio',
      description:
        'This tool helps you calculate how much starting capital you need to sustain monthly withdrawals over time, given different growth rate assumptions.'
    },
    tts: 'Welcome to ROI Headroom Studio. This tool helps you calculate how much starting capital you need to sustain monthly withdrawals over time, given different growth rate assumptions.'
  },
  {
    element: '.overview .hero-metrics',
    popover: {
      title: 'Key Metrics at a Glance',
      description:
        'These four cards show your most important numbers: the required starting capital, the growth rate needed for your current capital, how long until you reach your target, and your projected end balance.'
    },
    tts: 'These four cards show your most important numbers: the required starting capital, the growth rate needed for your current capital, how long until you reach your target, and your projected end balance.'
  },
  {
    element: '.overview > .panel:last-child',
    popover: {
      title: 'Balance Path',
      description:
        "This chart shows your projected account balance over time. It displays the accumulation phase where you contribute, followed by the withdrawal phase. With Monte Carlo enabled, you'll see probability bands."
    },
    tts: "This chart shows your projected account balance over time. It displays the accumulation phase where you contribute, followed by the withdrawal phase. With Monte Carlo enabled, you'll see probability bands."
  },
  {
    element: 'section:nth-of-type(2) .panel:first-child',
    popover: {
      title: 'Range Builder',
      description:
        'Use the Range Builder to set the boundaries for your scenarios. Adjust the minimum, maximum, and step values for monthly targets, time horizons, and growth rates. The chips below preview your generated values.'
    },
    tts: 'Use the Range Builder to set the boundaries for your scenarios. Adjust the minimum, maximum, and step values for monthly targets, time horizons, and growth rates. The chips below preview your generated values.'
  },
  {
    element: 'section:nth-of-type(2) .panel:last-child',
    popover: {
      title: 'Select Your Scenario',
      description:
        'Use these sliders to pick a specific scenario to analyze. Choose your desired monthly withdrawal, how many years you want the money to last, and your expected annual growth rate.'
    },
    tts: 'Use these sliders to pick a specific scenario to analyze. Choose your desired monthly withdrawal, how many years you want the money to last, and your expected annual growth rate.'
  },
  {
    element: '.contribution-section .panel',
    popover: {
      title: 'Contribution Plan',
      description:
        'Configure your accumulation phase here. Enter your starting capital, set up recurring contributions, and optionally enable Monte Carlo simulation to see probability ranges based on market volatility.'
    },
    tts: 'Configure your accumulation phase here. Enter your starting capital, set up recurring contributions, and optionally enable Monte Carlo simulation to see probability ranges based on market volatility.'
  }
]

/**
 * Composable for managing the guided tour with TTS support
 */
export function useTour() {
  const state = ref<TourState>({
    isSpeaking: false,
    isPaused: false,
    currentUtterance: null,
    ttsSupported: typeof window !== 'undefined' && 'speechSynthesis' in window
  })

  let driverInstance: Driver | null = null

  // === TTS Methods ===

  function speakText(text: string) {
    if (!state.value.ttsSupported) return

    stopTTS()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => {
      state.value.isSpeaking = true
      state.value.isPaused = false
      updateTTSButtonState()
    }

    utterance.onend = () => {
      state.value.isSpeaking = false
      state.value.isPaused = false
      state.value.currentUtterance = null
      updateTTSButtonState()
    }

    utterance.onerror = () => {
      state.value.isSpeaking = false
      state.value.isPaused = false
      state.value.currentUtterance = null
      updateTTSButtonState()
    }

    state.value.currentUtterance = utterance
    speechSynthesis.speak(utterance)
  }

  function pauseTTS() {
    if (!state.value.ttsSupported || !state.value.isSpeaking) return
    speechSynthesis.pause()
    state.value.isPaused = true
    updateTTSButtonState()
  }

  function resumeTTS() {
    if (!state.value.ttsSupported || !state.value.isPaused) return
    speechSynthesis.resume()
    state.value.isPaused = false
    updateTTSButtonState()
  }

  function stopTTS() {
    if (!state.value.ttsSupported) return
    speechSynthesis.cancel()
    state.value.isSpeaking = false
    state.value.isPaused = false
    state.value.currentUtterance = null
    updateTTSButtonState()
  }

  function toggleTTS() {
    if (state.value.isSpeaking && !state.value.isPaused) {
      pauseTTS()
    } else if (state.value.isPaused) {
      resumeTTS()
    } else {
      // Get current step's TTS text
      if (driverInstance) {
        const driverState = driverInstance.getState()
        if (driverState && driverState.activeIndex !== undefined) {
          const step = TOUR_STEPS[driverState.activeIndex]
          if (step && step.tts) {
            speakText(step.tts)
          }
        }
      }
    }
  }

  function updateTTSButtonState() {
    const ttsBtn = document.querySelector('.tour-tts-btn')
    const pauseBtn = document.querySelector('.tour-pause-btn')

    if (ttsBtn) {
      ttsBtn.classList.toggle('speaking', state.value.isSpeaking && !state.value.isPaused)
      ttsBtn.classList.toggle('paused', state.value.isPaused)

      if (state.value.isSpeaking && !state.value.isPaused) {
        ttsBtn.innerHTML = getSpeakingIcon()
        ttsBtn.setAttribute('title', 'Pause narration')
      } else if (state.value.isPaused) {
        ttsBtn.innerHTML = getPausedIcon()
        ttsBtn.setAttribute('title', 'Resume narration')
      } else {
        ttsBtn.innerHTML = getSpeakerIcon()
        ttsBtn.setAttribute('title', 'Play narration')
      }
    }

    if (pauseBtn) {
      pauseBtn.classList.toggle('visible', state.value.isSpeaking)
    }
  }

  function getSpeakerIcon(): string {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>`
  }

  function getSpeakingIcon(): string {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>`
  }

  function getPausedIcon(): string {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>`
  }

  // === Tour Methods ===

  function injectTTSControls(popoverWrapper: Element, _stepIndex: number) {
    const footer = popoverWrapper.querySelector('.driver-popover-footer')
    if (!footer) return

    if (footer.querySelector('.tour-controls')) return

    const controlsDiv = document.createElement('div')
    controlsDiv.className = 'tour-controls'

    if (state.value.ttsSupported) {
      const ttsBtn = document.createElement('button')
      ttsBtn.className = 'tour-tts-btn'
      ttsBtn.title = 'Play narration'
      ttsBtn.innerHTML = getSpeakerIcon()
      ttsBtn.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleTTS()
      }
      controlsDiv.appendChild(ttsBtn)
    }

    const navBtns = footer.querySelector('.driver-popover-navigation-btns')
    if (navBtns) {
      footer.insertBefore(controlsDiv, navBtns)
    } else {
      footer.appendChild(controlsDiv)
    }
  }

  function startTour() {
    if (driverInstance) {
      driverInstance.destroy()
    }
    stopTTS()

    const steps: DriveStep[] = TOUR_STEPS.map((step, index) => ({
      element: step.element,
      popover: {
        title: step.popover.title,
        description: step.popover.description,
        showButtons: ['next', 'previous', 'close'] as ('next' | 'previous' | 'close')[],
        nextBtnText: index === TOUR_STEPS.length - 1 ? 'Finish' : 'Next',
        prevBtnText: 'Previous',
        showProgress: true,
        onPopoverRender: (popover: { wrapper: Element }) => {
          injectTTSControls(popover.wrapper, index)
        }
      }
    }))

    driverInstance = driver({
      animate: true,
      showProgress: true,
      smoothScroll: true,
      allowClose: true,
      stagePadding: 8,
      stageRadius: 12,
      popoverOffset: 12,
      steps,
      onHighlightStarted: () => {
        stopTTS()
      },
      onDestroyStarted: () => {
        stopTTS()
      },
      onDestroyed: () => {
        driverInstance = null
        stopTTS()
      }
    })

    driverInstance.drive()
  }

  function handleVisibilityChange() {
    if (document.hidden && state.value.isSpeaking && !state.value.isPaused) {
      pauseTTS()
    }
  }

  function cleanup() {
    if (driverInstance) {
      driverInstance.destroy()
      driverInstance = null
    }
    stopTTS()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    state,
    startTour,
    stopTTS,
    cleanup
  }
}
