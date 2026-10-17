import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Show notifications even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request permission to send notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Schedule a daily learning reminder (default 9:00 AM)
 */
export async function scheduleDailyReminder(hour = 9, minute = 0) {
  // Cancel previous daily reminders first
  await Notifications.cancelScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Keep your streak alive!',
      body: 'Open Grow with Benedict and take one small step today. Consistency builds results.',
      sound: true,
      data: { type: 'daily_reminder' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/**
 * Send an immediate local notification (useful for testing or instant feedback)
 */
export async function sendInstantNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // null = send immediately
  });
}

/**
 * Schedule a progress encouragement notification
 */
export async function scheduleProgressNudge(productTitle: string, delayMinutes = 60) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Continue where you left off',
      body: `You started "${productTitle}". A few more minutes today will keep the momentum going.`,
      sound: true,
      data: { type: 'progress_nudge' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delayMinutes * 60,
    },
  });
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get current permission status
 */
export async function getNotificationStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}
