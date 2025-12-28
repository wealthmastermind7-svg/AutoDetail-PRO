import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminTabNavigator from "@/navigation/AdminTabNavigator";
import OnboardingScreen from "@/screens/OnboardingScreen";
import ServiceEditorScreen from "@/screens/ServiceEditorScreen";
import CustomerDetailScreen from "@/screens/CustomerDetailScreen";
import AvailabilityEditorScreen from "@/screens/AvailabilityEditorScreen";
import BookingSelectServiceScreen from "@/screens/BookingSelectServiceScreen";
import BookingSelectTimeScreen from "@/screens/BookingSelectTimeScreen";
import BookingCheckoutScreen from "@/screens/BookingCheckoutScreen";
import BookingConfirmationScreen from "@/screens/BookingConfirmationScreen";
import QRCodeScreen from "@/screens/QRCodeScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useOnboarding } from "@/hooks/useOnboarding";

export type RootStackParamList = {
  Onboarding: undefined;
  Admin: undefined;
  ServiceEditor: { serviceId?: string };
  CustomerDetail: { customerId: string };
  AvailabilityEditor: undefined;
  BookingSelectService: undefined;
  BookingSelectTime: { serviceId: string };
  BookingCheckout: { serviceId: string; date: string; time: string };
  BookingConfirmation: { bookingId: string };
  QRCode: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { hasCompletedOnboarding, isLoading } = useOnboarding();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
      ) : null}
      <Stack.Screen
        name="Admin"
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceEditor"
        component={ServiceEditorScreen}
        options={{
          presentation: "modal",
          headerTitle: "Edit Service",
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          headerTitle: "Customer",
        }}
      />
      <Stack.Screen
        name="AvailabilityEditor"
        component={AvailabilityEditorScreen}
        options={{
          presentation: "modal",
          headerTitle: "Business Hours",
        }}
      />
      <Stack.Screen
        name="BookingSelectService"
        component={BookingSelectServiceScreen}
        options={{
          headerTitle: "Select Service",
        }}
      />
      <Stack.Screen
        name="BookingSelectTime"
        component={BookingSelectTimeScreen}
        options={{
          headerTitle: "Select Time",
        }}
      />
      <Stack.Screen
        name="BookingCheckout"
        component={BookingCheckoutScreen}
        options={{
          headerTitle: "Checkout",
        }}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          presentation: "modal",
          headerTitle: "QR Code",
        }}
      />
    </Stack.Navigator>
  );
}
