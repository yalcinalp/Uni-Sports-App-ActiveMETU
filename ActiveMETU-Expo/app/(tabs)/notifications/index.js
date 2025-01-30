import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import FilterIcon from 'Assets/misc/FilterIcon';
import PressableOpacity from 'Components/PressableOpacity';

const DATA = [
  // Temp data, delete after api call implementation
  {
    id: 1,
    title: 'BSH will be closed due to maintaining of the lorem ipsum lorem ipsum',
    dateAndPlace: 'Sep 20, 2024 - BSH',
    details: 'Closed for 3 days',
    dateAndTime: '22.10.2024 18:30', // TODO: dateAndPlace vs dateAndTime difference? Should they be the same?
  },
  {
    id: 2,
    title: '101ST YEAR REPUBLIC RACE PHOTOS',
    dateAndPlace: 'Sep 20, 2024 - BSH',
    details: 'Closed for 3 days',
    dateAndTime: '22.10.2024 18:30',
  },
  {
    id: 3,
    title: 'ADDITIONAL REGISTRATIONS SIS-YOGA-PIL ',
    dateAndPlace: 'Sep 20, 2024 - BSH',
    details: 'Closed for 3 days',
    dateAndTime: '22.10.2024 18:30',
  },
  {
    id: 4,
    title: 'BSH will be closed due to maintaining of the r...',
    dateAndPlace: 'Sep 20, 2024 - BSH',
    details: 'Closed for 3 days',
    dateAndTime: '22.10.2024 18:30',
  },
  {
    id: 5,
    title: 'BSH will be closed due to maintaining of the r...',
    dateAndPlace: 'Sep 20, 2024 - BSH',
    details: 'Closed for 3 days',
    dateAndTime: '22.10.2024 18:30',
  },
];

function NotificationItem({ props: { id, title, dateAndPlace, details, dateAndTime } }) {
  [date, time] = dateAndTime.split(' ');
  return (
    <PressableOpacity style={styles.item} pressDelay={100}>
      <Text numberOfLines={1} style={styles.itemTitle}>
        {title}
      </Text>
      <Text style={styles.itemDateAndPlace}>{dateAndPlace}</Text>
      <Text style={styles.itemDetails}>{details}</Text>
      <Text style={styles.itemDateAndTime}>
        {date} <Text style={{ fontWeight: 'bold' }}>{time}</Text>
      </Text>
    </PressableOpacity>
  );
}

export default function NotificationsScreen() {
  const [selectedTab, setSelectedTab] = useState('Announces');
  const [notificationItems, setNotificationItems] = useState([]);

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        {['Announces', 'Reminders', 'Friends'].map((tab) => (
          <PressableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedTab === tab ? '#FFFFFF' : 'transparent',
              borderRadius: 120,
              marginHorizontal: 5,
            }}>
            <Text
              style={{
                color: selectedTab === tab ? '#6341EB' : '#5A5A5A',
                fontWeight: selectedTab === tab ? 'bold' : 'normal',
              }}>
              {tab}
            </Text>
          </PressableOpacity>
        ))}
      </View>
      <View style={{ marginHorizontal: 20, marginVertical: 20, alignSelf: 'flex-end' }}>
        <FilterIcon />
      </View>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <NotificationItem props={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center' },
  tabs: {
    height: 48,
    width: '90%',
    backgroundColor: '#D7CFFA1A',
    borderRadius: 120,
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
  },
  item: {
    alignSelf: 'center',
    width: '96%',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#D7CFFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  itemTitle: {
    overflow: 'hidden',
    color: '#613EEA',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  itemDateAndPlace: {
    fontSize: 15,
  },
  itemDetails: {
    fontWeight: '300',
  },
  itemDateAndTime: {
    alignSelf: 'flex-end',
  },
});
