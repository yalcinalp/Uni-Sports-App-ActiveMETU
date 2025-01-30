import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import EventItem from './EventItem';
import { Databases, Query } from 'react-native-appwrite';
import { appwrite, ID_DB1, ID_Collection_Events } from '../utils/appwrite';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const pullItems = () => {
    const databases = new Databases(appwrite);
    let promise = databases.listDocuments(ID_DB1, ID_Collection_Events, [
      Query.select(['$id', 'Title', 'Description', 'DateTime', 'Location']),
    ]);
    promise.then(
      (response) => {
        const formattedData = response.documents.map((doc) => ({
          id: doc.$id,
          title: doc.Title,
          description: doc.Description,
          location: doc.Location,
          date: doc.DateTime,
        }));
        setEvents(formattedData);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    pullItems();
  }, []);

  const renderItem = ({ item }) => (
    <EventItem
      id={item.id}
      title={item.title}
      description={item.description}
      location={item.location}
      date={item.date}
    />
  );

  return (
    <View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              pullItems();
              setRefreshing(false);
            }}
          />
        }
      />
    </View>
  );
};

export default EventList;
