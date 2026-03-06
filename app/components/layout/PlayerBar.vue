<template>
  <div class="bg-[#0f1115] pt-4 pb-6 px-10 border-t border-white/5">
    <div 
      class="relative w-full h-1 bg-slate-800 rounded-full mb-6 group cursor-pointer" 
      @mousedown="handleProgressClick"
    >
      <div 
        class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-[width] duration-150"
        :style="{ width: `${progressPercent}%` }"
      ></div>
      <div 
        class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        :style="{ left: `${progressPercent}%` }"
      ></div>
    </div>

    <div class="flex items-center justify-between">
      <div class="text-slate-400 font-mono text-sm w-32">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>

      <div class="flex items-center gap-8">
        <button @click="skip(-10)" class="text-slate-400 hover:text-white transition">
          <Icon name="lucide:rewind" size="24" />
        </button>
        
        <button @click="prevLesson" class="text-slate-400 hover:text-white transition">
          <Icon name="lucide:skip-back" size="24" fill="currentColor" />
        </button>
        
        <button 
          @click="handleToggle"
          class="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-white/10 shadow-xl hover:scale-105 transition active:scale-95"
        >
          <Icon :name="isPlaying ? 'lucide:pause' : 'lucide:play'" class="text-black" size="28" fill="black" />
        </button>

        <button @click="nextLesson" class="text-slate-400 hover:text-white transition">
          <Icon name="lucide:skip-forward" size="24" fill="currentColor" />
        </button>

        <button @click="skip(10)" class="text-slate-400 hover:text-white transition">
          <Icon name="lucide:fast-forward" size="24" />
        </button>
      </div>

      <div class="flex items-center gap-6 w-48 justify-end">
        <button class="text-slate-500 hover:text-blue-400 transition"><Icon name="lucide:repeat" size="20" /></button>
        <button class="text-slate-500 hover:text-blue-400 transition"><Icon name="lucide:log-in" size="20" /></button>
        
        <button 
          @click="toggleSpeed" 
          class="px-2 py-0.5 border border-slate-700 rounded text-xs font-bold text-slate-400 hover:text-white hover:border-slate-500 transition min-w-[35px]"
        >
          {{ playbackRate }}x
        </button>
        <button @click="toggleMute" class="text-slate-400 hover:text-white transition">
            <Icon :name="isMuted || volume === 0 ? 'lucide:volume-x' : volume < 0.5 ? 'lucide:volume-1' : 'lucide:volume-2'" size="22" />
        </button>
      </div>
    </div>
    <!-- <div class="flex flex-col items-center mt-4 pb- space-y-6">
        <div class="text-center space-y-1">
        <p class="text-slate-600 text-[11px]">© 2026 EnglishPod. All rights reserved.</p>
        <p class="text-slate-500 text-[11px] flex items-center justify-center gap-1">
            Made with <Icon name="lucide:heart" class="text-red-500" size="12" /> by Malzahar
        </p>
        </div>

        <a 
        href="#" 
        class="bg-[#ffdd00] hover:bg-[#ffea00] text-black px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-yellow-900/10 transition-transform active:scale-95"
        >
        <Icon name="lucide:coffee" size="18" />
        Buy me a coffee
        </a>
  </div> -->
  </div>
</template>

<script setup>
const lessonStore = useLessonStore()
const { isPlaying, currentTime, duration, playbackRate, togglePlay, seek, formatTime, audio } = useAudio()

const volume = ref(1) // 1 là 100%
const isMuted = ref(false)
const previousVolume = ref(1)

const toggleMute = () => {
  if (!audio.value) return
  if (isMuted.value) {
    volume.value = previousVolume.value
    audio.value.volume = volume.value
    isMuted.value = false
  } else {
    previousVolume.value = volume.value
    volume.value = 0
    audio.value.volume = 0
    isMuted.value = true
  }
}

const handleVolumeChange = (e) => {
  const val = parseFloat(e.target.value)
  volume.value = val
  if (audio.value) {
    audio.value.volume = val
  }
  isMuted.value = val === 0
}

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// --- CÁC ACTIONS GIỐNG HỆT ẢNH MẪU ---

const handleToggle = () => {
  if (lessonStore.activeLesson?.audioUrl) {
    togglePlay(lessonStore.activeLesson.audioUrl)
  }
}

const skip = (seconds) => {
  seek(currentTime.value + seconds)
}

const handleProgressClick = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = x / rect.width
  seek(percentage * duration.value)
}

const toggleSpeed = () => {
  const speeds = [1, 1.25, 1.5, 2]
  const currentIndex = speeds.indexOf(playbackRate.value)
  const nextIndex = (currentIndex + 1) % speeds.length
  const newSpeed = speeds[nextIndex]
  
  playbackRate.value = newSpeed
  if (audio.value) {
    audio.value.playbackRate = newSpeed
  }
}

const nextLesson = () => {
  const nextId = lessonStore.currentLessonId + 1
  if (nextId <= lessonStore.lessons.length) {
    lessonStore.setCurrentLesson(nextId)
  }
}

const prevLesson = () => {
  const prevId = lessonStore.currentLessonId - 1
  if (prevId >= 1) {
    lessonStore.setCurrentLesson(prevId)
  }
}
</script>