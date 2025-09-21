import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Calendar, Share2 } from "lucide-react";
import { format } from "date-fns";

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // Mock group data for now - will be replaced with real data later
  const mockGroup = {
    id: groupId,
    name: "Sample Group",
    description: "This is a sample group description",
    member_count: 42,
    books_read: 15,
    created_at: new Date().toISOString(),
    last_activity: new Date().toISOString()
  };

  const shareGroup = () => {
    const groupUrl = window.location.href;
    navigator.clipboard.writeText(groupUrl);
    // Would show toast notification here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/groups')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {mockGroup.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{mockGroup.name}</h1>
              <div className="flex items-center gap-6 text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {mockGroup.member_count.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {format(new Date(mockGroup.created_at), 'MMMM yyyy')}
                </span>
              </div>
              <p className="text-muted-foreground">{mockGroup.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={shareGroup}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button>Join Group</Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Group Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Group discussions and comments functionality coming soon!
                  <br />
                  <small className="text-xs">This feature will allow members to create discussions, share photos, and comment on each other's posts in real-time.</small>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Members:</span>
                    <span className="font-semibold">{mockGroup.member_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Books Read:</span>
                    <span className="font-semibold">{mockGroup.books_read}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Created:</span>
                    <span className="font-semibold">{format(new Date(mockGroup.created_at), 'MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Activity:</span>
                    <span className="font-semibold">2 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GroupDetail;