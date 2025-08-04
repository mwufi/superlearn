"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, Menu } from "lucide-react"

type SidebarContextValue = {
  isOpen: boolean
  isCollapsed: boolean
  setIsOpen: (value: boolean) => void
  setIsCollapsed: (value: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  // Set initial state based on screen size
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsOpen(window.innerWidth >= 1024) // lg breakpoint
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const value = React.useMemo(
    () => ({ isOpen, isCollapsed, setIsOpen, setIsCollapsed }),
    [isOpen, isCollapsed]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, isCollapsed, setIsOpen } = useSidebar()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          !isOpen && "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        {children}
      </aside>
    </>
  )
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 items-center border-b border-sidebar-border px-4">
      {children}
    </div>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-3 py-4">{children}</div>
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-sidebar-border p-4">
      {children}
    </div>
  )
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen, isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-md hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>
      {isOpen && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 z-50 h-6 w-6 items-center justify-center rounded-full border bg-background hover:bg-accent"
        >
          <ChevronLeft className={cn("h-4 w-4", isCollapsed && "rotate-180")} />
        </button>
      )}
    </>
  )
}

export function SidebarMenuItem({
  children,
  icon,
  active,
  onClick,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  const { isCollapsed } = useSidebar()

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isCollapsed && "justify-center"
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {!isCollapsed && <span className="flex-1 text-left">{children}</span>}
    </button>
  )
}

export function SidebarGroup({
  children,
  label,
}: {
  children: React.ReactNode
  label?: string
}) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="mb-4">
      {label && !isCollapsed && (
        <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
          {label}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}