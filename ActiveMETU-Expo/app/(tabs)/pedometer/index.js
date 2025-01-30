import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function PedometerScreen() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [isPermissionGranted, setIsPermissionGranted] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const checkPermission = async () => {
    try {
      const { status } = await Pedometer.requestPermissionsAsync();
      setIsPermissionGranted(status === 'granted' ? 'true' : 'false');
      return status === 'granted';
    } catch (error) {
      console.error('Permission error:', error);
      setIsPermissionGranted('false');
      return false;
    }
  };

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (!isAvailable) {
        console.log('Pedometer not available');
        return null;
      }

      const permission = await checkPermission();
      if (!permission) {
        console.log('Permission not granted');
        return null;
      }

      const subscription = Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });

      return subscription;
    } catch (error) {
      console.error('Subscription error:', error);
      return null;
    }
  };

  useEffect(() => {
    let subscription = null;

    const initializePedometer = async () => {
      subscription = await subscribe();
    };

    initializePedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Is permission granted: {isPermissionGranted}</Text>
      <Text>Walk! And watch this go up: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
