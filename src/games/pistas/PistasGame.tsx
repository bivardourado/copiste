import { useState } from 'react'
import pistasData from '../../assets/pistas.json'
import { ArrowLeft, Eye, CheckCircle, XCircle, Lightbulb } from 'lucide-react'

type Pista = {
  id: string
  tipo: string
  resposta: string
  pistas: string[]
  curiosidade: string
  dificuldade?: string
}

type GameState = 'CONFIG' | 'PLAYING' | 'SHOW_ANSWER' | 'REVEALED' | 'GAMEOVER'

const PONTOS_POR_PISTA = [500, 300, 200, 100, 50]

const tipoLabel: Record<string, string> = {
  personagem: '👤 Personagem',
  evento: '⚡ Evento',
  lugar: '📍 Lugar',
  livro: '📖 Livro',
}

const tipoColor: Record<string, string> = {
  personagem: 'bg-emerald-100 text-emerald-800',
  evento: 'bg-amber-100 text-amber-800',
  lugar: 'bg-sky-100 text-sky-800',
  livro: 'bg-purple-100 text-purple-800',
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────
function ConfigScreen({ isGroup, setIsGroup, team1, setTeam1, team2, setTeam2, maxRounds, setMaxRounds, dificuldade, setDificuldade, onStart }: any) {
  return (
    <div className="flex flex-col items-stretch justify-center h-full max-w-md mx-auto space-y-6 pb-12">
      <div className="text-center space-y-1">
        <p className="text-4xl">🕵️</p>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Jogo das Pistas</h2>
        <p className="text-sm text-slate-500">Quanto menos pistas usar, mais pontos!</p>
      </div>

      <div className="flex space-x-4">
        <button onClick={() => setIsGroup(false)}
          className={`flex-1 py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px]
            ${!isGroup ? 'bg-slate-200 text-sky-600' : 'bg-slate-200 text-slate-400'}`}>
          👤 Solo
        </button>
        <button onClick={() => setIsGroup(true)}
          className={`flex-1 py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px]
            ${isGroup ? 'bg-slate-200 text-sky-600' : 'bg-slate-200 text-slate-400'}`}>
          👥 Grupo
        </button>
      </div>

      {isGroup && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <label htmlFor="p-team1" className="block text-sm font-medium text-slate-700 mb-1">Equipe 1</label>
            <input id="p-team1" name="p-team1" type="text" value={team1} onChange={e => setTeam1(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white text-slate-800" />
          </div>
          <div>
            <label htmlFor="p-team2" className="block text-sm font-medium text-slate-700 mb-1">Equipe 2</label>
            <input id="p-team2" name="p-team2" type="text" value={team2} onChange={e => setTeam2(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white text-slate-800" />
          </div>
        </div>
      )}

      {/* Nível de Dificuldade */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Nível de Dificuldade</p>
        <div className="flex space-x-3">
          {([
            { key: 'facil',   emoji: '🟢', label: 'Fácil',   sub: 'Histórias conhecidas' },
            { key: 'medio',   emoji: '🟡', label: 'Médio',   sub: 'Nível intermediário'  },
            { key: 'dificil', emoji: '🔴', label: 'Difícil', sub: 'Pouco conhecidas'    },
          ] as const).map(({ key, emoji, label, sub }) => (
            <button key={key} onClick={() => setDificuldade(key)}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_4px_0_0_#94a3b8] active:shadow-none active:translate-y-[4px] flex flex-col items-center
                ${dificuldade === key ? 'bg-slate-200 text-sky-600' : 'bg-slate-200 text-slate-400'}`}>
              <span className="text-2xl mb-1">{emoji}</span>
              <span className="text-xs font-black">{label}</span>
              <span className="text-[9px] normal-case font-normal opacity-70 mt-0.5 text-center leading-tight">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="p-rounds" className="block text-sm font-medium text-slate-700 mb-1">Número de Rodadas</label>
        <select id="p-rounds" name="p-rounds" value={maxRounds} onChange={e => setMaxRounds(Number(e.target.value))}
          className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white text-slate-800">
          <option value={5}>5 Rodadas (Rápido)</option>
          <option value={10}>10 Rodadas (Normal)</option>
          <option value={15}>15 Rodadas (Longo)</option>
          <option value={9999}>Todas as Cartas</option>
        </select>
      </div>

      <div className="flex-1" />

      <button onClick={onStart} className="w-full py-5 bg-slate-200 text-emerald-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-none active:translate-y-[8px] transition-all">
        🚀 Começar Jogo
      </button>
    </div>
  )
}

// ─── PLAYING ─────────────────────────────────────────────────────────────────
function PlayingScreen({ carta, pistasVisiveis, scores, teams, currentTeam, currentIndex, total, onMaisPista, onReveal, onEndGame }: any) {
  const pontosAtual = PONTOS_POR_PISTA[pistasVisiveis - 1] ?? 50
  const todasReveladas = pistasVisiveis >= carta.pistas.length

  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-stretch">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <button onClick={onEndGame} className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-2 rounded-xl shadow-[0_4px_0_0_#334155] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[4px] transition-all">
          ✕ Encerrar
        </button>
        <span className="text-[10px] font-bold text-slate-500 uppercase">{currentIndex + 1} / {total}</span>
      </div>

      {/* Placar */}
      <div className="flex justify-center space-x-8 mb-3 shrink-0">
        {teams.length === 1 ? (
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Pontuação</span>
            <span className="text-3xl font-black text-amber-400">{scores[teams[0]]} <span className="text-sm font-bold opacity-50">pts</span></span>
          </div>
        ) : (
          teams.map((t: string) => (
            <div key={t} className={`flex flex-col items-center transition-all duration-300 ${t === currentTeam ? 'scale-110' : 'opacity-40 grayscale'}`}>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Equipe</span>
              <span className="text-[11px] uppercase font-black text-slate-700 text-center max-w-[90px] leading-tight">{t}</span>
              <span className={`text-2xl font-black ${t === currentTeam ? 'text-amber-400' : 'text-slate-500'}`}>
                {scores[t]} <span className="text-xs font-bold opacity-50">pts</span>
              </span>
            </div>
          ))
        )}
      </div>

      {/* Card */}
      <div className="flex-1 bg-slate-800 rounded-3xl border border-slate-700 shadow-lg p-5 flex flex-col overflow-y-auto mb-28">
        {/* Header do card */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-black text-slate-800 uppercase tracking-wider ${tipoColor[carta.tipo] || 'bg-slate-500'}`}>
            {tipoLabel[carta.tipo] || carta.tipo}
          </span>
          <div className="flex items-center space-x-1 bg-slate-800 px-3 py-1 rounded-full">
            <Lightbulb size={12} className="text-amber-600" />
            <span className="text-xs font-black text-amber-700">{pontosAtual} pts se acertar</span>
          </div>
        </div>

        {/* Pergunta */}
        <p className="text-center font-black text-amber-400 uppercase tracking-widest text-2xl mb-6 shrink-0 drop-shadow-sm">
          {carta.tipo === 'personagem' ? '🤔 Quem sou eu?' :
           carta.tipo === 'evento' ? '⚡ Que evento é esse?' :
           carta.tipo === 'lugar' ? '📍 Que lugar é esse?' : '📖 Que livro é esse?'}
        </p>

        {/* Pistas */}
        <div className="space-y-3 flex-1">
          {carta.pistas.slice(0, pistasVisiveis).map((pista: string, idx: number) => (
            <div key={idx} className="flex items-start space-x-3 animate-in fade-in slide-in-from-left-4 duration-500 bg-white/80 text-slate-800 rounded-2xl p-3 border border-slate-700">
              <span className="shrink-0 w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-black flex items-center justify-center">{idx + 1}</span>
              <p className="text-sm text-slate-700 leading-relaxed italic">{pista}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Dock */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto space-y-3">
          {!todasReveladas && (
            <button onClick={onMaisPista}
              className="w-full py-3 bg-sky-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center space-x-2">
              <Eye size={18} />
              <span>+ Revelar Pista ({carta.pistas.length - pistasVisiveis} restantes)</span>
            </button>
          )}
          <button onClick={onReveal}
            className="w-full py-5 bg-slate-200 text-sky-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center">
            Ver Resposta
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SHOW ANSWER ─────────────────────────────────────────────────────────────
function ShowAnswerScreen({ carta, pontos, onAcertou, onErrou }: any) {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-stretch justify-center space-y-4 pb-28 px-4">
      
      {/* Card Principal da Resposta (Neutro, revelando a resposta) */}
      <div className="relative w-full rounded-[2rem] p-8 text-center overflow-hidden transition-all duration-500 transform animate-in zoom-in-95 bg-gradient-to-br from-sky-100 to-sky-200 shadow-xl border border-sky-300">
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="text-6xl drop-shadow-md mb-2">👀</div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
            A Resposta É...
          </p>
          <h2 className="text-4xl font-black tracking-tight leading-none text-sky-950">
            {carta.resposta}
          </h2>
          
          <div className="mt-4 bg-white/50 backdrop-blur-md px-6 py-2 rounded-full border border-sky-300 shadow-sm inline-flex items-center space-x-2">
            <span className="text-sm font-bold text-sky-800 uppercase tracking-widest">Vale {pontos} pts</span>
          </div>
        </div>
      </div>

      {/* Dock Inferior com Acertou/Errou */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto">
          <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">A equipe acertou?</p>
          <div className="flex space-x-3">
            <button onClick={onErrou}
              className="flex-1 py-4 bg-slate-200 text-rose-600 font-black text-lg uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center space-x-2">
              <XCircle strokeWidth={3} size={24} />
              <span>Errou</span>
            </button>
            <button onClick={onAcertou}
              className="flex-1 py-4 bg-slate-200 text-emerald-600 font-black text-lg uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center space-x-2">
              <CheckCircle strokeWidth={3} size={24} />
              <span>Acertou!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── REVEALED ────────────────────────────────────────────────────────────────
function RevealedScreen({ carta, acertou, pontos, onNext }: any) {
  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-stretch justify-center space-y-4 pb-28 px-4">
      
      {/* Card Principal da Resposta */}
      <div className={`relative w-full rounded-[2rem] p-8 text-center overflow-hidden transition-all duration-500 transform animate-in zoom-in-95
        ${acertou 
          ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-[0_20px_40px_-15px_rgba(251,191,36,0.6)] border-2 border-amber-200' 
          : 'bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl border border-slate-300'
        }`}
      >
        {/* Efeito de Brilho (Shine) no fundo */}
        {acertou && <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/40 blur-3xl rounded-full" />}
        {acertou && <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-200/40 blur-3xl rounded-full" />}

        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Ícone 3D flutuante */}
          <div className="text-6xl drop-shadow-md animate-bounce mb-2">
            {acertou ? '🎉' : '😅'}
          </div>
          
          <p className={`text-xs font-black uppercase tracking-[0.2em] ${acertou ? 'text-amber-800' : 'text-slate-500'}`}>
            {acertou ? 'Resposta Correta!' : 'A Resposta Era...'}
          </p>
          
          <h2 className={`text-4xl font-black tracking-tight leading-none ${acertou ? 'text-amber-950' : 'text-slate-800'}`}>
            {carta.resposta}
          </h2>
          
          {acertou && (
            <div className="mt-4 bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm inline-flex items-center space-x-2">
              <span className="text-2xl font-black text-emerald-700">+{pontos}</span>
              <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest mt-1">pontos</span>
            </div>
          )}
        </div>
      </div>

      {/* Dock Inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto">
          <button onClick={onNext}
            className="w-full py-5 bg-slate-200 text-sky-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[8px] transition-all">
            Próxima Carta ➡️
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── GAME OVER ───────────────────────────────────────────────────────────────
function GameOverScreen({ scores, teams, onRestart }: any) {
  const sorted = [...teams].sort((a, b) => scores[b] - scores[a])
  const winner = sorted[0]

  return (
    <div className="flex flex-col h-full max-w-md mx-auto items-center justify-center space-y-6 pb-28">
      <p className="text-6xl">🏆</p>
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest text-center">Fim de Jogo!</h2>

      {teams.length > 1 && (
        <div className="w-full bg-amber-400 rounded-3xl p-5 text-center border-2 border-amber-500">
          <p className="text-xs font-black uppercase tracking-widest text-amber-800 mb-1">Vencedor</p>
          <p className="text-2xl font-black text-slate-900">{winner}</p>
          <p className="text-3xl font-black text-emerald-700">{scores[winner]} pts</p>
        </div>
      )}

      <div className="w-full space-y-3">
        {sorted.map((t: string, i: number) => (
          <div key={t} className="flex justify-between items-center text-slate-800 bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <span className="font-black text-slate-700">{t}</span>
            </div>
            <span className="text-xl font-black text-amber-400">{scores[t]} pts</span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto">
          <button onClick={onRestart}
            className="w-full py-5 bg-slate-200 text-emerald-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-[0_0px_0_0_#94a3b8] active:translate-y-[8px] transition-all">
            🔄 Jogar Novamente
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN GAME ───────────────────────────────────────────────────────────────
export function PistasGame({ onBackToHub }: { onBackToHub: () => void }) {
  const [gameState, setGameState] = useState<GameState>('CONFIG')

  const [isGroup, setIsGroup] = useState(false)
  const [team1, setTeam1] = useState('Equipe Fé')
  const [team2, setTeam2] = useState('Equipe Esperança')
  const [maxRounds, setMaxRounds] = useState(5)
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('facil')

  const [cartas, setCartas] = useState<Pista[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [pistasVisiveis, setPistasVisiveis] = useState(1)
  const [ultimoAcertou, setUltimoAcertou] = useState(false)
  const [ultimosPontos, setUltimosPontos] = useState(0)
  const [turnIndex, setTurnIndex] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [teams, setTeams] = useState<string[]>([])

  const startGame = () => {
    const t = isGroup ? [team1, team2] : [team1]
    const sc: Record<string, number> = {}
    t.forEach(tm => sc[tm] = 0)
    setTeams(t)
    setScores(sc)
    setTurnIndex(0)
    setCurrentIndex(0)
    setPistasVisiveis(1)
    const filtradas = (pistasData as Pista[]).filter(c => c.dificuldade === dificuldade)
    const shuffled = shuffle(filtradas).slice(0, Math.min(maxRounds, filtradas.length))
    setCartas(shuffled)
    setGameState('PLAYING')
  }

  const currentTeam = teams[turnIndex % teams.length]
  const carta = cartas[currentIndex]

  const handleVerResposta = () => {
    setGameState('SHOW_ANSWER')
  }

  const handleAcertou = () => {
    const pontos = PONTOS_POR_PISTA[pistasVisiveis - 1] ?? 50
    setScores(prev => ({ ...prev, [currentTeam]: (prev[currentTeam] ?? 0) + pontos }))
    setUltimoAcertou(true)
    setUltimosPontos(pontos)
    setGameState('REVEALED')
  }

  const handleErrou = () => {
    setUltimoAcertou(false)
    setUltimosPontos(0)
    setGameState('REVEALED')
  }

  const handleNext = () => {
    const next = currentIndex + 1
    if (next >= cartas.length) {
      setGameState('GAMEOVER')
    } else {
      setCurrentIndex(next)
      setPistasVisiveis(1)
      setTurnIndex(prev => prev + 1)
      setGameState('PLAYING')
    }
  }

  return (
    <div className="flex flex-col h-full relative bg-sky-50 text-slate-800">
      <header className="flex items-center p-4 bg-sky-100 border-b border-sky-200 shrink-0">
        <button onClick={onBackToHub} className="p-2 -ml-2 text-sky-600 hover:text-sky-800 rounded-full hover:bg-sky-200 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <img src="/logo-copiste.png" alt="Copiste" className="h-8 ml-2" />
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
        {gameState === 'CONFIG' && (
          <ConfigScreen
            isGroup={isGroup} setIsGroup={setIsGroup}
            team1={team1} setTeam1={setTeam1}
            team2={team2} setTeam2={setTeam2}
            maxRounds={maxRounds} setMaxRounds={setMaxRounds}
            dificuldade={dificuldade} setDificuldade={setDificuldade}
            onStart={startGame}
          />
        )}
        {gameState === 'PLAYING' && carta && (
          <PlayingScreen
            carta={carta}
            pistasVisiveis={pistasVisiveis}
            scores={scores}
            teams={teams}
            currentTeam={currentTeam}
            currentIndex={currentIndex}
            total={cartas.length}
            onMaisPista={() => setPistasVisiveis(prev => Math.min(prev + 1, carta.pistas.length))}
            onReveal={handleVerResposta}
            onEndGame={() => setGameState('GAMEOVER')}
          />
        )}
        {gameState === 'SHOW_ANSWER' && carta && (
          <ShowAnswerScreen
            carta={carta}
            pontos={PONTOS_POR_PISTA[pistasVisiveis - 1] ?? 50}
            onAcertou={handleAcertou}
            onErrou={handleErrou}
          />
        )}
        {gameState === 'REVEALED' && carta && (
          <RevealedScreen
            carta={carta}
            acertou={ultimoAcertou}
            pontos={ultimosPontos}
            onNext={handleNext}
          />
        )}
        {gameState === 'GAMEOVER' && (
          <GameOverScreen
            scores={scores}
            teams={teams}
            onRestart={() => setGameState('CONFIG')}
          />
        )}
      </main>
    </div>
  )
}
