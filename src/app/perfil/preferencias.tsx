import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useResponsive } from '../../utils/responsive';

const CLIMA_OPTIONS = ['Quente', 'Temperado', 'Frio', 'Qualquer'];
const DURACAO_OPTIONS = ['1 dia', '2-3 dias', '4-7 dias', '7+ dias'];
const ESTILO_OPTIONS = ['Aventura', 'Cultural', 'Gastronomia', 'Relaxamento', 'Ecoturismo'];

function ChipGroup({ title, options, selected }: { title: string; options: string[]; selected: string[] }) {
  const r = useResponsive();
  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { fontSize: r.font(16) }]}>{title}</Text>
      <View style={styles.chips}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <View
              key={opt}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, { fontSize: r.font(14) }, active && styles.chipTextActive]}>
                {opt}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function PreferenciasScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: r.scaleY(8) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: r.font(20) }]}>Preferências de Viagem</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { fontSize: r.font(14) }]}>
          Personalize suas preferências para receber roteiros mais adequados ao seu perfil.
        </Text>

        <ChipGroup title="Clima Preferido" options={CLIMA_OPTIONS} selected={['Temperado']} />
        <ChipGroup title="Duração da Viagem" options={DURACAO_OPTIONS} selected={['2-3 dias']} />
        <ChipGroup title="Estilo de Viagem" options={ESTILO_OPTIONS} selected={['Cultural', 'Gastronomia']} />

        <TouchableOpacity style={[styles.saveBtn, { marginTop: r.scaleY(8) }]} activeOpacity={0.85}>
          <Text style={[styles.saveBtnText, { fontSize: r.font(16) }]}>Salvar Preferências</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { color: Colors.textWhite, fontWeight: '700' },
  content: { paddingHorizontal: 24, paddingTop: 8 },
  subtitle: { color: Colors.textGray, marginBottom: 28, lineHeight: 22 },
  group: { marginBottom: 28 },
  groupTitle: { color: Colors.textWhite, fontWeight: '700', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(121,116,231,0.2)',
  },
  chipText: { color: Colors.textGray, fontWeight: '500' },
  chipTextActive: { color: Colors.primary },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
});
