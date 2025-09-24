import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Gift, Users, DollarSign, Heart, Calendar, Eye, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    packages: 0,
    addons: 0,
    donations: 0,
    tasks: 0,
    campaigns: 0,
    completions: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentData();
  }, []);

  const fetchStats = async () => {
    try {
      const [packages, addons, donations, tasks, campaigns, completions] = await Promise.all([
        supabase.from('giveaway_packages').select('id', { count: 'exact', head: true }),
        supabase.from('giveaway_addons').select('id', { count: 'exact', head: true }),
        supabase.from('donation_requests').select('id', { count: 'exact', head: true }),
        supabase.from('earn_money_tasks').select('id', { count: 'exact', head: true }),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('user_task_completions').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        packages: packages.count || 0,
        addons: addons.count || 0,
        donations: donations.count || 0,
        tasks: tasks.count || 0,
        campaigns: campaigns.count || 0,
        completions: completions.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentData = async () => {
    try {
      const [donations, tasks] = await Promise.all([
        supabase.from('donation_requests').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_task_completions').select('*, earn_money_tasks(name)').order('completed_at', { ascending: false }).limit(5)
      ]);

      setRecentDonations(donations.data || []);
      setRecentTasks(tasks.data || []);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/books')}>Manage Books</Button>
              <Button onClick={() => navigate('/admin/giveaway')}>Manage Giveaways</Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.packages}</div>
                <div className="text-sm text-muted-foreground">Packages</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.addons}</div>
                <div className="text-sm text-muted-foreground">Add-ons</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{stats.donations}</div>
                <div className="text-sm text-muted-foreground">Donations</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{stats.tasks}</div>
                <div className="text-sm text-muted-foreground">Tasks</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{stats.campaigns}</div>
                <div className="text-sm text-muted-foreground">Campaigns</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-indigo-600">{stats.completions}</div>
                <div className="text-sm text-muted-foreground">Completions</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="donations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="donations">Recent Donations</TabsTrigger>
              <TabsTrigger value="tasks">Task Completions</TabsTrigger>
              <TabsTrigger value="management">Quick Actions</TabsTrigger>
              <TabsTrigger value="help">Admin Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="donations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Donation Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDonations.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No donation requests yet</p>
                    ) : (
                      recentDonations.map((donation: any) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{donation.donor_name}</h4>
                            <p className="text-sm text-muted-foreground">{donation.email}</p>
                            <p className="text-sm">Type: {donation.donation_type}</p>
                            {donation.amount && <p className="text-sm">Amount: ${donation.amount}</p>}
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(donation.status)}>
                              {donation.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Task Completions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTasks.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No task completions yet</p>
                    ) : (
                      recentTasks.map((completion: any) => (
                        <div key={completion.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">{completion.earn_money_tasks?.name}</h4>
                            <p className="text-sm text-muted-foreground">User ID: {completion.user_id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">${completion.reward_earned}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(completion.completed_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="management" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Giveaway Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" onClick={() => navigate('/admin/giveaway')}>
                      Manage Packages & Add-ons
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Create packages, set pricing, add countdown timers, manage add-ons
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Task Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      Manage Earn Money Tasks
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Create tasks, set rewards, monitor completions
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Donation Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full" variant="outline">
                      Review Donations
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Approve/reject donation requests, manage supporters
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="help" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Guide & Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">🎁 Giveaway Package Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Go to <strong>/admin/giveaway</strong> to manage packages</li>
                      <li>• Set original price and discount price to show savings</li>
                      <li>• Add countdown timers for urgency marketing</li>
                      <li>• Upload package images (use Unsplash URLs for now)</li>
                      <li>• Create add-ons with custom pricing for each package</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">💰 Task & Earnings System</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Tasks are pre-loaded in the database</li>
                      <li>• Users can complete tasks to earn money</li>
                      <li>• Monitor task completions in the dashboard</li>
                      <li>• Set reward ranges (min/max) for each task</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">❤️ Donation Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Review donation requests from <strong>/support-donation</strong></li>
                      <li>• Types: Monetary, Food, Prayer, Volunteer</li>
                      <li>• Approve/reject requests as needed</li>
                      <li>• Track donor information and contact details</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">📚 Content Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Use <strong>/admin/books</strong> for chapters and books</li>
                      <li>• Add cover images and buy links for chapters</li>
                      <li>• Manage categories and book details</li>
                      <li>• Set pricing for book purchases</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🚀 Quick Setup Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                      <li>Run the COMPLETE_GIVEAWAY_SYSTEM.sql in Supabase</li>
                      <li>Create giveaway packages with images and pricing</li>
                      <li>Add custom add-ons for each package</li>
                      <li>Monitor donations and task completions</li>
                      <li>Manage content through the books admin panel</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;