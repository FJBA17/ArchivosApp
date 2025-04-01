import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          )
        }} 
      />
      <Tabs.Screen 
        name="direccion" 
        options={{
          title: 'Direccion',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" color={color} size={size} />
          )
        }} 
      />
      <Tabs.Screen 
        name="modales" 
        options={{
          title: 'Modales',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="layers" color={color} size={size} />
          )
        }} 
      />
    </Tabs>
  );
}