import { Stack } from 'expo-router/stack';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import BackButtonIcon from 'Assets/misc/BackButtonIcon';
import SearchIcon from 'Assets/icons/SearchIcon';
import NotificationIcon from 'Assets/icons/NotificationIcon';

export default function ReservationLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack initialRouteName="index">
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'Reservation',
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <BackButtonIcon style={{ marginRight: 10 }} />
              </Pressable>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <SearchIcon />
                <Pressable onPress={() => router.navigate('/notifications')}>
                  <NotificationIcon />
                </Pressable>
              </View>
            ),
          }}
        />
      </Stack>
    </View>
  );
}
