import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user } = useAuth();

  const fetchUnreadCounts = async () => {
    if (!user) {
      setUnreadNotifications(0);
      setUnreadMessages(0);
      return;
    }

    try {
      // Fetch unread notifications count
      const { count: notificationCount, error: notificationError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (notificationError) throw notificationError;
      setUnreadNotifications(notificationCount || 0);

      // Fetch unread messages count (handle if table doesn't exist)
      try {
        const { count: messageCount, error: messageError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);

        if (messageError) {
          // Messages table not available
          setUnreadMessages(0);
        } else {
          setUnreadMessages(messageCount || 0);
        }
      } catch (error) {
        // Messages feature not available
        setUnreadMessages(0);
      }
    } catch (error) {
      // Notification count error
    }
  };

  useEffect(() => {
    fetchUnreadCounts();

    // Set up real-time subscriptions
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user?.id}`
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [user]);

  return {
    unreadNotifications,
    unreadMessages,
    refreshCounts: fetchUnreadCounts
  };
};