"use client"

import { X, MapPin, Lock } from "lucide-react"
import { useEffect } from "react"

interface MapLocation {
  id: string
  name: string
  row: number
  col: number
  discovered: boolean
  current: boolean
  type: "bazaar" | "alley" | "building" | "park" | "bridge" | "empty"
  pageId?: number
}

interface MapModalProps {
  open: boolean
  onClose: () => void
  locations: MapLocation[]
  onLocationSelect: (id: string) => void
}

const typeLabels: Record<string, string> = {
  bazaar: "\u0628\u0627\u0632\u0627\u0631",
  alley: "\u06A9\u0648\u0686\u0647",
  building: "\u0628\u0646\u0627",
  park: "\u067E\u0627\u0631\u06A9",
  bridge: "\u067E\u0644",
  empty: "",
}

export function MapModal({
  open,
  onClose,
  locations,
  onLocationSelect,
}: MapModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const grid = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => null as MapLocation | null)
  )
  locations.forEach((loc) => {
    if (loc.row < 5 && loc.col < 5) {
      grid[loc.row][loc.col] = loc
    }
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Map of Tehran"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-noir-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-lg border border-border/50 p-6 animate-fade-in-up"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.008 60 / 0.95), oklch(0.08 0.005 50 / 0.98))",
          boxShadow:
            "0 16px 64px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.05)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-mono text-lg text-primary tracking-wide" dir="rtl">
              {"\u0646\u0642\u0634\u0647 \u0633\u0631\u062F\u0627\u0628"}
            </h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5" dir="rtl">
              {"\u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u06A9\u0634\u0641 \u0634\u062F\u0647"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close map"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2">
          {grid.map((row, rowIdx) =>
            row.map((loc, colIdx) => {
              if (!loc) {
                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="aspect-square rounded-sm border border-border/20 bg-secondary/20"
                  />
                )
              }

              return (
                <button
                  key={loc.id}
                  onClick={() => loc.discovered && onLocationSelect(loc.id)}
                  disabled={!loc.discovered}
                  className={`
                    group relative aspect-square rounded-sm border transition-all duration-200 flex flex-col items-center justify-center gap-0.5 p-1
                    ${
                      loc.current
                        ? "border-primary bg-primary/15 animate-pulse-gold"
                        : loc.discovered
                          ? "border-border/40 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                          : "border-border/20 bg-secondary/10 cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {loc.discovered ? (
                    <MapPin
                      className={`h-3.5 w-3.5 ${loc.current ? "text-primary" : "text-primary/50 group-hover:text-primary"} transition-colors`}
                    />
                  ) : (
                    <Lock className="h-3 w-3 text-muted-foreground/40" />
                  )}
                  <span
                    className={`text-[8px] font-mono leading-tight text-center ${
                      loc.current
                        ? "text-primary"
                        : loc.discovered
                          ? "text-muted-foreground"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {loc.discovered ? loc.name : "???"}
                  </span>
                  {loc.discovered && (
                    <span className="text-[7px] font-mono text-muted-foreground/50">
                      {typeLabels[loc.type]}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse-gold" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {"\u0641\u0639\u0644\u06CC"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary/40" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {"\u06A9\u0634\u0641 \u0634\u062F\u0647"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-2.5 w-2.5 text-muted-foreground/40" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {"\u0642\u0641\u0644"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
