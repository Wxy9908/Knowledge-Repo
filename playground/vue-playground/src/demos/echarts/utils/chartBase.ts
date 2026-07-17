import { getPlatformFont } from '../../../styles/fonts';
import { getThemeColors } from './themeColors';

export const getChartBaseStyle = () => {
  const colors = getThemeColors();
  
  const textStyle = {
    fontFamily: getPlatformFont('sans'),
    color: colors.muted,
  };

  const tooltipStyle = {
    backgroundColor: colors.tooltipBg,
    borderColor: colors.tooltipBorder,
    textStyle: { color: colors.tooltipText, fontSize: 12 },
  };

  const axisLineStyle = {
    lineStyle: { color: colors.border },
  };

  const splitLineStyle = {
    lineStyle: { color: colors.border, type: 'dashed' as const },
  };

  return {
    colors,
    textStyle,
    tooltipStyle,
    axisLineStyle,
    splitLineStyle,
  };
};
