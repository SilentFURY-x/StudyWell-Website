import { useAuthStore } from "@/store/useAuthStore";
import AddSubjectDialog from "./AddSubjectDialog";
import SubjectCard from "./SubjectCard";
import { useSubjects } from "@/hooks/useSubjects";
import { motion, AnimatePresence } from "framer-motion";
import { BookDashed } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { subjects, loading, deleteSubject } = useSubjects();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName?.split(" ")[0]}. Ready to focus?
          </p>
        </div>
        <AddSubjectDialog />
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="min-h-[400px]">
          {subjects.length === 0 ? (
            // Empty State
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                <BookDashed className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No subjects yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm text-center mb-4">
                Add your first subject to start tracking your progress and building your streak.
              </p>
              <AddSubjectDialog />
            </motion.div>
          ) : (
            // Grid of Subjects
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {subjects.map((subject) => (
                  <SubjectCard 
                    key={subject.id} 
                    subject={subject} 
                    onDelete={deleteSubject} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}