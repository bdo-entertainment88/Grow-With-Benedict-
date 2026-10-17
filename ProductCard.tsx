import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Product } from '../types';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 3) / 2;

interface Props {
  product: Product;
  onPress: () => void;
}

function ProductCard({ product, onPress }: Props) {
  const isInWishlist = useAppStore((s) => s.isInWishlist(product.id));
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const progress = useAppStore((s) => s.getProgress(product.id));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageOverlay} />

        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleWishlist(product.id)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.heart}>{isInWishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {progress && progress.status !== 'not_started' && (
          <View
            style={[
              styles.progressBadge,
              progress.status === 'completed' && styles.progressBadgeDone,
            ]}
          >
            <Text style={styles.progressText}>
              {progress.status === 'completed' ? '✓ Completed' : `${progress.progressPercent}%`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {product.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    height: 150,
    position: 'relative',
    backgroundColor: Colors.primaryLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 16,
  },
  progressBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: Colors.accent,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  progressBadgeDone: {
    backgroundColor: Colors.success,
  },
  progressText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  category: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    color: Colors.text,
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 18,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 11.5,
    lineHeight: 15,
  },
});
