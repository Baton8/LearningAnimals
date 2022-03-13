export const formatNumber = (number: number | undefined, fractionDigits?: number): string | undefined => {
  if (number != null) {
    return number.toLocaleString("en-US", {minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits})
  } else {
    return undefined
  }
}