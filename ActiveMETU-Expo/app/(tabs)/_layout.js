import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import { useSession } from 'Utils/auth/ctx';
import { Text, View } from 'react-native';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import HomeIcon from 'Assets/icons/HomeIcon';
import SocialIcon from 'Assets/icons/SocialIcon';
import ProfileIcon from 'Assets/icons/ProfileIcon';
import ActivitiesIcon from 'Assets/icons/ActivitiesIcon';
import ReservationIcon from 'Assets/icons/ReservationIcon';
import ActiveTabIndicator from 'Assets/misc/ActiveTabIndicator';

SplashScreen.preventAutoHideAsync(); // TODO: If I am not wrong, it doesn't work correctly. isLoading is problematic.

export default function AppLayout() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen once the loading is complete
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (tabs) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="home"
      backBehavior="history"
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        unmountOnBlur: true, // Reset the stack state of the tab when it's not visible
        tabBarActiveTintColor: '#FF862A',
        tabBarInactiveTintColor: '#C9C7C5',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <HomeIcon width={size} height={size} color={color} />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -size / 2,
                  }}>
                  <ActiveTabIndicator />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pedometer"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <ActivitiesIcon width={size} height={size} color={color} />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -size / 2,
                  }}>
                  <ActiveTabIndicator />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reservation"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                width: size * 2.7, // Circle size
                height: size * 2.7,
                borderRadius: (size * 2.7) / 2, // Makes it a circle
                backgroundColor: '#FF862A',
                justifyContent: 'center',
                alignItems: 'center',
                top: -15, // Adjust the circle position (a little bit upper than others)
              }}>
              <View
                style={{
                  transform: [{ translateX: size * 0.1 }], // Move the icon to the right
                }}>
                <ReservationIcon width={size} height={size} color="white" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <SocialIcon width={size} height={size} color={color} />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -size / 2,
                  }}>
                  <ActiveTabIndicator />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <ProfileIcon width={size} height={size} color={color} />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -size / 2,
                  }}>
                  <ActiveTabIndicator />
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
