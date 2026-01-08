import { useEffect, useState } from "react";
import { useTimeline } from "./useTimeline";
import { useSubjects } from "./useSubjects";

export const useSmartTimer = () => {
  const { sessions } = useTimeline();
  const { subjects } = useSubjects();
  const [currentSlot, setCurrentSlot] = useState<{
    subjectName: string;
    subjectColor: string;
    sessionId: string;
    isScheduled: boolean;
  } | null>(null);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Find a session scheduled for this specific hour
      const activeSession = sessions.find((s) => {
        const sessionDate = new Date(s.startTime);
        return sessionDate.getHours() === currentHour;
      });

      if (activeSession) {
        const subject = subjects.find((s) => s.id === activeSession.subjectId);
        if (subject) {
          setCurrentSlot({
            subjectName: subject.name,
            subjectColor: subject.color,
            sessionId: activeSession.id,
            isScheduled: true,
          });
          return;
        }
      }

      // If no session found
      setCurrentSlot(null);
    };

    // Check immediately
    checkSchedule();

    // Re-check every minute (in case hour changes)
    const interval = setInterval(checkSchedule, 60000);
    return () => clearInterval(interval);
  }, [sessions, subjects]);

  return { currentSlot };
};