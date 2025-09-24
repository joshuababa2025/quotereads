import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, Play, Share2, Eye, MessageSquare, Star, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EarnMoneyOnline = () => {
  const { toast } = useToast();
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const tasks = [
    {
      id: 1,
      name: 'Watch YouTube Videos',
      reward: 0.50,
      description: 'Watch and rate videos for 5 minutes',
      icon: <Play className="w-5 h-5" />,
      category: 'Video',
      timeRequired: '5 min',
      difficulty: 'Easy'
    },
    {
      id: 2,
      name: 'Social Media Engagement',
      reward: 1.00,
      description: 'Like and share posts on social platforms',
      icon: <Share2 className="w-5 h-5" />,
      category: 'Social',
      timeRequired: '10 min',
      difficulty: 'Easy'
    },
    {
      id: 3,
      name: 'Survey Participation',
      reward: 2.00,
      description: 'Complete short surveys about products',
      icon: <MessageSquare className="w-5 h-5" />,
      category: 'Survey',
      timeRequired: '15 min',
      difficulty: 'Medium'
    },
    {
      id: 4,
      name: 'Ad Viewing',
      reward: 0.25,
      description: 'View advertisements for 30 seconds',
      icon: <Eye className="w-5 h-5" />,
      category: 'Ads',
      timeRequired: '1 min',
      difficulty: 'Easy'
    },
    {
      id: 5,
      name: 'Product Reviews',
      reward: 1.50,
      description: 'Write detailed reviews for products',
      icon: <Star className="w-5 h-5" />,
      category: 'Review',
      timeRequired: '20 min',
      difficulty: 'Medium'
    },
    {
      id: 6,
      name: 'App Testing',
      reward: 3.00,
      description: 'Test mobile apps and provide feedback',
      icon: <CheckCircle className="w-5 h-5" />,
      category: 'Testing',
      timeRequired: '30 min',
      difficulty: 'Hard'
    }
  ];

  const handleStartTask = (taskId: number, reward: number) => {
    if (completedTasks.includes(taskId)) {
      toast({
        title: "Task Already Completed",
        description: "You have already completed this task today.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Task Started",
      description: "Complete the task to earn your reward.",
    });

    // Simulate task completion
    try {
      setTimeout(() => {
        setCompletedTasks(prev => {
          if (prev.includes(taskId)) return prev;
          return [...prev, taskId];
        });
        setTotalEarnings(prev => prev + reward);
        toast({
          title: "Task Completed!",
          description: `You earned $${reward.toFixed(2)}. Great job!`,
        });
      }, 2000);
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive"
      });
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

  const completionRate = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <DollarSign className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Earn Money Online</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete simple tasks and earn money from the comfort of your home. Start earning today!
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Daily Progress</h3>
                <span className="text-sm text-muted-foreground">{completedTasks.length}/{tasks.length} tasks</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>

          {/* Available Tasks */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Available Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);
                
                return (
                  <Card key={task.id} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {task.icon}
                          <CardTitle className="text-lg">{task.name}</CardTitle>
                        </div>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{task.category}</Badge>
                        <Badge className={getDifficultyColor(task.difficulty)}>{task.difficulty}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.timeRequired}
                        </div>
                        <div className="font-semibold text-green-600">
                          ${task.reward.toFixed(2)}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartTask(task.id, task.reward)}
                        disabled={isCompleted}
                        variant={isCompleted ? "secondary" : "default"}
                      >
                        {isCompleted ? "Completed" : "Start Task"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
      
      <Footer />
    </div>
  );
};

export default EarnMoneyOnline;