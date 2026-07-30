import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { getDb } from '@/db/database';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2D5DA6',
    secondary: '#5C85C5',
  },
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize DB (runs migrations) on app start
    getDb().catch(console.error);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
