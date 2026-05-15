<template>
  <div class="bg-[#16181d] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
    <div class="p-5 border-b border-slate-800 flex justify-between items-center bg-[#1c2027]">
      <h3 class="text-sm font-semibold text-slate-300">Transcript / Notes</h3>
      <button
        class="flex items-center gap-2 px-3 py-1.5 bg-[#252a33] hover:bg-[#2d333d] rounded-lg text-xs text-slate-400 transition-colors"
        @click="isShowing = !isShowing"
      >
        <Icon :name="isShowing ? 'lucide:eye-off' : 'lucide:eye'" size="14" />
        {{ isShowing ? 'Hide' : 'Show' }}
      </button>
    </div>

    <div class="p-8 space-y-6">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-2">{{ lesson.level }} - {{ lesson.title }}</h2>
      </div>

      <div v-show="isShowing" class="space-y-6 transition-all duration-300">
        <div v-for="(line, index) in lesson.transcript" :key="index" class="flex gap-8 group">
          <span class="text-blue-500 font-bold text-lg w-4 flex-shrink-0">{{ line.speaker }}</span>
          <p class="text-slate-300 leading-relaxed font-medium italic">
            {{ line.text }}
          </p>
        </div>
      </div>

      <div v-show="!isShowing" class="py-10 text-center text-slate-600 italic">
        Transcript is hidden. Click "Show" to read.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lesson: Object
})
const isShowing = ref(true)
</script>
