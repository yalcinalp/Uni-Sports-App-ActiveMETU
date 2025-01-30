import { Stack } from 'expo-router/stack';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import BackButonIcon from 'Assets/misc/BackButtonIcon';
import SettingsIcon from 'Assets/icons/SettingsIcon';
import SearchIcon from 'Assets/icons/SearchIcon';

export default function ProfileLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <BackButonIcon
                name="left"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <SearchIcon />
              <Pressable onPress={() => router.navigate('profile/settings')}>
                <SettingsIcon color="black" />
              </Pressable>
            </View>
          ),
          title: 'Profile',
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="settings"
          options={{
            headerBackImageSource: () => <BackButonIcon />,
            headerShown: false, // Header of the Settings screen is going to be shown, hide Profile layout's header.
          }}
        />
      </Stack>
    </View>
  );
}
