import React, { useState, useReducer } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomSwitch from 'Components/CustomSwitch';

export default function GeneralNotification() {
  const [isGeneralNotificationEnabled, setIsGeneralNotificationEnabled] = useState(false);

  const initialState = {
    fromFavoriteTeams: false,
    fromFavoriteSocieties: false,
    fromFavoriteCourses: false,
    fromCalendar: false,
    fromUpcomingEvents: false,
    fromGoalReminders: false,
    fromTrainingReminders: false,
    fromChallengeReminders: false,
    fromChallengeRequests: false,
    fromMatchRequests: false,
  };
  const reducer = (state, action) => {
    if (action.type === 'clear_all') {
      const newState = Object.keys(state).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      return newState;
    } else if (action.type === 'toggle') {
      newState = { ...state };
      newState[action.key] = action.newValue;
      return newState;
    }
    return state;
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const toPascalCase = (str) => {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={{ fontWeight: 'bold' }}>General Notifications</Text>
        <CustomSwitch
          isEnabled={isGeneralNotificationEnabled}
          setIsEnabled={(newValue) => {
            setIsGeneralNotificationEnabled(newValue);
            if (!newValue) {
              dispatch({ type: 'clear_all' });
            }
          }}
          height={36}
          width={36}
          trackColor={{ false: '#D9D9D9', true: '#A6EC4C' }}
          thumbColor={{ false: '#FFFFFF', true: '#DBF5B8' }}
        />
      </View>
      {isGeneralNotificationEnabled &&
        Object.entries(state).map(([key, value]) => (
          <View style={styles.row} key={key}>
            <Text>{toPascalCase(key)}</Text>
            <CustomSwitch
              isEnabled={value}
              setIsEnabled={(newValue) => {
                dispatch({ type: 'toggle', key: key, newValue: newValue });
              }}
              height={36}
              width={36}
              trackColor={{ false: '#D9D9D9', true: '#A6EC4C' }}
              thumbColor={{ false: '#FFFFFF', true: '#DBF5B8' }}
            />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
