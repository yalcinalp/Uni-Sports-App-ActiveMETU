import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { background, padding, textStyles } from 'Styles/theme';

const EventDetailScreen = () => {
  const route = useRoute();

  const { eventId, title, description, location, date } = route.params;
  return (
    <View style={{ ...padding.big_padding, ...background.color }}>
      <Text style={{ ...textStyles.title }}>{title}</Text>
      <Text>{description}</Text>
    </View>
  );
};

export default EventDetailScreen;
