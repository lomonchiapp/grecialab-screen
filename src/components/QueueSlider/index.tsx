import { useScreenState } from '@/global/useScreenState'
import { QueueBox } from './QueueBox'
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import { Queue } from "@/types/types"

interface QueueSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const QueueSlider: React.FC<QueueSliderProps> = ({ className, ...props }) => {
  const { queues, tickets } = useScreenState()
  const [activeQueues, setActiveQueues] = useState<Queue[]>([])

  useEffect(() => {
    const filtered = queues.filter(queue => {
      const hasTickets = tickets.some(ticket => 
        (ticket.status === "inQueue" || ticket.status === "processing") && 
        ticket.services.some(service => 
          service.id === queue.serviceId && 
          service.status !== "finished"
        )
      )
      return hasTickets
    })

    setActiveQueues(filtered)
  }, [queues, tickets])

  const plugin = Autoplay({ delay: 4000, stopOnInteraction: false })

  const itemsPerView = activeQueues.length >= 3 ? 3 : activeQueues.length;

  if (activeQueues.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">No hay colas activas</div>;
  }

  return (
    <Card className={cn("w-full h-full flex flex-col", className)} {...props}>
      <CardContent className="p-2 flex-grow">
        <Carousel
          plugins={[plugin]}
          className="w-full h-full"
          opts={{
            align: "start",
            loop: activeQueues.length > itemsPerView,
            skipSnaps: false,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="h-full">
            {activeQueues.map((queue) => (
              <CarouselItem 
                key={queue.id} 
                className={cn(
                  "h-full pl-2",
                  itemsPerView === 1 ? "basis-full" : 
                  itemsPerView === 2 ? "basis-1/2" : 
                  "basis-1/3"
                )}
              >
                <QueueBox queue={queue} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {activeQueues.length > itemsPerView && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  )
}

