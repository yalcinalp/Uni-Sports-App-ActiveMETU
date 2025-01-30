import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSession } from 'Utils/auth/ctx';
import moment from 'moment';
import Checkbox from 'expo-checkbox';
import * as Calendar from 'expo-calendar';

export default function ReservationScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [open, setOpen] = useState(false); // DropDownPicker state
  const [items, setItems] = useState([
    // DropDownPicker items, TODO: Fetch these from database
    { label: 'BSH (Big Sports Hall)', value: '1' },
    { label: 'Baraka', value: '2' },
    { label: 'Tennis Court', value: '3' },
  ]);
  const [useCalendar, setUseCalendar] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const { session, logout } = useSession();

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, 'days');
      days.push({
        display: date.format('ddd, MMM D'), // Format for display: Mon, Dec 23
        value: date.format('YYYY-MM-DD'), // Value to send to the backend: YYYY-MM-DD
      });
    }
    return days;
  };

  const makeReservation = async () => {
    if (!selectedDate || !selectedSlot || !selectedFacility) {
      Alert.alert('Error', 'Please select both a date and a time slot.');
      return;
    }
    try {
      await checkCalendar();
      const response = await axios.post('reservation/make_reservation/', {
        date: selectedDate,
        slot: selectedSlot,
        facility: selectedFacility,
      });
      Alert.alert('Success', response.data.detail);
    } catch (error) {
      let title = 'Error';
      let message = 'Something went wrong :(';

      if (error.response?.data?.detail) {
        // Interceptor
        title = error.response.data.title;
        message = error.response.data.detail;
      } else {
        message =
          error.response.data?.date ||
          error.response.data?.slot ||
          error.response.data?.non_field_errors ||
          message;
      }
      console.log('Error:', error.response.data);
      Alert.alert(title, Array.isArray(message) ? message.join('\n') : String(message), [
        {
          text: 'OK',
          onPress: () => {
            if (title === 'Unauthorized') {
              logout();
            }
          },
        },
      ]);
    }
  };

  const makeCalendar = () => {
    setUseCalendar(!useCalendar);

    if (!useCalendar) {
      console.log('Will check calendar for conflicts');
      (async () => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          console.log('Calendar permission granted');
          const calendars = await Calendar.getCalendarsAsync();
          setCalendars(calendars);
        }
      })();
    } else {
      console.log('Wont check calendar for conflicts');
    }
  };

  const checkCalendar = async () => {
    if (useCalendar) {
      try {
        console.log('Checking calendar for conflicts');
        console.log('Selected date:', selectedDate);
        console.log('Selected slot:', selectedSlot);
        const hour = selectedSlot.slice(0, 2);
        const min = selectedSlot.slice(2, 2);
        console.log('Hour:', parseInt(hour));
        console.log('Min:', min);
        const ymd = selectedDate.split('-');
        const startDate = new Date(ymd[0], ymd[1] - 1, ymd[2]);
        const endDate = new Date(ymd[0], ymd[1] - 1, ymd[2], 23, 59, 59);
        const events = await Calendar.getEventsAsync(
          calendars.map((calendar) => calendar.id),
          startDate,
          endDate
        );
        console.log('Events:', events);
        console.log('Date:', startDate);
        console.log('endDate:', endDate);
      } catch (error) {
        console.error('Calendar error:', error);
      }
    } else {
      console.log('Not checking calendar for conflicts');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select reservation date hocam,</Text>
      <View style={styles.options}>
        {getNext7Days().map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedDate === day.value && styles.selectedOption]}
            onPress={() => setSelectedDate(day.value)}>
            <Text style={styles.optionText}>{day.display}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Select reservation facility,</Text>
      <DropDownPicker
        open={open}
        value={selectedFacility}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedFacility}
        setItems={setItems}
        placeholder="Select a facility"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemLabelStyle={styles.listItemLabel}
        listItemContainerStyle={styles.listItemContainer}
        arrowIconStyle={styles.arrowIcon}
        placeholderStyle={styles.placeholder}
        selectedItemLabelStyle={styles.selectedItemLabel}
        tickIconStyle={styles.tickIcon}
      />
      <Text style={styles.label}>Select time slot,</Text>
      <View style={styles.options}>
        {['07:00-07:30', '07:30-08:00', '08:00-08:30', '08:30-09:00'].map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedSlot === slot.replace(':', '').slice(0, 3) && styles.selectedOption,
            ]}
            onPress={() => setSelectedSlot(slot.replace(':', '').slice(0, 3))}>
            <Text style={styles.optionText}>{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.makeReservationButton} onPress={makeReservation}>
          <Text style={styles.makeReservationButtonText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Checkbox
          color="#FF862A"
          value={useCalendar}
          onValueChange={makeCalendar}
          tintColors={{ true: '#FF862A', false: '#A8A7A7' }}
        />
        <Text style={styles.checkboxLabel}> Check my calendar for conflicts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 50,
    margin: 5,
  },
  optionText: {
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: '#D1F5A2',
  },

  // Styles for dropdown:
  dropdown: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#A8A7A7', // Light grey border
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 20,
  },
  dropdownContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#A8A7A7', // Light grey border for dropdown items
    borderWidth: 1,
    borderRadius: 20,
  },
  listItemLabel: {
    fontSize: 16, // Font size for dropdown items
    color: '#000000', // Black text for items
  },
  listItemContainer: {
    height: 50, // Height for each item
    justifyContent: 'center', // Center the text vertically
    paddingHorizontal: 0,
    borderBottomWidth: 0.2,
    borderColor: '#A8A7A7',
  },
  arrowIcon: {
    tintColor: '#5A5A5A', // Dark arrow icon
  },
  tickIcon: {
    tintColor: '#5A5A5A', // Dark check icon
  },
  placeholder: {
    color: '#A8A7A7', // Placeholder text
    fontSize: 16,
  },
  selectedItemLabel: {
    color: '#A6EC4C', // Darker green color for the selected item
    fontWeight: 'bold',
  },

  // Styles for the "Confirm Reservation" button:
  makeReservationButton: {
    width: '70%', // width of the button is arranged %70 of the screen
    backgroundColor: '#FF862A',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  makeReservationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center', // Center button horizontally
    marginTop: 10,
  },

  // Styles for the checkbox:
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
