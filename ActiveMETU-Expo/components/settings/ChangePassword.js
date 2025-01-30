import { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useSession } from 'Utils/auth/ctx';
import axios from 'axios';

export default function ChangePassword() {
  const { logout } = useSession();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword != newPasswordAgain) {
      Alert.alert('Error', "New passwords don't match. Please correct.", [{ text: 'OK' }]);
      return;
    }
    if (!oldPassword || !newPassword || !newPasswordAgain) {
      Alert.alert('Error', 'Please fill all the fields.', [{ text: 'OK' }]);
      return;
    }
    try {
      const response = await axios.post('accounts/change_password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      Alert.alert('Success!', response.data.message, [
        {
          text: 'OK',
          onPress: () => {
            logout();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', Object.values(error.response.data).join('\n'));
      // console.log(error.response.data);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={setOldPassword}
        value={oldPassword}
        placeholder="Old Password"
        autoCapitalize="none"
        placeholderTextColor="#5A5A5A"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        placeholder="New Password"
        autoCapitalize="none"
        placeholderTextColor="#5A5A5A"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={setNewPasswordAgain}
        value={newPasswordAgain}
        placeholder="New Password Again"
        autoCapitalize="none"
        placeholderTextColor="#5A5A5A"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Change password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  button: {
    width: '70%',
    backgroundColor: '#FF862A',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
