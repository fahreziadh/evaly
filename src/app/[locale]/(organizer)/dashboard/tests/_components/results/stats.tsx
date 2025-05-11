import { Card } from "@/components/ui/card"

const Stats = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
    <Card className="p-4">
      <p className="text-muted-foreground text-sm">Total Submissions</p>
      <h1 className="text-2xl font-semibold">12</h1>
    </Card>
    <Card className="p-4">
      <p className="text-muted-foreground text-sm">Completition Rate</p>
      <h1 className="text-2xl font-semibold">84%</h1>
    </Card>
    <Card className="p-4">
      <p className="text-muted-foreground text-sm">Average Score</p>
      <h1 className="text-2xl font-semibold">60</h1>
    </Card>
    <Card className="p-4">
      <p className="text-muted-foreground text-sm">Average Time</p>
      <h1 className="text-2xl font-semibold">100m</h1>
    </Card>
  </div>
  )
}

export default Stats