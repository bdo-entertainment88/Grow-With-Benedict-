import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { PRODUCTS } from '../data/products';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { Product } from '../types';

interface Props {
  onProductPress: (product: Product) => void;
}

export default function ProgressScreen({ onProductPress }: Props) {
  const progress = useAppStore((s) => s.progress);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const streak = useAppStore((s) => s.streak);

  const progressItems = Object.values(progress)
    .map((p) => {
      const product = PRODUCTS.find((prod) => prod.id === p.productId);
      return product ? { ...p, product } : null;
    })
    .filter(Boolean) as Array<{
    product: Product;
    status: string;
    progressPercent: number;
  }>;

  const stats = useMemo(() => {
    const total = PRODUCTS.length;
    const started = progressItems.length;
    const completed = progressItems.filter((p) => p.status === 'completed').length;
    const inProgress = progressItems.filter((p) => p.status === 'in_progress').length;
    const overallPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, started, completed, inProgress, overallPercent };
  }, [progressItems]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <Header title="My Progress" />
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📈</Text>
          <Text style={styles.emptyTitle}>Sign in to track progress</Text>
          <Text style={styles.emptyText}>
            Create an account or sign in to start tracking which guides you have started and completed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title="My Progress" />
      <FadeIn>
      <View style={styles.container}>
        {/* Chart / Summary Card */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>📈 Learning Overview</Text>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streak} day streak</Text>
              </View>
            )}
          </View>

          {/* Overall progress bar */}
          <View style={styles.overallRow}>
            <Text style={styles.overallLabel}>Overall completion</Text>
            <Text style={styles.overallPercent}>{stats.overallPercent}%</Text>
          </View>
          <View style={styles.overallBarBg}>
            <View style={[styles.overallBarFill, { width: `${stats.overallPercent}%` }]} />
          </View>

          {/* Mini stats */}
          <View style={styles.miniStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniNum}>{stats.completed}</Text>
              <Text style={styles.miniLabel}>Completed</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniNum}>{stats.inProgress}</Text>
              <Text style={styles.miniLabel}>In Progress</Text>
            </View>
            <View style={styles.miniDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniNum}>{stats.total - stats.started}</Text>
              <Text style={styles.miniLabel}>Not Started</Text>
            </View>
          </View>
        </View>

        {progressItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🚀</Text>
            <Text style={styles.emptyTitle}>No progress yet</Text>
            <Text style={styles.emptyText}>
              Open any guide and tap “Start Learning” to begin tracking.
            </Text>
          </View>
        ) : (
          <FlatList
            data={progressItems}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.list}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => onProductPress(item.product)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.category}>{item.product.category}</Text>
                  <Text
                    style={[
                      styles.badge,
                      item.status === 'completed' && styles.badgeDone,
                    ]}
                  >
                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
                <Text style={styles.title}>{item.product.title}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${item.progressPercent}%` }]} />
                </View>
                <Text style={styles.percent}>{item.progressPercent}% complete</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1 },

  // Chart card
  chartCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chartTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  streakBadge: {
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  streakText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  overallLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  overallPercent: {
    color: Colors.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  overallBarBg: {
    height: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  overallBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 5,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  miniStat: {
    alignItems: 'center',
    flex: 1,
  },
  miniNum: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  miniLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  miniDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  list: { padding: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: Colors.primaryLight,
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  badgeDone: {
    backgroundColor: Colors.successSoft,
    color: Colors.success,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 12,
  },
  barBg: {
    height: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  percent: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    marginTop: 6,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
