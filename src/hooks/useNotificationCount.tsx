import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useNotificationCount = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      setMessageCount(0);
      return;
    }

    fetchCounts();
    setupRealtimeSubscriptions();
  }, [user]);

  const fetchCounts = async () => {
    if (!user) return;

    try {
      console.log('🔄 Fetching notification counts for user:', user.id);
      // Count unread notifications
      const { count: notifCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      console.log('📊 Unread notification count:', notifCount);

      // Count unread messages
      const { count: msgCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      setNotificationCount(notifCount || 0);
      setMessageCount(msgCount || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    // Subscribe to notifications
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchCounts(); // Refetch counts when new notification arrives
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchCounts(); // Refetch counts when notification is marked as read
        }
      )
      .subscribe();

    // Subscribe to messages
    const messagesChannel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchCounts(); // Refetch counts when new message arrives
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          fetchCounts(); // Refetch counts when message is marked as read
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(messagesChannel);
    };
  };

  return {
    notificationCount,
    messageCount,
    refreshCounts: fetchCounts
  };
};