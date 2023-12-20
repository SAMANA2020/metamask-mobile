// Third party dependencies.
import { StyleSheet, ViewStyle } from 'react-native';

// External dependencies.
import { Theme } from '../../../../util/theme/models';

// Internal dependencies.
import { SelectMenuStyleSheetVars } from './SelectMenu.types';

/**
 * Style sheet function for SelectMenu component.
 *
 * @param params Style sheet params.
 * @param params.theme App theme from ThemeContext.
 * @param params.vars Inputs that the style sheet depends on.
 * @returns StyleSheet object.
 */
const styleSheet = (params: {
  theme: Theme;
  vars: SelectMenuStyleSheetVars;
}) => {
  const { vars } = params;
  const { style } = vars;

  return StyleSheet.create({
    base: Object.assign(
      {
        padding: 0,
      } as ViewStyle,
      style,
    ) as ViewStyle,
  });
};

export default styleSheet;
