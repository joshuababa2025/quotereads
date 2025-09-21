import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface UserRanking {
  id: string;
  user_id: string;
  rank_level: number;
  points: number;
  display_rank: string;
  updated_at: string;
}

export const useRanking = () => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create mock ranking data since table doesn't exist
    if (user) {
      const mockRanking: UserRanking = {
        id: 'mock-' + user.id,
        user_id: user.id,
        rank_level: 1,
        points: 100,
        display_rank: 'Beginner',
        updated_at: new Date().toISOString()
      };
      setRanking(mockRanking);
    }
    setLoading(false);
  }, [user]);

  const updatePoints = async (pointsToAdd: number) => {
    if (!user || !ranking) return;
    
    const newPoints = ranking.points + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const newDisplayRank = getRankDisplay(newLevel);

    setRanking(prev => prev ? {
      ...prev,
      points: newPoints,
      rank_level: newLevel,
      display_rank: newDisplayRank,
      updated_at: new Date().toISOString()
    } : null);
  };

  const updateDisplayRank = async (newDisplayRank: string) => {
    if (!user || !ranking) return;
    
    setRanking(prev => prev ? {
      ...prev,
      display_rank: newDisplayRank,
      updated_at: new Date().toISOString()
    } : null);
  };

  const getRankDisplay = (level: number): string => {
    if (level <= 5) return 'Beginner';
    if (level <= 15) return 'Novice';
    if (level <= 30) return 'Intermediate';
    if (level <= 50) return 'Advanced';
    if (level <= 75) return 'Expert';
    return 'Master';
  };

  const calculateProgress = () => {
    if (!ranking) return 0;
    const currentLevelPoints = (ranking.rank_level - 1) * 100;
    const nextLevelPoints = ranking.rank_level * 100;
    const progress = ((ranking.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getNextRank = () => {
    if (!ranking) return 'Beginner';
    return getRankDisplay(ranking.rank_level + 1);
  };

  const getPointsToNextLevel = () => {
    if (!ranking) return 100;
    const nextLevelPoints = ranking.rank_level * 100;
    return Math.max(nextLevelPoints - ranking.points, 0);
  };

  return {
    ranking,
    loading,
    updatePoints,
    updateDisplayRank,
    getRankDisplay,
    calculateProgress,
    getNextRank,
    getPointsToNextLevel,
  };
};