import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Switch,
  Alert,
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
import { storage, Service } from "@/lib/storage";
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

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  const loadServices = async () => {
    const data = await storage.getServices();
    setServices(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadServices();
    setRefreshing(false);
  };

  const toggleServiceActive = async (serviceId: string, isActive: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await storage.updateService(serviceId, { isActive });
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, isActive } : s))
    );
  };

  const handleDeleteService = (service: Service) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storage.deleteService(service.id);
            loadServices();
          },
        },
      ]
    );
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
          <ThemedText style={styles.headerTitle}>Services</ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("ServiceEditor", {});
            }}
          >
            <Feather name="plus" size={20} color={theme.pureWhite} />
          </Pressable>
        </View>

        {services.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="tool" size={48} color={theme.textTertiary} />
            <ThemedText style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              No services yet
            </ThemedText>
            <ThemedText style={[styles.emptyText, { color: theme.textTertiary }]}>
              Add your first service to start accepting bookings
            </ThemedText>
          </View>
        ) : (
          services.map((service, index) => (
            <Animated.View
              key={service.id}
              entering={FadeInDown.delay(index * 50).duration(Animation.normal)}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  {
                    backgroundColor: theme.backgroundDefault,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  navigation.navigate("ServiceEditor", { serviceId: service.id });
                }}
                onLongPress={() => handleDeleteService(service)}
              >
                <View style={styles.serviceHeader}>
                  <View style={styles.serviceInfo}>
                    <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                    <View style={styles.serviceDetails}>
                      <View style={styles.detailItem}>
                        <Feather name="clock" size={14} color={theme.textSecondary} />
                        <ThemedText style={[styles.detailText, { color: theme.textSecondary }]}>
                          {formatDuration(service.duration)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
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
                  <View style={styles.activeToggle}>
                    <ThemedText style={[styles.toggleLabel, { color: theme.textSecondary }]}>
                      Active
                    </ThemedText>
                    <Switch
                      value={service.isActive}
                      onValueChange={(value) => toggleServiceActive(service.id, value)}
                      trackColor={{ false: theme.fog, true: theme.pureBlack }}
                      thumbColor={theme.pureWhite}
                    />
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.textTertiary} />
                </View>
              </Pressable>
            </Animated.View>
          ))
        )}
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  serviceInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  serviceName: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  serviceDetails: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  detailText: {
    ...Typography.caption,
  },
  servicePrice: {
    fontSize: 32,
    fontWeight: "200",
  },
  serviceDescription: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  activeToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  toggleLabel: {
    ...Typography.caption,
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
