import React, { useEffect } from 'react';
import i18n from 'Utils/i18n.js';
import { View, Text, StyleSheet } from 'react-native';

export default function DebugElements() {
  return (
    <View style={styles.locale}>
      <Text>Locale: {i18n.locale}</Text>
      <Text>i18n Test Text: {i18n.t('label/hello')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  locale: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'cener',
  },
});
