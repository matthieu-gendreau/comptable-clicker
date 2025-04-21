export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.floor(num));
};

export const formatEntries = (num: number) => {
  return formatNumber(num);
};

export const formatEntriesPerSecond = (num: number) => {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: num < 10 ? 1 : 0,
    minimumFractionDigits: num < 10 ? 1 : 0,
  }).format(num);
}; 