
import React from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Font, Radius, Size, Spacing } from '../../constants/Tokens';

type CustomInputProps = TextInputProps & {
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md' | 'lg';
};

const heightBySize = {
  sm: Size.inputHeightSm,
  md: Size.inputHeightMd,
  lg: Size.inputHeightLg,
} as const;

export default function CustomInput({
  right,
  style,
  containerStyle,
  size = 'md',
  ...props
}: CustomInputProps) {
  return (
    <View style={[styles.inputWrapper, { height: heightBySize[size] }, containerStyle]}>
      <TextInput
        placeholderTextColor={Colors.textGray}
        style={[styles.input, style]}
        {...props}
      />
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing.xs,
  },
  input: {
    flex: 1,
    color: Colors.textGray,
    fontSize: Font.body,
    paddingHorizontal: Spacing.xs,
    height: '100%',
  },
  right: {
    marginLeft: Spacing.xxs,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
