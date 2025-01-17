import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function HardwareDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return (
    <View>
      <Stack.Screen options={{ title: 'Hardware Details' }} />
      <ThemedText>Hardware ID: {id}</ThemedText>
    </View>
  );
} 