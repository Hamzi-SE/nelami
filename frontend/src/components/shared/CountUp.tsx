import { motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value?: number
  end?: number
  duration?: number
  format?: boolean
  className?: string
  prefix?: string
  suffix?: string
  separator?: string
}

const CountUp = ({
  value,
  end,
  duration = 1.5,
  format = true,
  className,
  prefix = '',
  suffix = '',
  separator = ',',
}: CountUpProps) => {
  const target = value ?? end ?? 0
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => {
    const num = Math.round(v)
    if (format) {
      return separator ? num.toLocaleString('en-US') : num.toLocaleString()
    }
    return num.toString()
  })
  const [display, setDisplay] = useState(format ? target.toLocaleString() : String(target))

  useEffect(() => {
    if (!inView) return

    const controls = motionValue.set(0)
    const startTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      motionValue.set(eased * target)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    const unsubscribe = rounded.on('change', (v) => setDisplay(v))

    return () => {
      cancelAnimationFrame(animationFrame)
      unsubscribe()
    }
  }, [inView, target, duration, format, motionValue, rounded])

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </motion.span>
  )
}

export default CountUp
