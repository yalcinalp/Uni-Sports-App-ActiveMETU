import { useState, useCallback } from 'react';
import { TextInput, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useSession } from 'Utils/auth/ctx';
import { router } from 'expo-router';
import debounce from 'lodash.debounce';

import logoWithText from 'Assets/images/am-logo-with-text.jpg';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useSession();

  const handleLogin = useCallback(
    debounce(async () => {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.');
        return;
      } else {
        const credentials = btoa(`${username}:${password}`);
        const isLoggedIn = await login(credentials);
        if (isLoggedIn) {
          router.replace('/(tabs)/');
        }
      }
    }, 1000),
    [username, password, login]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={logoWithText} style={styles.logo} />
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
          placeholder="Metumail"
          autoCapitalize="none"
          placeholderTextColor="#5A5A5A"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#5A5A5A"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 170,
    height: 201,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    height: 60,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingLeft: 30,
  },
  button: {
    backgroundColor: '#613EEA',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '60%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
