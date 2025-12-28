import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Service, BusinessInfo } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function BookingSelectServiceScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [services, setServices] = useState<Service[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [servicesData, info] = await Promise.all([
      storage.getServices(),
      storage.getBusinessInfo(),
    ]);
    setServices(servicesData.filter((s) => s.isActive));
    setBusinessInfo(info);
  };

  const handleSelectService = (service: Service) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("BookingSelectTime", { serviceId: service.id });
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
          <View style={styles.header}>
            <ThemedText style={styles.businessName}>
              {businessInfo?.name || "AutoDetail Pro"}
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              Select a service to get started
            </ThemedText>
          </View>
        </Animated.View>

        {services.map((service, index) => (
          <Animated.View
            key={service.id}
            entering={FadeInDown.delay(index * 75).duration(Animation.normal)}
          >
            <Pressable
              style={({ pressed }) => [
                styles.serviceCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              onPress={() => handleSelectService(service)}
            >
              <View style={styles.serviceHeader}>
                <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                <ThemedText style={styles.servicePrice}>
                  {formatPrice(service.price)}
                </ThemedText>
              </View>

              {service.description ? (
                <ThemedText
                  style={[styles.serviceDescription, { color: theme.textSecondary }]}
                  numberOfLines={2}
                >
                  {service.description}
                </ThemedText>
              ) : null}

              <View style={styles.serviceFooter}>
                <View style={styles.durationBadge}>
                  <Feather name="clock" size={14} color={theme.textSecondary} />
                  <ThemedText style={[styles.durationText, { color: theme.textSecondary }]}>
                    {formatDuration(service.duration)}
                  </ThemedText>
                </View>
                <View style={[styles.selectButton, { backgroundColor: theme.pureBlack }]}>
                  <ThemedText style={[styles.selectButtonText, { color: theme.pureWhite }]}>
                    Select
                  </ThemedText>
                  <Feather name="arrow-right" size={16} color={theme.pureWhite} />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}

        {services.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="alert-circle" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              No services available
            </ThemedText>
            <ThemedText style={[styles.emptyText, { color: theme.textTertiary }]}>
              This business hasn't added any services yet
            </ThemedText>
          </View>
        ) : null}
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
  header: {
    marginBottom: Spacing.xl,
  },
  businessName: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
  },
  serviceCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  serviceName: {
    ...Typography.h3,
    flex: 1,
    marginRight: Spacing.md,
  },
  servicePrice: {
    fontSize: 40,
    fontWeight: "200",
  },
  serviceDescription: {
    ...Typography.body,
    marginBottom: Spacing.lg,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  durationText: {
    ...Typography.body,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  selectButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  emptyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing["4xl"],
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
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
