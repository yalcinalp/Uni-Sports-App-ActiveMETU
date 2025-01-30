import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from 'Utils/auth/ctx';
import { SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { reloadAppAsync } from 'expo';
import i18n from 'Utils/i18n';
import Accordion from 'Components/Accordion';
import GeneralNotification from 'Components/settings/GeneralNotification';
import ChangePassword from 'Components/settings/ChangePassword';
import ProfileIcon2 from 'Assets/icons/ProfileIcon2'; // TODO: Rename
import NotificationIcon from 'Assets/icons/NotificationIcon';
import LockIcon from 'Assets/icons/LockIcon';
import AccessibilityIcon from 'Assets/icons/AccessibilityIcon';
import GlobeIcon from 'Assets/icons/GlobeIcon';
import ShieldIcon from 'Assets/icons/ShieldIcon';
import StarIcon from 'Assets/icons/StarIcon';
import LifesaverIcon from 'Assets/icons/LifesaverIcon';
import LogOutIcon from 'Assets/icons/LogOutIcon';
import CustomSwitch from 'Components/CustomSwitch';
import QAIcon from 'Assets/icons/QAIcon';

export default function SettingsScreen() {
  const { logout } = useSession();
  const [locale, setLocale] = useState(i18n.locale);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Turkish', value: 'tr' },
    { label: 'English', value: 'en' },
  ]);

  const IconColor = '#D7CFFA'; // TODO: Move to theme + Icons don't have color prop normally...
  const [isCalendarNotificationEnabled, setIsCalendarNotificationEnabled] = useState(false);
  const [theme, setTheme] = useState(false); // TODO: Is it possible to change trueVal/falseVal? False: Light, True: Dark theme
  // TODO: Fetch user data, display data coming from response

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Accordion
          buttonText={i18n.t('label/myAccount')}
          leftIcon={<ProfileIcon2 color={IconColor} />}>
          <View style={{ gap: 5 }}>
            {/* TODO: Adjust gaps between rows*/}
            <View style={styles.row}>
              <Text style={{ fontWeight: 'bold' }}>Username</Text>
              <Text>Kerem Yıldırım</Text>
            </View>
            <Text style={{ fontWeight: 'bold' }}>Who can see...</Text>
            <View style={styles.row}>
              <Text>My Awards</Text>
              <Text>Friends</Text>
            </View>
            <View style={styles.row}>
              <Text>My XP</Text>
              <Text>Only Me</Text>
            </View>
            <View style={styles.row}>
              <Text>Me on scoreboards</Text>
              <Text>Anyone</Text>
            </View>
            <Text style={{ fontWeight: 'bold' }}>Who can send...</Text>
            <View style={styles.row}>
              <Text>Challenge request</Text>
              <Text>Friends</Text>
            </View>
            <View style={styles.row}>
              <Text>Match request</Text>
              <Text>Anyone</Text>
            </View>
          </View>
        </Accordion>
        <Accordion
          buttonText={i18n.t('label/notifications')}
          leftIcon={<NotificationIcon color={IconColor} strokeWidth={1} />}>
          <GeneralNotification />
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Calendar Synchronization</Text>
            <CustomSwitch
              isEnabled={isCalendarNotificationEnabled}
              setIsEnabled={setIsCalendarNotificationEnabled}
              height={36}
              width={36}
              trackColor={{ false: '#D9D9D9', true: '#A6EC4C' }}
              thumbColor={{ false: '#FFFFFF', true: '#DBF5B8' }}
            />
          </View>
        </Accordion>
        <Accordion buttonText={i18n.t('label/password')} leftIcon={<LockIcon color={IconColor} />}>
          <ChangePassword />
        </Accordion>
        <Accordion
          buttonText={i18n.t('label/accessibility')}
          leftIcon={<AccessibilityIcon color={IconColor} />}>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Theme</Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}>
              <Text>Light</Text>
              <CustomSwitch
                isEnabled={theme}
                setIsEnabled={setTheme}
                trackColor={{
                  false: '#D9D9D9',
                  true: '#4B4B4B',
                }}
                thumbColor={{
                  false: '#FFFFFF',
                  true: '#333333',
                }}
              />
              <Text style={{ fontWeight: 'bold' }}>Dark</Text>
            </View>
          </View>
          {/* TODO: Adjusting font size doesn't look easy...*/}
        </Accordion>
        <Accordion buttonText={i18n.t('label/language')} leftIcon={<GlobeIcon color={IconColor} />}>
          <DropDownPicker
            listMode="MODAL" // TODO: Problems with height calculation after the dropdown is open, MODAL is a quick fix.
            open={open}
            value={locale}
            items={items}
            setOpen={setOpen}
            setValue={setLocale}
            onChangeValue={(newLocale) => {
              i18n.locale = newLocale;
              reloadAppAsync(); // Will not work in Expo GO. The idea is to reload the app after locale change so that words are translated properly.
              // TODO: Check if it works.
            }}
          />
        </Accordion>
        <Accordion
          buttonText={i18n.t('label/privacyPolicy')}
          leftIcon={<ShieldIcon color={IconColor} />}>
          {/* TODO: Adjust design */}
          <View style={{ flex: 1, gap: 10 }}>
            {[
              'METU User Agreement',
              'METU Code of Ethical Conduct',
              'METU Facility Rules',
              'User Information Notice',
              'Community Standards',
            ].map((text, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#800080',
                  }}
                />
                <TouchableOpacity onPress={() => console.log(`${text} clicked`)}>
                  <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                    {text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Accordion>
        <Accordion
          buttonText={i18n.t('label/evaluation')}
          leftIcon={<StarIcon color={IconColor} />}>
          {/* TODO: Move to a separate component*/}
          <View style={{ flex: 1, gap: 15 }}>
            {[
              'Evaluate Application',
              'Evaluate Facilities',
              'Evaluate Courses',
              'Evaluate Teams',
              'Send a Report',
            ].map((text, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#800080',
                  }}></View>
                <TouchableOpacity onPress={() => console.log(`${text} clicked`)}>
                  <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>
                    {text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Accordion>
        <Accordion
          buttonText={i18n.t('label/support')}
          leftIcon={<LifesaverIcon color={IconColor} />}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'stretch',
              justifyContent: 'center',
              gap: 25,
            }}>
            <TouchableOpacity style={styles.supportButtons}>
              <QAIcon style={{ alignSelf: 'center' }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportButtons}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Report</Text>
            </TouchableOpacity>
          </View>
        </Accordion>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            alignSelf: 'flex-end',
            gap: 10,
            borderRadius: 30,
            padding: 10,
            borderColor: '#A5A5A5',
            borderWidth: 1,
          }}
          onPress={logout}>
          <LogOutIcon color={'crimson'} />
          <Text style={{ color: '#5A5A5A', fontWeight: 'bold' }}>{i18n.t('label/logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    gap: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supportButtons: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
