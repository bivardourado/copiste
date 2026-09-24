import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function IosInstallPrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 1. Detecta se é um dispositivo iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(userAgent)

    // 2. Detecta se o PWA já está rodando instalado (modo standalone)
    // A propriedade 'standalone' é exclusiva do Safari no iOS
    const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone === true

    // 3. Verifica se o usuário já dispensou esse aviso antes
    const hasDismissed = localStorage.getItem('hideIosPrompt') === 'true'

    // Mostra o prompt apenas se for iOS, não estiver instalado e o usuário não tiver fechado
    if (isIos && !isStandalone && !hasDismissed) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  const handleClose = () => {
    setShow(false)
    localStorage.setItem('hideIosPrompt', 'true') // Salva para não mostrar de novo
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 z-[60] animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 text-lg">Instalar no iPhone</h3>
        <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors active:scale-95">
          <X size={18} />
        </button>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-4">
        Para usar o Copiste como um aplicativo nativo, toque no botão <strong>Compartilhar</strong> na barra inferior do Safari e depois escolha <strong>Adicionar à Tela de Início</strong>.
      </p>
      
      <div className="flex justify-center text-blue-500 animate-bounce pb-1">
        {/* Ícone de Compartilhar fiel ao do iOS (Quadrado com seta para cima) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </div>
    </div>
  )
}
