import { BookOpen, Search, CheckSquare, Download } from 'lucide-react'
import { useState, useEffect } from 'react'

export function HubPage({ onSelectGame }: { onSelectGame: (gameId: string) => void }) {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setInstallPrompt(null)
  }

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
          onClick={() => onSelectGame('pistas')}
          className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all active:scale-95 group"
        >
          <div className="bg-amber-100 text-amber-600 p-3 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Search size={28} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-xl font-bold text-slate-800">Jogo das Pistas</h2>
            <p className="text-sm text-slate-500">Acerte com menos pistas!</p>
          </div>
        </button>

        <button
          onClick={() => onSelectGame('quiz')}
          className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all active:scale-95 group"
        >
          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <CheckSquare size={28} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-xl font-bold text-slate-800">Quiz Bíblico</h2>
            <p className="text-sm text-slate-500">Múltipla escolha clássica</p>
          </div>
        </button>

        <button
          onClick={() => onSelectGame('medite')}
          className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all active:scale-95 group"
        >
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <BookOpen size={28} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-xl font-bold text-slate-800">Medite na Bíblia</h2>
            <p className="text-sm text-slate-500">Reflita capítulo por capítulo</p>
          </div>
        </button>
      </div>

      {installPrompt && !installed && (
        <button
          onClick={handleInstall}
          className="mt-8 flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-slate-800 transition-colors active:scale-95"
        >
          <Download size={18} />
          <span>Instalar App</span>
        </button>
      )}
    </div>
  )
}
