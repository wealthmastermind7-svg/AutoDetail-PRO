import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Customer } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

export default function CustomersScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadCustomers = async () => {
    const data = await storage.getCustomers();
    setCustomers(data.sort((a, b) => b.totalBookings - a.totalBookings));
  };

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadCustomers();
    setRefreshing(false);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const renderCustomer = ({ item, index }: { item: Customer; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 30).duration(Animation.normal)}>
      <Pressable
        style={({ pressed }) => [
          styles.customerCard,
          {
            backgroundColor: theme.backgroundDefault,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        onPress={() => {
          Haptics.selectionAsync();
          navigation.navigate("CustomerDetail", { customerId: item.id });
        }}
      >
        <View style={[styles.avatar, { backgroundColor: theme.pureBlack }]}>
          <ThemedText style={[styles.avatarText, { color: theme.pureWhite }]}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </ThemedText>
        </View>
        <View style={styles.customerInfo}>
          <ThemedText style={styles.customerName}>{item.name}</ThemedText>
          <ThemedText style={[styles.customerEmail, { color: theme.textSecondary }]}>
            {item.email}
          </ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="calendar" size={12} color={theme.textTertiary} />
              <ThemedText style={[styles.statText, { color: theme.textTertiary }]}>
                {item.totalBookings} {item.totalBookings === 1 ? "booking" : "bookings"}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <Feather name="dollar-sign" size={12} color={theme.textTertiary} />
              <ThemedText style={[styles.statText, { color: theme.textTertiary }]}>
                {formatPrice(item.totalSpent)} spent
              </ThemedText>
            </View>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textTertiary} />
      </Pressable>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + Spacing.xl },
        ]}
      >
        <ThemedText style={styles.headerTitle}>Customers</ThemedText>
        <ThemedText style={[styles.customerCount, { color: theme.textSecondary }]}>
          {customers.length} total
        </ThemedText>
      </View>

      <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="search" size={20} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search customers..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color={theme.textTertiary} />
            </Pressable>
          ) : null}
        </View>
      </Animated.View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.pureBlack} />
        }
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="users" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              {searchQuery ? "No customers found" : "No customers yet"}
            </ThemedText>
            <ThemedText style={[styles.emptyText, { color: theme.textTertiary }]}>
              {searchQuery
                ? "Try a different search term"
                : "Customers will appear here when they book a service"}
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h2,
  },
  customerCount: {
    ...Typography.body,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  avatarText: {
    ...Typography.body,
    fontWeight: "600",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...Typography.body,
    fontWeight: "600",
  },
  customerEmail: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.caption,
  },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing["4xl"],
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginTop: Spacing["2xl"],
  },
  emptyTitle: {
    ...Typography.h3,
    marginTop: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
    textAlign: "center",
  },
});
