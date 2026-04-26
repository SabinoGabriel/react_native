import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import { Font, Radius, Shadow, Size } from '../../constants/Tokens';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  fullWidth?: boolean;
  size?: 'md' | 'lg';
  disabled?: boolean;
  align?: 'center' | 'stretch';
};

export default function PrimaryButton({
  title,
  onPress,
  fullWidth = true,
  size = 'md',
  disabled = false,
  align = 'center',
}: PrimaryButtonProps) {
  return (
    <View style={[styles.container, align === 'stretch' && styles.containerStretch]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          fullWidth && styles.buttonFullWidth,
          size === 'lg' && styles.buttonLarge,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  containerStretch: {
    alignItems: 'stretch',
  },
  button: {
    width: Size.buttonMaxWidth,
    maxWidth: '100%',
    height: Size.buttonHeight,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  buttonFullWidth: {
    width: '100%',
    maxWidth: Size.buttonMaxWidth,
  },
  buttonLarge: {
    height: Math.round(Size.buttonHeight * 1.08),
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: Font.bodyMd,
    color: Colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  textDisabled: {
    opacity: 0.95,
  },
});
