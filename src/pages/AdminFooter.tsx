import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

const AdminFooter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [newLink, setNewLink] = useState({
    platform: '',
    url: '',
    icon_name: '',
    is_active: true
  });

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      // Load social media links
      const { data: links } = await supabase
        .from('social_media_links')
        .select('*')
        .order('sort_order');
      
      // Load terms and conditions
      const { data: settings } = await supabase
        .from('footer_settings')
        .select('setting_value')
        .eq('setting_key', 'terms_and_conditions')
        .single();
      
      setSocialLinks(links || []);
      setTermsAndConditions(settings?.setting_value || '');
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  };

  const updateTermsAndConditions = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('footer_settings')
        .upsert({
          setting_key: 'terms_and_conditions',
          setting_value: termsAndConditions,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Terms and conditions updated successfully"
      });
    } catch (error) {
      console.error('Error updating terms:', error);
      toast({
        title: "Error",
        description: "Failed to update terms and conditions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = async () => {
    if (!newLink.platform || !newLink.url || !newLink.icon_name) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('social_media_links')
        .insert({
          ...newLink,
          sort_order: socialLinks.length + 1
        });

      if (error) throw error;

      setNewLink({ platform: '', url: '', icon_name: '', is_active: true });
      loadFooterData();
      
      toast({
        title: "Success",
        description: "Social media link added successfully"
      });
    } catch (error) {
      console.error('Error adding social link:', error);
      toast({
        title: "Error",
        description: "Failed to add social media link",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadFooterData();
      
      toast({
        title: "Success",
        description: "Social media link deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast({
        title: "Error",
        description: "Failed to delete social media link",
        variant: "destructive"
      });
    }
  };

  const toggleLinkStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('social_media_links')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      loadFooterData();
    } catch (error) {
      console.error('Error updating link status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Footer Management</h1>
            <p className="text-muted-foreground">Manage footer content and social media links</p>
          </div>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="terms">Terms and Conditions Text</Label>
                <Textarea
                  id="terms"
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  placeholder="Enter terms and conditions text..."
                  rows={4}
                />
              </div>
              <Button onClick={updateTermsAndConditions} disabled={loading}>
                Update Terms
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Link */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Add New Social Media Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Input
                      id="platform"
                      value={newLink.platform}
                      onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
                      placeholder="Facebook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon Name</Label>
                    <Input
                      id="icon"
                      value={newLink.icon_name}
                      onChange={(e) => setNewLink({...newLink, icon_name: e.target.value})}
                      placeholder="Facebook"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addSocialLink} disabled={loading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Links */}
              <div className="space-y-4">
                <h3 className="font-semibold">Existing Links</h3>
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium">{link.platform}</p>
                        <p className="text-sm text-muted-foreground">{link.icon_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.is_active}
                          onCheckedChange={(checked) => toggleLinkStatus(link.id, checked)}
                        />
                        <span className="text-sm">{link.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSocialLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminFooter;