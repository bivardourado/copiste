import { useState, useEffect } from 'react'
import { ExternalLink, Info, X } from 'lucide-react'

export function InAppBrowserWarning() {
  const [inApp, setInApp] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera
    
    // Lista de assinaturas comuns de navegadores internos
    const rules = ['FBAV', 'FBAN', 'Instagram', 'WhatsApp', 'LinkedInApp', 'Twitter']
    
    // Verifica se alguma regra bate com o UserAgent do celular
    const isInApp = rules.some(rule => ua.indexOf(rule) > -1)
    
    setInApp(isInApp)
    setIsAndroid(/android/i.test(ua.toLowerCase()))
  }, [])

  if (!inApp) return null

  const handleForceOpenChrome = () => {
    // O pulo do gato para o Android: usa a URL scheme (Intent) do Chrome
    // Isso força o SO a abrir o Chrome fora do app que estamos agora
    window.location.href = "intent://copiste.vercel.app#Intent;scheme=https;package=com.android.chrome;end"
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col justify-center items-center p-6 text-center text-white animate-in fade-in duration-300">
      <div className="bg-slate-800 p-8 rounded-3xl max-w-sm w-full border border-slate-700 shadow-2xl relative">
        <button 
          onClick={() => setInApp(false)} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 transition-colors rounded-full hover:bg-slate-700"
        >
          <X size={20} />
        </button>
        
        <div className="mx-auto bg-amber-500/20 text-amber-400 w-16 h-16 rounded-full flex items-center justify-center mb-6">
          <Info size={32} />
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-slate-100">Navegador Interno</h2>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          Você abriu o Copiste dentro do Instagram/WhatsApp. Para conseguir <strong>instalar o jogo</strong> e ter a melhor experiência, abra no navegador principal.
        </p>

        {isAndroid ? (
          <button 
            onClick={handleForceOpenChrome}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors mb-4 shadow-lg shadow-blue-600/30 active:scale-95"
          >
            <ExternalLink size={20} />
            <span>Abrir no Chrome</span>
          </button>
        ) : (
          <div className="bg-slate-700/50 p-5 rounded-xl mb-6 text-sm text-left border border-slate-600">
            <p className="mb-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs font-bold mr-2">1</span> Toque nos <strong>três pontinhos (...)</strong> ou no ícone da bússola no topo ou rodapé da tela.</p>
            <p><span className="bg-slate-800 px-2 py-1 rounded text-xs font-bold mr-2">2</span> Escolha <strong>"Abrir no Safari"</strong> ou <strong>"Abrir no Navegador"</strong>.</p>
          </div>
        )}
        
        <button 
          onClick={() => setInApp(false)}
          className="text-slate-400 text-sm font-medium hover:text-white underline underline-offset-4"
        >
          Continuar por aqui mesmo
        </button>
      </div>
    </div>
  )
}
