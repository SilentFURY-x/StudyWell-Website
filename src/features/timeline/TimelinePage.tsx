import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useSubjects } from "@/hooks/useSubjects";
import { useTimeline } from "@/hooks/useTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; //

// Generate hours from 6 AM to 11 PM
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); 

const TimelinePage = () => {
  const { subjects } = useSubjects();
  const { sessions, addSession, removeSession } = useTimeline();

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId !== "subjects") {
      const hour = parseInt(destination.droppableId);

      const existingSession = sessions.find((s) => {
        const sessionHour = new Date(s.startTime).getHours();
        return sessionHour === hour;
      });

      if (existingSession) {
        removeSession(existingSession.id);
      }

      addSession(draggableId, hour);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
      
      <DragDropContext onDragEnd={onDragEnd}>
        
        {/* LEFT COLUMN: Your Subjects */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4 relative z-0">
          <div className="absolute inset-0 rounded-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 -z-10" />
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

        {/* RIGHT COLUMN: The Timeline */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4 pb-20">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Today's Schedule</h2>
            
            {HOURS.map((hour) => {
              const session = sessions.find(s => {
                const sessionHour = new Date(s.startTime).getHours();
                return sessionHour === hour;
              });
              
              const sessionSubject = session 
                ? subjects.find(sub => sub.id === session.subjectId) 
                : null;

              return (
                <div key={hour} className="flex gap-4 group">
                  <div className="w-16 pt-2 text-right text-sm font-medium text-muted-foreground">
                    {hour}:00
                  </div>

                  <Droppable droppableId={hour.toString()}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "flex-1 min-h-[60px] rounded-xl border border-dashed transition-all relative overflow-hidden",
                          snapshot.isDraggingOver 
                            ? "bg-primary/5 border-primary" 
                            : "border-zinc-200 dark:border-zinc-800",
                          // Only show solid background if session exists AND we aren't hovering with a new one
                          sessionSubject && !snapshot.isDraggingOver 
                            ? "border-solid bg-white dark:bg-zinc-900" 
                            : "bg-transparent"
                        )}
                      >
                        {/* ANIMATION WRAPPER START */}
                        <AnimatePresence mode="wait">
                          {session && sessionSubject && (
                            <motion.div 
                              key={session.id} // Unique key is required for exit animation
                              layout // smooth layout adjustments
                              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                              exit={{ 
                                opacity: 0, 
                                scale: 0.5, 
                                filter: "blur(10px)",
                                transition: { duration: 0.2 } 
                              }}
                              className={cn(
                                "absolute inset-0 m-1 rounded-lg flex items-center justify-between px-4 transition-colors"
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
                                onMouseDown={(e) => e.stopPropagation()} 
                                onClick={() => removeSession(session.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* ANIMATION WRAPPER END */}

                        {/* If no session, render transparent placeholder */}
                        {!session && <div className="h-full w-full" />}
                        
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