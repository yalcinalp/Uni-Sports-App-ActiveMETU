import React from 'react';
import { View, Switch } from 'react-native';

const CustomSwitch = ({
  isEnabled,
  setIsEnabled,
  height = 48,
  width = 48,
  trackColor,
  thumbColor,
  style,
}) => {
  return (
    <View style={style}>
      <Switch
        style={{ height, width }}
        trackColor={trackColor}
        thumbColor={isEnabled ? thumbColor.true : thumbColor.false}
        ios_backgroundColor={thumbColor.false}
        onValueChange={setIsEnabled}
        value={isEnabled}
      />
    </View>
  );
};

export default CustomSwitch;
