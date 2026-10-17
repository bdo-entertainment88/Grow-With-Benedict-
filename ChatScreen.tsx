import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import { FadeIn } from '../components/PageLoader';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS } from '../data/products';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_PROMPTS = [
  'Which guide should I start with?',
  'How do I track my progress?',
  'Tell me about the ChatGPT system',
  'What is SideShift UGC?',
  'Help me stay consistent',
];

function generateReply(userMessage: string, context: {
  name?: string;
  wishlist: string[];
  progressCount: number;
  completedCount: number;
  streak: number;
}): string {
  const msg = userMessage.toLowerCase();
  const { name, wishlist, progressCount, completedCount, streak } = context;

  // Greetings
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return `Hello${name ? ` ${name}` : ''}! 👋 I'm your Grow with Benedict assistant.\n\nI can help you choose the right guide, track your learning, or answer questions about any of the resources. What would you like to do today?`;
  }

  // Recommend a guide
  if (msg.includes('which guide') || msg.includes('should i start') || msg.includes('recommend') || msg.includes('suggest')) {
    if (progressCount === 0) {
      return `Great question! Since you're just getting started, I recommend beginning with **The ChatGPT Monetization System**.\n\nIt teaches a clear path from AI skills → service → first clients. Many people find it the most actionable starting point.\n\nWould you like me to explain what you'll learn inside?`;
    }
    return `Based on your activity, you already have ${progressCount} guide(s) in progress and ${completedCount} completed. Nice work!\n\nIf you want something new, try the **SideShift UGC Campaign Blueprint** if you like content creation, or the **Customer Magnet Blueprint** if your focus is getting more customers.\n\nWhat are you most interested in right now — AI services, content, sales, or gaming?`;
  }

  // ChatGPT product
  if (msg.includes('chatgpt') || msg.includes('monetization') || msg.includes('ai skill')) {
    const p = PRODUCTS[0];
    return `**${p.title}**\n\n${p.subtitle}\n\nThis guide shows you how to turn ChatGPT skills into real paid services. The path is:\n\nAI skill → Service → Offer → Prospect → Client → Revenue\n\nIt focuses on practical steps to reach your first ₦100K in client revenue.\n\nYou can open it from the Home tab and tap "View on Selar" to get the full system.`;
  }

  // SideShift / UGC
  if (msg.includes('sideshift') || msg.includes('ugc') || msg.includes('content creation') || msg.includes('1000')) {
    const p = PRODUCTS[1];
    return `**${p.title}**\n\n${p.subtitle}\n\nThis is a practical blueprint covering campaign selection, hooks, scripts, filming, editing, and a repeatable creator workflow.\n\nIt's designed to help you reach your first $1,000 on SideShift in a structured way.`;
  }

  // Customer / Sales
  if (msg.includes('customer') || msg.includes('magnet') || msg.includes('sales') || msg.includes('clients')) {
    return `The **Customer Magnet Blueprint** helps you build a clearer path to finding customers. It focuses on offer clarity, communicating value, and attracting the right buyers.\n\nPerfect if you already have a skill or product but struggle to get consistent clients.`;
  }

  // Dropshipping
  if (msg.includes('dropship') || msg.includes('ecommerce') || msg.includes('store')) {
    return `The **Dropshipping Success Blueprint** organises the foundations: product selection, store setup, fulfilment, and customer experience.\n\nIt's focused on real systems rather than hype.`;
  }

  // CODM / Gaming
  if (msg.includes('codm') || msg.includes('gaming') || msg.includes('call of duty') || msg.includes('game')) {
    return `The **CODM Master System · 2026 Edition** is for players who want a more deliberate approach to practice, loadouts, and in-game improvement.\n\nIt helps you stop playing on autopilot and start tracking real progress.`;
  }

  // Progress / Tracking
  if (msg.includes('progress') || msg.includes('track') || msg.includes('how do i')) {
    return `Here's how progress tracking works:\n\n1. Open any guide\n2. Tap **Start Learning**\n3. When you're done, tap **Mark Complete**\n\nYour progress appears on the Progress tab and also as badges on the product cards. You currently have ${progressCount} active and ${completedCount} completed.`;
  }

  // Streak / Consistency
  if (msg.includes('streak') || msg.includes('consistent') || msg.includes('daily') || msg.includes('motivation')) {
    return `Your current learning streak is **${streak} day${streak === 1 ? '' : 's'}** 🔥\n\nTip: Open the app and interact with any guide each day to keep the streak alive. Small consistent actions beat occasional big efforts.\n\nWant a simple daily routine I can suggest?`;
  }

  // Wishlist
  if (msg.includes('wishlist') || msg.includes('saved')) {
    return wishlist.length === 0
      ? `Your wishlist is empty right now. Tap the heart 🤍 on any product card to save it for later.`
      : `You have ${wishlist.length} guide(s) in your wishlist. You can view them anytime from the Wishlist tab.`;
  }

  // Help / What can you do
  if (msg.includes('help') || msg.includes('what can you') || msg.includes('what do you')) {
    return `I can help you with:\n\n• Recommending which guide to start with\n• Explaining any of the 5 products\n• Tracking and understanding your progress\n• Staying consistent with learning streaks\n• Answering questions about AI services, UGC, sales, dropshipping or CODM\n\nJust ask me anything related to growing with the guides!`;
  }

  // Default helpful response
  return `I'm here to help you get the most out of the Grow with Benedict guides.\n\nYou can ask me things like:\n• "Which guide should I start with?"\n• "Tell me about the ChatGPT system"\n• "How do I track progress?"\n• "Help me stay consistent"\n\nWhat would you like to know?`;
}

export default function ChatScreen() {
  const user = useAppStore((s) => s.user);
  const wishlist = useAppStore((s) => s.wishlist);
  const progress = useAppStore((s) => s.progress);
  const streak = useAppStore((s) => s.streak);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: `Hi${user?.name ? ` ${user.name}` : ''}! 👋 I'm your personal assistant for Grow with Benedict.\n\nI can help you choose guides, understand your progress, or answer questions about any of the resources. What would you like help with?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const progressCount = Object.keys(progress).length;
  const completedCount = Object.values(progress).filter((p) => p.status === 'completed').length;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const reply = generateReply(text, {
        name: user?.name,
        wishlist,
        progressCount,
        completedCount,
        streak,
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: reply,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350 + Math.random() * 250);
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header title="AI Assistant" />
      <FadeIn>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.role === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.bubble, styles.botBubble]}>
                <ActivityIndicator size="small" color={Colors.accent} />
              </View>
            ) : null
          }
        />

        {/* Quick prompts */}
        {messages.length < 3 && (
          <View style={styles.quickRow}>
            {QUICK_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={styles.quickChip}
                onPress={() => sendMessage(prompt)}
              >
                <Text style={styles.quickText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => sendMessage(input)}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Text style={styles.sendText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  flex: {
    flex: 1,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  botText: {
    color: Colors.text,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingBottom: 10,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  quickText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.primary,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 15,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
});
