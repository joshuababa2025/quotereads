import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Medal, Trophy, Award, Star, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingBadgeProps {
  rankLevel: string;
  points?: number;
  size?: 'sm' | 'md' | 'lg';
  showPoints?: boolean;
  className?: string;
}

const rankConfigs = {
  bronze: {
    icon: Medal,
    label: 'Bronze',
    className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  silver: {
    icon: Trophy,
    label: 'Silver',
    className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700',
    iconColor: 'text-gray-500 dark:text-gray-400'
  },
  gold: {
    icon: Award,
    label: 'Gold',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  platinum: {
    icon: Crown,
    label: 'Platinum',
    className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  diamond: {
    icon: Star,
    label: 'Diamond',
    className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
};

const sizeConfigs = {
  sm: {
    badgeClass: 'text-xs px-2 py-1',
    iconSize: 'w-3 h-3',
    gap: 'gap-1'
  },
  md: {
    badgeClass: 'text-sm px-3 py-1',
    iconSize: 'w-4 h-4',
    gap: 'gap-1.5'
  },
  lg: {
    badgeClass: 'text-base px-4 py-2',
    iconSize: 'w-5 h-5',
    gap: 'gap-2'
  }
};

export const RankingBadge = ({ 
  rankLevel, 
  points, 
  size = 'md', 
  showPoints = false, 
  className 
}: RankingBadgeProps) => {
  const rankConfig = rankConfigs[rankLevel as keyof typeof rankConfigs] || rankConfigs.bronze;
  const sizeConfig = sizeConfigs[size];
  const Icon = rankConfig.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        rankConfig.className,
        sizeConfig.badgeClass,
        'font-medium flex items-center',
        sizeConfig.gap,
        className
      )}
    >
      <Icon className={cn(sizeConfig.iconSize, rankConfig.iconColor)} />
      <span className="capitalize">{rankConfig.label}</span>
      {showPoints && points !== undefined && (
        <span className="ml-1 opacity-75">({points})</span>
      )}
    </Badge>
  );
};