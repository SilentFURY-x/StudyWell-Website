import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";
import { SUBJECT_COLORS } from "@/types";
import { cn } from "@/lib/utils";

const AddSubjectDialog = () => {
  const [open, setOpen] = useState(false); // We control this state 100% now
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(SUBJECT_COLORS[0].value);
  const { addSubject } = useSubjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addSubject(name, selectedColor);
      
      // Reset and Close ONLY after success
      setName("");
      setSelectedColor(SUBJECT_COLORS[0].value);
      setOpen(false); 
    } catch (error) {
      console.error("Failed to create subject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. The Button is now OUTSIDE the Dialog component */}
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" /> Add Subject
      </Button>

      {/* 2. The Dialog is controlled purely by the 'open' prop */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input
                id="name"
                placeholder="e.g. Advanced Physics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label>Color Code</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      selectedColor === color.value 
                        ? "border-primary scale-110 shadow-md" 
                        : "border-transparent hover:border-zinc-300"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Subject"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSubjectDialog;