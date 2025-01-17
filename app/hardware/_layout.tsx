import { Stack } from 'expo-router';

export default function HardwareLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Hardware Details',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'Add New Hardware',
        }}
      />
    </Stack>
  );
} 