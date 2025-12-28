import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Booking, Service, Customer } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "BookingConfirmation">;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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

export default function BookingConfirmationScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const checkScale = useSharedValue(0);

  useEffect(() => {
    loadData();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    checkScale.value = withDelay(200, withSpring(1, Animation.spring));
  }, [bookingId]);

  const loadData = async () => {
    const [bookings, services, customers] = await Promise.all([
      storage.getBookings(),
      storage.getServices(),
      storage.getCustomers(),
    ]);

    const foundBooking = bookings.find((b) => b.id === bookingId);
    setBooking(foundBooking || null);

    if (foundBooking) {
      const foundService = services.find((s) => s.id === foundBooking.serviceId);
      const foundCustomer = customers.find((c) => c.id === foundBooking.customerId);
      setService(foundService || null);
      setCustomer(foundCustomer || null);
    }
  };

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Admin" }],
      })
    );
  };

  if (!booking || !service) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.checkCircle, checkAnimatedStyle]}>
          <View style={[styles.checkInner, { backgroundColor: theme.success }]}>
            <Feather name="check" size={48} color={theme.pureWhite} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300).duration(Animation.cinematic)}>
          <ThemedText style={styles.title}>Booking Confirmed!</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            We've sent a confirmation to your email
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(Animation.cinematic)}>
          <View style={[styles.detailCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.bookingIdRow}>
              <ThemedText style={[styles.bookingIdLabel, { color: theme.textSecondary }]}>
                Booking Reference
              </ThemedText>
              <ThemedText style={styles.bookingId}>
                #{bookingId.slice(-8).toUpperCase()}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

            <View style={styles.detailRow}>
              <Feather name="tool" size={18} color={theme.textSecondary} />
              <View style={styles.detailText}>
                <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Service
                </ThemedText>
                <ThemedText style={styles.detailValue}>{service.name}</ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Feather name="calendar" size={18} color={theme.textSecondary} />
              <View style={styles.detailText}>
                <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Date & Time
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatDate(booking.date)} at {formatTime(booking.time)}
                </ThemedText>
              </View>
            </View>

            {booking.vehicleInfo ? (
              <View style={styles.detailRow}>
                <Feather name="truck" size={18} color={theme.textSecondary} />
                <View style={styles.detailText}>
                  <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
                    Vehicle
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>{booking.vehicleInfo}</ThemedText>
                </View>
              </View>
            ) : null}

            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />

            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total Paid</ThemedText>
              <ThemedText style={styles.totalValue}>{formatPrice(booking.totalPrice)}</ThemedText>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(500).duration(Animation.cinematic)}>
        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleDone}
        >
          <ThemedText style={[styles.doneButtonText, { color: theme.pureWhite }]}>
            Done
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing["3xl"],
  },
  checkCircle: {
    marginBottom: Spacing["2xl"],
  },
  checkInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...Typography.h1,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing["3xl"],
  },
  detailCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  bookingIdRow: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  bookingIdLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  bookingId: {
    ...Typography.h3,
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    ...Typography.body,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    ...Typography.h3,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "200",
  },
  doneButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
