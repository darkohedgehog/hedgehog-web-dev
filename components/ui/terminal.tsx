"use client"

import React, {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, type MotionProps, useInView } from "motion/react"
import { cn } from "@/lib/utils"

interface SequenceContextValue {
  completeItem: (index: number) => void
  activeIndex: number
  sequenceStarted: boolean
}

const SequenceContext = createContext<SequenceContextValue | null>(null)
const useSequence = () => useContext(SequenceContext)

const ItemIndexContext = createContext<number | null>(null)
const useItemIndex = () => useContext(ItemIndexContext)

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  startOnView?: boolean
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(elementRef, { amount: 0.3, once: true })

  const sequence = useSequence()
  const itemIndex = useItemIndex()

 
  const shouldAnimate = useMemo(() => {
    if (sequence && itemIndex !== null) {
      if (!sequence.sequenceStarted) return false
      return sequence.activeIndex >= itemIndex
    }
    return startOnView ? isInView : true
  }, [sequence, itemIndex, startOnView, isInView])

  const computedDelay = sequence ? 0 : delay / 1000

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: computedDelay }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      onAnimationComplete={() => {
        if (!sequence) return
        if (itemIndex === null) return
        // Poziva se kad animacija stvarno završi (prvi put kad postane vidljivo)
        sequence.completeItem(itemIndex)
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type TypingAs = "span" | "div" | "p" | "code" | "pre"

interface TypingAnimationProps extends MotionProps {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: TypingAs
  startOnView?: boolean
}

const MOTION_TAGS: Record<
  TypingAs,
  React.ComponentType<MotionProps & { children?: React.ReactNode; className?: string }>
> = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  code: motion.code,
  pre: motion.pre,
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string.")
  }

  const [displayedText, setDisplayedText] = useState<string>("")

  // ✅ ref ide na wrapper, ne na motion komponentu
  const inViewRef = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(inViewRef, { amount: 0.3, once: true })

  const sequence = useSequence()
  const itemIndex = useItemIndex()

  const startedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const MotionTag = MOTION_TAGS[as]

  const startCondition = useMemo(() => {
    if (sequence && itemIndex !== null) {
      return sequence.sequenceStarted && sequence.activeIndex === itemIndex
    }
    return startOnView ? isInView : true
  }, [sequence, itemIndex, startOnView, isInView])

  useEffect(() => {
    startedRef.current = false

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null

    const raf = requestAnimationFrame(() => setDisplayedText(""))
    return () => cancelAnimationFrame(raf)
  }, [children])

  useEffect(() => {
    if (!startCondition) return
    if (startedRef.current) return
    startedRef.current = true

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null

    const effectiveDelay = sequence ? 0 : delay

    timeoutRef.current = setTimeout(() => {
      let i = 0

      intervalRef.current = setInterval(() => {
        i += 1
        setDisplayedText(children.substring(0, i))

        if (i >= children.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null

          if (sequence && itemIndex !== null) {
            sequence.completeItem(itemIndex)
          }
        }
      }, duration)
    }, effectiveDelay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      timeoutRef.current = null
      intervalRef.current = null
    }
  }, [startCondition, children, duration, delay, sequence, itemIndex])

  return (
    // ✅ ovaj wrapper samo služi za inView ref
    <span ref={inViewRef} className="contents">
      <MotionTag
        className={cn("text-sm font-normal tracking-tight", className)}
        {...props}
      >
        {displayedText}
      </MotionTag>
    </span>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  sequence?: boolean
  startOnView?: boolean
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.3, once: true })

  const [activeIndex, setActiveIndex] = useState(0)

  const sequenceHasStarted = sequence ? !startOnView || isInView : false

  const completeItem = useCallback((index: number) => {
    setActiveIndex((current) => (index === current ? current + 1 : current))
  }, [])

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null
    return {
      completeItem,
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    }
  }, [sequence, completeItem, activeIndex, sequenceHasStarted])

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children
    const array = Children.toArray(children)
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child as React.ReactNode}
      </ItemIndexContext.Provider>
    ))
  }, [children, sequence])

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "my-16 text-sky-400 border-2 border-cyan-300/60 bg-linear-to-r from-slate-950/80 via-[#051542]/60 to-slate-950/80 backdrop-blur-xl ring-1 ring-sky-300/15 rounded-2xl mx-auto h-full max-h-100 w-full max-w-6xl",
        className
      )}
    >
      <div className="border-border flex flex-col gap-y-2 border-b p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
        </div>
      </div>
      <pre className="p-4">
        <code className="grid gap-y-1 overflow-auto">{wrappedChildren}</code>
      </pre>
    </div>
  )

  if (!sequence) return content

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  )
}