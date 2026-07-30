import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  Button,
  SegmentedButtons,
  TextInput,
  Switch,
  Chip,
  Divider,
  useTheme,
  HelperText,
} from 'react-native-paper';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { useMigraineStore } from '@/stores/migraineStore';
import type {
  HeadLocation,
  MigraineType,
  AuraSymptom,
  ProdromeSymptom,
} from '@/db/types';

const HEAD_LOCATIONS: { label: string; value: HeadLocation }[] = [
  { label: 'Left', value: 'left_side' },
  { label: 'Right', value: 'right_side' },
  { label: 'Both', value: 'bilateral' },
  { label: 'Forehead', value: 'forehead' },
  { label: 'Back', value: 'back' },
  { label: 'Neck', value: 'neck' },
  { label: 'Full', value: 'full_head' },
];

const MIGRAINE_TYPES: { label: string; value: MigraineType }[] = [
  { label: 'Migraine', value: 'migraine' },
  { label: 'Tension', value: 'tension' },
  { label: 'Cluster', value: 'cluster' },
  { label: 'Ocular', value: 'ocular' },
  { label: 'Vestibular', value: 'vestibular' },
  { label: 'Hemiplegic', value: 'hemiplegic' },
];

const AURA_SYMPTOMS: { label: string; value: AuraSymptom }[] = [
  { label: 'Visual', value: 'visual_disturbance' },
  { label: 'Tingling', value: 'tingling' },
  { label: 'Speech', value: 'speech' },
  { label: 'Motor', value: 'motor' },
  { label: 'Other', value: 'other' },
];

const PRODROME_SYMPTOMS: { label: string; value: ProdromeSymptom }[] = [
  { label: 'Fatigue', value: 'fatigue' },
  { label: 'Mood change', value: 'mood_change' },
  { label: 'Food craving', value: 'food_craving' },
  { label: 'Neck stiffness', value: 'neck_stiffness' },
  { label: 'Yawning', value: 'yawning' },
];

export default function NewMigraineScreen() {
  const theme = useTheme();
  const { create } = useMigraineStore();
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const [severity, setSeverity] = useState(5);
  const [headLocation, setHeadLocation] = useState<HeadLocation>('left_side');
  const [migraineType, setMigraineType] = useState<MigraineType>('migraine');
  const [hasAura, setHasAura] = useState(false);
  const [auraSymptoms, setAuraSymptoms] = useState<AuraSymptom[]>([]);
  const [prodromeSymptoms, setProdromeSymptoms] = useState<ProdromeSymptom[]>([]);
  const [notes, setNotes] = useState('');
  const [isOngoing, setIsOngoing] = useState(true);

  function toggleAura(symptom: AuraSymptom) {
    setAuraSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }

  function toggleProdrome(symptom: ProdromeSymptom) {
    setProdromeSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await create({
        date: format(now, 'yyyy-MM-dd'),
        startTime: now.toISOString(),
        endTime: isOngoing ? null : now.toISOString(),
        severity,
        headLocation,
        migraineType,
        hasAura,
        auraSymptoms: hasAura ? auraSymptoms : [],
        prodromeSymptoms,
        notes: notes.trim() || null,
      });
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
          Log Migraine
        </Text>
        <Text variant="bodyMedium" style={styles.timestamp}>
          Started {format(now, 'h:mm a, MMM d')}
        </Text>
      </View>

      <Divider style={styles.divider} />

      {/* Severity */}
      <Text variant="titleMedium" style={styles.sectionLabel}>
        Severity (1–10)
      </Text>
      <View style={styles.severityRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Button
            key={n}
            mode={severity === n ? 'contained' : 'outlined'}
            compact
            onPress={() => setSeverity(n)}
            style={styles.severityBtn}
            labelStyle={styles.severityLabel}
          >
            {String(n)}
          </Button>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Head location */}
      <Text variant="titleMedium" style={styles.sectionLabel}>
        Location
      </Text>
      <View style={styles.chips}>
        {HEAD_LOCATIONS.map(({ label, value }) => (
          <Chip
            key={value}
            selected={headLocation === value}
            onPress={() => setHeadLocation(value)}
            style={styles.chip}
          >
            {label}
          </Chip>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Migraine type */}
      <Text variant="titleMedium" style={styles.sectionLabel}>
        Type
      </Text>
      <View style={styles.chips}>
        {MIGRAINE_TYPES.map(({ label, value }) => (
          <Chip
            key={value}
            selected={migraineType === value}
            onPress={() => setMigraineType(value)}
            style={styles.chip}
          >
            {label}
          </Chip>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Aura */}
      <View style={styles.switchRow}>
        <Text variant="titleMedium">Aura present?</Text>
        <Switch value={hasAura} onValueChange={setHasAura} />
      </View>
      {hasAura && (
        <View style={styles.chips}>
          {AURA_SYMPTOMS.map(({ label, value }) => (
            <Chip
              key={value}
              selected={auraSymptoms.includes(value)}
              onPress={() => toggleAura(value)}
              style={styles.chip}
            >
              {label}
            </Chip>
          ))}
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Prodrome symptoms */}
      <Text variant="titleMedium" style={styles.sectionLabel}>
        Prodrome symptoms (before onset)
      </Text>
      <View style={styles.chips}>
        {PRODROME_SYMPTOMS.map(({ label, value }) => (
          <Chip
            key={value}
            selected={prodromeSymptoms.includes(value)}
            onPress={() => toggleProdrome(value)}
            style={styles.chip}
          >
            {label}
          </Chip>
        ))}
      </View>

      <Divider style={styles.divider} />

      {/* Ongoing toggle */}
      <View style={styles.switchRow}>
        <Text variant="titleMedium">Still ongoing?</Text>
        <Switch value={isOngoing} onValueChange={setIsOngoing} />
      </View>

      <Divider style={styles.divider} />

      {/* Notes */}
      <Text variant="titleMedium" style={styles.sectionLabel}>
        Notes
      </Text>
      <TextInput
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="Triggers, context, how you're feeling…"
        value={notes}
        onChangeText={setNotes}
        style={styles.notes}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.actionBtn}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.actionBtn}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 16, paddingBottom: 48 },
  header: { marginBottom: 8 },
  timestamp: { color: '#666', marginTop: 4 },
  divider: { marginVertical: 16 },
  sectionLabel: { marginBottom: 10 },
  severityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  severityBtn: { minWidth: 40 },
  severityLabel: { fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginBottom: 4 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notes: { backgroundColor: '#fff' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  actionBtn: { minWidth: 100 },
});
