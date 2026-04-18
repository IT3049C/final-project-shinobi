const STATS_KEY = "wordle_stats_v1";

export const DEFAULT_STATS = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
};

export function loadStats() {
  try {
    const rawStats = window.localStorage.getItem(STATS_KEY);
    if (!rawStats) {
      return { ...DEFAULT_STATS };
    }

    const parsed = JSON.parse(rawStats);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      guessDistribution: Array.isArray(parsed.guessDistribution)
        ? parsed.guessDistribution.slice(0, 6)
        : [...DEFAULT_STATS.guessDistribution],
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats) {
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordWin(previousStats, guessNumber) {
  const nextStats = {
    ...previousStats,
    played: previousStats.played + 1,
    wins: previousStats.wins + 1,
    currentStreak: previousStats.currentStreak + 1,
    guessDistribution: [...previousStats.guessDistribution],
  };

  nextStats.maxStreak = Math.max(nextStats.maxStreak, nextStats.currentStreak);

  if (guessNumber >= 1 && guessNumber <= 6) {
    nextStats.guessDistribution[guessNumber - 1] += 1;
  }

  return nextStats;
}

export function recordLoss(previousStats) {
  return {
    ...previousStats,
    played: previousStats.played + 1,
    currentStreak: 0,
  };
}
