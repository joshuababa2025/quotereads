import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMinus, UserX, Shield, MoreVertical, Upload, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GroupMemberForManagement {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface GroupMemberManagementProps {
  members: GroupMemberForManagement[];
  groupId: string;
  currentUserId: string;
  isAdmin: boolean;
  onMemberAction: () => void;
}

export const GroupMemberManagement = ({ 
  members, 
  groupId, 
  currentUserId, 
  isAdmin, 
  onMemberAction 
}: GroupMemberManagementProps) => {
  const { toast } = useToast();
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: `${memberName} has been removed from the group.`
      });
      onMemberAction();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const handleMakeAdmin = async (memberId: string, memberName: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .update({ role: 'admin' })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Admin role granted",
        description: `${memberName} is now a group admin.`
      });
      onMemberAction();
    } catch (error) {
      console.error('Error making admin:', error);
      toast({
        title: "Error",
        description: "Failed to grant admin role",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (type: 'profile' | 'cover', file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${groupId}-${type}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('groups')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('groups')
        .getPublicUrl(fileName);

      const updateField = type === 'profile' ? 'profile_image' : 'cover_image';
      
      const { error: updateError } = await supabase
        .from('groups')
        .update({ [updateField]: publicUrl })
        .eq('id', groupId);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: `Group ${type} image updated successfully!`
      });
      onMemberAction();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Manage Photos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Group Images</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('profile', file);
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cover Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('cover', file);
                        }}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Create Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {(member.profiles?.full_name || 'User').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">
                    {member.profiles?.full_name || 'Anonymous User'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role === 'admin' ? 'Admin' : 'Member'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Joined {format(new Date(member.joined_at), 'MMM yyyy')}
                    </span>
                  </div>
                </div>
                
                {isAdmin && member.user_id !== currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role !== 'admin' && (
                        <DropdownMenuItem
                          onClick={() => handleMakeAdmin(member.id, member.profiles?.full_name || 'User')}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleRemoveMember(member.id, member.profiles?.full_name || 'User')}
                        className="text-red-600"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};