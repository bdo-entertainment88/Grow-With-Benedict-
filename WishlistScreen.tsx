import React from 'react';
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
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { Product } from '../types';

interface Props {
  onProductPress: (product: Product) => void;
}

export default function WishlistScreen({ onProductPress }: Props) {
  const wishlist = useAppStore((s) => s.wishlist);
  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title="Wishlist" />
      <FadeIn>
      <View style={styles.container}>
        {wishlistedProducts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptyText}>
              Tap the heart on any product to save it here for later.
            </Text>
          </View>
        ) : (
          <FlatList
            data={wishlistedProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            initialNumToRender={6}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => onProductPress(item)} />
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
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.lg },
  list: { paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  row: { justifyContent: 'space-between' },
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
