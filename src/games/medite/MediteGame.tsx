import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ANTIGO_TESTAMENTO, NOVO_TESTAMENTO } from '../../data/bibleData'
import mediteData from '../../assets/medite.json'

type PerguntaMedite = {
  pergunta: string
  resposta_esperada: string
  versiculo_referencia: string
}

type CapituloData = {
  livro: string
  capitulo: number
  perguntas: PerguntaMedite[]
}

type GameState = 'SELECT_BOOK' | 'SELECT_CHAPTER' | 'PLAYING' | 'DONE'

// Converte nome do livro para o slug da URL do JW.org
function livroParaSlug(livro: string): string {
  const mapa: Record<string, string> = {
    'Gênesis': 'genesis', 'Êxodo': 'exodo', 'Levítico': 'levitico',
    'Números': 'numeros', 'Deuteronômio': 'deuteronomio', 'Josué': 'josue',
    'Juízes': 'juizes', 'Rute': 'rute', '1 Samuel': '1-samuel',
    '2 Samuel': '2-samuel', '1 Reis': '1-reis', '2 Reis': '2-reis',
    '1 Crônicas': '1-cronicas', '2 Crônicas': '2-cronicas', 'Esdras': 'esdras',
    'Neemias': 'neemias', 'Ester': 'ester', 'Jó': 'jo', 'Salmos': 'salmos',
    'Provérbios': 'proverbios', 'Eclesiastes': 'eclesiastes', 'Cânticos': 'canticos',
    'Isaías': 'isaias', 'Jeremias': 'jeremias', 'Lamentações': 'lamentacoes',
    'Ezequiel': 'ezequiel', 'Daniel': 'daniel', 'Oséias': 'oseias',
    'Joel': 'joel', 'Amós': 'amos', 'Obadias': 'obadias', 'Jonas': 'jonas',
    'Miquéias': 'miqueias', 'Naum': 'naum', 'Habacuque': 'habacuque',
    'Sofonias': 'sofonias', 'Ageu': 'ageu', 'Zacarias': 'zacarias',
    'Malaquias': 'malaquias', 'Mateus': 'mateus', 'Marcos': 'marcos',
    'Lucas': 'lucas', 'João': 'joao', 'Atos': 'atos', 'Romanos': 'romanos',
    '1 Coríntios': '1-corintios', '2 Coríntios': '2-corintios',
    'Gálatas': 'galatas', 'Efésios': 'efesios', 'Filipenses': 'filipenses',
    'Colossenses': 'colossenses', '1 Tessalonicenses': '1-tessalonicenses',
    '2 Tessalonicenses': '2-tessalonicenses', '1 Timóteo': '1-timoteo',
    '2 Timóteo': '2-timoteo', 'Tito': 'tito', 'Filemom': 'filemom',
    'Hebreus': 'hebreus', 'Tiago': 'tiago', '1 Pedro': '1-pedro',
    '2 Pedro': '2-pedro', '1 João': '1-joao', '2 João': '2-joao',
    '3 João': '3-joao', 'Judas': 'judas', 'Apocalipse': 'apocalipse',
  }
  return mapa[livro] ?? livro.toLowerCase()
}

function jwOrgUrl(livro: string, capitulo: number): string {
  return `https://www.jw.org/pt/biblioteca/biblia/biblia-de-estudo/livros/${livroParaSlug(livro)}/${capitulo}/`
}

