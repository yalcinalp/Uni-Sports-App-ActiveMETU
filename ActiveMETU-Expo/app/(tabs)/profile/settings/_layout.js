import { Stack } from 'expo-router/stack';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import BackButtonIcon from 'Assets/misc/BackButtonIcon';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <BackButtonIcon style={{ marginRight: 10 }} />
          </Pressable>
        ),
        title: 'Settings',
      }}
    />
  );
}
