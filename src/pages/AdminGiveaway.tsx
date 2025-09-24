import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GiveawayPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: number;
  original_price?: number;
  discount_price?: number;
  countdown_end?: string;
  is_countdown_active: boolean;
  image_url: string;
  features: string[];
  is_active: boolean;
}

interface GiveawayAddon {
  id: string;
  package_id: string;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
}

const AdminGiveaway = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<GiveawayPackage[]>([]);
  const [addons, setAddons] = useState<GiveawayAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [showAddonDialog, setShowAddonDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<GiveawayPackage | null>(null);
  const [editingAddon, setEditingAddon] = useState<GiveawayAddon | null>(null);

  const [packageForm, setPackageForm] = useState({
    title: '',
    description: '',
    category: '',
    base_price: '',
    original_price: '',
    discount_price: '',
    countdown_end: '',
    is_countdown_active: false,
    image_url: '',
    features: '',
    is_active: true
  });

  const [addonForm, setAddonForm] = useState({
    package_id: '',
    name: '',
    description: '',
    price: '',
    is_active: true
  });

  useEffect(() => {
    fetchPackages();
    fetchAddons();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('giveaway_packages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from('giveaway_addons')
        .select('*, giveaway_packages(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAddons(data || []);
    } catch (error) {
      console.error('Error fetching addons:', error);
    }
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const packageData = {
        ...packageForm,
        base_price: parseFloat(packageForm.base_price) || 0,
        original_price: packageForm.original_price ? parseFloat(packageForm.original_price) : null,
        discount_price: packageForm.discount_price ? parseFloat(packageForm.discount_price) : null,
        countdown_end: packageForm.countdown_end || null,
        features: packageForm.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingPackage) {
        const { error } = await supabase
          .from('giveaway_packages')
          .update(packageData)
          .eq('id', editingPackage.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Package updated successfully" });
      } else {
        const { error } = await supabase
          .from('giveaway_packages')
          .insert([packageData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Package created successfully" });
      }

      setShowPackageDialog(false);
      setEditingPackage(null);
      resetPackageForm();
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive"
      });
    }
  };

  const handleAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const addonData = {
        ...addonForm,
        price: parseFloat(addonForm.price) || 0
      };

      if (editingAddon) {
        const { error } = await supabase
          .from('giveaway_addons')
          .update(addonData)
          .eq('id', editingAddon.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Addon updated successfully" });
      } else {
        const { error } = await supabase
          .from('giveaway_addons')
          .insert([addonData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Addon created successfully" });
      }

      setShowAddonDialog(false);
      setEditingAddon(null);
      resetAddonForm();
      fetchAddons();
    } catch (error) {
      console.error('Error saving addon:', error);
      toast({
        title: "Error",
        description: "Failed to save addon",
        variant: "destructive"
      });
    }
  };

  const resetPackageForm = () => {
    setPackageForm({
      title: '',
      description: '',
      category: '',
      base_price: '',
      original_price: '',
      discount_price: '',
      countdown_end: '',
      is_countdown_active: false,
      image_url: '',
      features: '',
      is_active: true
    });
  };

  const resetAddonForm = () => {
    setAddonForm({
      package_id: '',
      name: '',
      description: '',
      price: '',
      is_active: true
    });
  };

  const editPackage = (pkg: GiveawayPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      title: pkg.title,
      description: pkg.description,
      category: pkg.category,
      base_price: pkg.base_price.toString(),
      original_price: pkg.original_price?.toString() || '',
      discount_price: pkg.discount_price?.toString() || '',
      countdown_end: pkg.countdown_end ? new Date(pkg.countdown_end).toISOString().slice(0, 16) : '',
      is_countdown_active: pkg.is_countdown_active,
      image_url: pkg.image_url,
      features: pkg.features.join(', '),
      is_active: pkg.is_active
    });
    setShowPackageDialog(true);
  };

  const editAddon = (addon: GiveawayAddon) => {
    setEditingAddon(addon);
    setAddonForm({
      package_id: addon.package_id,
      name: addon.name,
      description: addon.description || '',
      price: addon.price.toString(),
      is_active: addon.is_active
    });
    setShowAddonDialog(true);
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      const { error } = await supabase
        .from('giveaway_packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Package deleted successfully" });
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive"
      });
    }
  };

  const deleteAddon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this addon?')) return;
    
    try {
      const { error } = await supabase
        .from('giveaway_addons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Addon deleted successfully" });
      fetchAddons();
    } catch (error) {
      console.error('Error deleting addon:', error);
      toast({
        title: "Error",
        description: "Failed to delete addon",
        variant: "destructive"
      });
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Admin - Giveaway Management</h1>
          
          <Tabs defaultValue="packages" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="packages">Packages ({packages.length})</TabsTrigger>
              <TabsTrigger value="addons">Add-ons ({addons.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="packages" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Packages</h2>
                <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetPackageForm(); setEditingPackage(null); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePackageSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={packageForm.title}
                            onChange={(e) => setPackageForm({...packageForm, title: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={packageForm.category}
                            onChange={(e) => setPackageForm({...packageForm, category: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={packageForm.description}
                          onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="base_price">Base Price ($)</Label>
                          <Input
                            id="base_price"
                            type="number"
                            step="0.01"
                            value={packageForm.base_price}
                            onChange={(e) => setPackageForm({...packageForm, base_price: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="original_price">Original Price ($)</Label>
                          <Input
                            id="original_price"
                            type="number"
                            step="0.01"
                            value={packageForm.original_price}
                            onChange={(e) => setPackageForm({...packageForm, original_price: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="discount_price">Discount Price ($)</Label>
                          <Input
                            id="discount_price"
                            type="number"
                            step="0.01"
                            value={packageForm.discount_price}
                            onChange={(e) => setPackageForm({...packageForm, discount_price: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="countdown_end">Countdown End</Label>
                          <Input
                            id="countdown_end"
                            type="datetime-local"
                            value={packageForm.countdown_end}
                            onChange={(e) => setPackageForm({...packageForm, countdown_end: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="is_countdown_active"
                            checked={packageForm.is_countdown_active}
                            onCheckedChange={(checked) => setPackageForm({...packageForm, is_countdown_active: checked})}
                          />
                          <Label htmlFor="is_countdown_active">Countdown Active</Label>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={packageForm.image_url}
                          onChange={(e) => setPackageForm({...packageForm, image_url: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Textarea
                          id="features"
                          value={packageForm.features}
                          onChange={(e) => setPackageForm({...packageForm, features: e.target.value})}
                          placeholder="Feature 1, Feature 2, Feature 3"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={packageForm.is_active}
                          onCheckedChange={(checked) => setPackageForm({...packageForm, is_active: checked})}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowPackageDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingPackage ? 'Update' : 'Create'} Package
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-4">
                {packages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{pkg.title}</h3>
                            {pkg.is_countdown_active && <Clock className="h-4 w-4 text-orange-500" />}
                          </div>
                          <p className="text-muted-foreground mb-2">{pkg.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Category: {pkg.category}</span>
                            <span>Base: ${pkg.base_price}</span>
                            {pkg.original_price && pkg.discount_price && (
                              <span className="text-green-600">
                                ${pkg.discount_price} (was ${pkg.original_price})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => editPackage(pkg)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deletePackage(pkg.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="addons" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Add-ons</h2>
                <Dialog open={showAddonDialog} onOpenChange={setShowAddonDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetAddonForm(); setEditingAddon(null); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Addon
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingAddon ? 'Edit Addon' : 'Add New Addon'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddonSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="package_id">Package</Label>
                        <select
                          id="package_id"
                          value={addonForm.package_id}
                          onChange={(e) => setAddonForm({...addonForm, package_id: e.target.value})}
                          className="w-full p-2 border rounded"
                          required
                        >
                          <option value="">Select a package</option>
                          {packages.map((pkg) => (
                            <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="addon_name">Name</Label>
                        <Input
                          id="addon_name"
                          value={addonForm.name}
                          onChange={(e) => setAddonForm({...addonForm, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="addon_description">Description</Label>
                        <Textarea
                          id="addon_description"
                          value={addonForm.description}
                          onChange={(e) => setAddonForm({...addonForm, description: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="addon_price">Price ($)</Label>
                        <Input
                          id="addon_price"
                          type="number"
                          step="0.01"
                          value={addonForm.price}
                          onChange={(e) => setAddonForm({...addonForm, price: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="addon_is_active"
                          checked={addonForm.is_active}
                          onCheckedChange={(checked) => setAddonForm({...addonForm, is_active: checked})}
                        />
                        <Label htmlFor="addon_is_active">Active</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddonDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAddon ? 'Update' : 'Create'} Addon
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-4">
                {addons.map((addon) => (
                  <Card key={addon.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{addon.name}</h4>
                          <p className="text-sm text-muted-foreground">{addon.description}</p>
                          <div className="flex items-center gap-4 text-sm mt-2">
                            <span className="font-medium text-green-600">${addon.price}</span>
                            <span>Package: {(addon as any).giveaway_packages?.title}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => editAddon(addon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteAddon(addon.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminGiveaway;