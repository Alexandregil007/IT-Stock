import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: true,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hardware-list"
        options={{
          title: 'Hardware List',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-hardware"
        options={{
          title: 'Add Hardware',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}