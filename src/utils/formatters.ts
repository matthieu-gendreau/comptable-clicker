export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.floor(num));
};

export const formatEntries = (num: number) => {
  return formatNumber(num);
}; 