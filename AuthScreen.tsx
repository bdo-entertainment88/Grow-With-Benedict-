import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import Header from '../components/Header';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

type Mode = 'login' | 'signup' | 'forgot';

export default function AuthScreen({ onSuccess }: Props) {
  const login = useAppStore((s) => s.login);
  const signUp = useAppStore((s) => s.signUp);
  const authLoading = useAppStore((s) => s.authLoading);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Fast professional entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 9,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      await handleForgotPassword();
      return;
    }

    if (!password.trim()) {
      Alert.alert('Missing password', 'Please enter your password.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Missing name', 'Please enter your name.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    let result;
    if (mode === 'login') {
      result = await login(email, password);
    } else {
      result = await signUp(email, password, name);
    }

    if (result.error) {
      Alert.alert('Error', result.error);
    } else {
      onSuccess();
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your email address.');
      return;
    }

    setResetLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            // You can set a redirect URL later if you have a website
            // redirectTo: 'https://your-app-domain.com/reset-password',
          }
        );

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          setResetSent(true);
        }
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Could not send reset email.');
      }
    } else {
      // Local mode fallback
      setTimeout(() => {
        setResetSent(true);
      }, 800);
    }

    setResetLoading(false);
  };

  const isLoading = authLoading || resetLoading;

  const title =
    mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password';

  const heading =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'signup'
      ? 'Join Grow with Benedict'
      : 'Forgot your password?';

  const sub =
    mode === 'login'
      ? 'Sign in to access your wishlist and progress'
      : mode === 'signup'
      ? 'Create an account to track your learning journey'
      : 'Enter your email and we’ll send you a reset link';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title={title} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.form, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {/* Animated Logo */}
          <Animated.View style={[styles.logoCircle, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.logoText}>GB</Text>
          </Animated.View>

          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.sub}>{sub}</Text>

          {/* Success state after reset email sent */}
          {mode === 'forgot' && resetSent ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✉️</Text>
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successText}>
                We sent a password reset link to{'\n'}
                <Text style={{ color: Colors.accent }}>{email}</Text>
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  setResetSent(false);
                  setMode('login');
                }}
              >
                <Text style={styles.primaryBtnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {mode === 'signup' && (
                <TextInput
                  style={styles.input}
                  placeholder="Full name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />

              {mode !== 'forgot' && (
                <TextInput
                  style={styles.input}
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                />
              )}

              {/* Forgot password link (only on login) */}
              {mode === 'login' && (
                <TouchableOpacity
                  style={styles.forgotBtn}
                  onPress={() => {
                    setMode('forgot');
                    setResetSent(false);
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Main button with loading animation */}
              <TouchableOpacity
                style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={Colors.primary} size="small" />
                    <Text style={[styles.primaryBtnText, { marginLeft: 10 }]}>
                      {mode === 'forgot' ? 'Sending...' : mode === 'login' ? 'Signing in...' : 'Creating account...'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.primaryBtnText}>
                    {mode === 'login'
                      ? 'Sign In'
                      : mode === 'signup'
                      ? 'Create Account'
                      : 'Send Reset Link'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Switch mode links */}
              <View style={styles.switchArea}>
                {mode === 'forgot' ? (
                  <TouchableOpacity onPress={() => setMode('login')} disabled={isLoading}>
                    <Text style={styles.switchText}>
                      Remember your password?{' '}
                      <Text style={styles.switchAccent}>Sign in</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    disabled={isLoading}
                  >
                    <Text style={styles.switchText}>
                      {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <Text style={styles.switchAccent}>
                        {mode === 'login' ? 'Create one' : 'Sign in'}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              {isSupabaseConfigured()
                ? '🔒 Real accounts enabled'
                : '⚠️ Local mode — add Supabase keys for real accounts & password reset emails'}
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, justifyContent: 'center' },
  form: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 26,
  },
  heading: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  sub: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -4,
  },
  forgotText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.75,
  },
  primaryBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchArea: {
    marginTop: Spacing.lg,
  },
  switchText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  switchAccent: {
    color: Colors.accent,
    fontWeight: '700',
  },
  statusBox: {
    marginTop: Spacing.xl,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Success state
  successBox: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  successTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  successText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
});
