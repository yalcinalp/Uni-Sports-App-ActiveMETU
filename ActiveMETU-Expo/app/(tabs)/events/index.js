import { Alert, View, Text, ScrollView, StyleSheet } from 'react-native';
import EventList from 'Components/EventList';
import { background, align, textStyles } from 'Styles/theme';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'Utils/auth/ctx';

export default function EventsScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const response = await axios.get(
          // 'http://127.0.0.1:8080/events/view_events/',
          'events/view_events/',
          {}
        );
        setData(JSON.parse(response.data));
        Alert.alert('Success', response.data.detail);
        console.log('Fetched events:', response.data);
        //   console.log(typeof response.data);
      } catch (error) {
        // console.log("Error details:", error.response?.data || error.message);
        //   console.log("Session token:", session);
        // console.log("Error oldu: ", error);
        setError(error.message || 'An error occurred.');
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {data.map((event, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.dateText}>{event.date_time}</Text>
          <Text style={styles.placeText}>{event.place}</Text>
          <Text style={styles.description}>{event.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  box: {
    // backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  placeText: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
});
