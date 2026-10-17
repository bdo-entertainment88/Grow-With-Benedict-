import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import ChatScreen from './src/screens/ChatScreen';
import { Product } from './src/types';
import { Colors } from './src/constants/theme';
import { useAppStore } from './src/store/useAppStore';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from './src/lib/notifications';
import PageLoader from './src/components/PageLoader';

type Tab = 'home' | 'wishlist' | 'progress' | 'chat' | 'profile';
type Screen = Tab | 'detail' | 'auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [appReady, setAppReady] = useState(false);

  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const updateStreak = useAppStore((s) => s.updateStreak);
  const restoreSession = useAppStore((s) => s.restoreSession);

  useEffect(() => {
    (async () => {
      updateStreak();
      await restoreSession();

      // Request notification permission
      try {
        const granted = await requestNotificationPermission();
        if (granted) {
          await scheduleDailyReminder(9, 0);
        }
      } catch (e) {
        // ignore notification errors
      }

      setAppReady(true);
    })();
  }, []);

  // When auth state changes after login/logout, decide where to go
  useEffect(() => {
    if (!appReady) return;

    if (isAuthenticated) {
      // Just logged in → go to Home
      if (currentScreen === 'auth') {
        setActiveTab('home');
        setCurrentScreen('home');
      }
    } else {
      // Logged out → force login screen
      setCurrentScreen('auth');
    }
  }, [isAuthenticated, appReady]);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
  };

  const goBack = () => {
    setCurrentScreen(activeTab);
    setSelectedProduct(null);
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentScreen(tab);
    setSelectedProduct(null);
  };

  // Loading screen while checking session
  if (!appReady) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <PageLoader message="Grow with Benedict" />
      </View>
    );
  }

  // LOGIN IS THE FIRST SCREEN when not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <AuthScreen
          onBack={() => {}} // no back when it's the first screen
          onSuccess={() => {
            setActiveTab('home');
            setCurrentScreen('home');
          }}
        />
      </View>
    );
  }

  // Main app (only shown when logged in)
  const renderScreen = () => {
    if (currentScreen === 'detail' && selectedProduct) {
      return <ProductDetailScreen product={selectedProduct} onBack={goBack} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onProductPress={openProduct} onNavigate={switchTab} />;
      case 'wishlist':
        return <WishlistScreen onProductPress={openProduct} />;
      case 'progress':
        return <ProgressScreen onProductPress={openProduct} />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigateToAuth={() => {
              // logout is handled inside Profile, this is just a fallback
              setCurrentScreen('auth');
            }}
          />
        );
      default:
        return null;
    }
  };

  const showTabBar = currentScreen !== 'detail';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.content}>{renderScreen()}</View>

      {showTabBar && (
        <SafeAreaView style={styles.tabBarSafe}>
          <View style={styles.tabBar}>
            <TabButton
              label="Home"
              icon="🏠"
              active={activeTab === 'home'}
              onPress={() => switchTab('home')}
            />
            <TabButton
              label="Wishlist"
              icon="❤️"
              active={activeTab === 'wishlist'}
              onPress={() => switchTab('wishlist')}
            />
            <TabButton
              label="AI"
              icon="🤖"
              active={activeTab === 'chat'}
              onPress={() => switchTab('chat')}
            />
            <TabButton
              label="Progress"
              icon="📈"
              active={activeTab === 'progress'}
              onPress={() => switchTab('progress')}
            />
            <TabButton
              label="Profile"
              icon="👤"
              active={activeTab === 'profile'}
              onPress={() => switchTab('profile')}
            />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 26,
  },
  loadingBrand: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  tabBarSafe: {
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingBottom: 2,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.accent,
  },
});
