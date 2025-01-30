import { Stack, router } from 'expo-router';
import { Pressable } from 'react-native';
import BackButtonIcon from 'Assets/misc/BackButtonIcon';
import ActiveNotificationIcon from 'Assets/icons/ActiveNotificationIcon';
import SearchIcon from 'Assets/icons/SearchIcon';
import { View } from 'react-native';

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Notifications',
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <BackButtonIcon style={{ marginRight: 10 }} />
          </Pressable>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {/* TODO: Should there be a search icon here?*/}
            <SearchIcon />
            <Pressable onPress={() => router.navigate('/notifications')}>
              <ActiveNotificationIcon color="#A6EC4C" />
            </Pressable>
          </View>
        ),
      }}
    />
  );
}
