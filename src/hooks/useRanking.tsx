import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserRanking {
  id: string;
  user_id: string;
  rank_level: string;
  points: number;
  display_rank: boolean;
  created_at: string;
  updated_at: string;
}

export const useRanking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ranking, setRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRanking();
    } else {
      setRanking(null);
      setLoading(false);
    }
  }, [user]);

  const fetchRanking = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setRanking(data);
      } else {
        // Create initial ranking for new user
        await createInitialRanking();
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialRanking = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .insert({
          user_id: user.id,
          rank_level: 'bronze',
          points: 0,
          display_rank: true
        })
        .select()
        .single();

      if (error) throw error;
      setRanking(data);
    } catch (error) {
      console.error('Error creating initial ranking:', error);
    }
  };

  const updatePoints = async (pointsToAdd: number, reason?: string) => {
    if (!user || !ranking) return;

    try {
      const newPoints = ranking.points + pointsToAdd;
      const newRankLevel = calculateRankLevel(newPoints);

      const { data, error } = await supabase
        .from('user_rankings')
        .update({
          points: newPoints,
          rank_level: newRankLevel
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const oldRankLevel = ranking.rank_level;
      setRanking(data);

      // Show notification if rank changed
      if (newRankLevel !== oldRankLevel) {
        toast({
          title: "Rank Up! 🎉",
          description: `Congratulations! You've reached ${newRankLevel.charAt(0).toUpperCase() + newRankLevel.slice(1)} level!`
        });
      } else if (pointsToAdd > 0) {
        toast({
          title: "Points Earned! ✨",
          description: `You earned ${pointsToAdd} points${reason ? ` for ${reason}` : ''}!`
        });
      }
    } catch (error) {
      console.error('Error updating points:', error);
      toast({
        title: "Error",
        description: "Failed to update points",
        variant: "destructive"
      });
    }
  };

  const toggleDisplayRank = async () => {
    if (!user || !ranking) return;

    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .update({
          display_rank: !ranking.display_rank
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setRanking(data);

      toast({
        title: "Settings updated",
        description: `Rank display ${!ranking.display_rank ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error toggling rank display:', error);
      toast({
        title: "Error",
        description: "Failed to update rank display setting",
        variant: "destructive"
      });
    }
  };

  const calculateRankLevel = (points: number): string => {
    if (points >= 10000) return 'diamond';
    if (points >= 5000) return 'platinum';
    if (points >= 2000) return 'gold';
    if (points >= 500) return 'silver';
    return 'bronze';
  };

  const getNextRankInfo = () => {
    if (!ranking) return null;

    const currentPoints = ranking.points;
    const currentRank = ranking.rank_level;

    const rankThresholds = {
      bronze: { next: 'silver', threshold: 500 },
      silver: { next: 'gold', threshold: 2000 },
      gold: { next: 'platinum', threshold: 5000 },
      platinum: { next: 'diamond', threshold: 10000 },
      diamond: { next: null, threshold: null }
    };

    const currentRankInfo = rankThresholds[currentRank as keyof typeof rankThresholds];
    
    if (!currentRankInfo.next) {
      return { isMaxRank: true, progress: 100 };
    }

    const pointsNeeded = currentRankInfo.threshold - currentPoints;
    const progressPercent = (currentPoints / currentRankInfo.threshold) * 100;

    return {
      nextRank: currentRankInfo.next,
      pointsNeeded,
      progress: Math.min(progressPercent, 100),
      isMaxRank: false
    };
  };

  return {
    ranking,
    loading,
    updatePoints,
    toggleDisplayRank,
    getNextRankInfo,
    refetch: fetchRanking
  };
};