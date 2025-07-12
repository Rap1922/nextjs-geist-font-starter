import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Alert} from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import EditItemScreen from './src/screens/EditItemScreen';
import ExportScreen from './src/screens/ExportScreen';

// Import database service
import DatabaseService from './src/services/DatabaseService';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await DatabaseService.initDB();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      Alert.alert(
        'Database Error',
        'Failed to initialize database. Please restart the app.',
        [{text: 'OK'}]
      );
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Stock Opname',
            headerStyle: {
              backgroundColor: '#1976D2',
            },
          }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            title: 'Tambah Barang',
            headerStyle: {
              backgroundColor: '#388E3C',
            },
          }}
        />
        <Stack.Screen
          name="EditItem"
          component={EditItemScreen}
          options={{
            title: 'Edit Barang',
            headerStyle: {
              backgroundColor: '#F57C00',
            },
          }}
        />
        <Stack.Screen
          name="Export"
          component={ExportScreen}
          options={{
            title: 'Export Data',
            headerStyle: {
              backgroundColor: '#7B1FA2',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
