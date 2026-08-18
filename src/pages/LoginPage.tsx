import { useEffect, useMemo, useRef, useState } from 'react'

import gsap from 'gsap'
import SplitType from 'split-type'

import LoginBackground from '../components/LoginBackground'
import LoginCard from '../components/LoginCard'
import LoginCursor from '../components/LoginCursor'

type LoginPageProps = {
  onNavigate: (hash: string) => void
}

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const canvasWrapRef = useRef<HTMLDivElement | null>(null)
  const cardStageRef = useRef<HTMLDivElement | null>(null)
  const curtainRef = useRef<HTMLDivElement | null>(null)

  const [leaving, setLeaving] = useState(false)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    if (reducedMotion) return

    const page = pageRef.current
    if (!page) return

    const logo = page.querySelector<HTMLElement>('.login-logo-wrap')
    const card = page.querySelector<HTMLElement>('.login-card')
    const title = page.querySelector<HTMLElement>('.login-title')
    const kicker = page.querySelector<HTMLElement>('.login-kicker')
    const subtitle = page.querySelector<HTMLElement>('.login-subtitle')
    const fields = page.querySelectorAll<HTMLElement>('.login-field, .login-row')
    const submit = page.querySelector<HTMLElement>('.login-submit')
    const counter = page.querySelector<HTMLElement>('.login-counter')
    const createLink = page.querySelector<HTMLElement>('.login-create')

    let split: SplitType | null = null
    let tl: gsap.core.Timeline | null = null

    // Defer SplitType + timeline build until next frame so fonts and layout
    // are settled. Splitting by "words,chars" keeps each word as an
    // inline-block atom — prevents mid-word line breaks like "v\nolta.".
    const splitRafId = requestAnimationFrame(() => {
      if (title) {
        split = new SplitType(title, { types: 'words,chars' })
      }

      tl = gsap.timeline()

      if (logo) {
        tl.fromTo(
          logo,
          { y: -60, opacity: 0, scale: 0.5, rotation: -180 },
          { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.0, ease: 'back.out(1.7)' },
        )
      }

      if (card) {
        tl.fromTo(
          card,
          { opacity: 0, scale: 0.85, filter: 'blur(20px)', y: 30 },
          { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4',
        )
      }

      if (kicker) {
        tl.fromTo(
          kicker,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.5',
        )
      }

      if (split?.chars?.length) {
        tl.fromTo(
          split.chars,
          { opacity: 0, y: 20, rotateX: -90 },
          { opacity: 1, y: 0, rotateX: 0, stagger: 0.04, duration: 0.5, ease: 'back.out(2)' },
          '-=0.3',
        )
      }

      if (subtitle) {
        tl.fromTo(
          subtitle,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2',
        )
      }

      if (fields.length > 0) {
        tl.fromTo(
          fields,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 0.4, ease: 'power2.out' },
          '-=0.1',
        )
      }

      if (submit) {
        tl.fromTo(
          submit,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
          '-=0.1',
        )
      }

      if (counter) {
        tl.fromTo(
          counter,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2',
        )
      }

      if (createLink) {
        tl.fromTo(
          createLink,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.3',
        )
      }
    })

    return () => {
      cancelAnimationFrame(splitRafId)
      tl?.kill()
      split?.revert()
    }
  }, [reducedMotion])

  const performExitTransition = (nextHash: string): void => {
    if (leaving) return
    setLeaving(true)

    if (reducedMotion) {
      onNavigate(nextHash)
      return
    }

    const canvasWrap = canvasWrapRef.current
    const cardStage = cardStageRef.current
    const curtain = curtainRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        onNavigate(nextHash)
      },
    })

    if (canvasWrap) {
      tl.to(
        canvasWrap,
        { scale: 1.15, filter: 'blur(18px)', opacity: 0.4, duration: 0.5, ease: 'power2.in' },
        0,
      )
    }

    if (cardStage) {
      tl.to(
        cardStage,
        { rotationY: 90, opacity: 0, duration: 0.4, ease: 'power2.in' },
        0,
      )
    }

    if (curtain) {
      tl.fromTo(
        curtain,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0 0 0 0)', duration: 0.5, ease: 'power3.inOut' },
        0.15,
      )
    }
  }

  const handleLogoClick = (): void => {
    performExitTransition('#hero')
  }

  const handleCreateAccount = (): void => {
    performExitTransition('#conteudos')
  }

  const handleSuccess = (): void => {
    performExitTransition('#hero')
  }

  return (
    <div className="login-page" ref={pageRef}>
      <div ref={canvasWrapRef} className="login-canvas-wrap">
        <LoginBackground />
      </div>

      <div className="login-vignette" aria-hidden="true" />

      <div ref={cardStageRef} className="login-card-stage">
        <LoginCard
          onSuccess={handleSuccess}
          onLogoClick={handleLogoClick}
          onCreateAccount={handleCreateAccount}
        />
      </div>

      <LoginCursor />

      <div ref={curtainRef} className="login-curtain" aria-hidden="true" />
    </div>
  )
}

export type LoginFaceProps = {
  onSuccess: () => void
  onLogoClick: () => void
  onCreateAccount: () => void
  isVisible?: boolean
}

export const LoginFace = ({ onSuccess, onLogoClick, onCreateAccount, isVisible }: LoginFaceProps) => {
  return (
    <LoginCard
      onSuccess={onSuccess}
      onLogoClick={onLogoClick}
      onCreateAccount={onCreateAccount}
      isVisible={isVisible}
    />
  )
}

export default LoginPage
