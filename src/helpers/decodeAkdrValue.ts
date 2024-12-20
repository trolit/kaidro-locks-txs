export function decodeAkdrValue(value: string, decimals = 18) {
  const valueDecimals = value.length;

  if (valueDecimals === decimals) {
    return `0.${value.substring(0, 2)}`;
  }

  const separatorIndex = valueDecimals - decimals;

  const rawValue = `${value.substring(0, separatorIndex)}.${value.substring(separatorIndex)}`;

  return parseFloat(rawValue).toFixed(2);
}
