// server/api/daily.ts
import vocabularyData from '../data/vocabulary.json'

export default defineCachedEventHandler(
  (event) => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const seed = parseInt(today)

    const shuffled = [...vocabularyData].sort((a, b) => {
      const hashA = (seed * a.hiddenWord.length) % 100
      const hashB = (seed * b.hiddenWord.length) % 100
      return hashA - hashB
    })
    return shuffled.slice(0, 10)
  },
  {
    maxAge: 60 * 60 * 24,
    name: 'daily-words'
  }
)
