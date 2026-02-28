export function formatPriceAR(value: number): string {
  return '$' + value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
