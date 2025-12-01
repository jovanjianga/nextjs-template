import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="h-10" />
        </Card>
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="h-10" />
        </Card>
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="h-10" />
        </Card>
      </div>
    </DashboardShell>
  )
}
