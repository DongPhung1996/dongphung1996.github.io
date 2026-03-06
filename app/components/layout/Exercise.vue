<template>
  <div class="max-w-4xl mx-auto py-8 px-4 bg-[#0f172a] min-h-screen text-slate-200 rounded-xl">
    
    <div class="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-md pb-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-2">
          <UIcon 
            v-for="n in 3" :key="n"
            :name="n <= lives ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
            :class="n <= lives ? 'text-red-500' : 'text-slate-700'"
            class="w-8 h-8 transition-all duration-300"
          />
        </div>

        <div class="text-right">
          <span class="text-xs font-bold text-slate-500 uppercase">Progress</span>
          <p class="text-xl font-black text-blue-400">{{ correctCount }}/{{ shuffledExercises.length }}</p>
        </div>
      </div>

      <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div 
          class="h-full bg-gradient-to-r from-blue-600 to-green-400 transition-all duration-500"
          :style="{ width: `${(correctCount / shuffledExercises.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <div v-if="lives <= 0" class="text-center py-20 bg-[#1e293b] rounded-3xl border-2 border-red-900/50 animate-in fade-in zoom-in">
      <UIcon name="i-heroicons-face-frown" class="w-20 h-20 text-red-500 mb-4" />
      <h2 class="text-3xl font-black text-white mb-2">Hết lượt mất rồi!</h2>
      <p class="text-slate-400 mb-8">Đừng nản lòng, luyện tập lại để nhớ lâu hơn nhé.</p>
      <UButton size="xl" color="red" label="Thử lại ngay" @click="startNewGame" />
    </div>

    <div v-else-if="correctCount === shuffledExercises.length && shuffledExercises.length > 0" class="text-center py-20 bg-[#1e293b] rounded-3xl border-2 border-green-900/50">
      <UIcon name="i-heroicons-trophy" class="w-20 h-20 text-yellow-400 mb-4" />
      <h2 class="text-3xl font-black text-white mb-2">Tuyệt vời!</h2>
      <p class="text-slate-400 mb-8">Bạn đã hoàn thành xuất sắc tất cả các câu hỏi.</p>
      <UButton size="xl" color="green" label="Chơi ván mới" @click="startNewGame" />
    </div>

    <div v-else class="space-y-6 mt-6">
      <div 
        v-for="(ex, index) in shuffledExercises" 
        :key="ex.id" 
        class="p-8 bg-[#1e293b] border border-slate-800 rounded-3xl shadow-lg relative overflow-hidden"
        :class="{'opacity-50 grayscale pointer-events-none': isCompleted(ex)}"
      >
        <div class="flex justify-between items-start mb-6">
          <span class="text-xs font-black text-slate-500 uppercase tracking-widest">Question #{{ index + 1 }}</span>
          <p class="text-sm text-slate-400 italic text-right max-w-[60%]">{{ ex.vi }}</p>
        </div>

        <div class="text-xl font-medium leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-4">
          <template v-for="(part, pIdx) in ex.sentence.split('________')" :key="pIdx">
            <span>{{ part }}</span>
            <input 
              v-if="pIdx < ex.sentence.split('________').length - 1"
              v-model="userAnswers[ex.id]"
              @keyup.enter="checkAnswer(ex)"
              type="text"
              class="min-w-[140px] px-3 py-1 bg-[#0f172a] border-b-2 outline-none transition-all text-center font-bold"
              :class="getInputClass(ex)"
              :disabled="isCompleted(ex)"
              placeholder="....."
            />
          </template>
        </div>
        <div class="mt-6 flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <button 
                @click="toggleHint(ex.id)" 
                class="text-xs font-bold flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg border"
                :class="showHint[ex.id] 
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'"
              >
                <UIcon :name="showHint[ex.id] ? 'i-heroicons-light-bulb-solid' : 'i-heroicons-light-bulb'" class="w-4 h-4" />
                {{ showHint[ex.id] ? 'Đang hiện gợi ý' : 'Cần gợi ý?' }}
              </button>

              <button 
                v-if="isCompleted(ex)"
                @click="speak(ex.hiddenWord)"
                class="text-xs font-bold text-green-400 flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/30"
              >
                <UIcon name="i-heroicons-speaker-wave" class="w-4 h-4" />
                Nghe lại
              </button>
            </div>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div v-if="showHint[ex.id]" class="bg-slate-900/50 border border-slate-700 p-4 rounded-xl">
                <p class="text-xs text-orange-300/90 leading-relaxed">
                  <span class="font-black">💡 GỢI Ý:</span> {{ ex.hint }}
                </p>
              </div>
            </Transition>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import confetti from 'canvas-confetti'
const props = defineProps(['data'])
const shuffledExercises = ref([])
const userAnswers = ref({})
const lives = ref(3)
const completedIds = ref(new Set())
const showHint = ref({})

const toggleHint = (id) => {
  showHint.value[id] = !showHint.value[id]
}

const startNewGame = () => {
  shuffledExercises.value = props.data.sort(() => Math.random() - 0.5)
  userAnswers.value = {}
  lives.value = 3
  completedIds.value.clear()
  showHint.value = {}
}
const correctCount = computed(() => completedIds.value.size)

const checkAnswer = (ex) => {
  if (completedIds.value.has(ex.id)) return

  const userAns = userAnswers.value[ex.id]?.toLowerCase().trim()
  if (userAns === ex.hiddenWord.toLowerCase()) {
    completedIds.value.add(ex.id)
  
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#60a5fa', '#4ade80', '#fbbf24']
    })
    if (completedIds.value.size === shuffledExercises.value.length) {
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()
        if (timeLeft <= 0) return clearInterval(interval)
        const particleCount = 50 * (timeLeft / duration)
        confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } })
      }, 250)
    }
  } else {
    lives.value--
  }
};

const isCompleted = (ex) => completedIds.value.has(ex.id)

const getInputClass = (ex) => {
  if (isCompleted(ex)) return 'border-green-500 text-green-400 bg-green-950/20'
  const val = userAnswers.value[ex.id]
  if (val && val.length >= ex.hiddenWord.length && val.toLowerCase().trim() !== ex.hiddenWord.toLowerCase()) {
    return 'border-red-500 text-red-400 bg-red-950/20 animate-shake'
  }
  return 'border-slate-600 text-blue-400 focus:border-blue-500'
}

onMounted(startNewGame)
</script>