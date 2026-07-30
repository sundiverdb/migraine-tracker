import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function DietScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Diet Log</Text>
      <Text variant="bodyMedium" style={styles.sub}>Coming in Phase 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA' },
  title: { color: '#9E9E9E' },
  sub: { color: '#BDBDBD', marginTop: 8 },
});
