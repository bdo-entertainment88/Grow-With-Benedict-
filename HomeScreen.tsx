import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import { Product } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  onProductPress: (product: Product) => void;
  onNavigate: (screen: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI' },
  { id: 'ugc', label: 'UGC' },
  { id: 'business', label: 'Business' },
  { id: 'gaming', label: 'Gaming' },
];

const DAILY_INSIGHTS = [
  'Small consistent actions beat occasional big efforts.',
  'Clarity of offer is more important than the number of skills you have.',
  'Track your progress — what gets measured improves.',
  'Your next client is looking for someone who can solve a specific problem.',
  'Deliberate practice is the fastest path to improvement.',
  'Turn what you learn into something you can sell.',
];

export default function HomeScreen({ onProductPress }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const streak = useAppStore((s) => s.streak);
  const progress = useAppStore((s) => s.progress);

  const insight = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_INSIGHTS[day % DAILY_INSIGHTS.length];
  }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS;

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        if (activeCategory === 'ai') return cat.includes('ai');
        if (activeCategory === 'ugc') return cat.includes('ugc') || cat.includes('content');
        if (activeCategory === 'business')
          return cat.includes('business') || cat.includes('sales') || cat.includes('e-commerce');
        if (activeCategory === 'gaming') return cat.includes('gaming') || cat.includes('codm');
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  const featured = PRODUCTS[0];
  const completedCount = Object.values(progress).filter((p) => p.status === 'completed').length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header showLogo />
      <FadeIn>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search guides..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>YOUR NEXT MOVE STARTS HERE</Text>
          <Text style={styles.heroTitle}>
            Turn what you learn into{'\n'}
            <Text style={styles.heroAccent}>what you build.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Practical digital guides for AI, online business, content creation and gaming.
          </Text>

          {(streak > 0 || completedCount > 0) && (
            <View style={styles.statsRow}>
              {streak > 0 && (
                <View style={styles.statPill}>
                  <Text style={styles.statPillText}>🔥 {streak} day streak</Text>
                </View>
              )}
              {completedCount > 0 && (
                <View style={styles.statPill}>
                  <Text style={styles.statPillText}>✓ {completedCount} completed</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Daily Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>TODAY'S INSIGHT</Text>
          <Text style={styles.insightText}>"{insight}"</Text>
        </View>

        {/* Featured Guide - hide when searching */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>FEATURED</Text>
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => onProductPress(featured)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: featured.image }} style={styles.featuredImage} />
              <View style={styles.featuredOverlay} />
              <View style={styles.featuredContent}>
                <Text style={styles.featuredCategory}>{featured.category}</Text>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={styles.featuredSub}>{featured.subtitle}</Text>
                <View style={styles.featuredBtn}>
                  <Text style={styles.featuredBtnText}>Explore →</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, activeCategory === cat.id && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeCategory === cat.id && styles.filterTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Catalogue */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {searchQuery ? 'SEARCH RESULTS' : 'THE CATALOGUE'}
          </Text>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `${filtered.length} guide${filtered.length !== 1 ? 's' : ''} found`
              : 'Find your next useful resource.'}
          </Text>
        </View>

        <View style={styles.grid}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => onProductPress(product)}
            />
          ))}
        </View>

        {filtered.length === 0 && (
          <View style={styles.emptyFilter}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyFilterText}>
              {searchQuery
                ? `No guides found for "${searchQuery}"`
                : 'No guides in this category yet.'}
            </Text>
          </View>
        )}

        {/* Value props - hide when searching */}
        {!searchQuery && (
          <View style={styles.valueSection}>
            <View style={styles.valueCard}>
              <Text style={styles.valueIcon}>✦</Text>
              <Text style={styles.valueTitle}>Built for action</Text>
              <Text style={styles.valueText}>
                Steps, frameworks and application — not just theory.
              </Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueIcon}>↗</Text>
              <Text style={styles.valueTitle}>Checkout via Selar</Text>
              <Text style={styles.valueText}>
                Secure purchase and instant digital delivery.
              </Text>
            </View>
            <View style={styles.valueCard}>
              <Text style={styles.valueIcon}>◎</Text>
              <Text style={styles.valueTitle}>Clear expectations</Text>
              <Text style={styles.valueText}>
                Outcomes depend on your circumstances and execution.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, backgroundColor: Colors.primary },
  content: { paddingBottom: Spacing.xxl },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    paddingVertical: 2,
  },
  clearIcon: {
    color: Colors.textMuted,
    fontSize: 14,
    paddingLeft: 8,
  },

  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  heroLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroAccent: { color: Colors.accent },
  heroSub: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statPillText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },

  insightCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  insightLabel: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightText: {
    color: Colors.text,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
  },

  featuredCard: {
    marginTop: 10,
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,18,32,0.65)',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.md,
  },
  featuredCategory: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  featuredSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
  featuredBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  featuredBtnText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },

  filters: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.primary,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  emptyFilter: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyFilterText: {
    color: Colors.textMuted,
    textAlign: 'center',
  },

  valueSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: 12,
  },
  valueCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  valueIcon: {
    color: Colors.accent,
    fontSize: 18,
    marginBottom: 6,
  },
  valueTitle: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
  },
  valueText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
