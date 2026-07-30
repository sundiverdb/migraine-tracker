import { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, Card, Chip, FAB, ActivityIndicator, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useMigraineStore } from '@/stores/migraineStore';
import type { MigraineEntry } from '@/db/types';

function severityColor(severity: number): string {
  if (severity <= 3) return '#4CAF50';
  if (severity <= 6) return '#FF9800';
  return '#E53935';
}

function MigraineCard({ entry }: { entry: MigraineEntry }) {
  const theme = useTheme();
  return (
    <Card
      style={styles.card}
      onPress={() => router.push(`/migraine/${entry.id}`)}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium">
            {format(parseISO(entry.startTime), 'MMM d, yyyy')}
          </Text>
          <Chip
            style={{ backgroundColor: severityColor(entry.severity) }}
            textStyle={{ color: '#fff', fontWeight: 'bold' }}
          >
            {entry.severity}/10
          </Chip>
        </View>

        <Text variant="bodyMedium" style={styles.meta}>
          {format(parseISO(entry.startTime), 'h:mm a')}
          {entry.endTime
            ? ` – ${format(parseISO(entry.endTime), 'h:mm a')}`
            : ' · Ongoing'}
          {entry.durationMinutes ? ` (${entry.durationMinutes} min)` : ''}
        </Text>

        <View style={styles.chips}>
          <Chip compact style={styles.chip}>
            {entry.headLocation.replace('_', ' ')}
          </Chip>
          <Chip compact style={styles.chip}>
            {entry.migraineType}
          </Chip>
          {entry.hasAura && (
            <Chip compact style={[styles.chip, { backgroundColor: '#EDE7F6' }]}>
              aura
            </Chip>
          )}
        </View>

        {entry.notes ? (
          <Text
            variant="bodySmall"
            style={styles.notes}
            numberOfLines={2}
          >
            {entry.notes}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}

export default function MigrainesScreen() {
  const theme = useTheme();
  const { entries, loading, loadAll } = useMigraineStore();

  useEffect(() => {
    loadAll();
  }, []);

  if (loading && entries.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MigraineCard entry={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text variant="bodyLarge" style={{ color: '#9E9E9E' }}>
              No migraines logged yet.
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => router.push('/migraine/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  list: { padding: 16, paddingBottom: 100 },
  card: { marginBottom: 12, borderRadius: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  meta: { color: '#666', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  chip: { backgroundColor: '#EEF2FB' },
  notes: { color: '#888', marginTop: 4 },
  fab: { position: 'absolute', right: 16, bottom: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
});
