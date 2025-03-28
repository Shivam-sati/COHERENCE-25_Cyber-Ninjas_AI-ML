
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BriefcaseIcon, X, Plus } from "lucide-react";
import { Job } from "@/pages/Jobs";

interface JobPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Omit<Job, "id" | "applicants" | "matchedCandidates" | "topCandidates" | "postedDate">) => void;
}

export function JobPostingModal({ isOpen, onClose, onSubmit }: JobPostingModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const resetForm = () => {
    setTitle("");
    setDepartment("");
    setLocation("");
    setDescription("");
    setSkillInput("");
    setSkills([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !department || !location || skills.length === 0) {
      return;
    }

    onSubmit({
      title,
      department,
      location,
      description,
      requiredSkills: skills
    });

    resetForm();
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput) {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BriefcaseIcon className="h-5 w-5" />
            Post New Job
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="space-y-3">
            <Label htmlFor="title">Job Title*</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="department">Department*</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="location">Location*</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, New York, NY"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="skills">Required Skills*</Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="e.g. React, TypeScript"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="shrink-0"
                onClick={addSkill}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add at least one required skill
              </p>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-full"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-full bg-gradient-primary hover:opacity-90"
              disabled={!title || !department || !location || skills.length === 0}
            >
              Post Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
