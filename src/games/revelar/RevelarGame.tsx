import { useState } from 'react'
import perguntasData from '../../assets/perguntas_revelar.json'
import { ArrowLeft, Check, X, ExternalLink } from 'lucide-react'

// Tipos
export type Pergunta = {
  id_pergunta: string
  capitulo: number
  titulo_capitulo: string
  dificuldade: string
  pergunta: string
  resposta: string
  curiosidade_extra: string
  textosBiblicos?: string
  link?: string
}

type GameState = 'CONFIG' | 'PLAYING' | 'GAMEOVER'

export function RevelarGame({ onBackToHub }: { onBackToHub: () => void }) {
  const [gameState, setGameState] = useState<GameState>('CONFIG')
  
  // Config state
  const [isGroup, setIsGroup] = useState(false)
  const [team1, setTeam1] = useState('Equipe Fé')
  const [team2, setTeam2] = useState('Equipe Esperança')
  const [maxQuestions, setMaxQuestions] = useState(10)

  // Playing state
  const [teams, setTeams] = useState<string[]>([])
  const [scores, setScores] = useState<Record<string, number>>({})
  const [questions, setQuestions] = useState<Pergunta[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [turnIndex, setTurnIndex] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  const startGame = () => {
    const selectedTeams = isGroup ? [team1.trim(), team2.trim()] : ['Jogador 1']
    if (isGroup && (!selectedTeams[0] || !selectedTeams[1])) {
      alert('Preencha o nome das duas equipes!')
      return
    }

    // Shuffle questions
    let shuffled = [...(perguntasData as Pergunta[])].sort(() => Math.random() - 0.5)
    if (maxQuestions < 9999) {
      shuffled = shuffled.slice(0, maxQuestions)
    }
    
    setTeams(selectedTeams)
    setScores(selectedTeams.reduce((acc, team) => ({ ...acc, [team]: 0 }), {}))
    setQuestions(shuffled)
    setCurrentQuestionIndex(0)
    setTurnIndex(0)
    setIsAnswerRevealed(false)
    setGameState('PLAYING')
  }

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      const currentTeam = teams[turnIndex % teams.length]
      setScores(prev => ({ ...prev, [currentTeam]: prev[currentTeam] + 10 }))
    }

    if (currentQuestionIndex + 1 >= questions.length) {
      setGameState('GAMEOVER')
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setTurnIndex(prev => prev + 1)
      setIsAnswerRevealed(false)
    }
  }

  const restartGame = () => setGameState('CONFIG')

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center p-4 bg-white border-b border-slate-200 shrink-0">
        <button onClick={onBackToHub} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold ml-2 text-slate-800">Perguntas Bíblicas</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
        {gameState === 'CONFIG' && (
          <ConfigScreen 
            isGroup={isGroup} setIsGroup={setIsGroup}
            team1={team1} setTeam1={setTeam1}
            team2={team2} setTeam2={setTeam2}
            maxQuestions={maxQuestions} setMaxQuestions={setMaxQuestions}
            onStart={startGame}
          />
        )}

        {gameState === 'PLAYING' && (
          <PlayingScreen
            currentTeam={teams[turnIndex % teams.length]}
            question={questions[currentQuestionIndex]}
            isRevealed={isAnswerRevealed}
            scores={scores}
            teams={teams}
            totalQuestions={questions.length}
            currentIndex={currentQuestionIndex}
            onReveal={() => setIsAnswerRevealed(true)}
            onAnswer={handleAnswer}
            onEndGame={() => setGameState('GAMEOVER')}
          />
        )}

        {gameState === 'GAMEOVER' && (
          <GameOverScreen scores={scores} onRestart={restartGame} />
        )}
      </main>
    </div>
  )
}

// Subcomponents
function parseBiblicalTexts(text: string) {
  if (!text) return [];
  const references = text.split(';');
  const grouped: string[] = [];
  let currentGroup: string[] = [];
  
  references.forEach(ref => {
     // Se tiver letras (nome do livro), começa um novo grupo
     if (/[a-zA-ZÀ-ÿ]/.test(ref)) {
        if (currentGroup.length > 0) grouped.push(currentGroup.join('; '));
        currentGroup = [ref.trim()];
     } else {
        // Se for só número (capítulo/versículo), junta no livro anterior
        currentGroup.push(ref.trim());
     }
  });
  if (currentGroup.length > 0) grouped.push(currentGroup.join('; '));
  return grouped;
}

