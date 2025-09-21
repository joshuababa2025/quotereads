import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UserRanking {
  id: string;
  user_id: string;
  rank_level: 'silver' | 'gold' | 'platinum';
  points: number;
  updated_at: string;
}

export const useRanking = () => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRanking();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserRanking = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user ranking:', error);
        throw error;
      }

      if (data) {
        setRanking(data);
      } else {
        // Create default ranking if none exists
        const { data: newRanking, error: insertError } = await supabase
          .from('user_rankings')
          .insert({
            user_id: user.id,
            rank_level: 'silver',
            points: 0
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user ranking:', insertError);
        } else {
          setRanking(newRanking);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserRanking:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePoints = async (pointsToAdd: number) => {
    if (!user || !ranking) return;
    
    const newPoints = ranking.points + pointsToAdd;
    let newRankLevel = ranking.rank_level;
    
    // Determine new rank level based on points
    if (newPoints >= 1000) {
      newRankLevel = 'platinum';
    } else if (newPoints >= 500) {
      newRankLevel = 'gold';
    } else {
      newRankLevel = 'silver';
    }

    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .update({
          points: newPoints,
          rank_level: newRankLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setRanking(data);
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const getRankDisplay = (rankLevel: 'silver' | 'gold' | 'platinum'): string => {
    switch (rankLevel) {
      case 'silver': return 'Silver';
      case 'gold': return 'Gold';
      case 'platinum': return 'Platinum';
      default: return 'Silver';
    }
  };

  const calculateProgress = () => {
    if (!ranking) return 0;
    
    let currentThreshold = 0;
    let nextThreshold = 500;
    
    if (ranking.rank_level === 'gold') {
      currentThreshold = 500;
      nextThreshold = 1000;
    } else if (ranking.rank_level === 'platinum') {
      return 100; // Already at max level
    }
    
    const progress = ((ranking.points - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getNextRank = () => {
    if (!ranking) return 'Gold';
    if (ranking.rank_level === 'silver') return 'Gold';
    if (ranking.rank_level === 'gold') return 'Platinum';
    return 'Platinum'; // Already at max
  };

  const getPointsToNextLevel = () => {
    if (!ranking) return 500;
    if (ranking.rank_level === 'silver') return Math.max(500 - ranking.points, 0);
    if (ranking.rank_level === 'gold') return Math.max(1000 - ranking.points, 0);
    return 0; // Already at max level
  };

  return {
    ranking,
    loading,
    updatePoints,
    getRankDisplay,
    calculateProgress,
    getNextRank,
    getPointsToNextLevel,
    fetchUserRanking,
  };
};