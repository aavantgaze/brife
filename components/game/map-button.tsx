"use client"

import { MapIcon } from "lucide-react"

interface MapButtonProps {
  onClick: () => void
}

export function MapButton({ onClick }: MapButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full flex items-center justify-center border border-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-gold group"
      style={{
        background:
          "radial-gradient(circle, oklch(0.15 0.015 70 / 0.9), oklch(0.1 0.008 60 / 0.95))",
        boxShadow:
          "0 4px 20px oklch(0.78 0.14 80 / 0.2), inset 0 1px 0 oklch(1 0 0 / 0.06)",
      }}
      aria-label="Open map of Tehran"
    >
      <MapIcon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
    </button>
  )
}
