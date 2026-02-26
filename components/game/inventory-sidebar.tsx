"use client"

import {
  Flame,
  Coins,
  Key,
  FileText,
  CircleDot,
  Clock,
  Package,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface InventoryItem {
  id: string
  name: string
  icon: string
  count: number
  description?: string
}

const iconMap: Record<string, LucideIcon> = {
  flame: Flame,
  coins: Coins,
  key: Key,
  file: FileText,
  cigarette: CircleDot,
  watch: Clock,
  package: Package,
}

interface InventorySidebarProps {
  items: InventoryItem[]
}

export function InventorySidebar({ items }: InventorySidebarProps) {
  return (
    <aside
      className="fixed right-0 top-[52px] bottom-0 z-30 w-20 flex flex-col items-center py-6 gap-1 border-l border-border/30 overflow-y-auto"
      style={{
        background:
          "linear-gradient(to left, oklch(0.08 0.005 60 / 0.95), oklch(0.08 0.005 60 / 0.8))",
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70 mb-4">
        Items
      </span>

      {items.map((item) => {
        const IconComp = iconMap[item.icon] || Package
        return (
          <div
            key={item.id}
            className="group relative flex flex-col items-center gap-1 py-3 px-2 rounded-md transition-colors hover:bg-primary/5 cursor-default w-full"
            title={item.description || item.name}
          >
            <div className="relative">
              <IconComp className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
              {item.count > 1 && (
                <span className="absolute -top-1.5 -right-2.5 text-[9px] font-mono font-bold text-primary bg-secondary rounded-full h-4 w-4 flex items-center justify-center border border-border/40">
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono text-muted-foreground group-hover:text-foreground/80 transition-colors text-center leading-tight">
              {item.name}
            </span>

            {/* Tooltip */}
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50">
              <div
                className="px-3 py-2 rounded-md border border-border/50 whitespace-nowrap"
                style={{
                  background: "oklch(0.12 0.008 60 / 0.95)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-xs font-mono text-primary">{item.name}</p>
                {item.description && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 mt-8 opacity-40">
          <Package className="h-5 w-5 text-muted-foreground" />
          <span className="text-[9px] font-mono text-muted-foreground text-center">
            No items
          </span>
        </div>
      )}
    </aside>
  )
}
