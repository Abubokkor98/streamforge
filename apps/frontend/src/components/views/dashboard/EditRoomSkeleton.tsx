import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

function EditRoomSkeleton() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        </CardContent>

        <CardFooter>
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    </div>
  )
}

export { EditRoomSkeleton }
