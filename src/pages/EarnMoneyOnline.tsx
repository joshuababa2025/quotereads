import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, Play, Share2, Eye, MessageSquare, Star, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { TaskDialog } from '@/components/TaskDialog';

const EarnMoneyOnline = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [userCompletions, setUserCompletions] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewingTasks, setReviewingTasks] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    // Clean up any existing intervals on unmount
    return () => {
      Object.keys(reviewingTasks).forEach(taskId => {
        if (window[`countdown_${taskId}`]) {
          clearInterval(window[`countdown_${taskId}`]);
        }
      });
    };
  }, []);

  useEffect(() => {
    loadTasks();
    if (user) {
      loadUserData();
      
      // Check for existing reviewing tasks and start countdowns
      setTimeout(async () => {
        const { data: reviewingTasksData } = await supabase
          .from('user_task_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'reviewing');
        
        if (reviewingTasksData && reviewingTasksData.length > 0) {
          reviewingTasksData.forEach(task => {
            const taskId = task.task_id;
            setReviewingTasks(prev => ({ ...prev, [taskId]: 30 }));
            
            const countdownInterval = setInterval(() => {
              setReviewingTasks(prev => {
                const newCount = (prev[taskId] || 0) - 1;
                if (newCount <= 0) {
                  clearInterval(countdownInterval);
                  autoApproveTask(taskId);
                  const { [taskId]: removed, ...rest } = prev;
                  return rest;
                }
                return { ...prev, [taskId]: newCount };
              });
            }, 1000);
            
            window[`countdown_${taskId}`] = countdownInterval;
          });
        }
      }, 1000);
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('earn_money_tasks')
        .select('*')
        .eq('is_active', true)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    try {
      console.log('=== LOADING USER DATA ===');
      console.log('User ID:', user.id);
      
      const { data: completions, error: completionsError } = await supabase
        .from('user_task_completions')
        .select('*')
        .eq('user_id', user.id);
      
      console.log('User completions:', completions);
      console.log('Completions error:', completionsError);
      
      // Get earnings from user_earnings table (calculated from transactions)
      const { data: earnings, error: earningsError } = await supabase
        .from('user_earnings')
        .select('total_earnings')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('User earnings:', earnings);
      console.log('Earnings error:', earningsError);
      
      setUserCompletions(completions || []);
      setTotalEarnings(earnings?.total_earnings || 0);
      
      // Debug: Log task statuses
      if (completions) {
        completions.forEach(completion => {
          console.log(`Task ${completion.task_id}: Status = ${completion.status}, Earnings = ${completion.earnings}`);
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };



  const getTaskIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'video': return <Play className="w-5 h-5" />;
      case 'social': return <Share2 className="w-5 h-5" />;
      case 'survey': return <MessageSquare className="w-5 h-5" />;
      case 'ads': return <Eye className="w-5 h-5" />;
      case 'review': return <Star className="w-5 h-5" />;
      case 'app': case 'testing': return <CheckCircle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getTaskStatus = (taskId: string) => {
    if (!user) return 'not_started';
    const completion = userCompletions.find(c => c.task_id === taskId);
    return completion?.status || 'not_started';
  };

  const getButtonText = (taskId: string) => {
    const status = getTaskStatus(taskId);
    switch (status) {
      case 'completed': return 'Completed';
      case 'reviewing': return 'Reviewing';
      case 'started': return 'Continue Task';
      default: return 'Start Task';
    }
  };

  const handleTaskClick = (taskId: string) => {
    const status = getTaskStatus(taskId);
    if (status === 'completed' || status === 'reviewing') return;

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsTaskDialogOpen(true);
    }
  };

  const handleTaskStart = async (taskId: string) => {
    if (!user) return;
    try {
      await supabase.from('user_task_completions').insert({
        user_id: user.id,
        task_id: taskId,
        status: 'started'
      });
      loadUserData();
    } catch (error) {
      console.error('Error starting task:', error);
    }
  };

  const handleTaskReviewing = async (taskId: string) => {
    if (!user) return;
    try {
      console.log('=== TASK REVIEWING DEBUG ===');
      console.log('User ID:', user.id);
      console.log('Task ID:', taskId);
      
      const { data: updateResult, error: updateError } = await supabase.from('user_task_completions')
        .update({ 
          status: 'reviewing',
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .select();
      
      console.log('Update result:', updateResult);
      console.log('Update error:', updateError);
      
      if (updateError) {
        console.error('Failed to update task to reviewing:', updateError);
        return;
      }
      
      // Verify the update worked
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_task_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
      
      console.log('Verification data:', verifyData);
      console.log('Verification error:', verifyError);
      
      // Start 30-second countdown for this task
      console.log('Starting countdown for task:', taskId);
      setReviewingTasks(prev => {
        console.log('Setting countdown to 30 for task:', taskId);
        console.log('Previous reviewing tasks:', prev);
        const newState = { ...prev, [taskId]: 30 };
        console.log('New reviewing tasks state:', newState);
        return newState;
      });
      
      const countdownInterval = setInterval(() => {
        setReviewingTasks(prev => {
          const newCount = (prev[taskId] || 0) - 1;
          console.log(`Countdown for task ${taskId}: ${newCount}`);
          if (newCount <= 0) {
            clearInterval(countdownInterval);
            console.log('Countdown finished, auto-approving task:', taskId);
            // Auto-approve the task
            autoApproveTask(taskId);
            const { [taskId]: removed, ...rest } = prev;
            return rest;
          }
          return { ...prev, [taskId]: newCount };
        });
      }, 1000);
      
      loadUserData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  
  const autoApproveTask = async (taskId: string) => {
    if (!user) return;
    try {
      console.log('=== AUTO APPROVAL DEBUG ===');
      console.log('Auto-approving task:', taskId);
      console.log('User ID:', user.id);
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        return;
      }
      
      console.log('Task found:', task);
      console.log('Task reward:', task.reward);
      
      // First check current status
      const { data: currentStatus, error: statusError } = await supabase
        .from('user_task_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
      
      console.log('Current task status before auto-approval:', currentStatus);
      console.log('Status check error:', statusError);
      
      const { data: updateResult, error: updateError } = await supabase
        .from('user_task_completions')
        .update({ 
          status: 'completed',
          earnings: task.reward || 0,
          completed_at: new Date().toISOString(),
          admin_notes: 'Auto-verified after 30 seconds'
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .eq('status', 'reviewing')
        .select();
      
      console.log('Auto-approval update result:', updateResult);
      console.log('Auto-approval update error:', updateError);
      
      if (updateError) {
        console.error('Auto-approval error:', updateError);
        
        // Try direct update without status condition
        console.log('Trying direct update without status condition...');
        const { data: directResult, error: directError } = await supabase
          .from('user_task_completions')
          .update({ 
            status: 'completed',
            earnings: task.reward || 0,
            completed_at: new Date().toISOString(),
            admin_notes: 'Auto-verified after 30 seconds (direct update)'
          })
          .eq('user_id', user.id)
          .eq('task_id', taskId)
          .select();
        
        console.log('Direct update result:', directResult);
        console.log('Direct update error:', directError);
      } else {
        console.log('Task auto-approved successfully');
        toast({
          title: "Task Auto-Approved!",
          description: `You earned $${(task.reward || 0).toFixed(2)}. Great job!`,
        });
      }
      
      // Verify final status
      const { data: finalStatus, error: finalError } = await supabase
        .from('user_task_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .single();
      
      console.log('Final task status after auto-approval:', finalStatus);
      console.log('Final status error:', finalError);
      
      loadUserData();
    } catch (error) {
      console.error('Auto-approval error:', error);
    }
  };

  const handleTaskComplete = async (taskId: string, reward: number) => {
    if (!user) return;
    try {
      await supabase.from('user_task_completions')
        .update({ 
          status: 'completed',
          earnings: reward,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('task_id', taskId);
      
      setIsTaskDialogOpen(false);
      setSelectedTask(null);
      loadUserData();
      
      toast({
        title: "Task Completed!",
        description: `You earned $${reward.toFixed(2)}. Great job!`,
      });
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionRate = tasks.length > 0 ? (userCompletions.filter(c => c.status === 'completed').length / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Earn Money Online</h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete simple tasks and earn money from the comfort of your home. Start earning today!
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4">
            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-500 mx-auto mb-1 md:mb-2" />
                <div className="text-lg md:text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total Earnings</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-500 mx-auto mb-1 md:mb-2" />
                <div className="text-lg md:text-2xl font-bold text-blue-600">{user ? userCompletions.filter(c => c.status === 'completed').length : 0}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Tasks Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 md:p-6 text-center">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-500 mx-auto mb-1 md:mb-2" />
                <div className="text-lg md:text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="mb-4">
            <CardContent className="p-3 md:p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Daily Progress</h3>
                <span className="text-sm text-muted-foreground">{user ? userCompletions.filter(c => c.status === 'completed').length : 0}/{tasks.length} tasks</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>


          {/* Available Tasks */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Available Tasks</h2>
            {!user ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Please sign in to view and complete tasks.</p>
                <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
              </Card>
            ) : loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading tasks...</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => {
                const status = getTaskStatus(task.id);
                const isCompleted = status === 'completed';
                const isReviewing = status === 'reviewing';
                const countdown = reviewingTasks[task.id];
                
                // Debug: Log countdown value and task status
                console.log(`=== TASK RENDER DEBUG ===`);
                console.log(`Task ${task.id}:`);
                console.log(`- Status: ${status}`);
                console.log(`- isReviewing: ${isReviewing}`);
                console.log(`- isCompleted: ${isCompleted}`);
                console.log(`- countdown: ${countdown}`);
                console.log(`- reviewingTasks state:`, reviewingTasks);
                
                if (isReviewing && countdown !== undefined) {
                  console.log(`Task ${task.id} countdown:`, countdown);
                }
                
                return (
                  <Card key={task.id} className={`transition-all ${
                    isCompleted ? 'bg-green-50 border-green-200' : 
                    isReviewing ? 'bg-blue-50 border-blue-200' :
                    'hover:shadow-lg'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTaskIcon(task.category)}
                          <CardTitle className="text-lg">{task.name}</CardTitle>
                        </div>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {isReviewing && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                            {countdown !== undefined && (
                              <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                {countdown}s
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-orange-500 text-white hover:bg-orange-600">{task.category}</Badge>
                        <Badge className="bg-orange-500 text-white hover:bg-orange-600">{task.difficulty}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.time_required}
                        </div>
                        <div className="font-semibold text-green-600">
                          ${(task.reward || 0).toFixed(2)}
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full ${
                          isCompleted ? 'bg-orange-500 text-white hover:bg-orange-600' : ''
                        }`}
                        onClick={() => handleTaskClick(task.id)}
                        disabled={isCompleted || isReviewing}
                        variant={
                          isCompleted ? "default" : 
                          isReviewing ? "outline" : 
                          "default"
                        }
                      >
                        {isReviewing && countdown !== undefined 
                          ? `Auto-approving in ${countdown}s` 
                          : getButtonText(task.id)
                        }
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            )}
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose a Task</h3>
                  <p className="text-sm text-muted-foreground">Select from our available tasks based on your interests and available time.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Complete the Task</h3>
                  <p className="text-sm text-muted-foreground">Follow the instructions and complete the task within the specified time.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Earn Money</h3>
                  <p className="text-sm text-muted-foreground">Get paid instantly upon task completion. Withdraw your earnings anytime.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <TaskDialog
        task={selectedTask}
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedTask(null);
        }}
        onTaskComplete={(taskId, reward) => handleTaskComplete(taskId, reward)}
        onTaskStart={(taskId) => handleTaskStart(taskId)}
        onTaskReviewing={(taskId) => handleTaskReviewing(taskId)}
        taskStatus={selectedTask ? getTaskStatus(selectedTask.id) : 'not_started'}
      />
      
      <Footer />
    </div>
  );
};

export default EarnMoneyOnline;