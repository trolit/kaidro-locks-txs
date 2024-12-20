export function decodeAkdrValue(value: string, decimals = 18) {
  const valueDecimals = value.length;

  const separatorIndex = valueDecimals - decimals;

  const rawValue =
    valueDecimals === decimals
      ? `0.${value}`
      : `${value.substring(0, separatorIndex)}.${value.substring(separatorIndex)}`;

  return parseFloat(rawValue).toFixed(2);
}
