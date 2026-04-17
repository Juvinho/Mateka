import { useState, useRef, useEffect } from 'react'
import LoginCard from './LoginCard'
import RegisterPage from '../pages/RegisterPage'
import LoginBackground from './LoginBackground'

type Props = {
  view?: 'login' | 'register'
  onFlip?: (v: 'login' | 'register') => void
}

export default function AuthCardFlip({ view: propView, onFlip }: Props) {
  const [view, setView] = useState<'login' | 'register'>(
    propView || (window.location.hash === '#register' ? 'register' : 'login')
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const flipperRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const [flipperHeight, setFlipperHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const updateHeight = () => {
      const activeRef = view === 'login' ? frontRef : backRef
      const h = activeRef.current?.scrollHeight
      if (h && h > 0) setFlipperHeight(h)
    }
    const timeout = setTimeout(updateHeight, 750)
    updateHeight()
    return () => clearTimeout(timeout)
  }, [view])

  useEffect(() => {
    const onResize = () => {
      const activeRef = view === 'login' ? frontRef : backRef
      const h = activeRef.current?.scrollHeight
      if (h && h > 0) setFlipperHeight(h)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [view])

  const flipTo = (target: 'login' | 'register') => {
    if (isAnimating || view === target) return
    setIsAnimating(true)
    history.pushState(null, '', '#' + target)
    if (target === 'register') {
      flipperRef.current?.classList.add('flipped')
    } else {
      flipperRef.current?.classList.remove('flipped')
    }
    setTimeout(() => {
      setView(target)
      setIsAnimating(false)
      if (onFlip) onFlip(target)
    }, 700)
  }

  return (
    <>
      {/* Fundo sempre atrás */}
      <LoginBackground />

      {/* Conteúdo centralizado */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        transform: 'translateY(-3vh)',
        zIndex: 10,
        overflowY: 'auto',
      }}>
        {/* Cena 3D */}
        <div style={{
          perspective: '1200px',
          width: 'min(420px, calc(100vw - 32px))',
          maxHeight: 'calc(100dvh - 100px)',
        }}>
          <div
            ref={flipperRef}
            className={`auth-flipper ${view === 'register' ? 'flipped' : ''}`}
            style={{
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s ease',
              height: flipperHeight,
            }}
          >
            {/* Frente — Login */}
            <div ref={frontRef} style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}>
              <LoginCard
                onSuccess={() => {}}
                onLogoClick={() => {}}
                onCreateAccount={() => flipTo('register')}
                isVisible={view === 'login'}
              />
            </div>

            {/* Verso — Registro */}
            <div ref={backRef} style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}>
              <RegisterPage
                onSuccess={() => flipTo('login')}
                onBack={() => flipTo('login')}
                isVisible={view === 'register'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS necessário */}
      <style>{`
        .auth-flipper.flipped {
          transform: rotateY(180deg);
        }

        /* Essential formatting from original AuthCardFlip */
        .login-card { padding: 32px 36px; position: relative; }
        .register-card { 
          padding: 24px 32px; 
          position: relative; 
          max-height: calc(100dvh - 120px);
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        .register-card::-webkit-scrollbar { display: none; }
        
        .register-fields-wrapper { display: flex; flex-direction: column; gap: 8px; }
        .login-title { margin-bottom: 20px; }
        .register-card .login-title { font-size: clamp(22px, 4vw, 30px); margin-bottom: 4px; }
        
        .login-kicker { margin-bottom: 8px; }
        .login-subtitle { margin-bottom: 16px; }
        .register-card .login-subtitle { font-size: 13px; margin-bottom: 12px; }
        
        .login-input { padding: 12px 16px; height: 48px; }
        .register-card .login-input { height: 44px; padding: 10px 14px; font-size: 13px; }
        
        .pw-strength, .password-strength { margin-top: 6px; margin-bottom: 0; height: 4px; gap: 4px; display: flex; }
        .pw-seg { flex: 1 1 0; height: 4px; border-radius: 3px; opacity: 0.18; transform-origin: center; }
        .login-submit { margin-top: 16px; padding: 14px; }
        .register-card .login-submit { margin-top: 12px; padding: 12px; font-size: 13px; }
        
        .login-forgot { margin-top: 12px; }
        .register-card .login-forgot { margin-top: 10px; font-size: 12px; }
        
        .login-submit[disabled], .login-submit[aria-disabled="true"] { opacity: 0.55; filter: grayscale(40%); cursor: default; }
        .login-counter, .auth-stats { margin-top: 12px; }

        @keyframes card-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(105deg, transparent 40%, rgba(34,211,238,0.04) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: card-shimmer 6s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
        .login-card .scan-line { position: absolute; left: 0; right: 0; top: -40%; height: 2px; background: linear-gradient(90deg, transparent, rgba(34,211,238,0.08), transparent); animation: scan 4s linear infinite; pointer-events: none; z-index: 2; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .cursor-blink { animation: blink 1s step-end infinite; color: #22d3ee; margin-left: 4px; }

        .login-submit:hover { box-shadow: 0 0 20px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.15), inset 0 1px 0 rgba(255,255,255,0.1); }
        .register-progress { height: 4px; background: linear-gradient(90deg, #f472b6, #22d3ee); border-radius: 4px; margin-top: 8px; }
        .step-counter { position: absolute; top: 12px; right: 16px; font-size: 12px; color: rgba(148,163,184,0.8); }

        @media (max-width: 400px) {
          .login-card, .register-card { padding: 24px; }
        }
      `}</style>
    </>
  )
}
