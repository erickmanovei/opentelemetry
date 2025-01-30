export const floatToBRL = (value: number | null | undefined): string | '' => {
  if (!value) {
    return '';
  }
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

export const leftPad = (
  value: number,
  totalWidth: number,
  paddingChar = '0',
): string => {
  const length = totalWidth - value.toString().length + 1;
  return Array(length).join(paddingChar || '0') + value;
};
