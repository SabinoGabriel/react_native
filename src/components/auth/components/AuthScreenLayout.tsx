import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { Font, Spacing, Size } from '../../../constants/Tokens';

type AuthScreenLayoutProps = {
  title: string;
  description?: string;
  titleAlign?: 'left' | 'center';
  children: React.ReactNode;
  primaryAction?: React.ReactNode;
  footerAction?: React.ReactNode;
};

export default function AuthScreenLayout({
  title,
  description,
  titleAlign = 'left',
  children,
  primaryAction,
  footerAction,
}: AuthScreenLayoutProps) {
  const centered = titleAlign === 'center';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <Image source={require('../../../../assets/icons/logo.png')} style={styles.logo} />
      </View>

      <Text style={[styles.title, centered && styles.titleCentered]}>{title}</Text>

      {description ? (
        <Text style={[styles.description, centered && styles.textCentered]}>{description}</Text>
      ) : null}

      <View style={styles.content}>{children}</View>

      {primaryAction ? <View style={styles.primaryAction}>{primaryAction}</View> : null}
      {footerAction ? <View style={styles.footerAction}>{footerAction}</View> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.pageHorizontal,
    paddingTop: Spacing.pageTop,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logo: {
    width: Size.logoLg,
    height: Size.logoLg,
    resizeMode: 'contain',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Font.titleDisplay,
    color: Colors.textWhite,
    textAlign: 'left',
    marginBottom: Spacing.lg,
    fontWeight: '700',
  },
  titleCentered: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Font.body,
    color: Colors.textWhite,
    opacity: 0.9,
    marginBottom: Spacing.xl,
  },
  textCentered: {
    textAlign: 'center',
  },
  content: {
    marginBottom: Spacing.lg,
  },
  primaryAction: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  footerAction: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
});
