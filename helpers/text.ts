const baseFontSize = 18;
const lineHeightRatio = 1.5;
const lineHeightBase = baseFontSize * lineHeightRatio;

// http://inlehmansterms.net/2014/06/09/groove-to-a-vertical-rhythm
const fontSize = (fontSize: number) => {
  const lines = Math.ceil(fontSize / lineHeightBase);
  const lineHeight = lines * lineHeightBase;
  return { fontSize, lineHeight };
};
