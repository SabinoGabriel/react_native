import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import MainTabLayout from '../components/layout/MainTabLayout';
import { useResponsive } from '../utils/responsive';

const FILTER_TIPOS = ['Urbano', 'Rural', 'Populoso'];

export default function MapaScreen() {
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [filtroAtivo, setFiltroAtivo] = useState('Urbano');
  const [busca, setBusca] = useState('');

  return (
    <MainTabLayout activeTab="mapa">
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search & filters — sem botao de voltar, e uma aba principal */}
      <View style={[styles.topBar, { paddingTop: r.scaleY(8) }]}>
        <View style={styles.mapHeader}>
          <Text style={[styles.mapHeaderTitle, { fontSize: r.font(16) }]}>Explorar Mapa</Text>
        </View>
        <View style={styles.searchBar}>
          <TextInput
            style={[styles.searchInput, { fontSize: r.font(14) }]}
            placeholder="Encontre novas cidades...."
            placeholderTextColor={Colors.textGray}
            value={busca}
            onChangeText={setBusca}
          />
          <TouchableOpacity style={styles.locationBtn}>
            <MaterialIcons name="my-location" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.filters}>
          {FILTER_TIPOS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filtroAtivo === f && styles.filterChipActive]}
              onPress={() => setFiltroAtivo(f)}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={f === 'Urbano' ? 'home' : f === 'Rural' ? 'eco' : 'people'}
                size={15}
                color={filtroAtivo === f ? Colors.primary : Colors.textGray}
              />
              <Text style={[styles.filterText, { fontSize: r.font(13) }, filtroAtivo === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        {/* Simulated map pins */}
        <Text style={styles.mapBg}>🗺️</Text>
        <View style={[styles.pinActive, { top: '35%', left: '30%' }]}>
          <MaterialIcons name="place" size={32} color="#FFFFFF" />
          <Text style={styles.pinLabel}>Recife</Text>
        </View>
        <View style={[styles.pin, { top: '22%', right: '30%' }]}>
          <MaterialIcons name="place" size={22} color={Colors.background} />
          <Text style={styles.pinLabelSm}>Paulista</Text>
        </View>
        <View style={[styles.pin, { top: '55%', right: '20%' }]}>
          <MaterialIcons name="place" size={22} color={Colors.background} />
          <Text style={styles.pinLabelSm}>Jaboatão</Text>
        </View>
        <View style={[styles.pin, { top: '65%', left: '25%' }]}>
          <MaterialIcons name="place" size={22} color={Colors.background} />
          <Text style={styles.pinLabelSm}>Olinda</Text>
        </View>

        {/* Filter FAB */}
        <TouchableOpacity style={[styles.filterFab, { right: 16, bottom: 120 }]}>
          <MaterialIcons name="filter-list" size={22} color={Colors.textGray} />
        </TouchableOpacity>
      </View>

      {/* City card bottom */}
      <View style={[styles.cityCard, { paddingBottom: insets.bottom + 8, marginBottom: 0 }]}>
        <View style={styles.cityCardImg}>
          <Text style={{ fontSize: 32 }}>🏙️</Text>
        </View>
        <View style={styles.cityCardBody}>
          <View style={styles.cityCardTop}>
            <MaterialIcons name="place" size={16} color="#FFFFFF" />
            <Text style={[styles.cityCardNome, { fontSize: r.font(20) }]}>Recife</Text>
            <Text style={[styles.cityCardEstado, { fontSize: r.font(14) }]}>PE</Text>
            <TouchableOpacity style={styles.bookmarkIcon}>
              <MaterialIcons name="bookmark" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.cityCardPop, { fontSize: r.font(13) }]}>1.00.000 habitantes</Text>
          <View style={styles.cityCardTags}>
            <View style={styles.tagChip}><Text style={styles.tagChipText}>Populoso</Text></View>
            <View style={[styles.tagChip, { backgroundColor: '#F59E0B' }]}><Text style={styles.tagChipText}>IDH</Text></View>
            <View style={styles.tagChip}><Text style={styles.tagChipText}>Polo Tech</Text></View>
            <TouchableOpacity style={styles.playBtn}>
              <MaterialIcons name="play-arrow" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
    </MainTabLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F0' },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHeaderTitle: { color: Colors.textDark, fontWeight: '700' },
  topBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: { flex: 1, color: Colors.textDark },
  locationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexDirection: 'row', gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: { borderColor: Colors.primary },
  filterText: { color: Colors.textGray },
  filterTextActive: { color: Colors.primary, fontWeight: '600' },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8EBF0',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBg: { fontSize: 120, opacity: 0.15 },
  pinActive: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pin: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pinLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 11, marginTop: 2 },
  pinLabelSm: { color: Colors.textDark, fontSize: 10, fontWeight: '600', marginTop: 1 },
  filterFab: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cityCard: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  cityCardImg: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityCardBody: { flex: 1 },
  cityCardTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cityCardNome: { color: '#FFFFFF', fontWeight: '700' },
  cityCardEstado: { color: 'rgba(255,255,255,0.75)' },
  bookmarkIcon: { marginLeft: 'auto' },
  cityCardPop: { color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  cityCardTags: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  tagChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
