import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { roteirosFavoritos, Roteiro } from '../../data/mockRoteiros';
import { useResponsive } from '../../utils/responsive';

function FavoritoCard({ roteiro }: { roteiro: Roteiro }) {
  const r = useResponsive();
  const cidadesStr = roteiro.cidades.join(' → ');
  return (
    <View style={[styles.favCard, { backgroundColor: roteiro.cor }]}>
      <View style={styles.favHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.favNome, { fontSize: r.font(20) }]}>{roteiro.nome}</Text>
          <View style={styles.favCidadesRow}>
            <MaterialIcons name="place" size={13} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.favCidades, { fontSize: r.font(13) }]}>{cidadesStr}</Text>
          </View>
        </View>
        <MaterialIcons
          name={roteiro.favoritado ? 'bookmark' : 'bookmark-border'}
          size={24}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.favFooter}>
        <Text style={[styles.favKm, { fontSize: r.font(18) }]}>{roteiro.distanciaKm} Km</Text>
        <TouchableOpacity style={styles.verDetalhesBtn}>
          <Text style={[styles.verDetalhesText, { fontSize: r.font(12) }]}>Ver detalhes ▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RoteirosFavoritosScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');

  const filtrados = busca.trim()
    ? roteirosFavoritos.filter((rt) =>
        rt.nome.toLowerCase().includes(busca.toLowerCase())
      )
    : roteirosFavoritos;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: r.scaleY(8) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: r.font(20) }]}>Roteiros Favoritos</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={[styles.searchInput, { fontSize: r.font(14) }]}
          placeholder="Nome do Roteiro"
          placeholderTextColor={Colors.textGray}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.meusRoteirosBanner} activeOpacity={0.8}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerTitle, { fontSize: r.font(20) }]}>Meus Roteiros</Text>
            <Text style={[styles.bannerSub, { fontSize: r.font(14) }]}>
              Seus roteiros públicos e privados
            </Text>
          </View>
          <Text style={[styles.bannerLink, { fontSize: r.font(13) }]}>Ver detalhes ▶</Text>
        </TouchableOpacity>

        {filtrados.map((rt) => (
          <FavoritoCard key={rt.id} roteiro={rt} />
        ))}
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
    paddingBottom: 16,
  },
  backBtn: { marginRight: 12 },
  headerTitle: { color: Colors.textWhite, fontWeight: '700' },
  searchWrapper: { paddingHorizontal: 20, marginBottom: 16 },
  searchInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textDark,
  },
  content: { paddingHorizontal: 20 },
  meusRoteirosBanner: {
    backgroundColor: '#2D2B6B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  bannerTitle: { color: Colors.textWhite, fontWeight: '700', marginBottom: 6 },
  bannerSub: { color: Colors.textWhite, opacity: 0.7 },
  bannerLink: { color: 'rgba(255,255,255,0.6)' },
  favCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  favHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  favNome: { color: '#FFFFFF', fontWeight: '700', marginBottom: 4 },
  favCidadesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  favCidades: { color: 'rgba(255,255,255,0.85)', flexShrink: 1 },
  favFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  favKm: { color: '#FFFFFF', fontWeight: '700' },
  verDetalhesBtn: {},
  verDetalhesText: { color: 'rgba(255,255,255,0.8)' },
});
