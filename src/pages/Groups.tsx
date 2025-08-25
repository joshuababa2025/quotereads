import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { useState } from "react";

const Groups = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Soccer Club - Lagos",
      members: 45,
      lastActivity: "2 hours ago",
      description: "A community for physical meetings, sports, and social activities. Join us for weekly matches, training sessions, and social events. All skill levels welcome.",
      link: "/soccer-club",
      avatar: "SC",
      color: "from-green-500 to-green-600"
    },
    {
      id: 2,
      name: "Book Club - Fantasy Readers",
      members: 127,
      lastActivity: "5 minutes ago",
      description: "A community for fantasy book lovers. We explore magical worlds, discuss epic adventures, and share our favorite fantasy books. Monthly book discussions and reading challenges.",
      link: "/book-club",
      avatar: "BC",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      name: "Tech Meetup - JavaScript Developers",
      members: 89,
      lastActivity: "10 minutes ago",
      description: "A community of passionate JavaScript developers sharing knowledge, discussing latest trends, and building amazing projects together. All experience levels welcome!",
      link: "/tech-meetup",
      avatar: "TM",
      color: "from-blue-500 to-blue-600"
    }
  ]);

  const handleGroupCreated = (newGroup: any) => {
    const groupWithDefaults = {
      ...newGroup,
      avatar: newGroup.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase(),
      color: "from-indigo-500 to-indigo-600",
      link: `/group/${newGroup.id}`
    };
    setGroups(prev => [groupWithDefaults, ...prev]);
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Groups</h1>
              <p className="text-muted-foreground">
                Reading Challenge Faves: The most-read books by 2025 participants (so far).
              </p>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <Input 
                placeholder="Group name, description" 
                className="flex-1"
              />
              <Button>Search groups</Button>
            </div>

            {/* Featured Groups */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured groups</h2>
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img 
                      src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" 
                      alt="Group avatar" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Read With Jenna (Official)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        39649 members • Active a month ago
                      </p>
                      <p className="text-sm">
                        When anyone on the TODAY team is looking for a book recommendation, there is only 
                        one person to turn to: Jenna Bush Hager. Jenna selects a book...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Popular Groups */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Popular groups</h2>
              
              {groups.map((group) => (
                <Card key={group.id} className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`w-16 h-16 rounded bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{group.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          <Link to={group.link} className="hover:text-primary transition-colors">
                            {group.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {group.members} members • Active {group.lastActivity}
                        </p>
                        <p className="text-sm">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create a Group */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create a Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter group name" />
                <Textarea placeholder="Enter group description" rows={3} />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Associations</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Privacy Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="privacy" value="public" defaultChecked />
                      <span className="text-sm">Public Group</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="privacy" value="private" />
                      <span className="text-sm">Private Group</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Format</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Webinar</span>
                    </label>
                    <p className="text-xs text-muted-foreground ml-6">
                      Host virtual meetings where members can see and speak but cannot chat on topics.
                    </p>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm">Select Dates & Time</span>
                    </label>
                  </div>
                </div>

                <Input placeholder="Search and select tags..." />

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Transparency</Badge>
                  <Badge variant="secondary">Business</Badge>
                  <Badge variant="secondary">Self-growth</Badge>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Encourage Leadership</span>
                  </label>
                  <p className="text-xs text-muted-foreground ml-6">
                    Promote leadership roles within the group
                  </p>
                  
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Enable Voting</span>
                  </label>
                  <p className="text-xs text-muted-foreground ml-6">
                    Allow members to vote on group decisions
                  </p>
                </div>

                <Textarea placeholder="Upload or paste helpful self-guides for members" rows={2} />

                <CreateGroupDialog onGroupCreated={handleGroupCreated} />
              </CardContent>
            </Card>

            {/* Browse groups by tag */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse groups by tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="Tag name" className="flex-1" />
                  <Button variant="secondary" size="sm">Search tags</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">bookclub</Badge>
                  <Badge variant="outline">fun</Badge>
                  <Badge variant="outline">fantasy</Badge>
                  <Badge variant="outline">science-fiction</Badge>
                  <Badge variant="outline">romance</Badge>
                  <Badge variant="outline">mystery</Badge>
                  <Badge variant="outline">fiction</Badge>
                  <Badge variant="outline">book-club</Badge>
                  <Badge variant="outline">young-adult</Badge>
                  <Badge variant="outline">books</Badge>
                  <Badge variant="outline">horror</Badge>
                </div>
              </CardContent>
            </Card>

            {/* More groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">More groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Goodreads Librarians Group: request changes to book records
                </p>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Create a group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Groups;