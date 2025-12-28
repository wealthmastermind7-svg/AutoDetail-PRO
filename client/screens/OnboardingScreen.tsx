import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  ViewToken,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  SlideInUp,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { useNavigation, CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface OnboardingPage {
  id: string;
}

const pages: OnboardingPage[] = [{ id: "1" }, { id: "2" }, { id: "3" }];

function OnboardingPage1() {
  const { theme } = useTheme();

  return (
    <View style={styles.pageContainer}>
      <View style={styles.page1Header}>
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <ThemedText style={styles.page1Logo}>AUTOPRESTIGE</ThemedText>
        </Animated.View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.page1Content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={SlideInUp.delay(300).springify()}>
          <ThemedText style={styles.page1Subtitle}>PRECISION & PROTECTION</ThemedText>
          <ThemedText style={styles.page1Title}>
            Transforming{"\n"}
            <ThemedText style={styles.page1TitleRegular}>Every Vehicle.</ThemedText>
          </ThemedText>

          <ThemedText style={styles.page1Description}>
            Experience the art of detailing. Book premium ceramic coatings, paint correction, and
            interior restoration effortlessly.
          </ThemedText>

          <View style={styles.page1Dots}>
            <View style={[styles.page1Dot, { width: 32, backgroundColor: theme.pureWhite }]} />
            <View style={[styles.page1Dot, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
            <View style={[styles.page1Dot, { backgroundColor: "rgba(255,255,255,0.3)" }]} />
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={styles.page1Footer}
        entering={SlideInUp.delay(500).springify()}
      >
        <Pressable style={styles.page1BookButton}>
          <ThemedText style={styles.page1BookButtonText}>Book Appointment</ThemedText>
          <View style={styles.page1ArrowCircle}>
            <Feather name="arrow-right" size={20} color={theme.pureWhite} />
          </View>
        </Pressable>

        <View style={styles.page1SecondaryButtons}>
          <Pressable style={styles.page1SecondaryButton}>
            <ThemedText style={styles.page1SecondaryButtonText}>View Services</ThemedText>
          </Pressable>
          <Pressable style={styles.page1SecondaryButton}>
            <ThemedText style={styles.page1SecondaryButtonText}>Gallery</ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.page1SignIn}>
          Already a member?{" "}
          <ThemedText style={styles.page1SignInLink}>Sign in</ThemedText>
        </ThemedText>
      </Animated.View>
    </View>
  );
}

function OnboardingPage2() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={styles.page2ContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.page2Header}>
        <ThemedText style={styles.page2Title}>
          Perfection{"\n"}
          <ThemedText style={styles.page2Subtitle}>in every</ThemedText>
          {"\n"}
          Detail.
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={SlideInUp.delay(300).springify()}
        style={styles.page2ImageContainer}
      >
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGSwhj5tszFo5zg6i9yUgBFZk2oddb3f5bmtF_LBlOFZS-3cm3gzIPoxzAOooRd18aTgRb_4pCI5PHhVxvH6AYS2KzIRKmtwgIIXsc9OCbXi93Wx86rBlNO1cLZRP4uDwh9fGzLZ7bLkC9ZEQJgp29a78YxS0Gy-3ESAZaY1oOTN6QGgOBfwUldksUMTLppT_dpQV8LFAU3jSoRKYY38FWHqCIgWsHj6zRGi",
          }}
          style={styles.page2Image}
        />
        <View style={styles.page2ImageOverlay}>
          <View style={styles.page2ImageLabel}>
            <ThemedText style={styles.page2ImageLabelSmall}>CERAMIC COATING</ThemedText>
            <ThemedText style={styles.page2ImageLabelBig}>Ultimate Protection</ThemedText>
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(400).springify()} style={styles.page2Description}>
        <ThemedText style={styles.page2DescriptionText}>
          Experience automotive care redefined. We transform vehicles with precision engineering
          and artisan craftsmanship.
        </ThemedText>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(500).springify()} style={styles.page2Metrics}>
        <View style={styles.page2MetricCard}>
          <View style={styles.page2MetricCircle}>
            <ThemedText style={styles.page2MetricValue}>98%</ThemedText>
          </View>
          <ThemedText style={styles.page2MetricTitle}>Gloss</ThemedText>
          <ThemedText style={styles.page2MetricSubtitle}>Reflection Index</ThemedText>
        </View>
        <View style={styles.page2MetricCard}>
          <View style={styles.page2MetricCircle}>
            <ThemedText style={styles.page2MetricValue}>5yr</ThemedText>
          </View>
          <ThemedText style={styles.page2MetricTitle}>Durability</ThemedText>
          <ThemedText style={styles.page2MetricSubtitle}>Paint Protection</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(600).springify()} style={styles.page2Services}>
        <View style={styles.page2ServicesHeader}>
          <ThemedText style={styles.page2ServicesTitle}>Signature{"\n"}Services</ThemedText>
          <Pressable>
            <ThemedText style={styles.page2ViewMenu}>View Menu</ThemedText>
          </Pressable>
        </View>

        <View style={styles.page2ServiceCards}>
          <View style={styles.page2ServiceCard}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDja9i6E6c0hMqV01JE-f08JzcDO7nsqLzynsMc3npVU0Xd987WsKpQKfiq6O11FhydXHCU3cmcTHoFHk0_oiOMB9aIRHyQoAuCdk0nRQysUu1wMvLaVqxt-2kdeDNZRZrAJpTGDOp9_qhfrshhL-e0E1VSOpGwamVg9FWkVe8ZRmdC72Y6qsElT5iI8ckK5yqkMcVJiHGCRhgCglOp0Z8XhrbVhaySxRjaMZaalMy5Ah24MIwdTgTpNJD6z0rqoRQSk3VSyBynZiWP",
              }}
              style={styles.page2ServiceImage}
            />
            <View style={styles.page2ServiceInfo}>
              <ThemedText style={styles.page2ServiceName}>Interior Revival</ThemedText>
              <ThemedText style={styles.page2ServiceDesc}>
                Deep cleaning of all surfaces, leather conditioning, and odor elimination.
              </ThemedText>
              <View style={styles.page2ServiceFooter}>
                <ThemedText style={styles.page2ServicePrice}>$149</ThemedText>
                <View style={styles.page2ServiceArrow}>
                  <Feather name="arrow-right" size={16} color={theme.pureBlack} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.page2ServiceCard}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvinDpwRnzUb4C9zarWEPWsBoTeVykNu-Sl48ApxhAMyp4FvR2C1PVFeB4vhz1JVsmrf2ToXtKJP8eXykAWKL1kEI7BifpOUrEL36-gjyPgw89y8XDVzKR0F7fbi__S57QT-fRCtrKGkMHDGHSbatWQy_B_kIwIgAHXwnJ7Qu3kmHsicCyvM8PIS_X8UVY8sTF17Sq3bfDeuzZgWvf4QcHi9EInZjQf6gA6b15-sLgyHyuqKX3w2ex7f7cT0axL7VolLkVvLebsd3f",
              }}
              style={styles.page2ServiceImage}
            />
            <View style={styles.page2ServiceInfo}>
              <ThemedText style={styles.page2ServiceName}>Paint Correction</ThemedText>
              <ThemedText style={styles.page2ServiceDesc}>
                Remove swirls, scratches and oxidation to restore showroom shine.
              </ThemedText>
              <View style={styles.page2ServiceFooter}>
                <ThemedText style={styles.page2ServicePrice}>$399</ThemedText>
                <View style={styles.page2ServiceArrow}>
                  <Feather name="arrow-right" size={16} color={theme.pureBlack} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function OnboardingPage3() {
  const { theme } = useTheme();

  return (
    <View style={styles.pageContainer}>
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.page3Header}>
        <ThemedText style={styles.page3Logo}>BookFlow</ThemedText>
        <Pressable>
          <ThemedText style={styles.page3Skip}>Skip</ThemedText>
        </Pressable>
      </Animated.View>

      <View style={styles.page3Content}>
        <Animated.View entering={SlideInUp.delay(300).springify()}>
          <ThemedText style={styles.page3Subtitle}>Simply</ThemedText>
          <ThemedText style={styles.page3Title}>Effortless.</ThemedText>
          <ThemedText style={styles.page3Description}>
            Premium detailing appointments booked in seconds. No calls. No wait.
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={SlideInUp.delay(400).springify()}
          style={styles.page3ProcessCard}
        >
          <View style={styles.page3ProcessSteps}>
            <View style={styles.page3Step}>
              <ThemedText style={styles.page3StepNumber}>01</ThemedText>
              <View style={styles.page3StepIcon}>
                <MaterialIcons name="calendar-today" size={20} color={theme.pureBlack} />
              </View>
              <ThemedText style={styles.page3StepLabel}>Pick</ThemedText>
            </View>

            <View style={styles.page3StepDivider} />

            <View style={styles.page3StepCenter}>
              <ThemedText style={styles.page3StepNumber02}>02</ThemedText>
              <View style={styles.page3StepIconCenter}>
                <MaterialIcons name="check" size={24} color={theme.pureWhite} />
              </View>
              <ThemedText style={styles.page3StepLabelCenter}>Confirm</ThemedText>
            </View>

            <View style={styles.page3StepDivider} />

            <View style={styles.page3Step}>
              <ThemedText style={styles.page3StepNumber}>03</ThemedText>
              <View style={styles.page3StepIcon}>
                <MaterialIcons name="auto-awesome" size={20} color={theme.pureBlack} />
              </View>
              <ThemedText style={styles.page3StepLabel}>Shine</ThemedText>
            </View>
          </View>

          <View style={styles.page3AvatarBadge}>
            <View style={styles.page3Avatars}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwEJ1CCwrw0iNFGBBcOQpr-pgsBbHgOXF7dIfy88M_jn8sbU1-EcSzy2S9cNCurGu9CId3ejLwU1eju0bEaEYXbFBlt0o37hvl_Pjs264Ow-W88GQeeYrpCVxfkkeF18x3rMToSs7D6lA9EVjVsQNJwJ9StrTP6cfrV9LgCrZfklN9A5IFcu6zlevEirJ6AFPYG6K41gQ1JALQJhvUdz0a6dmeqOt2kS1UXb81iz6-mGRfAY3aTSf33VRbYgREFGbxSO7kmFRkxzVs",
                }}
                style={styles.page3Avatar}
              />
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmvFa3cHpf623RHB6xk0bEXryQJAc8bc-hmW3-R2Gw5uwkftfD6fzSAXNibG6xbvriZ4Opb-uT9SEyX1Ikb-EgDOzzi727RiRBapyegL9xt_EBOA403UJkVPhOuPX-KwyhYYpImtTKk0ch1qjTJ3cRYSRR8XY5Ma6ZuyN4Pqs7j4wjeFhHAai_sqRt3Phah1fCav_jed7x3JXrxtTJLvKN3-S4BWfUSH55c2GdE4-9tx55JTEsdnINaUgYsFQwyKIeUYslKDCOht9h",
                }}
                style={styles.page3Avatar}
              />
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWvrRZfiXOuNfXR77Rb0iCsiDZHfC0Z6DsmUXCweDXxZpQP8a6UEqJl0QtinABf3fnXtkk54kyS1op-zdLSiPE-ZoA2YY5GZkp3hxlEf5z2LnJx0ZDV0FqFY-iDuf5mPWtmnkiJa2gzi3pmnUTCD4nJhEiES45LTCv5WWFQZtwy4UNN2vZR664Kr6CkeL3GEZ2O6em-z1pM46Ac4qLRpJZsunFODoYhKTRpdfXlcUiONSo8V1JQvZD__8YUZYSqo7brm_DsFnutwyh",
                }}
                style={styles.page3Avatar}
              />
            </View>
            <ThemedText style={styles.page3BookingsBadge}>10k+ Bookings</ThemedText>
          </View>
        </Animated.View>
      </View>

      <Animated.View
        entering={SlideInUp.delay(500).springify()}
        style={styles.page3Footer}
      >
        <Pressable style={styles.page3Button}>
          <ThemedText style={styles.page3ButtonText}>Get Started</ThemedText>
          <Feather name="arrow-right" size={18} color={theme.pureWhite} />
        </Pressable>

        <Pressable>
          <ThemedText style={styles.page3SecondaryText}>View Demo Services</ThemedText>
        </Pressable>

        <View style={styles.page3ProgressDots}>
          <View style={[styles.page3ProgressDot, { width: 8, height: 8 }]} />
          <View style={[styles.page3ProgressDot, { width: 32, height: 8 }]} />
          <View style={[styles.page3ProgressDot, { width: 8, height: 8 }]} />
        </View>
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
    const PageComponent =
      index === 0 ? OnboardingPage1 : index === 1 ? OnboardingPage2 : OnboardingPage3;

    return (
      <View style={[styles.slideContainer, { width }]}>
        <PageComponent />
      </View>
    );
  };

  return (
    <ThemedView style={[styles.container]}>
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
        scrollEventThrottle={16}
      />

      {currentPage < pages.length && (
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              { backgroundColor: theme.pureBlack, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleNext}
          >
            <ThemedText style={[styles.nextButtonText, { color: theme.pureWhite }]}>
              {currentPage === pages.length - 1 ? "Get Started" : "Next"}
            </ThemedText>
          </Pressable>

          <Pressable style={styles.skipLink} onPress={handleSkip}>
            <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>
              Skip
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
  },

  // Page 1 Styles
  pageContainer: {
    flex: 1,
  },
  page1Header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  page1Logo: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
  page1Content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  page1Subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  page1Title: {
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 64,
    marginBottom: Spacing.xl,
  },
  page1TitleRegular: {
    fontWeight: "400",
  },
  page1Description: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    marginBottom: Spacing["2xl"],
    opacity: 0.8,
  },
  page1Dots: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing["3xl"],
  },
  page1Dot: {
    height: 4,
    borderRadius: 2,
  },
  page1Footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  page1BookButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: 32,
    height: 56,
  },
  page1BookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  page1ArrowCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  page1SecondaryButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  page1SecondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    alignItems: "center",
  },
  page1SecondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  page1SignIn: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.6,
  },
  page1SignInLink: {
    fontWeight: "600",
    opacity: 1,
  },

  // Page 2 Styles
  page2ContentContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  page2Header: {
    marginBottom: Spacing["3xl"],
  },
  page2Title: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 52,
    marginBottom: Spacing.md,
  },
  page2Subtitle: {
    fontSize: 32,
    fontWeight: "300",
    fontStyle: "italic",
  },
  page2ImageContainer: {
    width: "100%",
    height: 320,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  page2Image: {
    width: "100%",
    height: "100%",
  },
  page2ImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: Spacing.xl,
  },
  page2ImageLabel: {
    gap: Spacing.xs,
  },
  page2ImageLabelSmall: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.8)",
  },
  page2ImageLabelBig: {
    fontSize: 20,
    fontWeight: "400",
    fontStyle: "italic",
    color: "#FFFFFF",
  },
  page2Description: {
    marginBottom: Spacing["2xl"],
  },
  page2DescriptionText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    opacity: 0.8,
  },
  page2Metrics: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing["3xl"],
  },
  page2MetricCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  page2MetricCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  page2MetricValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  page2MetricTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  page2MetricSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  page2Services: {
    marginBottom: Spacing.xl,
  },
  page2ServicesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Spacing.lg,
  },
  page2ServicesTitle: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  page2ViewMenu: {
    fontSize: 14,
    fontWeight: "500",
    borderBottomWidth: 1,
    paddingBottom: Spacing.xs,
  },
  page2ServiceCards: {
    gap: Spacing.lg,
  },
  page2ServiceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  page2ServiceImage: {
    width: "100%",
    height: 160,
  },
  page2ServiceInfo: {
    padding: Spacing.lg,
  },
  page2ServiceName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  page2ServiceDesc: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    opacity: 0.7,
    marginBottom: Spacing.lg,
  },
  page2ServiceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  page2ServicePrice: {
    fontSize: 18,
    fontWeight: "600",
  },
  page2ServiceArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Page 3 Styles
  page3Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  page3Logo: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  page3Skip: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
  page3Content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing["2xl"],
  },
  page3Subtitle: {
    fontSize: 28,
    fontWeight: "300",
    fontStyle: "italic",
    opacity: 0.7,
  },
  page3Title: {
    fontSize: 56,
    fontWeight: "700",
    lineHeight: 64,
    marginBottom: Spacing.lg,
  },
  page3Description: {
    fontSize: 16,
    fontWeight: "300",
    lineHeight: 24,
    opacity: 0.8,
  },
  page3ProcessCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  page3ProcessSteps: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  page3Step: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
  },
  page3StepDivider: {
    height: 1,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: Spacing.sm,
  },
  page3StepNumber: {
    fontSize: 20,
    fontWeight: "700",
    opacity: 0.4,
  },
  page3StepNumber02: {
    fontSize: 28,
    fontWeight: "700",
  },
  page3StepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  page3StepCenter: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: -24,
  },
  page3StepIconCenter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  page3StepLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 0.5,
    textTransform: "uppercase",
  },
  page3StepLabelCenter: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    opacity: 1,
    textTransform: "uppercase",
  },
  page3AvatarBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  page3Avatars: {
    flexDirection: "row",
    marginLeft: -8,
  },
  page3Avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginLeft: -8,
  },
  page3BookingsBadge: {
    fontSize: 12,
    fontWeight: "600",
  },
  page3Footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  page3Button: {
    backgroundColor: "#000000",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    height: 56,
  },
  page3ButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  page3SecondaryText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.7,
  },
  page3ProgressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  page3ProgressDot: {
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // Bottom Navigation
  bottomNav: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  nextButton: {
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  skipLink: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
