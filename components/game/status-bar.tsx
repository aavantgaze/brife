"use client"

import { Clock, Coins, Flame } from "lucide-react"

interface StatusBarProps {
  coins: number
  matches: number
  time: number
}

export function StatusBar({ coins, matches, time }: StatusBarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-border/40"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.08 0.005 60 / 0.95), oklch(0.08 0.005 60 / 0.7))",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse-gold" />
        <span className="font-mono text-sm tracking-widest text-primary uppercase">
          {"\u0633\u0627\u06CC\u0647\u200C\u0647\u0627\u06CC \u062A\u0647\u0631\u0627\u0646"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm tracking-wide">{matches}</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{"\u06A9\u0628\u0631\u06CC\u062A"}</span>
        </div>

        <div className="w-px h-4 bg-border" />

        <div className="flex items-center gap-2 text-muted-foreground">
          <Coins className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm tracking-wide">{coins}</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{"\u0633\u06A9\u0647"}</span>
        </div>

        <div className="w-px h-4 bg-border" />

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm tracking-wide">{time}</span>
          <span className="text-[10px] font-mono text-muted-foreground/60">{"\u0632\u0645\u0627\u0646"}</span>
        </div>
      </div>
    </header>
  )
}
