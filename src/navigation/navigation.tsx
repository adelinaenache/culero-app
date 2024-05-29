import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { BottomNavigator } from "./BottomTabNavigator";
import { AuthStackNavigator } from "./AuthStack";
import { useUser } from "../hooks";
import { EmailVerificationSuccess } from "../screens/AuthScreens";
import { AuthHeader } from "../components";
import { DrawerNavigator } from "./DrawerNavigation";
import { OnboardingScreen } from "../screens/OnboardingScreen/OnboardingScreen";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import { useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { addPushToken } from "../utils/api";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const user = useUser();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  React.useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          addPushToken(token);
        }
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    }
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="AuthNav" component={AuthStackNavigator} />
        </>
      )}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen
        name="EmailVerificationSuccess"
        component={EmailVerificationSuccess}
        options={{
          headerShown: true,
          contentStyle: {
            backgroundColor: "#ffffff",
          },

          header: () => <AuthHeader />,
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
