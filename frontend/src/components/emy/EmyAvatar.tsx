import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import emyPeaceImg from '../../assets/mascot/emy-peace.png';

interface EmyAvatarProps {
  size?: 'small' | 'medium';
  className?: string;
  imgSrc?: string;
  alt?: string;
}

/**
 * Animated avatar shared by Emy-chan and Mii-chan.
 * Applies a gentle floating + breathing effect unless the user prefers reduced motion.
 */
export function EmyAvatar({ size = 'medium', className = '', imgSrc = emyPeaceImg, alt = 'Emy-chan' }: EmyAvatarProps) {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !avatarRef.current) return;

    const ctx = gsap.context(() => {
      // Floating effect
      gsap.set(avatarRef.current, { y: -3 });
      gsap.to(avatarRef.current, {
        y: 3,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

      // Breathing effect (subtle vertical scale)
      gsap.to(avatarRef.current, {
        scaleY: 1.02,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }, avatarRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={avatarRef}
      className={`emy-avatar emy-avatar--${size} ${className}`}
    >
      <img src={imgSrc} alt={alt} />
    </div>
  );
}
