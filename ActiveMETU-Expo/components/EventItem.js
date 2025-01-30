import { Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { textStyles, elements } from '../styles/theme';

const EventItem = ({ id, title, description, location, date }) => {
  return (
    <Link
      href={{
        pathname: `/main/events/${id}`,
        params: {
          title,
          description,
          location,
          date,
        },
      }}
      asChild>
      <Pressable style={{ ...elements.card }}>
        <Text style={{ ...textStyles.title }}>{title}</Text>
        <Text>{location}</Text>
        <Text>{date}</Text>
      </Pressable>
    </Link>
  );
};

export default EventItem;
