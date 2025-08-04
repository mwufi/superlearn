"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Brain, 
  Sparkles, 
  GraduationCap, 
  User, 
  HelpCircle,
  MoreHorizontal,
  Github,
  Twitter,
  Globe
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

function SidebarContents() {
  const { isCollapsed } = useSidebar()
  const [activeItem, setActiveItem] = React.useState("explain")

  const menuItems = [
    {
      id: "explain",
      label: "Explain to me",
      icon: <Sparkles className="h-5 w-5" />,
      href: "/explain",
    },
    {
      id: "structured",
      label: "Structured Learning",
      icon: <Brain className="h-5 w-5" />,
      href: "/structured",
    },
    {
      id: "school",
      label: "School",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/school",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <User className="h-5 w-5" />,
      href: "/profile",
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/quiz",
    },
    {
      id: "more",
      label: "More",
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: "/more",
    },
  ]

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-semibold text-lg">Superlearn</span>
          )}
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {menuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <SidebarMenuItem
                icon={item.icon}
                active={activeItem === item.id}
                onClick={() => setActiveItem(item.id)}
              >
                {item.label}
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!isCollapsed && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">
              Learn everything with AI
            </div>
            <div className="flex gap-3">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </SidebarFooter>
    </>
  )
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar>
          <SidebarContents />
        </Sidebar>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top Bar */}
          <header className="flex-shrink-0 h-16 border-b border-border bg-background px-4 lg:px-6 flex items-center">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Superlearn</h1>
          </header>
          
          {/* Content */}
          <main className="flex-1 overflow-y-auto min-h-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}