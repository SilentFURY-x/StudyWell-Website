import { useState, useEffect } from "react";
import { useTimeline } from "@/hooks/useTimeline";
import { useSubjects } from "@/hooks/useSubjects";

export const useStudyNotifications = () => {
  const { sessions } = useTimeline();
  const { subjects } = useSubjects();
  
  // Stores all details needed to start the timer
  const [activeSession, setActiveSession] = useState<{
    id: string;
    subjectName: string;
    subjectColor: string;
  } | null>(null);

  const [notifiedSessions, setNotifiedSessions] = useState<string[]>([]);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      const currentSession = sessions.find(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getHours() === currentHour;
      });

      if (currentSession) {
        if (!notifiedSessions.includes(currentSession.id)) {
          const subject = subjects.find(s => s.id === currentSession.subjectId);
          if (subject) {
            setActiveSession({
                id: currentSession.id,
                subjectName: subject.name,
                subjectColor: subject.color
            });
            setNotifiedSessions(prev => [...prev, currentSession.id]);
          }
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 60000);
    return () => clearInterval(interval);
  }, [sessions, subjects, notifiedSessions]);

  return {
    activeSession, // Now returns the full object
    closeNotification: () => setActiveSession(null)
  };
};