function ConfigScreen({ isGroup, setIsGroup, team1, setTeam1, team2, setTeam2, maxQuestions, setMaxQuestions, onStart }: any) {
  return (
    <div className="flex flex-col items-stretch justify-center h-full max-w-md mx-auto space-y-8 pb-12">
      <h2 className="text-2xl font-bold text-center text-slate-800">Selecione o Modo</h2>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setIsGroup(false)}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${!isGroup ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
        >
          Modo Solo
        </button>
        <button
          onClick={() => setIsGroup(true)}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${isGroup ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
        >
          Modo Grupo
        </button>
      </div>

      {isGroup && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Equipe 1</label>
            <input 
              type="text" value={team1} onChange={e => setTeam1(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Equipe 2</label>
            <input 
              type="text" value={team2} onChange={e => setTeam2(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
        <label className="block text-sm font-medium text-slate-700 mb-1">Número de Perguntas</label>
        <select 
          value={maxQuestions} 
          onChange={e => setMaxQuestions(Number(e.target.value))}
          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
        >
          <option value={10}>10 Perguntas (Rápido)</option>
          <option value={20}>20 Perguntas (Normal)</option>
          <option value={30}>30 Perguntas (Longo)</option>
          <option value={9999}>Todas as Perguntas</option>
        </select>
      </div>

      <div className="flex-1" />

      <button onClick={onStart} className="w-full py-4 bg-green-500 text-white font-extrabold text-xl rounded-2xl shadow-lg hover:bg-green-600 active:scale-95 transition-all">
        COMEÇAR JOGO
      </button>
    </div>
  )
}

function PlayingScreen({ currentTeam, question, isRevealed, scores, teams, totalQuestions, currentIndex, onReveal, onAnswer, onEndGame }: any) {
  const diffColors: Record<string, string> = {
    facil: 'bg-green-500',
    medio: 'bg-orange-500',
    dificil: 'bg-red-500'
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-stretch">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <button onClick={onEndGame} className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200 hover:bg-red-100 hover:text-red-600 px-3 py-1.5 rounded-full transition-colors">
          Encerrar
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {currentIndex + 1} / {totalQuestions}
        </span>
      </div>

      <div className="flex justify-center space-x-8 mb-4 shrink-0">
        {teams.length === 1 ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pontuação</span>
            <span className="text-3xl font-black text-blue-600">
              {scores[teams[0]]} <span className="text-sm font-bold opacity-50">pts</span>
            </span>
          </div>
        ) : (
          teams.map((t: string) => (
            <div key={t} className={`flex flex-col items-center transition-all duration-300 ${t === currentTeam ? 'scale-110' : 'opacity-40 grayscale'}`}>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold max-w-[80px] truncate">{t}</span>
              <span className={`text-2xl font-black ${t === currentTeam ? 'text-blue-600' : 'text-slate-600'}`}>
                {scores[t]} <span className="text-xs font-bold opacity-50">pts</span>
              </span>
            </div>
          ))
        )}
      </div>

      <div className="relative flex-1 w-full perspective-1000">
        <div className={`w-full h-full transition-all duration-700 transform-style-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
          
          {/* FRENTE (Pergunta) */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-3xl shadow-lg border border-slate-100 p-5 flex flex-col backface-hidden overflow-y-auto">
            <div className="self-end shrink-0 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${diffColors[question.dificuldade] || 'bg-slate-500'}`}>
                {question.dificuldade}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <h3 className="text-lg font-bold text-slate-800 text-center leading-snug">
                {question.pergunta}
              </h3>
              
              {question.textosBiblicos && (
                <div className="flex flex-col items-center pt-4 space-y-2 w-full">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Não sabe? Leia na Bíblia:</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {parseBiblicalTexts(question.textosBiblicos).map((ref, idx) => (
                      <a 
                        key={idx}
                        href={`https://www.jw.org/pt/busca/?q=${encodeURIComponent(ref)}&link=%2Fresults%2FT%2Fbible%3Fsort%3Drel%26q%3D`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline underline-offset-2 italic hover:text-blue-800 transition-colors"
                      >
                        {ref}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* VERSO (Resposta) */}
          <div className="absolute inset-0 w-full h-full bg-blue-50 rounded-3xl shadow-lg border border-blue-100 p-5 flex flex-col backface-hidden rotate-y-180 overflow-y-auto">
             <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-1 bg-blue-200 rounded-full shrink-0" />
              <h3 className="text-2xl font-black text-blue-600 text-center leading-tight">
                {question.resposta}
              </h3>
              {question.curiosidade_extra && (
                <div className="bg-white/60 p-3 rounded-2xl w-full shrink-0">
                  <p className="text-xs font-bold text-blue-800 mb-1">💡 Curiosidade</p>
                  <p className="text-xs text-slate-700 italic leading-relaxed">{question.curiosidade_extra}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-50/90 backdrop-blur-md border-t border-slate-200 z-50">
        <div className="max-w-md mx-auto flex items-center">
          {!isRevealed ? (
            <button onClick={onReveal} className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all">
              Ver Resposta
            </button>
          ) : (
            <div className="flex w-full space-x-4 animate-in slide-in-from-bottom-4 duration-300">
              <button onClick={() => onAnswer(false)} className="flex-1 py-4 bg-white text-red-500 border-2 border-red-100 font-bold text-lg rounded-2xl active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-sm hover:border-red-500 hover:bg-red-50">
                <X strokeWidth={3} size={20} />
                <span>Errei</span>
              </button>
              <button onClick={() => onAnswer(true)} className="flex-1 py-4 bg-green-500 text-white font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgb(34,197,94,0.3)] hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center space-x-2">
                <Check strokeWidth={3} size={20} />
                <span>Acertei</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GameOverScreen({ scores, onRestart }: any) {
  const entries = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1])
  const isSolo = entries.length === 1
  
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-8">
      <h2 className="text-4xl font-black text-slate-800">Fim de Jogo!</h2>
      
      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-4">
        {entries.map(([team, score]: any, i) => (
          <div key={team} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center space-x-4">
              {!isSolo && <span className="text-2xl font-black text-slate-300">#{i+1}</span>}
              <span className="text-xl font-bold text-slate-700">{isSolo ? 'Pontos Acumulados' : team}</span>
            </div>
            <span className="text-2xl font-black text-blue-600">{score} pts</span>
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="w-full py-4 bg-blue-600 text-white font-bold text-xl rounded-2xl shadow-md active:scale-95 transition-all">
        Jogar Novamente
      </button>
    </div>
  )
}
