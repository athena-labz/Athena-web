export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const abbreviate = (
  str: string,
  startNumChars: number,
  endNumChars: number
): string => {
  if (str.length <= startNumChars + endNumChars) {
    return str;
  }
  const start = str.substring(0, startNumChars);
  const end = str.substring(str.length - endNumChars);

  return `${start}...${end}`;
};
