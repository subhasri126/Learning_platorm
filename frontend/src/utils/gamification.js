// Gamification utility functions

// Calculate level from total XP
export const calculateLevel = (xp) => {
  // Each level requires more XP: Level 1=100, Level 2=250, Level 3=450, etc.
  // Formula: XP needed for level n = 100 * n * (n + 1) / 2
  let level = 1;
  let xpNeeded = 0;
  
  while (xp >= xpNeeded) {
    xpNeeded += level * 100;
    if (xp >= xpNeeded) level++;
  }
  
  return level;
};

// Calculate XP needed for next level
export const calculateXPForNextLevel = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  let xpForNextLevel = 0;
  
  for (let i = 1; i <= currentLevel; i++) {
    xpForNextLevel += i * 100;
  }
  
  return xpForNextLevel;
};

// Calculate XP progress within current level (0-100%)
export const calculateLevelProgress = (currentXP) => {
  const currentLevel = calculateLevel(currentXP);
  
  // XP at start of current level
  let xpAtLevelStart = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAtLevelStart += i * 100;
  }
  
  // XP needed for current level
  const xpNeededForLevel = currentLevel * 100;
  
  // Progress within level
  const xpProgress = currentXP - xpAtLevelStart;
  const progress = (xpProgress / xpNeededForLevel) * 100;
  
  return Math.min(100, Math.max(0, progress));
};

// Get rank/tier based on total XP
export const getRank = (xp) => {
  if (xp >= 5000) return { name: 'LEGEND', color: 'text-accent-purple', bg: 'bg-accent-purple/20', icon: '👑' };
  if (xp >= 3000) return { name: 'MASTER', color: 'text-xp-platinum', bg: 'bg-gray-400/20', icon: '💎' };
  if (xp >= 2000) return { name: 'EXPERT', color: 'text-xp-gold', bg: 'bg-xp-gold/20', icon: '🥇' };
  if (xp >= 1000) return { name: 'ADVANCED', color: 'text-xp-silver', bg: 'bg-xp-silver/20', icon: '🥈' };
  if (xp >= 500) return { name: 'INTERMEDIATE', color: 'text-xp-bronze', bg: 'bg-xp-bronze/20', icon: '🥉' };
  return { name: 'BEGINNER', color: 'text-gray-400', bg: 'bg-gray-400/20', icon: '🌱' };
};

// Calculate streak bonus multiplier
export const getStreakMultiplier = (streak) => {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
};

// Get achievement badges
export const getAchievements = (stats) => {
  const achievements = [];
  
  if (stats.coursesCompleted >= 1) achievements.push({ id: 'first-course', name: 'First Steps', icon: '🎓', description: 'Completed first course' });
  if (stats.coursesCompleted >= 5) achievements.push({ id: 'dedicated', name: 'Dedicated Learner', icon: '📚', description: 'Completed 5 courses' });
  if (stats.coursesCompleted >= 10) achievements.push({ id: 'expert', name: 'Course Expert', icon: '🏆', description: 'Completed 10 courses' });
  
  if (stats.quizzesPassed >= 10) achievements.push({ id: 'quiz-master', name: 'Quiz Master', icon: '🎯', description: 'Passed 10 quizzes' });
  if (stats.perfectScores >= 1) achievements.push({ id: 'perfect', name: 'Perfectionist', icon: '💯', description: 'Perfect quiz score' });
  if (stats.perfectScores >= 5) achievements.push({ id: 'flawless', name: 'Flawless', icon: '⭐', description: '5 perfect scores' });
  
  if (stats.streak >= 7) achievements.push({ id: 'week-streak', name: '7-Day Streak', icon: '🔥', description: 'Learned for 7 days straight' });
  if (stats.streak >= 30) achievements.push({ id: 'month-streak', name: '30-Day Streak', icon: '💪', description: 'Unstoppable!' });
  
  if (stats.totalPoints >= 1000) achievements.push({ id: 'thousand', name: '1K Club', icon: '💰', description: 'Earned 1000 XP' });
  if (stats.totalPoints >= 5000) achievements.push({ id: 'legend', name: 'Legendary', icon: '👑', description: 'Earned 5000 XP' });
  
  return achievements;
};

// Format XP number with commas
export const formatXP = (xp) => {
  return new Intl.NumberFormat().format(xp);
};

// Get level tier color
export const getLevelColor = (level) => {
  if (level >= 50) return 'from-purple-600 to-pink-600';
  if (level >= 30) return 'from-yellow-500 to-orange-600';
  if (level >= 20) return 'from-blue-500 to-cyan-600';
  if (level >= 10) return 'from-green-500 to-emerald-600';
  return 'from-gray-500 to-gray-600';
};
