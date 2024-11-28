import { useState, useEffect } from 'react'
import { VideoPlayer } from "@/components/VideoPlayer"
import { QueueSlider } from "@/components/QueueSlider"
import { BillingList } from "@/components/BillingList"
import { cn } from "@/lib/utils"
import { lightTheme, darkTheme } from "@/lib/theme"
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useScreenState } from "@/global/useScreenState"

interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Screen: React.FC<ScreenProps> = ({ className, ...props }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { tickets } = useScreenState()
  const [hasActiveTickets, setHasActiveTickets] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const theme = isDarkMode ? darkTheme : lightTheme
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [isDarkMode])

  useEffect(() => {
    const activeTickets = tickets.some(ticket => 
      ticket.status === "inQueue" || ticket.status === "processing"
    )
    setHasActiveTickets(activeTickets)
  }, [tickets])

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-background transition-colors duration-300",
        isDarkMode ? "dark" : "",
        className
      )}
      {...props}
    >
      <div className="w-full p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            <BillingList />
          </div>
          <div className="lg:col-span-9 xl:col-span-9 space-y-4 flex flex-col">
            <div className={cn(
              "rounded-lg overflow-hidden shadow-lg transition-all duration-300",
              hasActiveTickets ? "h-[60vh]" : "h-[80vh]"
            )}>
              <VideoPlayer />
            </div>
            <div className={cn(
              "rounded-lg shadow-lg bg-card overflow-hidden transition-all duration-300",
              hasActiveTickets ? "h-[35vh]" : "h-[15vh]"
            )}>
              <QueueSlider />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

