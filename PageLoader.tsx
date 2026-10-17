import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

interface Props {
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'large';
}

/**
 * Fast, professional loading indicator
 */
export default function PageLoader({ fullScreen = true, message, size = 'large' }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const content = (
    <Animated.View style={[styles.inner, { opacity, transform: [{ scale }] }]}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>GB</Text>
      </View>
      <ActivityIndicator color={Colors.accent} size={size} style={{ marginTop: 18 }} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </Animated.View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }
  return content;
}

/**
 * Fast, subtle page entrance — professional and snappy
 */
export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  message: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
