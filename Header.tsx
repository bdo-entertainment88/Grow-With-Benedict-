import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';

interface Props {
  title?: string;
  showLogo?: boolean;
  rightElement?: React.ReactNode;
  onBack?: () => void;
}

export default function Header({ title, showLogo = false, rightElement, onBack }: Props) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>GB</Text>
          </View>
          {showLogo && (
            <View>
              <Text style={styles.brand}>Grow with Benedict</Text>
              <Text style={styles.tagline}>Learn · Build · Grow</Text>
            </View>
          )}
        </View>
      )}

      {title && !showLogo && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={styles.right}>{rightElement}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  brand: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.6,
    marginTop: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    position: 'absolute',
    left: 56,
    right: 56,
    textAlign: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  backText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '500',
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
