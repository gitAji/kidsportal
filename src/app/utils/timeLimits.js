/**
 * Daily/weekly screen-time limit helpers.
 *
 * Parent-configured limits (`timeLimits`) live on the child's profile doc
 * (users/{parentUid}/children/{childId}). Actual usage (`timeUsage`) and
 * approved bonus minutes (`timeBonus`) live on the child's stats doc
 * (childStats/{childId}), keyed by local date ("YYYY-MM-DD").
 *
 * No Firebase imports here — pure date math and status computation, safe to
 * use from any client component.
 */

export function getDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Monday-start week containing `date`, as 7 date keys (Mon..Sun).
export function getWeekDateKeys(date = new Date()) {
  const day = date.getDay(); // 0 = Sunday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const keys = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    keys.push(getDateKey(d));
  }
  return keys;
}

/**
 * Combines configured limits with usage-to-date into one status object.
 * A limit of 0 (or missing) means "no cap" for that dimension.
 */
export function getTimeStatus({ timeLimits, timeUsage = {}, timeBonus = {} } = {}, now = new Date()) {
  const enabled = !!timeLimits?.enabled;
  const todayKey = getDateKey(now);
  const weekKeys = getWeekDateKeys(now);

  const dailyUsedMinutes = timeUsage[todayKey] || 0;
  const dailyBaseLimit = timeLimits?.dailyMinutes || 0;
  const dailyBonus = timeBonus[todayKey] || 0;
  const dailyLimitMinutes = dailyBaseLimit > 0 ? dailyBaseLimit + dailyBonus : 0;

  const weeklyUsedMinutes = weekKeys.reduce((sum, k) => sum + (timeUsage[k] || 0), 0);
  const weeklyLimitMinutes = timeLimits?.weeklyMinutes || 0;

  const dailyExceeded = enabled && dailyLimitMinutes > 0 && dailyUsedMinutes >= dailyLimitMinutes;
  const weeklyExceeded = enabled && weeklyLimitMinutes > 0 && weeklyUsedMinutes >= weeklyLimitMinutes;

  const minutesRemainingToday = !enabled
    ? Infinity
    : Math.max(
      0,
      Math.min(
        dailyLimitMinutes > 0 ? dailyLimitMinutes - dailyUsedMinutes : Infinity,
        weeklyLimitMinutes > 0 ? weeklyLimitMinutes - weeklyUsedMinutes : Infinity
      )
    );

  return {
    enabled,
    dailyUsedMinutes,
    dailyLimitMinutes,
    weeklyUsedMinutes,
    weeklyLimitMinutes,
    isBlocked: dailyExceeded || weeklyExceeded,
    limitType: dailyExceeded ? 'daily' : weeklyExceeded ? 'weekly' : null,
    minutesRemainingToday,
  };
}
