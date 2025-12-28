import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Service } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "BookingSelectTime">;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export default function BookingSelectTimeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { serviceId } = route.params;

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadService();
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate && service) {
      loadSlots();
    }
  }, [selectedDate, service]);

  const loadService = async () => {
    const services = await storage.getServices();
    const found = services.find((s) => s.id === serviceId);
    setService(found || null);
  };

  const loadSlots = async () => {
    if (!selectedDate || !service) return;
    setLoading(true);
    const slots = await storage.getAvailableSlots(selectedDate, service.duration);
    setAvailableSlots(slots);
    setSelectedTime(null);
    setLoading(false);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInPast = (dateStr: string) => {
    const date = new Date(dateStr);
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    return date < todayStart;
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

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("BookingCheckout", {
      serviceId,
      date: selectedDate,
      time: selectedTime,
    });
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
      const isPast = isDateInPast(dateStr);

      days.push(
        <Pressable
          key={day}
          style={styles.dayCell}
          onPress={() => {
            if (isPast) return;
            Haptics.selectionAsync();
            setSelectedDate(dateStr);
          }}
          disabled={isPast}
        >
          <View
            style={[
              styles.dayCircle,
              isSelected && { backgroundColor: theme.pureBlack },
              isToday && !isSelected && { borderWidth: 2, borderColor: theme.pureBlack },
              isPast && { opacity: 0.3 },
            ]}
          >
            <ThemedText
              style={[
                styles.dayText,
                isSelected && { color: theme.pureWhite },
                isPast && { color: theme.textTertiary },
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
          { paddingBottom: insets.bottom + 80 + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
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

        {selectedDate ? (
          <Animated.View entering={FadeInDown.duration(Animation.cinematic)}>
            <ThemedText style={styles.sectionTitle}>Available Times</ThemedText>
            {loading ? (
              <View style={[styles.loadingCard, { backgroundColor: theme.backgroundDefault }]}>
                <ThemedText style={{ color: theme.textSecondary }}>Loading...</ThemedText>
              </View>
            ) : availableSlots.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="clock" size={32} color={theme.textTertiary} />
                <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No available times for this date
                </ThemedText>
              </View>
            ) : (
              <View style={styles.slotsGrid}>
                {availableSlots.map((slot, index) => (
                  <Animated.View
                    key={slot}
                    entering={FadeInDown.delay(index * 30).duration(Animation.fast)}
                  >
                    <Pressable
                      style={[
                        styles.slotButton,
                        {
                          backgroundColor:
                            selectedTime === slot ? theme.pureBlack : theme.backgroundDefault,
                        },
                      ]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedTime(slot);
                      }}
                    >
                      <ThemedText
                        style={[
                          styles.slotText,
                          { color: selectedTime === slot ? theme.pureWhite : theme.text },
                        ]}
                      >
                        {formatTime(slot)}
                      </ThemedText>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        ) : null}
      </ScrollView>

      {selectedDate && selectedTime ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.backgroundRoot,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleContinue}
          >
            <ThemedText style={[styles.continueButtonText, { color: theme.pureWhite }]}>
              Continue
            </ThemedText>
            <Feather name="arrow-right" size={20} color={theme.pureWhite} />
          </Pressable>
        </View>
      ) : null}
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
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  slotButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  slotText: {
    ...Typography.body,
    fontWeight: "500",
  },
  loadingCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  emptyCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.body,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  continueButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
