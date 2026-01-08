import { Subject } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface SubjectCardProps {
  subject: Subject;
  onDelete: (id: string) => void;
}

const SubjectCard = ({ subject, onDelete }: SubjectCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
        {/* Color Strip at the top */}
        <div 
          className="h-3 w-full" 
          style={{ backgroundColor: subject.color }} 
        />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">{subject.name}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => onDelete(subject.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="text-xs text-muted-foreground">
            0 hours studied
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubjectCard;