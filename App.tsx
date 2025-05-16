import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApolloProvider } from '@apollo/client';
import { Provider as PaperProvider } from 'react-native-paper';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { client } from './src/apollo/client';
import { LaunchOverviewScreen } from './src/screens/LaunchOverviewScreen';
import { LaunchDetailsScreen } from './src/screens/LaunchDetailsScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name="LaunchOverview" 
                component={LaunchOverviewScreen}
                options={{ title: 'SpaceX Launches' }}
              />
              <Stack.Screen 
                name="LaunchDetails" 
                component={LaunchDetailsScreen}
                options={{ title: 'Launch Details' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </PaperProvider>
    </ApolloProvider>
  );
}
