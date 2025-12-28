import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { useNavigation, CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

interface OnboardingPage {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
  features: string[];
}

const pages: OnboardingPage[] = [
  {
    id: "1",
    title: "Detailing Made\nEffortless",
    subtitle: "Manage your auto detailing business with ease",
    icon: "droplet",
    features: ["Track daily goals", "Manage client list", "Calendar scheduling"],
  },
  {
    id: "2",
    title: "Built for How\nYou Work",
    subtitle: "Designed for every type of detailing business",
    icon: "tool",
    features: ["Mobile Detailing", "Fixed Location", "Fleet Services", "Ceramic Specialists"],
  },
  {
    id: "3",
    title: "Every Appointment\nCaptured",
    subtitle: "Never miss a booking again",
    icon: "calendar",
    features: ["Instant booking", "Customer details", "Service history", "Revenue tracking"],
  },
];

function OnboardingPage1() {
  const { theme } = useTheme();

  return (
    <View style={styles.pageContent}>
      <Animated.View
        entering={FadeIn.delay(200).duration(Animation.cinematic)}
        style={[styles.heroCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <BlurView intensity={20} tint="light" style={styles.glassOverlay}>
          <View style={styles.goalMeter}>
            <View style={[styles.goalCircle, { borderColor: theme.pureBlack }]}>
              <ThemedText style={styles.goalPercent}>85%</ThemedText>
              <ThemedText style={[styles.goalLabel, { color: theme.textSecondary }]}>
                Daily Goal
              </ThemedText>
            </View>
          </View>
          <View style={styles.previewList}>
            {["John S.", "Sarah M.", "Mike W."].map((name, index) => (
              <Animated.View
                key={name}
                entering={SlideInRight.delay(400 + index * 100).springify()}
                style={[styles.previewItem, { backgroundColor: theme.backgroundSecondary }]}
              >
                <View style={[styles.avatar, { backgroundColor: theme.pureBlack }]}>
                  <Feather name="user" size={16} color={theme.pureWhite} />
                </View>
                <ThemedText style={styles.previewName}>{name}</ThemedText>
                <View style={[styles.newBadge, { backgroundColor: theme.pureBlack }]}>
                  <ThemedText style={[styles.badgeText, { color: theme.pureWhite }]}>
                    New
                  </ThemedText>
                </View>
              </Animated.View>
            ))}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

function OnboardingPage2() {
  const { theme } = useTheme();
  const chips = ["Mobile Detailing", "Fixed Location", "Fleet Services", "Ceramic Specialists"];

  return (
    <View style={styles.pageContent}>
      <View style={styles.chipContainer}>
        {chips.map((chip, index) => (
          <Animated.View
            key={chip}
            entering={FadeIn.delay(300 + index * 150).springify()}
            style={[
              styles.chip,
              {
                backgroundColor: index % 2 === 0 ? theme.pureBlack : theme.backgroundDefault,
                borderColor: theme.pureBlack,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.chipText,
                { color: index % 2 === 0 ? theme.pureWhite : theme.pureBlack },
              ]}
            >
              {chip}
            </ThemedText>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

function OnboardingPage3() {
  const { theme } = useTheme();

  return (
    <View style={styles.pageContent}>
      <Animated.View
        entering={FadeIn.delay(200).duration(Animation.cinematic)}
        style={[styles.bookingCard, { backgroundColor: theme.backgroundDefault }]}
      >
        <BlurView intensity={20} tint="light" style={styles.glassOverlay}>
          <View style={styles.bookingHeader}>
            <View style={[styles.calendarChip, { backgroundColor: theme.pureBlack }]}>
              <Feather name="calendar" size={14} color={theme.pureWhite} />
              <ThemedText style={[styles.calendarText, { color: theme.pureWhite }]}>
                Tomorrow
              </ThemedText>
            </View>
            <ThemedText style={[styles.bookingTime, { color: theme.textSecondary }]}>
              10:00 AM
            </ThemedText>
          </View>
          <ThemedText style={styles.customerName}>Sarah Johnson</ThemedText>
          <ThemedText style={[styles.serviceName, { color: theme.textSecondary }]}>
            Full Detail - Tesla Model 3
          </ThemedText>
          <View style={styles.priceRow}>
            <ThemedText style={styles.priceLabel}>Total</ThemedText>
            <ThemedText style={styles.priceValue}>$150</ThemedText>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { completeOnboarding } = useOnboarding();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentPage < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    } else {
      await completeOnboarding();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Admin" }],
        })
      );
    }
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Admin" }],
      })
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }).current;

  const renderPage = ({ item, index }: { item: OnboardingPage; index: number }) => {
    const PageContent = index === 0 ? OnboardingPage1 : index === 1 ? OnboardingPage2 : OnboardingPage3;

    return (
      <View style={[styles.page, { width }]}>
        <View style={styles.titleContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.pureBlack }]}>
            <Feather name={item.icon} size={32} color={theme.pureWhite} />
          </View>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {item.subtitle}
          </ThemedText>
        </View>
        <PageContent />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        contentContainerStyle={{ paddingTop: insets.top + Spacing["3xl"] }}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentPage ? theme.pureBlack : theme.fog,
                  width: index === currentPage ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleNext}
        >
          <ThemedText style={[styles.buttonText, { color: theme.pureWhite }]}>
            {currentPage === pages.length - 1 ? "Get Started" : "Next"}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>
            Skip
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    textAlign: "center",
  },
  pageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  glassOverlay: {
    padding: Spacing.xl,
  },
  goalMeter: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  goalCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  goalPercent: {
    ...Typography.h2,
  },
  goalLabel: {
    ...Typography.caption,
  },
  previewList: {
    gap: Spacing.md,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  previewName: {
    ...Typography.body,
    flex: 1,
  },
  newBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  chip: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    ...Typography.body,
    fontWeight: "500",
  },
  bookingCard: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  calendarChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  calendarText: {
    ...Typography.caption,
    fontWeight: "600",
  },
  bookingTime: {
    ...Typography.body,
  },
  customerName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  serviceName: {
    ...Typography.body,
    marginBottom: Spacing.xl,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    ...Typography.body,
  },
  priceValue: {
    ...Typography.h2,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  skipButton: {
    alignItems: "center",
    padding: Spacing.md,
  },
  skipText: {
    ...Typography.body,
  },
});
