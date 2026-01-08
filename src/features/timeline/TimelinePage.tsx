import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useSubjects } from "@/hooks/useSubjects";
import { useTimeline } from "@/hooks/useTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// Generate hours from 6 AM to 11 PM
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); 

const TimelinePage = () => {
  const { subjects } = useSubjects();
  const { sessions, addSession, removeSession } = useTimeline();

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    // Dropped outside a valid slot? Do nothing.
    if (!destination) return;

    // If dropped in a timeline slot
    if (destination.droppableId !== "subjects") {
      const hour = parseInt(destination.droppableId);

      // 1. Check for collision: Is there already a session here?
      const existingSession = sessions.find((s) => {
        const sessionHour = new Date(s.startTime).getHours();
        return sessionHour === hour;
      });

      // 2. If yes, REMOVE the old one first (Replacement Logic)
      if (existingSession) {
        removeSession(existingSession.id);
      }

      // 3. Add the new session
      addSession(draggableId, hour);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
      
      <DragDropContext onDragEnd={onDragEnd}>
        
        {/* LEFT COLUMN: Your Subjects (Draggable Source) */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4 relative z-0">
          
          {/* 1. BACKGROUND LAYER: Handles the Glass Effect & Border independently */}
          {/* We put the blur here. Because it's a sibling (not a parent) to the content, it won't break dragging. */}
          <div className="absolute inset-0 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 -z-10" />

          {/* 2. CONTENT LAYER: The Logical Container */}
          {/* We strip the styles (bg-transparent, border-0) so it doesn't create a stacking context */}
          <Card className="h-full flex flex-col bg-transparent border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Subjects</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <Droppable droppableId="subjects" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                    {subjects.map((subject, index) => (
                      <Draggable key={subject.id} draggableId={subject.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "p-3 rounded-lg border shadow-sm bg-white dark:bg-zinc-800 flex items-center gap-3 cursor-grab active:cursor-grabbing hover:ring-2 ring-primary/20 transition-all",
                              snapshot.isDragging && "scale-105 shadow-xl rotate-2"
                            )}
                            style={{ 
                              borderLeft: `4px solid ${subject.color}`,
                              ...provided.draggableProps.style 
                            }}
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{subject.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: The Timeline (Drop Targets) */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4 pb-20">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Today's Schedule</h2>
            
            {HOURS.map((hour) => {
              // Find if there is a session for this hour
              const session = sessions.find(s => {
                const sessionHour = new Date(s.startTime).getHours();
                return sessionHour === hour;
              });
              
              // Get Subject Details if session exists
              const sessionSubject = session 
                ? subjects.find(sub => sub.id === session.subjectId) 
                : null;

              return (
                <div key={hour} className="flex gap-4 group">
                  {/* Time Label */}
                  <div className="w-16 pt-2 text-right text-sm font-medium text-muted-foreground">
                    {hour}:00
                  </div>

                  {/* The Drop Zone */}
                  <Droppable droppableId={hour.toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "flex-1 min-h-[60px] rounded-xl border border-dashed transition-all relative overflow-hidden",
                          // Visual Feedback: If dragging over, light up the background
                          snapshot.isDraggingOver 
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20" 
                            : "border-zinc-200 dark:border-zinc-800",
                          // If occupied but NOT being hovered, show solid background
                          sessionSubject && !snapshot.isDraggingOver 
                            ? "border-solid bg-white dark:bg-zinc-900" 
                            : "bg-transparent"
                        )}
                      >
                        {/* If a session exists here, show it */}
                        {session && sessionSubject ? (
                          <div 
                            className={cn(
                              "absolute inset-0 m-1 rounded-lg flex items-center justify-between px-4 transition-opacity duration-200",
                              // THE FIX: If dragging a NEW card over this one, fade this one out!
                              snapshot.isDraggingOver ? "opacity-30 scale-95 grayscale" : "opacity-100"
                            )}
                            style={{ 
                                backgroundColor: `${sessionSubject.color}20`, 
                                borderLeft: `4px solid ${sessionSubject.color}` 
                            }}
                          >
                            <span className="font-semibold" style={{ color: sessionSubject.color }}>
                              {sessionSubject.name}
                            </span>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                              // Stop propagation so clicking delete doesn't trigger drag weirdness
                              onMouseDown={(e) => e.stopPropagation()} 
                              onClick={() => removeSession(session.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="h-full w-full" />
                        )}
                        
                        <div className="hidden">{provided.placeholder}</div>
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>

      </DragDropContext>
    </div>
  );
};

export default TimelinePage;