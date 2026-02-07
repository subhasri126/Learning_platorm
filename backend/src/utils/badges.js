// Badge calculation logic - Will be implemented in Step 4
export const calculateBadge = (totalPoints) => {
  if (totalPoints >= 1000) return 'GOLD';
  if (totalPoints >= 500) return 'SILVER';
  if (totalPoints >= 100) return 'BRONZE';
  return 'BEGINNER';
};
