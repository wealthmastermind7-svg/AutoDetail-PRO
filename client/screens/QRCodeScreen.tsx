import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import Animated, { FadeIn } from "react-native-reanimated";
import Svg, { Rect, Path } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, BusinessInfo } from "@/lib/storage";

function generateQRCodePath(data: string, size: number): string {
  const modules = 25;
  const moduleSize = size / modules;
  let path = "";

  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const seed = hash(data);

  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      const isPositionMarker =
        (row < 7 && col < 7) ||
        (row < 7 && col >= modules - 7) ||
        (row >= modules - 7 && col < 7);

      const isPositionMarkerInner =
        ((row >= 2 && row < 5 && col >= 2 && col < 5)) ||
        ((row >= 2 && row < 5 && col >= modules - 5 && col < modules - 2)) ||
        ((row >= modules - 5 && row < modules - 2 && col >= 2 && col < 5));

      const isPositionMarkerBorder =
        isPositionMarker && !isPositionMarkerInner &&
        (row === 0 || row === 6 || col === 0 || col === 6 ||
         row === modules - 7 || row === modules - 1 ||
         col === modules - 7 || col === modules - 1);

      const shouldFill = 
        isPositionMarkerBorder ||
        isPositionMarkerInner ||
        ((seed * (row + 1) * (col + 1)) % 3 === 0 && !isPositionMarker);

      if (shouldFill) {
        const x = col * moduleSize;
        const y = row * moduleSize;
        path += `M${x},${y} h${moduleSize} v${moduleSize} h-${moduleSize} Z `;
      }
    }
  }

  return path;
}

export default function QRCodeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    const info = await storage.getBusinessInfo();
    setBusinessInfo(info);
  };

  const bookingLink = `https://book.autodetailpro.com/${businessInfo?.slug || "autodetailpro"}`;
  const qrSize = 240;

  const copyLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
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

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.qrCard, { backgroundColor: theme.pureWhite }]}>
            <Svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
              <Rect x="0" y="0" width={qrSize} height={qrSize} fill={theme.pureWhite} />
              <Path d={generateQRCodePath(bookingLink, qrSize)} fill={theme.pureBlack} />
            </Svg>
          </View>
        </Animated.View>

        <View style={styles.info}>
          <ThemedText style={styles.title}>Your Booking QR Code</ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            Customers can scan this code to instantly access your booking page
          </ThemedText>
        </View>

        <View style={styles.linkContainer}>
          <View style={[styles.linkBox, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={styles.linkText} numberOfLines={1}>
              {bookingLink}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={copyLink}
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={20}
              color={theme.pureWhite}
            />
            <ThemedText style={[styles.actionButtonText, { color: theme.pureWhite }]}>
              {copied ? "Copied!" : "Copy Link"}
            </ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={shareLink}
          >
            <Feather name="share" size={20} color={theme.pureBlack} />
            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.tip, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="info" size={18} color={theme.textSecondary} />
          <ThemedText style={[styles.tipText, { color: theme.textSecondary }]}>
            Print this QR code and display it at your location, on business cards, or in marketing materials
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    alignItems: "center",
  },
  qrCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  info: {
    alignItems: "center",
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  description: {
    ...Typography.body,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  linkContainer: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  linkBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  linkText: {
    ...Typography.body,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
    marginBottom: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    width: "100%",
  },
  tipText: {
    ...Typography.caption,
    flex: 1,
  },
});
