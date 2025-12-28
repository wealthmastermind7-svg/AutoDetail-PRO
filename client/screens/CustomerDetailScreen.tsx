import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Customer, Booking, Service } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type RouteType = RouteProp<RootStackParamList, "CustomerDetail">;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function CustomerDetailScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const route = useRoute<RouteType>();
  const { customerId } = route.params;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadData();
  }, [customerId]);

  const loadData = async () => {
    const [customers, allBookings, servicesData] = await Promise.all([
      storage.getCustomers(),
      storage.getBookings(),
      storage.getServices(),
    ]);

    const foundCustomer = customers.find((c) => c.id === customerId);
    setCustomer(foundCustomer || null);

    const customerBookings = allBookings
      .filter((b) => b.customerId === customerId)
      .sort((a, b) => b.date.localeCompare(a.date));
    setBookings(customerBookings);
    setServices(servicesData);
  };

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || "Service";
  };

  const handleCall = () => {
    if (!customer?.phone) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${customer.phone}`);
  };

  const handleEmail = () => {
    if (!customer?.email) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`mailto:${customer.email}`);
  };

  if (!customer) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText>Customer not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.profileCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={[styles.avatar, { backgroundColor: theme.pureBlack }]}>
              <ThemedText style={[styles.avatarText, { color: theme.pureWhite }]}>
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </ThemedText>
            </View>
            <ThemedText style={styles.customerName}>{customer.name}</ThemedText>
            <ThemedText style={[styles.customerSince, { color: theme.textSecondary }]}>
              Customer since {formatDate(customer.createdAt)}
            </ThemedText>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{customer.totalBookings}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Bookings
                </ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.borderLight }]} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>
                  {formatPrice(customer.totalSpent)}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Total Spent
                </ThemedText>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(Animation.cinematic)}>
          <View style={[styles.contactCard, { backgroundColor: theme.backgroundDefault }]}>
            <Pressable
              style={({ pressed }) => [
                styles.contactRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleCall}
              disabled={!customer.phone}
            >
              <View style={[styles.contactIcon, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name="phone" size={18} color={theme.pureBlack} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={[styles.contactLabel, { color: theme.textSecondary }]}>
                  Phone
                </ThemedText>
                <ThemedText style={styles.contactValue}>
                  {customer.phone || "Not provided"}
                </ThemedText>
              </View>
              {customer.phone ? (
                <Feather name="chevron-right" size={20} color={theme.textTertiary} />
              ) : null}
            </Pressable>

            <View style={[styles.contactDivider, { backgroundColor: theme.borderLight }]} />

            <Pressable
              style={({ pressed }) => [
                styles.contactRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleEmail}
              disabled={!customer.email}
            >
              <View style={[styles.contactIcon, { backgroundColor: theme.backgroundSecondary }]}>
                <Feather name="mail" size={18} color={theme.pureBlack} />
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={[styles.contactLabel, { color: theme.textSecondary }]}>
                  Email
                </ThemedText>
                <ThemedText style={styles.contactValue}>
                  {customer.email || "Not provided"}
                </ThemedText>
              </View>
              {customer.email ? (
                <Feather name="chevron-right" size={20} color={theme.textTertiary} />
              ) : null}
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(Animation.cinematic)}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Booking History</ThemedText>
            <ThemedText style={[styles.bookingCount, { color: theme.textSecondary }]}>
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </ThemedText>
          </View>

          {bookings.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="calendar" size={32} color={theme.textTertiary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No bookings yet
              </ThemedText>
            </View>
          ) : (
            bookings.map((booking, index) => (
              <Animated.View
                key={booking.id}
                entering={FadeInDown.delay(250 + index * 50).duration(Animation.normal)}
              >
                <View style={[styles.bookingCard, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.bookingHeader}>
                    <ThemedText style={styles.bookingDate}>
                      {formatDate(booking.date)}
                    </ThemedText>
                    <ThemedText style={[styles.bookingTime, { color: theme.textSecondary }]}>
                      {formatTime(booking.time)}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.serviceName, { color: theme.textSecondary }]}>
                    {getServiceName(booking.serviceId)}
                  </ThemedText>
                  {booking.vehicleInfo ? (
                    <ThemedText style={[styles.vehicleInfo, { color: theme.textTertiary }]}>
                      {booking.vehicleInfo}
                    </ThemedText>
                  ) : null}
                  <View style={styles.bookingFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            booking.status === "completed"
                              ? theme.success + "20"
                              : booking.status === "confirmed"
                              ? theme.success + "20"
                              : booking.status === "cancelled"
                              ? theme.error + "20"
                              : theme.warning + "20",
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          {
                            color:
                              booking.status === "completed" || booking.status === "confirmed"
                                ? theme.success
                                : booking.status === "cancelled"
                                ? theme.error
                                : theme.warning,
                          },
                        ]}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.bookingPrice}>
                      {formatPrice(booking.totalPrice)}
                    </ThemedText>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "600",
  },
  customerName: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  customerSince: {
    ...Typography.caption,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  statValue: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  contactCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  contactValue: {
    ...Typography.body,
  },
  contactDivider: {
    height: 1,
    marginVertical: Spacing.md,
    marginLeft: 56,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  bookingCount: {
    ...Typography.body,
  },
  bookingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  bookingDate: {
    ...Typography.body,
    fontWeight: "600",
  },
  bookingTime: {
    ...Typography.body,
  },
  serviceName: {
    ...Typography.body,
    marginBottom: Spacing.xs,
  },
  vehicleInfo: {
    ...Typography.caption,
    marginBottom: Spacing.md,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  bookingPrice: {
    ...Typography.h3,
  },
  emptyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing["3xl"],
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
  },
});
