<template>
  <div class="w-full bg-[#16181d]/50 border-b border-white/5 py-2 px-4 overflow-hidden">
    <div
      class="whitespace-nowrap animate-marquee text-[11px] text-slate-500 font-medium text-center"
    >
      You are building something great! Mastering English takes patience, but you have the power.
      Keep going, and never stop challenging yourself.
    </div>
  </div>
</template>

<style scoped>
/* Nếu bạn muốn chữ chạy (marquee) */
.animate-marquee {
  display: inline-block;
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
