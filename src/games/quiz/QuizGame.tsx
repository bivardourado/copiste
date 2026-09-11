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
  dificuldade?: 'facil' | 'medio' | 'dificil'
}

type GameState = 'CONFIG' | 'PLAYING' | 'GAMEOVER'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function QuizGame({ onBackToHub }: { onBackToHub: () => void }) {
  const [gameState, setGameState] = useState<GameState>('CONFIG')
  const [maxQuestions, setMaxQuestions] = useState(10)
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('facil')
  
  const [perguntas, setPerguntas] = useState<Quiz[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const startGame = () => {
    // Filtra pela dificuldade e embaralha
    const filtradas = (quizData as Quiz[]).filter(q => q.dificuldade === dificuldade || !q.dificuldade)
    const shuffled = shuffle(filtradas).slice(0, Math.min(maxQuestions, filtradas.length))
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
      <header className="flex items-center px-3 py-2 bg-purple-100 border-b border-purple-200 shrink-0">
        <button onClick={onBackToHub} className="p-1.5 -ml-1 text-purple-600 hover:bg-purple-200 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <img src="/logo-copiste.png" alt="Copiste" className="h-6 ml-2" />
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 pb-24">
        {gameState === 'CONFIG' && (
          <div className="flex flex-col items-stretch justify-center h-full max-w-md mx-auto space-y-4 px-2">

            <div className="text-center">
              <h2 className="text-xl font-black text-purple-900 uppercase tracking-widest">✨ Quiz Bíblico</h2>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Dificuldade</p>
              <div className="flex space-x-3">
                {([
                  { key: 'facil',   emoji: '🟢', label: 'Fácil' },
                  { key: 'medio',   emoji: '🟡', label: 'Médio' },
                  { key: 'dificil', emoji: '🔴', label: 'Difícil' },
                ] as const).map(({ key, emoji, label }) => (
                  <button key={key} onClick={() => setDificuldade(key)}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_4px_0_0_#94a3b8] active:shadow-none active:translate-y-[4px] flex items-center justify-center space-x-1.5
                      ${dificuldade === key ? 'bg-slate-200 text-purple-600' : 'bg-slate-200 text-slate-400'}`}>
                    <span>{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Perguntas</label>
              <select value={maxQuestions} onChange={e => setMaxQuestions(Number(e.target.value))}
                className="w-full p-2.5 border border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-purple-900 text-sm">
                <option value={5}>5 Perguntas</option>
                <option value={10}>10 Perguntas</option>
                <option value={20}>20 Perguntas</option>
                <option value={9999}>Todas as Perguntas</option>
              </select>
            </div>

            <button onClick={startGame}
              className="w-full py-4 bg-slate-200 text-purple-600 font-black text-lg uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px] transition-all mt-2">
              🎮 Iniciar Quiz
            </button>
          </div>
        )}

        {gameState === 'PLAYING' && perguntaAtual && (
          <div className="flex flex-col h-full max-w-md mx-auto">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-3 shrink-0">
              <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Pergunta {currentIndex + 1} de {perguntas.length}
              </span>
              <span className="text-base font-black text-purple-600">{score} pts</span>
            </div>

            {/* Pergunta */}
            <h2 className="text-lg font-black text-slate-800 leading-snug mb-4 text-center">
              {perguntaAtual.pergunta}
            </h2>

            {/* Opções */}
            <div className="space-y-2 flex-1">
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
                    className={`w-full p-3 rounded-2xl font-bold text-base text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opcao}</span>
                    {icon && <span className="ml-2">{icon}</span>}
                  </button>
                )
              })}
            </div>

            {/* Explicação inline + Dock fixo com Continuar */}
            {isAnswered && (
              <>
                <div className="mt-6 mb-32 animate-in slide-in-from-bottom-4 duration-300 bg-white rounded-3xl p-5 border-2 border-purple-100 shadow-sm">
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${selectedOption === perguntaAtual.resposta_correta ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {selectedOption === perguntaAtual.resposta_correta ? 'Acertou! 🎉' : 'Errou...'}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {perguntaAtual.explicacao}
                  </p>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50 bg-gradient-to-t from-purple-50 via-purple-50 to-transparent pt-10">
                  <div className="max-w-md mx-auto">
                    <button onClick={handleNext}
                      className={`w-full py-5 font-black text-xl uppercase tracking-widest rounded-2xl transition-all
                        ${selectedOption === perguntaAtual.resposta_correta
                          ? 'bg-slate-200 text-emerald-600 shadow-[0_8px_0_0_#94a3b8] active:shadow-none active:translate-y-[8px]'
                          : 'bg-slate-200 text-rose-600 shadow-[0_8px_0_0_#94a3b8] active:shadow-none active:translate-y-[8px]'
                        }`}>
                      Continuar
                    </button>
                  </div>
                </div>
              </>
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
