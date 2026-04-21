
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function PrimaryButton({ title, onPress, showArrow = false, style, textStyle }: PrimaryButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title?.toUpperCase?.() ?? ''}</Text>
      {showArrow && (
        <View style={styles.arrowCircle}>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: 271,
    height: 58,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    paddingHorizontal: 16,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: Colors.textWhite,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  arrowIcon: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});