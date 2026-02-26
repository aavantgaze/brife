"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Choice {
  id: string
  text: string
  disabled?: boolean
  requirementLabel?: string
}

interface StoryCardProps {
  text: string
  choices: Choice[]
  onChoiceSelect: (choiceId: string) => void
  speaker?: string
  rtl?: boolean
}

function TypewriterText({ text, rtl }: { text: string; rtl?: boolean }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [text])

  return (
    <p
      className="font-mono text-base leading-relaxed text-foreground/90 whitespace-pre-wrap"
      dir={rtl ? "rtl" : "ltr"}
    >
      {displayed}
      {!done && (
        <span className="inline-block w-2 h-5 bg-primary ml-0.5 align-middle animate-typewriter-blink" />
      )}
    </p>
  )
}

export function StoryCard({
  text,
  choices,
  onChoiceSelect,
  speaker,
  rtl,
}: StoryCardProps) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    const timer = setTimeout(
      () => setRevealed(true),
      Math.min(text.length * 28 + 200, 4000)
    )
    return () => clearTimeout(timer)
  }, [text])

  const ChevronIcon = rtl ? ChevronLeft : ChevronRight

  return (
    <div
      className="relative flex flex-col max-w-xl w-full rounded-lg border border-border/50 p-6 md:p-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.1 0.008 60 / 0.88), oklch(0.08 0.005 50 / 0.92))",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 8px 32px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.05)",
      }}
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {speaker && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary">
            {speaker}
          </span>
        </div>
      )}

      <div className="flex-1 mb-6 min-h-[120px]">
        <TypewriterText text={text} rtl={rtl} />
      </div>

      {/* Choices */}
      <div
        className={`flex flex-col gap-2 transition-all duration-500 ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-2" />
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            onClick={() => onChoiceSelect(choice.id)}
            disabled={choice.disabled}
            className="group flex items-center gap-3 w-full text-left px-4 py-3 rounded-md transition-all duration-200 border border-transparent hover:border-primary/30 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
            dir={rtl ? "rtl" : "ltr"}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <ChevronIcon className="h-4 w-4 text-primary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            <span className="font-mono text-sm text-foreground/80 group-hover:text-primary transition-colors flex-1">
              {choice.text}
            </span>
            {choice.requirementLabel && (
              <span className="text-[10px] font-mono text-primary/50 shrink-0">
                {choice.requirementLabel}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
