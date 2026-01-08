import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
      <h1 className="text-4xl font-bold tracking-tight">StudyWell</h1>
      <p className="text-slate-400">The professional study companion.</p>
      <Button variant="secondary" size="lg" className="animate-pulse">
        System Operational
      </Button>
    </div>
  )
}

export default App