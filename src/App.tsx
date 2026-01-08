import { Button } from "@/components/ui/button"

function App() {
  return (
    // This div uses your theme's background color
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      
      <div className="text-center space-y-4 max-w-md">
        {/* 'text-primary' tests your text color variable */}
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          StudyWell
        </h1>
        
        {/* 'text-muted-foreground' tests the subtle gray zinc color */}
        <p className="text-muted-foreground">
          The ultimate study companion. Phase 1 is complete.
        </p>
        
        <div className="flex justify-center gap-4">
           {/* This is the component you just installed */}
           <Button>Login</Button>
           <Button variant="secondary">Learn More</Button>
        </div>
      </div>

    </div>
  )
}

export default App