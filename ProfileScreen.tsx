import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize, SUPPORT } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelAllNotifications,
  getNotificationStatus,
  sendInstantNotification,
} from '../lib/notifications';

interface Props {
  onNavigateToAuth: () => void;
}

export default function ProfileScreen({ onNavigateToAuth }: Props) {
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const logout = useAppStore((s) => s.logout);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const wishlist = useAppStore((s) => s.wishlist);
  const progress = useAppStore((s) => s.progress);
  const streak = useAppStore((s) => s.streak);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  React.useEffect(() => {
    getNotificationStatus().then((status) => {
      setNotifEnabled(status === 'granted');
    });
  }, []);

  const handleSave = () => {
    if (name.trim()) {
      updateProfile(name.trim());
      setEditing(false);
    }
  };

  
  const toggleNotifications = async () => {
    setNotifLoading(true);
    try {
      if (notifEnabled) {
        await cancelAllNotifications();
        setNotifEnabled(false);
        Alert.alert('Notifications off', 'Daily reminders have been turned off.');
      } else {
        const granted = await requestNotificationPermission();
        if (granted) {
          await scheduleDailyReminder(9, 0);
          setNotifEnabled(true);
          await sendInstantNotification(
            'Notifications enabled ✅',
            'You will receive a daily reminder at 9:00 AM to keep your learning streak.'
          );
        } else {
          Alert.alert(
            'Permission needed',
            'Please allow notifications in your phone settings to receive reminders.'
          );
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update notification settings.');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title="Profile" />
      <FadeIn>
      <ScrollView contentContainerStyle={styles.container}>
        {isAuthenticated && user ? (
          <>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {editing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.editHint}>Tap to edit</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{wishlist.length}</Text>
                <Text style={styles.statLabel}>Wishlist</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{Object.keys(progress).length}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNum}>
                  {Object.values(progress).filter((p) => p.status === 'completed').length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.guest}>
            <Text style={styles.guestIcon}>👤</Text>
            <Text style={styles.guestTitle}>You're not signed in</Text>
            <Text style={styles.guestText}>
              Sign in to save your wishlist and track learning progress across devices.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onNavigateToAuth}>
              <Text style={styles.primaryBtnText}>Sign In / Create Account</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Notifications */}
        <View style={styles.support}>
          <Text style={styles.supportTitle}>Notifications</Text>
          <TouchableOpacity
            style={styles.supportRow}
            onPress={toggleNotifications}
            disabled={notifLoading}
          >
            <Text style={styles.supportLabel}>Daily Learning Reminder</Text>
            <Text style={[styles.supportValue, { color: notifEnabled ? Colors.success : Colors.textMuted }]}>
              {notifLoading ? '...' : notifEnabled ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: Colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 18 }}>
            Get a daily reminder at 9:00 AM to keep your streak and stay consistent.
          </Text>
        </View>

        {/* Support section */}
        <View style={styles.support}>
          <Text style={styles.supportTitle}>Need help?</Text>
          <TouchableOpacity
            style={styles.supportRow}
            onPress={() => Linking.openURL(`mailto:${SUPPORT.email}`)}
          >
            <Text style={styles.supportLabel}>Email</Text>
            <Text style={styles.supportValue}>{SUPPORT.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.supportRow}
            onPress={() => Linking.openURL(`tel:${SUPPORT.phone}`)}
          >
            <Text style={styles.supportLabel}>Phone</Text>
            <Text style={styles.supportValue}>{SUPPORT.phoneDisplay}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Grow with Benedict · Learn · Build · Grow</Text>
      </ScrollView>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
  },
  name: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  editHint: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  email: {
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    minWidth: 180,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  saveBtnText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  stat: { alignItems: 'center' },
  statNum: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: Spacing.xl,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: '600',
  },
  guest: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  guestIcon: { fontSize: 48, marginBottom: Spacing.md },
  guestTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  guestText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  support: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.lg,
  },
  supportTitle: {
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  supportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  supportLabel: { color: Colors.textSecondary },
  supportValue: { color: Colors.accent, fontWeight: '600' },
  footer: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.xl,
  },
});
