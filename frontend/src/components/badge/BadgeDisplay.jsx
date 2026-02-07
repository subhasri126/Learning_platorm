import React from 'react';

const BadgeDisplay = ({ points }) => {
  const getBadge = (pts) => {
    if (pts >= 1000) return { name: 'GOLD', color: 'text-yellow-500', bg: 'bg-yellow-50', icon: '🏆' };
    if (pts >= 500) return { name: 'SILVER', color: 'text-gray-400', bg: 'bg-gray-50', icon: '🥈' };
    if (pts >= 100) return { name: 'BRONZE', color: 'text-orange-600', bg: 'bg-orange-50', icon: '🥉' };
    return { name: 'BEGINNER', color: 'text-blue-600', bg: 'bg-blue-50', icon: '⭐' };
  };

  const badge = getBadge(points);

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg ${badge.bg}`}>
      <span className="text-2xl mr-2">{badge.icon}</span>
      <div>
        <div className={`text-lg font-bold ${badge.color}`}>{badge.name}</div>
        <div className="text-xs text-gray-600">{points} points</div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
