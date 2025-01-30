import { Pressable, Animated } from 'react-native';

// Pressable component but with a similar animation TouchableOpacity component has when pressed
export default function PressableOpacity({
  children,
  pressDelay,
  style,
  onPressIn,
  onPressOut,
  onPress,
}) {
  const animated = new Animated.Value(1);

  const fadeIn = () => {
    console.log('PressIn');
    Animated.timing(animated, {
      toValue: 0.2,
      duration: 100,
      useNativeDriver: true,
    }).start();
    if (onPressIn) onPressIn();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    console.log('PressOut');
    if (onPressOut) onPressOut();
  };

  return (
    <Pressable
      style={style}
      unstable_pressDelay={pressDelay ?? 0}
      onPressIn={fadeIn}
      onPressOut={fadeOut}
      onPress={onPress}>
      <Animated.View
        style={{
          opacity: animated,
        }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
