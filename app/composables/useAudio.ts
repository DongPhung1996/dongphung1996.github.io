// app/composables/useAudio.ts
import { ref, onMounted, watch } from 'vue'

export const useAudio = () => {
  // Đối tượng audio duy nhất cho toàn ứng dụng
  const audio = ref<HTMLAudioElement | null>(null)

  // Các trạng thái reactive để UI nhận biết
  const isPlaying = useState('audio_isPlaying', () => false)
  const currentTime = useState('audio_currentTime', () => 0)
  const duration = useState('audio_duration', () => 0)
  const playbackRate = useState('audio_speed', () => 1)

  onMounted(() => {
    // Khởi tạo audio object
    audio.value = new Audio()

    // Cập nhật tổng thời gian khi file nhạc load xong
    audio.value.onloadedmetadata = () => {
      duration.value = audio.value?.duration || 0
    }

    // Cập nhật thời gian thực khi nhạc đang phát
    audio.value.ontimeupdate = () => {
      currentTime.value = audio.value?.currentTime || 0
    }

    // Tự động chuyển trạng thái khi hết bài
    audio.value.onended = () => {
      isPlaying.value = false
    }
  })

  // Hàm phát nhạc
  const play = (url: string) => {
    if (!audio.value) return

    // Nếu đổi bài mới thì load lại src
    if (audio.value.src !== window.location.origin + url) {
      audio.value.src = url
      audio.value.load()
    }

    audio.value.play()
    isPlaying.value = true
  }

  // Hàm tạm dừng
  const pause = () => {
    audio.value?.pause()
    isPlaying.value = false
  }

  // Hàm toggle (Play/Pause) dùng cho nút chính giữa
  const togglePlay = (url: string) => {
    if (isPlaying.value) {
      pause()
    } else {
      play(url)
    }
  }

  // Hàm tua nhạc (seek) dùng khi click vào thanh progress
  const seek = (time: number) => {
    if (audio.value) {
      // Đảm bảo thời gian không âm và không vượt quá tổng thời lượng
      const targetTime = Math.max(0, Math.min(time, duration.value))
      audio.value.currentTime = targetTime
      currentTime.value = targetTime
    }
  }

  // Hàm định dạng thời gian 00:00
  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    audio,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    togglePlay,
    pause,
    seek,
    formatTime
  }
}
