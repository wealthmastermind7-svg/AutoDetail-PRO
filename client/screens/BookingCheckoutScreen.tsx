import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Service } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "BookingCheckout">;

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

export default function BookingCheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { serviceId, date, time } = route.params;

  const [service, setService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    const services = await storage.getServices();
    const found = services.find((s) => s.id === serviceId);
    setService(found || null);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSubmitting(true);

    try {
      let customer = await storage.getCustomerByEmail(email);
      
      if (!customer) {
        customer = await storage.addCustomer({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        });
      }

      const booking = await storage.addBooking({
        customerId: customer.id,
        serviceId,
        date,
        time,
        status: "confirmed",
        totalPrice: service?.price || 0,
        notes: notes.trim(),
        vehicleInfo: vehicleInfo.trim(),
      });

      navigation.navigate("BookingConfirmation", { bookingId: booking.id });
    } catch (error) {
      Alert.alert("Error", "Failed to complete booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centered}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.summaryTitle}>Booking Summary</ThemedText>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Feather name="tool" size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                  Service
                </ThemedText>
              </View>
              <ThemedText style={styles.summaryValue}>{service.name}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Feather name="calendar" size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                  Date
                </ThemedText>
              </View>
              <ThemedText style={styles.summaryValue}>{formatDate(date)}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Feather name="clock" size={16} color={theme.textSecondary} />
                <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                  Time
                </ThemedText>
              </View>
              <ThemedText style={styles.summaryValue}>{formatTime(time)}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>{formatPrice(service.price)}</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(Animation.cinematic)}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Your Information
          </ThemedText>
          <View style={[styles.formCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Full Name *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="John Smith"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Email Address *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="john@email.com"
                placeholderTextColor={theme.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Phone Number *
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={theme.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Vehicle Info
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={vehicleInfo}
                onChangeText={setVehicleInfo}
                placeholder="2023 Tesla Model 3"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Special Requests
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special requests or notes..."
                placeholderTextColor={theme.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(Animation.cinematic)}>
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: theme.pureBlack, opacity: pressed || submitting ? 0.8 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <ThemedText style={[styles.submitButtonText, { color: theme.pureWhite }]}>
              {submitting ? "Processing..." : "Confirm Booking"}
            </ThemedText>
            <Feather name="check" size={20} color={theme.pureWhite} />
          </Pressable>
        </Animated.View>
      </KeyboardAwareScrollViewCompat>
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
  summaryCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  summaryTitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
  },
  summaryValue: {
    ...Typography.body,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
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
  sectionTitle: {
    ...Typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  formCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.caption,
    marginBottom: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
  },
  textArea: {
    height: 100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    ...Typography.body,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  submitButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
