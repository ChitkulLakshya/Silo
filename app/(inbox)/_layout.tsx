import { Stack } from 'expo-router';

export default function InboxLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Inbox',
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#ffffff' },
        }} 
      />
    </Stack>
  );
}
