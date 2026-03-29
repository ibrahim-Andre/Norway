export function daysUntil(date) {
  if (!date) return null;

  const today = new Date();
  const target = new Date(date);

  const diff = Math.ceil(
    (target - today) / (1000 * 60 * 60 * 24)
  );

  return diff;
}