export function MediteGame({ onBackToHub }: { onBackToHub: () => void }) {
  const [gameState, setGameState] = useState<GameState>('SELECT_BOOK')
  const [selectedBook, setSelectedBook] = useState<{ nome: string, capitulos: number } | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  
  // Dados do capítulo jogando
  const [capituloAtual, setCapituloAtual] = useState<CapituloData | null>(null)
  const [perguntaIndex, setPerguntaIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)

  const handleSelectBook = (book: { nome: string, capitulos: number }) => {
    setSelectedBook(book)
    setGameState('SELECT_CHAPTER')
  }

  const handleSelectChapter = (cap: number) => {
    if (!selectedBook) return
    
    // Procura no JSON
    const data = (mediteData as CapituloData[]).find(
      d => d.livro === selectedBook.nome && d.capitulo === cap
    )

    if (!data) {
      alert(`O capítulo ${cap} de ${selectedBook.nome} ainda não foi gerado! Tente Gênesis 1 por enquanto.`)
      return
    }

    setCapituloAtual(data)
    setSelectedChapter(cap)
    setPerguntaIndex(0)
    setIsRevealed(false)
    setGameState('PLAYING')
  }

  const handleNextQuestion = () => {
    if (!capituloAtual) return
    
    if (perguntaIndex + 1 >= capituloAtual.perguntas.length) {
      setGameState('DONE')
    } else {
      setPerguntaIndex(prev => prev + 1)
      setIsRevealed(false)
    }
  }

  const handleVoltarLivros = () => {
    setSelectedBook(null)
    setSelectedChapter(null)
    setGameState('SELECT_BOOK')
  }

  return (
    <div className="flex flex-col h-full relative bg-blue-50 text-slate-800">
      {/* HEADER */}
      <header className="flex items-center p-4 bg-white border-b border-blue-100 shrink-0 shadow-sm z-10">
        <button 
          onClick={gameState === 'SELECT_BOOK' ? onBackToHub : () => setGameState(gameState === 'PLAYING' || gameState === 'DONE' ? 'SELECT_CHAPTER' : 'SELECT_BOOK')} 
          className="p-2 -ml-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="ml-2 font-black text-blue-900 tracking-widest uppercase">
          {gameState === 'SELECT_BOOK' ? 'Medite na Bíblia' : selectedBook?.nome}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
        
        {/* TELA 1: ESCOLHER LIVRO */}
        {gameState === 'SELECT_BOOK' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-blue-900 uppercase tracking-widest">Escolha um Livro</h2>
              <p className="text-blue-600/80 text-sm mt-1">Selecione o livro que você deseja meditar hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Antigo Testamento */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-50">
                <h3 className="text-lg font-black text-blue-800 mb-4 border-b border-blue-50 pb-2">Antigo Testamento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ANTIGO_TESTAMENTO.map(livro => (
                    <button 
                      key={livro.nome} 
                      onClick={() => handleSelectBook(livro)}
                      className="text-left text-sm text-slate-600 hover:text-blue-600 hover:font-bold py-1.5 transition-colors"
                    >
                      {livro.nome}
                    </button>
                  ))}
                </div>
              </div>

              {/* Novo Testamento */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-50">
                <h3 className="text-lg font-black text-blue-800 mb-4 border-b border-blue-50 pb-2">Novo Testamento</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NOVO_TESTAMENTO.map(livro => (
                    <button 
                      key={livro.nome} 
                      onClick={() => handleSelectBook(livro)}
                      className="text-left text-sm text-slate-600 hover:text-blue-600 hover:font-bold py-1.5 transition-colors"
                    >
                      {livro.nome}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TELA 2: ESCOLHER CAPÍTULO */}
        {gameState === 'SELECT_CHAPTER' && selectedBook && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-blue-600 mb-2">{selectedBook.nome}</h2>
              <div className="h-1 w-16 bg-blue-400 mx-auto rounded-full mb-4"></div>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Explore os capítulos do livro de <span className="font-bold">{selectedBook.nome}</span> e mergulhe nas palavras inspiradas que moldaram a fé e a história do povo de Deus.
              </p>
            </div>

            <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Capítulos</h3>
            
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: selectedBook.capitulos }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handleSelectChapter(i + 1)}
                  className="w-12 h-12 flex items-center justify-center bg-white border border-blue-100 rounded-xl font-bold text-blue-600 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all active:scale-95"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TELA 3: JOGANDO / MEDITANDO */}
        {gameState === 'PLAYING' && capituloAtual && (
          <div className="max-w-md mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {capituloAtual.livro} {capituloAtual.capitulo}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pergunta {perguntaIndex + 1} de {capituloAtual.perguntas.length}
              </span>
            </div>

            {/* Link para ler o capítulo no JW.org */}
            <a
              href={jwOrgUrl(capituloAtual.livro, capituloAtual.capitulo)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 mb-6 py-2.5 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors"
            >
              <span>📖</span>
              <span>Leia o capítulo aqui</span>
            </a>

            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-800 mb-8 leading-relaxed">
                {capituloAtual.perguntas[perguntaIndex].pergunta}
              </h2>

              {isRevealed && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Resposta</h3>
                  <p className="text-slate-700 text-base mb-4 leading-relaxed">
                    {capituloAtual.perguntas[perguntaIndex].resposta_esperada}
                  </p>
                  
                  <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100">
                    📖 {capituloAtual.perguntas[perguntaIndex].versiculo_referencia}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Dock Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe z-50">
              <div className="max-w-md mx-auto">
                {!isRevealed ? (
                  <button onClick={() => setIsRevealed(true)}
                    className="w-full py-5 bg-slate-200 text-blue-600 font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#94a3b8] active:shadow-none active:translate-y-[8px] transition-all">
                    Ver Resposta
                  </button>
                ) : (
                  <button onClick={handleNextQuestion}
                    className="w-full py-5 bg-blue-500 text-white font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_8px_0_0_#2563eb] active:shadow-none active:translate-y-[8px] transition-all">
                    {perguntaIndex + 1 >= capituloAtual.perguntas.length ? 'Concluir' : 'Próxima'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TELA 4: CONCLUÍDO */}
        {gameState === 'DONE' && selectedBook && (
          <div className="max-w-md mx-auto h-full flex flex-col items-center justify-center space-y-6 pb-20">
            <p className="text-6xl">🙌</p>
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-widest text-center">
              Meditação Concluída!
            </h2>
            <p className="text-center text-slate-600 mb-8">
              Você meditou no capítulo <span className="font-bold">{selectedChapter}</span> de <span className="font-bold">{selectedBook.nome}</span>.
            </p>

            <button onClick={() => setGameState('SELECT_CHAPTER')}
              className="w-full py-4 bg-slate-200 text-blue-600 font-black text-lg uppercase tracking-widest rounded-2xl shadow-[0_6px_0_0_#94a3b8] active:shadow-none active:translate-y-[6px] transition-all">
              Outro Capítulo
            </button>
            <button onClick={handleVoltarLivros}
              className="w-full py-4 bg-white text-slate-500 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_4px_0_0_#cbd5e1] active:shadow-none active:translate-y-[4px] transition-all">
              Outro Livro
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
