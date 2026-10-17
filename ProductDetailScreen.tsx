import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Product } from '../types';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { scheduleProgressNudge, sendInstantNotification } from '../lib/notifications';

interface Props {
  product: Product;
  onBack: () => void;
}

export default function ProductDetailScreen({ product, onBack }: Props) {
  const isInWishlist = useAppStore((s) => s.isInWishlist(product.id));
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const progress = useAppStore((s) => s.getProgress(product.id));
  const setProgress = useAppStore((s) => s.setProgress);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const handleBuy = () => {
    if (product.selarUrl) {
      Linking.openURL(product.selarUrl);
    } else {
      Alert.alert('Coming Soon', 'This product will be available on Selar shortly.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this practical guide: ${product.title}\n\n${product.subtitle}\n\n${product.selarUrl || 'Available on Grow with Benedict'}`,
        title: product.title,
      });
    } catch (e) {
      // user cancelled
    }
  };

  const handleStartProgress = async () => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please sign in to track your progress.');
      return;
    }
    setProgress(product.id, 'in_progress', 10);
    try {
      await sendInstantNotification(
        'Progress started 🚀',
        `You're now learning "${product.title}". Keep going!`
      );
      // Nudge the user again in 24 hours if they don't complete it
      await scheduleProgressNudge(product.title, 24 * 60);
    } catch (e) {
      // Notifications are optional – ignore errors
    }
  };

  const handleComplete = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please sign in to track your progress.');
      return;
    }
    setProgress(product.id, 'completed', 100);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header onBack={onBack} title="Product" />
      <FadeIn>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={[styles.cover, { backgroundColor: product.color }]}>
          <Image source={{ uri: product.image }} style={styles.coverImage} resizeMode="cover" />
        </View>

        <View style={styles.body}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.primaryBtn, !product.selarUrl && styles.disabledBtn]}
              onPress={handleBuy}
            >
              <Text style={styles.primaryBtnText}>
                {product.selarUrl ? 'View on Selar ↗' : 'Coming Soon'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => toggleWishlist(product.id)}>
              <Text style={styles.secondaryBtnText}>
                {isInWishlist ? '❤️ Saved' : '🤍 Wishlist'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
              <Text style={styles.secondaryBtnText}>↗ Share this guide</Text>
            </TouchableOpacity>
          </View>

          {/* Progress controls */}
          <View style={styles.progressBox}>
            <Text style={styles.progressLabel}>Your Progress</Text>
            {progress ? (
              <View>
                <Text style={styles.progressStatus}>
                  Status: {progress.status.replace('_', ' ').toUpperCase()}
                </Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, { width: `${progress.progressPercent}%` }]}
                  />
                </View>
                <Text style={styles.progressPercent}>{progress.progressPercent}%</Text>
              </View>
            ) : (
              <Text style={styles.noProgress}>Not started yet</Text>
            )}

            <View style={styles.progressActions}>
              {(!progress || progress.status === 'not_started') && (
                <TouchableOpacity style={styles.smallBtn} onPress={handleStartProgress}>
                  <Text style={styles.smallBtnText}>Start Learning</Text>
                </TouchableOpacity>
              )}
              {progress?.status === 'in_progress' && (
                <TouchableOpacity style={styles.smallBtn} onPress={handleComplete}>
                  <Text style={styles.smallBtnText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this guide</Text>
          <Text style={styles.description}>{product.longDescription}</Text>

          <Text style={styles.note}>{product.priceNote}</Text>
        </View>
      </ScrollView>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  cover: { height: 240 },
  coverImage: { width: '100%', height: '100%', opacity: 0.9 },
  body: { padding: Spacing.lg },
  category: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 34,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  actions: { gap: Spacing.sm, marginBottom: Spacing.lg },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: Colors.surfaceLight },
  primaryBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: FontSize.sm,
  },
  progressBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressLabel: {
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressStatus: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  progressPercent: {
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 6,
    fontSize: FontSize.sm,
  },
  noProgress: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  progressActions: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallBtnText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: FontSize.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  note: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontStyle: 'italic',
    marginBottom: Spacing.xxl,
  },
});
