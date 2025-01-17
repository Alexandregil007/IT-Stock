import { Stack } from 'expo-router';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function NewHardwareScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Add New Hardware' }} />
      <ThemedText>New Hardware Form</ThemedText>
    </View>
  );
} 