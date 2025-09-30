import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Task {
  id: string;
  name: string;
  reward: number;
  description: string;
  instructions: string;
  time_required: string;
  difficulty: string;
  task_url: string;
}

interface TaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskComplete: (taskId: string, reward: number) => void;
  onTaskStart: (taskId: string) => void;
  onTaskReviewing: (taskId: string) => void;
  taskStatus: 'not_started' | 'started' | 'reviewing' | 'completed';
}

type DialogStep = 'instructions' | 'upload' | 'validation' | 'review' | 'success';

export const TaskDialog: React.FC<TaskDialogProps> = ({ task, isOpen, onClose, onTaskComplete, onTaskStart, onTaskReviewing, taskStatus }) => {
  const [step, setStep] = useState<DialogStep>('instructions');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [validationCode, setValidationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Set initial step based on task status
  React.useEffect(() => {
    if (taskStatus === 'started') {
      setStep('upload');
    } else {
      setStep('instructions');
    }
  }, [taskStatus, isOpen]);

  const resetDialog = () => {
    setStep('instructions');
    setProofFile(null);
    setValidationCode('');
    setGeneratedCode('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleStartTask = () => {
    if (task?.task_url) {
      window.open(task.task_url, '_blank');
      onTaskStart(task.id);
      onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setProofFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmitProof = async () => {
    if (!proofFile || !task) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload image to task-proofs bucket
      const filename = `${Date.now()}.jpg`;
      const filePath = `${task.id}/${filename}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('task-proofs')
        .upload(filePath, proofFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('task-proofs')
        .getPublicUrl(filePath);
      
      // Update task completion with proof image URL
      const { error: updateError } = await supabase
        .from('user_task_completions')
        .update({ 
          proof_image_url: publicUrl,
          status: 'proof_uploaded',
          submitted_at: new Date().toISOString()
        })
        .eq('task_id', task.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Proof Uploaded",
        description: "Your proof has been submitted for review.",
      });
      
      setStep('validation');
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
      
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload proof image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidationSubmit = async () => {
    if (validationCode.toUpperCase() !== generatedCode) {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct validation code.",
        variant: "destructive"
      });
      return;
    }
    
    if (task) {
      onTaskReviewing(task.id);
    }
    
    setStep('review');
    setIsSubmitting(true);
    onClose();
    

  };

  const renderInstructions = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{task?.name}</h3>
        <p className="text-muted-foreground">{task?.description}</p>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Task Instructions:</h4>
        <p className="text-sm">{task?.instructions}</p>
      </div>
      
      <div className="flex justify-between text-sm">
        <span>Time Required: {task?.time_required}</span>
        <span className="font-semibold text-green-600">Reward: ${(task?.reward || 0).toFixed(2)}</span>
      </div>
      
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Tasks are monitored for quality and compliance. Please follow instructions carefully.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleStartTask} className="flex-1">
          Go to Task
        </Button>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Upload Proof of Completion</h3>
        <p className="text-muted-foreground">Please upload a screenshot showing you completed the task</p>
      </div>
      
      <div 
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        {proofFile ? (
          <div>
            <p className="font-semibold text-green-600">File uploaded: {proofFile.name}</p>
            <p className="text-sm text-muted-foreground">Click to change file</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">Click to upload screenshot</p>
            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Make sure your screenshot clearly shows the completed task. Unclear or fake submissions will be rejected.
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmitProof} 
          disabled={!proofFile || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Uploading...' : 'Submit Proof'}
        </Button>
      </div>
    </div>
  );

  const renderValidation = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Validation Required</h3>
        <p className="text-muted-foreground">Please wait for the validation code to appear and enter it below</p>
      </div>
      
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-sm text-muted-foreground mb-2">Your validation code is:</p>
        <div className="text-2xl font-bold font-mono tracking-wider">{generatedCode}</div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Enter validation code:</label>
        <Input
          placeholder="Enter code here"
          value={validationCode}
          onChange={(e) => setValidationCode(e.target.value)}
          className="text-center font-mono tracking-wider"
        />
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleValidationSubmit}
          disabled={!validationCode}
          className="flex-1"
        >
          Submit Code
        </Button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-4 text-center">
      <Clock className="h-16 w-16 text-blue-500 mx-auto animate-pulse" />
      <h3 className="text-lg font-semibold">Task Under Review</h3>
      <p className="text-muted-foreground">
        Your submission is being reviewed. Return to the main page to see auto-approval countdown.
      </p>
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm">Please wait while we verify your task completion...</p>
      </div>
      {isSubmitting && (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm">Reviewing submission...</span>
        </div>
      )}
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h3 className="text-lg font-semibold text-green-600">Task Completed Successfully!</h3>
      <p className="text-muted-foreground">
        Congratulations! You have earned ${(task?.reward || 0).toFixed(2)} for completing this task.
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-700">
          Your earnings have been added to your account balance.
        </p>
      </div>
      <Button onClick={handleClose} className="w-full">
        Continue
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'instructions': return renderInstructions();
      case 'upload': return renderUpload();
      case 'validation': return renderValidation();
      case 'review': return renderReview();
      case 'success': return renderSuccess();
      default: return renderInstructions();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'instructions' && 'Task Instructions'}
            {step === 'upload' && 'Upload Proof'}
            {step === 'validation' && 'Validation'}
            {step === 'review' && 'Under Review'}
            {step === 'success' && 'Task Complete'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};