import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Booking, Service, Customer } from "@/lib/storage";

const { width: screenWidth } = Dimensions.get("window");

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dateStr === today.toISOString().split("T")[0]) {
    return "Today";
  } else if (dateStr === tomorrow.toISOString().split("T")[0]) {
    return "Tomorrow";
  }
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

interface RevenueGraphProps {
  data: { date: string; revenue: number }[];
  width: number;
  height: number;
}

function RevenueGraph({ data, width, height }: RevenueGraphProps) {
  const { theme } = useTheme();
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * graphWidth,
    y: padding.top + graphHeight - (d.revenue / maxRevenue) * graphHeight,
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 3;
    const cp2x = prev.x + (2 * (point.x - prev.x)) / 3;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  return (
    <Svg width={width} height={height}>
      {[0, 0.5, 1].map((ratio, i) => (
        <React.Fragment key={i}>
          <Line
            x1={padding.left}
            y1={padding.top + graphHeight * (1 - ratio)}
            x2={width - padding.right}
            y2={padding.top + graphHeight * (1 - ratio)}
            stroke={theme.borderLight}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
          <SvgText
            x={padding.left - 8}
            y={padding.top + graphHeight * (1 - ratio) + 4}
            fill={theme.textTertiary}
            fontSize={10}
            textAnchor="end"
          >
            {formatPrice(maxRevenue * ratio)}
          </SvgText>
        </React.Fragment>
      ))}
      <Path d={pathD} stroke={theme.pureBlack} strokeWidth={2} fill="none" />
      {points.map((point, i) => (
        <Circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={4}
          fill={theme.pureWhite}
          stroke={theme.pureBlack}
          strokeWidth={2}
        />
      ))}
      {data.map((d, i) => {
        if (i % 2 !== 0 && data.length > 5) return null;
        const dayName = new Date(d.date).toLocaleDateString("en-US", { weekday: "short" });
        return (
          <SvgText
            key={i}
            x={points[i].x}
            y={height - padding.bottom + 20}
            fill={theme.textTertiary}
            fontSize={10}
            textAnchor="middle"
          >
            {dayName}
          </SvgText>
        );
      })}
    </Svg>
  );
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    todayBookings: 0,
    weekBookings: 0,
    upcomingBookings: [] as Booking[],
    capacityPercent: 0,
  });
  const [revenueHistory, setRevenueHistory] = useState<{ date: string; revenue: number }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showAllBookings, setShowAllBookings] = useState(false);

  const loadData = async () => {
    const [statsData, historyData, servicesData, customersData] = await Promise.all([
      storage.getDashboardStats(),
      storage.getRevenueHistory(7),
      storage.getServices(),
      storage.getCustomers(),
    ]);
    setStats(statsData);
    setRevenueHistory(historyData);
    setServices(servicesData);
    setCustomers(customersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  };

  const getServiceName = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.name || "Service";
  };

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || "Customer";
  };

  const displayedBookings = showAllBookings
    ? stats.upcomingBookings
    : stats.upcomingBookings.slice(0, 3);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.pureBlack} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Feather name="droplet" size={24} color={theme.pureBlack} />
          </View>
          <ThemedText style={styles.headerTitle}>AutoDetail Pro</ThemedText>
        </View>

        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.heroCard, { backgroundColor: theme.backgroundDefault }]}>
            <BlurView intensity={20} tint="light" style={styles.heroContent}>
              <View style={styles.heroRow}>
                <View style={styles.revenueSection}>
                  <ThemedText style={[styles.revenueLabel, { color: theme.textSecondary }]}>
                    Today's Revenue
                  </ThemedText>
                  <ThemedText style={styles.revenueValue}>
                    {formatPrice(stats.todayRevenue)}
                  </ThemedText>
                  <View style={styles.weekCompare}>
                    <Feather
                      name={stats.weekRevenue > 0 ? "trending-up" : "minus"}
                      size={14}
                      color={theme.success}
                    />
                    <ThemedText style={[styles.weekLabel, { color: theme.textSecondary }]}>
                      {formatPrice(stats.weekRevenue)} this week
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.capacitySection}>
                  <View style={[styles.capacityCircle, { borderColor: theme.pureBlack }]}>
                    <ThemedText style={styles.capacityPercent}>
                      {Math.round(stats.capacityPercent)}%
                    </ThemedText>
                    <ThemedText style={[styles.capacityLabel, { color: theme.textSecondary }]}>
                      Booked
                    </ThemedText>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(Animation.cinematic)}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Revenue (7 days)</ThemedText>
          </View>
          <View style={[styles.graphCard, { backgroundColor: theme.backgroundDefault }]}>
            <RevenueGraph
              data={revenueHistory}
              width={screenWidth - Spacing.lg * 2}
              height={180}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(Animation.cinematic)}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Upcoming</ThemedText>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setShowAllBookings(!showAllBookings);
              }}
            >
              <ThemedText style={[styles.toggleText, { color: theme.textSecondary }]}>
                {showAllBookings ? "Show Less" : "Show All"}
              </ThemedText>
            </Pressable>
          </View>

          {displayedBookings.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="calendar" size={40} color={theme.textTertiary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No upcoming bookings
              </ThemedText>
            </View>
          ) : (
            displayedBookings.map((booking, index) => (
              <Animated.View
                key={booking.id}
                entering={FadeInDown.delay(350 + index * 50).duration(Animation.normal)}
              >
                <View style={[styles.bookingCard, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.bookingHeader}>
                    <View style={[styles.dateChip, { backgroundColor: theme.pureBlack }]}>
                      <Feather name="calendar" size={12} color={theme.pureWhite} />
                      <ThemedText style={[styles.dateChipText, { color: theme.pureWhite }]}>
                        {formatDate(booking.date)}
                      </ThemedText>
                    </View>
                    <ThemedText style={[styles.timeText, { color: theme.textSecondary }]}>
                      {formatTime(booking.time)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.bookingCustomer}>
                    {getCustomerName(booking.customerId)}
                  </ThemedText>
                  <View style={styles.bookingDetails}>
                    <ThemedText style={[styles.bookingService, { color: theme.textSecondary }]}>
                      {getServiceName(booking.serviceId)}
                    </ThemedText>
                    {booking.vehicleInfo ? (
                      <ThemedText style={[styles.vehicleInfo, { color: theme.textTertiary }]}>
                        {booking.vehicleInfo}
                      </ThemedText>
                    ) : null}
                  </View>
                  <View style={styles.bookingFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            booking.status === "confirmed"
                              ? theme.success + "20"
                              : booking.status === "pending"
                              ? theme.warning + "20"
                              : theme.backgroundSecondary,
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          {
                            color:
                              booking.status === "confirmed"
                                ? theme.success
                                : booking.status === "pending"
                                ? theme.warning
                                : theme.textSecondary,
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  headerIcon: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h2,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  heroContent: {
    padding: Spacing.xl,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueSection: {
    flex: 1,
  },
  revenueLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  revenueValue: {
    fontSize: 48,
    fontWeight: "200",
    marginBottom: Spacing.sm,
  },
  weekCompare: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  weekLabel: {
    ...Typography.caption,
  },
  capacitySection: {
    alignItems: "center",
  },
  capacityCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  capacityPercent: {
    ...Typography.h2,
  },
  capacityLabel: {
    ...Typography.caption,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  toggleText: {
    ...Typography.body,
  },
  graphCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    padding: Spacing.md,
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
    marginBottom: Spacing.md,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  dateChipText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  timeText: {
    ...Typography.body,
  },
  bookingCustomer: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  bookingDetails: {
    marginBottom: Spacing.md,
  },
  bookingService: {
    ...Typography.body,
  },
  vehicleInfo: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
