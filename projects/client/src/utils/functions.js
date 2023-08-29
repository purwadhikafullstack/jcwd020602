function generateRandomRGBAColor(length) {
  const colors1 = [];
  const colors2 = [];
  for (let i = 0; i < length; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors1.push(`rgba(${r}, ${g}, ${b}, 1)`);
    colors2.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }
  return { colors1, colors2 };
}
export function styleDoughnut(length) {
  const { colors1, colors2 } = generateRandomRGBAColor(length);
  const style = {
    hoverBackgroundColor: colors1,
    backgroundColor: colors2,
    hoverBorderColor: colors2,
    borderColor: colors1,
    borderWidth: 2,
  };
  return style;
}
