import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { HubPage } from './hub/HubPage'
import { RevelarGame } from './games/revelar/RevelarGame'
import { PistasGame } from './games/pistas/PistasGame'
import { QuizGame } from './games/quiz/QuizGame'
import { MediteGame } from './games/medite/MediteGame'
import { PwaUpdater } from './components/PwaUpdater'

export default function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null)

  return (
    <div className="h-full w-full bg-amber-50 relative">
      {currentGame === null && <HubPage onSelectGame={setCurrentGame} />}
      {currentGame === 'revelar' && <RevelarGame onBackToHub={() => setCurrentGame(null)} />}
      {currentGame === 'pistas' && <PistasGame onBackToHub={() => setCurrentGame(null)} />}
      {currentGame === 'quiz' && <QuizGame onBackToHub={() => setCurrentGame(null)} />}
      {currentGame === 'medite' && <MediteGame onBackToHub={() => setCurrentGame(null)} />}
      
      {/* Componente que verifica atualizações do app */}
      <PwaUpdater />

      {/* Vercel Analytics — coleta visitantes e page views */}
      <Analytics />
    </div>
  )
}
