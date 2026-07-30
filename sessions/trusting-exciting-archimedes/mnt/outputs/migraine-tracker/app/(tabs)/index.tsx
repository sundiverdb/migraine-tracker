import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, FAB, Surface, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { useMigraineStore } from '@/stores/migraineStore';

const today = format(new Date(), 'yyyy-MM-dd');
const todayDisplay = format(new Date(), 'EEEE, MMMM d');

export default function TodayScreen() {
  const theme = useTheme();
  const { entries, loadByDate, loading } = useMigraineStore();

  useEffect(() => {
    loadByDate(today);
  }, []);

  const todayMigraines = entries.filter((e) => e.date === today);
  const activeMigraine = todayMigraines.find((e) => !e.endTime);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Date header */}
        <Surface style={styles.dateCard} elevation={0}>
          <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
            {todayDisplay}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Your health at a glance
          </Text>
        </Surface>

        {/* Active migraine banner */}
        {activeMigraine && (
          <Card style={[styles.card, { borderColor: '#E53935', borderWidth: 2 }]}>
            <Card.Content>
              <Text variant="titleMedium" style={{ color: '#E53935' }}>
                Active Migraine
              </Text>
              <Text variant="bodyMedium">
                Started:{' '}
                {format(new Date(activeMigraine.startTime), 'h:mm a')} ·
                Severity {activeMigraine.severity}/10
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                buttonColor="#E53935"
                onPress={() =>
                  router.push(`/migraine/${activeMigraine.id}`)
                }
              >
                Mark as Ended
              </Button>
            </Card.Actions>
          </Card>
        )}

        {/* Today's migraine count */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Migraines today</Text>
            <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
              {todayMigraines.length}
            </Text>
          </Card.Content>
        </Card>

        {/* Placeholder cards for future trackers */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.comingSoon}>
              Diet Log
            </Text>
            <Text variant="bodySmall" style={styles.comingSoonSub}>
              Coming in Phase 2
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.comingSoon}>
              Sleep Diary
            </Text>
            <Text variant="bodySmall" style={styles.comingSoonSub}>
              Coming in Phase 2
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.comingSoon}>
              Focus Tracker
            </Text>
            <Text variant="bodySmall" style={styles.comingSoonSub}>
              Coming in Phase 2
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB to log a new migraine */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        label="Log Migraine"
        onPress={() => router.push('/migraine/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 16, paddingBottom: 100 },
  dateCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#EEF2FB',
  },
  subtitle: { color: '#666', marginTop: 4 },
  card: { marginBottom: 12, borderRadius: 12 },
  comingSoon: { color: '#9E9E9E' },
  comingSoonSub: { color: '#BDBDBD', marginTop: 4 },
  fab: { position: 'absolute', right: 16, bottom: 24 },
});
