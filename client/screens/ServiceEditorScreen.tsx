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
import Animated, { FadeIn } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography, Animation } from "@/constants/theme";
import { storage, Service } from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, "ServiceEditor">;

export default function ServiceEditorScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { serviceId } = route.params || {};

  const isEditing = !!serviceId;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? "Edit Service" : "New Service",
    });
  }, [isEditing, navigation]);

  const loadService = async () => {
    const services = await storage.getServices();
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setDuration(String(service.duration));
      setPrice(String(service.price / 100));
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a service name");
      return;
    }
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert("Error", "Please enter a valid duration");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);

    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      duration: parseInt(duration),
      price: Math.round(parseFloat(price) * 100),
      isActive: true,
    };

    try {
      if (isEditing && serviceId) {
        await storage.updateService(serviceId, serviceData);
      } else {
        await storage.addService(serviceData);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!serviceId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Delete Service",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storage.deleteService(serviceId);
            navigation.goBack();
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
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(Animation.cinematic)}>
          <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Service Name
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Full Detail"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Description
              </ThemedText>
              <TextInput
                style={[
                  styles.textArea,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what's included in this service..."
                placeholderTextColor={theme.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Duration (minutes)
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundSecondary, color: theme.text },
                  ]}
                  value={duration}
                  onChangeText={setDuration}
                  placeholder="60"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="number-pad"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={[styles.inputLabel, { color: theme.textSecondary }]}>
                  Price ($)
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: theme.backgroundSecondary, color: theme.text },
                  ]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="75"
                  placeholderTextColor={theme.textTertiary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: theme.pureBlack, opacity: pressed || saving ? 0.8 : 1 },
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Feather name="check" size={20} color={theme.pureWhite} />
            <ThemedText style={[styles.saveButtonText, { color: theme.pureWhite }]}>
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Service"}
            </ThemedText>
          </Pressable>

          {isEditing ? (
            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                { backgroundColor: theme.error + "15", opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleDelete}
            >
              <Feather name="trash-2" size={20} color={theme.error} />
              <ThemedText style={[styles.deleteButtonText, { color: theme.error }]}>
                Delete Service
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
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
  textArea: {
    height: 120,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    ...Typography.body,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  saveButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
  },
  deleteButtonText: {
    ...Typography.body,
    fontWeight: "600",
  },
});
