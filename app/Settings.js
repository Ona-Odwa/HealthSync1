import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // use router instead of navigation
import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from './BottomNavBar';

export default function Settings() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Profile')}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Change password</Text>
      </TouchableOpacity>

      <View style={styles.option}>
        <Text style={styles.optionText}>Dark theme</Text>
        <Switch
          onValueChange={setIsDarkTheme}
          value={isDarkTheme}
          trackColor={{ false: '#ccc', true: '#c187e5' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push('/LoginScreen')} // use router to go to login
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
