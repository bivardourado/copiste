import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw, X } from 'lucide-react'

export function PwaUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Opcional: checar periodicamente se há atualizações (ex: a cada 1 hora)
      if (r) {
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] bg-white rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-emerald-500 flex items-center justify-between animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex flex-col">
        <span className="font-bold text-slate-800 flex items-center gap-2">
          <RefreshCw size={18} className="text-emerald-500 animate-spin-slow" />
          Nova atualização!
        </span>
        <span className="text-sm text-slate-500">Clique para atualizar o aplicativo.</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setNeedRefresh(false)}
          className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X size={20} />
        </button>
        <button 
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
        >
          Atualizar
        </button>
      </div>
    </div>
  )
}
