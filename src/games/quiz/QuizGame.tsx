import { useState } from 'react'
import quizData from '../../assets/quiz.json'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

type Quiz = {
  id: string
  pergunta: string
  opcoes: string[]
  resposta_correta: number
  explicacao: string
}

type GameState = 'CONFIG' | 'PLAYING' | 'GAMEOVER'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function QuizGame({ onBackToHub }: { onBackToHub: () => void }) {
  const [gameState, setGameState] = useState<GameState>('CONFIG')
  const [maxQuestions, setMaxQuestions] = useState(10)
  
  const [perguntas, setPerguntas] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const startGame = () => {
    const shuffled = shuffle(quizData as Quiz[]).slice(0, Math.min(maxQuestions, quizData.length))
    setPerguntas(shuffled)
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setGameState('PLAYING')
  }

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
    setIsAnswered(true)

    const isCorrect = idx === perguntas[currentIndex].resposta_correta
    if (isCorrect) {
      setScore(prev => prev + 10)
      // Dispara confetes!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#d946ef', '#10b981', '#f59e0b']
      })
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= perguntas.length) {
      setGameState('GAMEOVER')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    }
  }

  const perguntaAtual = perguntas[currentIndex]

  return (
    <div className="flex flex-col h-full relative bg-purple-50 text-slate-800">
      <header className="flex items-center p-4 bg-purple-100 border-b border-purple-200 shrink-0">
        <button onClick={onBackToHub} className="p-2 -ml-2 text-purple-600 hover:bg-purple-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <img src="/logo-copiste.png" alt="Copiste" className="h-8 ml-2" />
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
        {gameState === 'CONFIG' && (
          <div className="flex flex-col items-stretch justify-center h-full max-w-md mx-auto space-y-8 pb-12">
            <div className="text-center space-y-1">
              <p className="text-4xl">✨</p>
              <h2 className="text-2xl font-black text-purple-900 uppercase tracking-widest">Quiz Bíblico</h2>
              <p className="text-sm text-purple-600">Teste seu conhecimento de múltipla escolha!</p>
            </div>

            <div>
              <label htmlFor="q-rounds" className="block text-sm font-bold text-purple-800 mb-1">Número de Perguntas</label>
              <select id="q-rounds" value={maxQuestions} onChange={e => setMaxQuestions(Number(e.target.value))}
                className="w-full p-4 border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none bg-white font-bold text-purple-900 shadow-sm">
                <option value={5}>5 Perguntas</option>
                <option value={10}>10 Perguntas</option>
                <option value={9999}>Todas as Perguntas</option>
              </select>
            </div>

            <div className="flex-1" />

            <button onClick={startGame} className="w-full py-5 bg-slate-200 text-purple-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[8px] transition-all">
              🎮 Iniciar Quiz
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && perguntaAtual && (
          <div className="flex flex-col h-full max-w-md mx-auto">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              <span className="bg-purple-200 text-purple-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                Pergunta {currentIndex + 1} de {perguntas.length}
              </span>
              <span className="text-lg font-black text-purple-600">{score} pts</span>
            </div>

            {/* Pergunta */}
            <h2 className="text-2xl font-black text-slate-800 leading-tight mb-8 text-center">
              {perguntaAtual.pergunta}
            </h2>

            {/* Opções */}
            <div className="space-y-4 flex-1">
              {perguntaAtual.opcoes.map((opcao, idx) => {
                const isSelected = selectedOption === idx
                const isCorrect = idx === perguntaAtual.resposta_correta
                
                let btnStyle = "bg-slate-200 border-none text-slate-700 shadow-[0_4px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[4px]"
                let icon = null

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-slate-200 border-2 border-emerald-500 text-emerald-600 shadow-[0_4px_0_0_#94a3b8]"
                    icon = <CheckCircle className="text-emerald-500" />
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-slate-200 border-2 border-rose-500 text-rose-600 shadow-[0_4px_0_0_#94a3b8]"
                    icon = <XCircle className="text-rose-500" />
                  } else {
                    btnStyle = "bg-slate-200 border-2 border-slate-300 text-slate-400 opacity-50"
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl font-bold text-lg text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opcao}</span>
                    {icon && <span className="ml-2">{icon}</span>}
                  </button>
                )
              })}
            </div>

            {/* Explicação e Próximo */}
            {isAnswered && (
              <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300 bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-lg">
                <p className="text-xs font-black uppercase text-purple-600 tracking-widest mb-2">
                  {selectedOption === perguntaAtual.resposta_correta ? 'Acertou! 🎉' : 'Errou...'}
                </p>
                <p className="text-sm text-slate-700 italic mb-5 leading-relaxed">
                  {perguntaAtual.explicacao}
                </p>
                <button onClick={handleNext}
                  className="w-full py-4 bg-slate-200 text-purple-600 font-black uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[6px] transition-all">
                  Continuar ➡️
                </button>
              </div>
            )}
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className="flex flex-col h-full max-w-md mx-auto items-center justify-center space-y-6 pb-28">
            <p className="text-6xl">🎓</p>
            <h2 className="text-2xl font-black text-purple-900 uppercase tracking-widest text-center">Fim do Quiz!</h2>
            
            <div className="w-full bg-purple-600 rounded-3xl p-8 text-center text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-widest text-purple-200 mb-2">Pontuação Final</p>
              <p className="text-6xl font-black">{score}</p>
              <p className="text-lg font-bold text-purple-200 mt-2">de {perguntas.length * 10} possíveis</p>
            </div>

            <button onClick={() => setGameState('CONFIG')}
              className="w-full py-5 bg-slate-200 text-emerald-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[8px] transition-all mt-8">
              🔄 Jogar Novamente
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
