import { Card, CardContent } from "@/components/ui/card"
import { Receipt } from 'lucide-react'

export const EmptyBillingQueue: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardContent className="text-center py-8">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cola de Facturación Vacía</h3>
          <p className="text-muted-foreground">No hay tickets pendientes de facturación en este momento.</p>
        </CardContent>
      </Card>
    </div>
  )
}
