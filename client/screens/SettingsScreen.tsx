import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, BusinessInfo } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "AutoDetail Pro",
    phone: "",
    email: "",
    website: "",
    address: "",
    slug: "autodetailpro",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    const info = await storage.getBusinessInfo();
    setBusinessInfo(info);
  };

  const updateField = async (field: keyof BusinessInfo, value: string) => {
    const updated = { ...businessInfo, [field]: value };
    setBusinessInfo(updated);
    await storage.setBusinessInfo(updated);
  };

  const bookingLink = `https://book.autodetailpro.com/${businessInfo.slug}`;

  const copyBookingLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareBookingLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Book your auto detailing appointment: ${bookingLink}`,
        url: bookingLink,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const loadDemoData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Load Demo Data",
      "This will add sample customers and bookings. Existing data will be preserved.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Demo",
          onPress: async () => {
            await storage.loadDemoData();
            Alert.alert("Success", "Demo data has been loaded!");
          },
        },
      ]
    );
  };

  const clearAllData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all services, customers, and bookings. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            await storage.clearAllData();
            Alert.alert("Success", "All data has been cleared.");
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>

        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Business Information
          </ThemedText>
          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Business Name
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={businessInfo.name}
                onChangeText={(value) => updateField("name", value)}
                placeholder="Enter business name"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Phone
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={businessInfo.phone}
                onChangeText={(value) => updateField("phone", value)}
                placeholder="(555) 123-4567"
                placeholderTextColor={theme.textTertiary}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Email
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={businessInfo.email}
                onChangeText={(value) => updateField("email", value)}
                placeholder="contact@business.com"
                placeholderTextColor={theme.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Website
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={businessInfo.website}
                onChangeText={(value) => updateField("website", value)}
                placeholder="www.yourbusiness.com"
                placeholderTextColor={theme.textTertiary}
                autoCapitalize="none"
              />
            </View>
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Address
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={businessInfo.address}
                onChangeText={(value) => updateField("address", value)}
                placeholder="123 Main Street, City, State"
                placeholderTextColor={theme.textTertiary}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(Animation.cinematic)}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Sharing Tools
          </ThemedText>
          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.linkContainer}>
              <ThemedText style={[styles.linkLabel, { color: theme.textSecondary }]}>
                Your Booking Link
              </ThemedText>
              <ThemedText style={styles.linkText} numberOfLines={1}>
                {bookingLink}
              </ThemedText>
            </View>
            <View style={styles.buttonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={copyBookingLink}
              >
                <Feather
                  name={copied ? "check" : "copy"}
                  size={18}
                  color={theme.pureWhite}
                />
                <ThemedText style={[styles.actionButtonText, { color: theme.pureWhite }]}>
                  {copied ? "Copied!" : "Copy Link"}
                </ThemedText>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={shareBookingLink}
              >
                <Feather name="share" size={18} color={theme.pureBlack} />
                <ThemedText style={styles.actionButtonText}>Share</ThemedText>
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.qrButton,
                {
                  backgroundColor: theme.backgroundSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("QRCode");
              }}
            >
              <Feather name="maximize" size={20} color={theme.pureBlack} />
              <ThemedText style={styles.qrButtonText}>Generate QR Code</ThemedText>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(Animation.cinematic)}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Data Management
          </ThemedText>
          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <Pressable
              style={({ pressed }) => [
                styles.dataButton,
                {
                  backgroundColor: theme.backgroundSecondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={loadDemoData}
            >
              <View style={styles.dataButtonContent}>
                <Feather name="database" size={20} color={theme.pureBlack} />
                <View style={styles.dataButtonText}>
                  <ThemedText style={styles.dataButtonTitle}>Load Demo Data</ThemedText>
                  <ThemedText style={[styles.dataButtonSubtitle, { color: theme.textSecondary }]}>
                    Add sample customers and bookings
                  </ThemedText>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textTertiary} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.dataButton,
                {
                  backgroundColor: theme.error + "10",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={clearAllData}
            >
              <View style={styles.dataButtonContent}>
                <Feather name="trash-2" size={20} color={theme.error} />
                <View style={styles.dataButtonText}>
                  <ThemedText style={[styles.dataButtonTitle, { color: theme.error }]}>
                    Clear All Data
                  </ThemedText>
                  <ThemedText style={[styles.dataButtonSubtitle, { color: theme.textSecondary }]}>
                    Permanently delete all data
                  </ThemedText>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={theme.textTertiary} />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(Animation.cinematic)}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            Test Booking Flow
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.testButton,
              { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("BookingSelectService");
            }}
          >
            <Feather name="external-link" size={20} color={theme.pureWhite} />
            <ThemedText style={[styles.testButtonText, { color: theme.pureWhite }]}>
              Preview Public Booking
            </ThemedText>
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
  },
  headerTitle: {
    ...Typography.h2,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
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
  linkContainer: {
    marginBottom: Spacing.lg,
  },
  linkLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  linkText: {
    ...Typography.body,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: 48,
    borderRadius: BorderRadius.sm,
  },
  qrButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  dataButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  dataButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  dataButtonText: {
    gap: Spacing.xs,
  },
  dataButtonTitle: {
    ...Typography.body,
    fontWeight: "600",
  },
  dataButtonSubtitle: {
    ...Typography.caption,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  testButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
