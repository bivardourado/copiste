import { BookOpen, HelpCircle } from 'lucide-react'

export function HubPage({ onSelectGame }: { onSelectGame: (gameId: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
      <div className="text-center space-y-2">
        <img src="/logo-copiste.png" alt="Copiste" className="h-16 mx-auto" />
        <p className="text-slate-500 text-base">Seu ecossistema de jogos bíblicos</p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        <button
          onClick={() => onSelectGame('revelar')}
          className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all active:scale-95 group"
        >
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <BookOpen size={28} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-xl font-bold text-slate-800">Jogo de Revelar</h2>
            <p className="text-sm text-slate-500">Mecânica estilo flashcard</p>
          </div>
        </button>

        <button
          disabled
          className="flex items-center p-4 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 opacity-60 cursor-not-allowed"
        >
          <div className="bg-slate-200 text-slate-400 p-3 rounded-xl">
            <HelpCircle size={28} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-xl font-bold text-slate-600">Em Breve...</h2>
            <p className="text-sm text-slate-500">Novos jogos a caminho</p>
          </div>
        </button>
      </div>
    </div>
  )
}
