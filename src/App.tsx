import { useState } from 'react'
import { HubPage } from './hub/HubPage'
import { RevelarGame } from './games/revelar/RevelarGame'

export default function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null)

  return (
    <div className="h-full w-full bg-amber-50">
      {currentGame === null && <HubPage onSelectGame={setCurrentGame} />}
      {currentGame === 'revelar' && <RevelarGame onBackToHub={() => setCurrentGame(null)} />}
    </div>
  )
}
