import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import RightArrowIcon from 'Assets/misc/RightArrowIcon';

function AccordionItem({ isExpanded, children, viewKey, style, duration = 500 }) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View key={`accordionItem_${viewKey}`} style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

function Item({ children }) {
  return <View style={styles.box}>{children}</View>;
}

function Parent({ open, children }) {
  return (
    <AccordionItem isExpanded={open} viewKey="Accordion">
      <Item children={children} />
    </AccordionItem>
  );
}

export default function Accordion(props) {
  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };
  const IconColor = '#D7CFFA'; // TODO: Move to theme

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              flexDirection: 'row',
              gap: 20,
            }}>
            {props.leftIcon}
            <Text style={styles.text}>{props.buttonText}</Text>
          </View>
          <RightArrowIcon color={IconColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Parent open={open} children={props.children} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // TODO: Refactor

  content: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    marginTop: 5,
    width: '100%',
    overflow: 'hidden',
  },
  box: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A5A',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
});
