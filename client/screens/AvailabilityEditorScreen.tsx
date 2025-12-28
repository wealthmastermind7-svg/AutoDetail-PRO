import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Availability } from "@/lib/storage";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return { value: `${hour.toString().padStart(2, "0")}:00`, label: `${displayHour}:00 ${ampm}` };
});

export default function AvailabilityEditorScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    const data = await storage.getAvailability();
    setAvailability(data);
  };

  const toggleDayActive = async (dayOfWeek: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const day = availability.find((a) => a.dayOfWeek === dayOfWeek);
    if (day) {
      await storage.updateDayAvailability(dayOfWeek, { isActive: !day.isActive });
      setAvailability((prev) =>
        prev.map((a) =>
          a.dayOfWeek === dayOfWeek ? { ...a, isActive: !a.isActive } : a
        )
      );
    }
  };

  const updateTime = async (dayOfWeek: number, field: "startTime" | "endTime", value: string) => {
    Haptics.selectionAsync();
    await storage.updateDayAvailability(dayOfWeek, { [field]: value });
    setAvailability((prev) =>
      prev.map((a) =>
        a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a
      )
    );
  };

  const formatTime = (time: string) => {
    const [hours] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

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
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            Set your business hours for each day of the week. Customers can only book during active hours.
          </ThemedText>
        </Animated.View>

        {availability.map((day, index) => (
          <Animated.View
            key={day.dayOfWeek}
            entering={FadeInDown.delay(index * 50).duration(Animation.normal)}
          >
            <View style={[styles.dayCard, { backgroundColor: theme.backgroundDefault }]}>
              <Pressable
                style={styles.dayHeader}
                onPress={() => {
                  Haptics.selectionAsync();
                  setExpandedDay(expandedDay === day.dayOfWeek ? null : day.dayOfWeek);
                }}
              >
                <View style={styles.dayInfo}>
                  <ThemedText style={styles.dayName}>{DAYS[day.dayOfWeek]}</ThemedText>
                  {day.isActive ? (
                    <ThemedText style={[styles.hoursText, { color: theme.textSecondary }]}>
                      {formatTime(day.startTime)} - {formatTime(day.endTime)}
                    </ThemedText>
                  ) : (
                    <ThemedText style={[styles.closedText, { color: theme.textTertiary }]}>
                      Closed
                    </ThemedText>
                  )}
                </View>
                <View style={styles.dayActions}>
                  <Switch
                    value={day.isActive}
                    onValueChange={() => toggleDayActive(day.dayOfWeek)}
                    trackColor={{ false: theme.fog, true: theme.pureBlack }}
                    thumbColor={theme.pureWhite}
                  />
                  <Feather
                    name={expandedDay === day.dayOfWeek ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.textTertiary}
                  />
                </View>
              </Pressable>

              {expandedDay === day.dayOfWeek && day.isActive ? (
                <View style={styles.expandedContent}>
                  <View style={styles.timeRow}>
                    <ThemedText style={[styles.timeLabel, { color: theme.textSecondary }]}>
                      Opens
                    </ThemedText>
                    <View style={styles.timeOptions}>
                      {TIME_OPTIONS.filter((t) => parseInt(t.value) < 12).map((option) => (
                        <Pressable
                          key={option.value}
                          style={[
                            styles.timeChip,
                            {
                              backgroundColor:
                                day.startTime === option.value
                                  ? theme.pureBlack
                                  : theme.backgroundSecondary,
                            },
                          ]}
                          onPress={() => updateTime(day.dayOfWeek, "startTime", option.value)}
                        >
                          <ThemedText
                            style={[
                              styles.timeChipText,
                              {
                                color:
                                  day.startTime === option.value
                                    ? theme.pureWhite
                                    : theme.text,
                              },
                            ]}
                          >
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={styles.timeRow}>
                    <ThemedText style={[styles.timeLabel, { color: theme.textSecondary }]}>
                      Closes
                    </ThemedText>
                    <View style={styles.timeOptions}>
                      {TIME_OPTIONS.filter((t) => parseInt(t.value) >= 12).map((option) => (
                        <Pressable
                          key={option.value}
                          style={[
                            styles.timeChip,
                            {
                              backgroundColor:
                                day.endTime === option.value
                                  ? theme.pureBlack
                                  : theme.backgroundSecondary,
                            },
                          ]}
                          onPress={() => updateTime(day.dayOfWeek, "endTime", option.value)}
                        >
                          <ThemedText
                            style={[
                              styles.timeChipText,
                              {
                                color:
                                  day.endTime === option.value
                                    ? theme.pureWhite
                                    : theme.text,
                              },
                            ]}
                          >
                            {option.label}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          </Animated.View>
        ))}
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
  description: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  dayCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    ...Typography.body,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  hoursText: {
    ...Typography.caption,
  },
  closedText: {
    ...Typography.caption,
  },
  dayActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  expandedContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    gap: Spacing.lg,
  },
  timeRow: {
    gap: Spacing.sm,
  },
  timeLabel: {
    ...Typography.caption,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  timeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  timeChipText: {
    ...Typography.caption,
    fontWeight: "500",
  },
});
