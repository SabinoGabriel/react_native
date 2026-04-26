import { Font } from './Tokens';

/** Tipografia base do Brasil em Foco */
export const Typography = {
  fontSizeSmall: Font.caption,
  fontSizeBase: Font.body,
  fontSizeMedium: Font.bodyMd,
  fontSizeLarge: Font.titleLg,
  fontSizeTitle: Font.titleXl,
  fontSizeDisplay: Font.titleDisplay,

  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
};

export default Typography;
