import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Booking, Service, Customer } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadData = async () => {
    const [bookingsData, servicesData, customersData] = await Promise.all([
      storage.getBookings(),
      storage.getServices(),
      storage.getCustomers(),
    ]);
    setAllBookings(bookingsData);
    setServices(servicesData);
    setCustomers(customersData);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const dayBookings = allBookings
      .filter((b) => b.date === selectedDate && b.status !== "cancelled")
      .sort((a, b) => a.time.localeCompare(b.time));
    setBookings(dayBookings);
  }, [selectedDate, allBookings]);

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

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasBookingsOnDate = (dateStr: string) => {
    return allBookings.some((b) => b.date === dateStr && b.status !== "cancelled");
  };

  const goToPrevMonth = () => {
    Haptics.selectionAsync();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    Haptics.selectionAsync();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const todayStr = today.toISOString().split("T")[0];

    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;
      const hasBookings = hasBookingsOnDate(dateStr);

      days.push(
        <Pressable
          key={day}
          style={styles.dayCell}
          onPress={() => {
            Haptics.selectionAsync();
            setSelectedDate(dateStr);
          }}
        >
          <View
            style={[
              styles.dayCircle,
              isSelected && { backgroundColor: theme.pureBlack },
              isToday && !isSelected && { borderWidth: 2, borderColor: theme.pureBlack },
              hasBookings && !isSelected && { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <ThemedText
              style={[
                styles.dayText,
                isSelected && { color: theme.pureWhite },
              ]}
            >
              {day}
            </ThemedText>
          </View>
        </Pressable>
      );
    }

    return days;
  };

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
          <ThemedText style={styles.headerTitle}>Calendar</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.hoursButton,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("AvailabilityEditor");
            }}
          >
            <Feather name="clock" size={16} color={theme.pureBlack} />
            <ThemedText style={styles.hoursButtonText}>Hours</ThemedText>
          </Pressable>
        </View>

        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.calendarCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.monthHeader}>
              <Pressable onPress={goToPrevMonth} style={styles.monthArrow}>
                <Feather name="chevron-left" size={24} color={theme.pureBlack} />
              </Pressable>
              <ThemedText style={styles.monthTitle}>
                {MONTHS[currentMonth]} {currentYear}
              </ThemedText>
              <Pressable onPress={goToNextMonth} style={styles.monthArrow}>
                <Feather name="chevron-right" size={24} color={theme.pureBlack} />
              </Pressable>
            </View>

            <View style={styles.weekHeader}>
              {DAYS.map((day) => (
                <View key={day} style={styles.weekDayCell}>
                  <ThemedText style={[styles.weekDayText, { color: theme.textSecondary }]}>
                    {day}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>{renderCalendar()}</View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(Animation.cinematic)}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {selectedDate === today.toISOString().split("T")[0]
                ? "Today"
                : new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
            </ThemedText>
            <ThemedText style={[styles.bookingCount, { color: theme.textSecondary }]}>
              {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
            </ThemedText>
          </View>

          {bookings.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="calendar" size={40} color={theme.textTertiary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No bookings for this day
              </ThemedText>
            </View>
          ) : (
            bookings.map((booking, index) => (
              <Animated.View
                key={booking.id}
                entering={FadeInDown.delay(200 + index * 50).duration(Animation.normal)}
              >
                <View style={[styles.bookingCard, { backgroundColor: theme.backgroundDefault }]}>
                  <View style={styles.timeBlock}>
                    <ThemedText style={styles.timeText}>{formatTime(booking.time)}</ThemedText>
                  </View>
                  <View style={styles.bookingInfo}>
                    <ThemedText style={styles.customerName}>
                      {getCustomerName(booking.customerId)}
                    </ThemedText>
                    <ThemedText style={[styles.serviceName, { color: theme.textSecondary }]}>
                      {getServiceName(booking.serviceId)}
                    </ThemedText>
                    {booking.vehicleInfo ? (
                      <ThemedText style={[styles.vehicleInfo, { color: theme.textTertiary }]}>
                        {booking.vehicleInfo}
                      </ThemedText>
                    ) : null}
                  </View>
                  <ThemedText style={styles.priceText}>
                    {formatPrice(booking.totalPrice)}
                  </ThemedText>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h2,
  },
  hoursButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  hoursButtonText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  calendarCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  monthArrow: {
    padding: Spacing.sm,
  },
  monthTitle: {
    ...Typography.h3,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    ...Typography.body,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
  },
  bookingCount: {
    ...Typography.body,
  },
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  timeBlock: {
    marginRight: Spacing.lg,
  },
  timeText: {
    ...Typography.body,
    fontWeight: "600",
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    ...Typography.body,
    fontWeight: "600",
  },
  serviceName: {
    ...Typography.caption,
  },
  vehicleInfo: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  priceText: {
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
