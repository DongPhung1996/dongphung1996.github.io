<template>
  <div class="space-y-8">
    <div class="flex justify-end items-center gap-2 mb-6 p-2 bg-[#1e232d] rounded-lg">
      <span class="text-sm font-medium text-blue-400">Chế độ luyện tập (Ẩn tiếng Anh)</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="isPracticeMode" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>

    <div v-for="(group, gIndex) in data" :key="gIndex">
      <h3 class="font-bold text-lg">{{ group.category }}</h3>
        <div
            v-for="(item, iIndex) in group.list"
            :key="iIndex"
            @click="speak(item.en)"
        class="cursor-pointer group p-3 rounded-lg transition-all"
        >
            <p 
            :class="[
                'text-[17px] font-medium transition-all duration-300 text-green-600',
                isPracticeMode ? 'filter blur-sm select-none opacity-30 group-hover:blur-none group-hover:opacity-100' : ''
            ]"
            >
            {{ item.en }}
            </p>
            <p class="text-sm text-slate-400 mt-1">{{ item.vi }}</p>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['data'])
const isPracticeMode = ref(false)
const speak = (text) => {
  window.speechSynthesis.cancel()
  const msg = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices
  const premiumVoice = voices.find(v =>
    v.name.includes('Google US English')
  )
  if (premiumVoice) msg.voice = premiumVoice
  msg.rate = 0.8
  msg.pitch = 1
  window.speechSynthesis.speak(msg)
}
</script>