import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import StarRating from '../components/ui/StarRating';
import { Colors } from '../constants/Colors';
import { avaliacoesComunidade } from '../data/mockAvaliacoes';
import { cidadesRecomendadas, Cidade } from '../data/mockCidades';
import { useResponsive } from '../utils/responsive';

// Mock extra city details
const detalhesExtra: Record<string, { local: string; populacao: string; valorEstimado: string; historia: string }> = {
  default: {
    local: 'Região turística, consulte informações locais.',
    populacao: '–',
    valorEstimado: 'R$ 250,00 por pessoa, ao dia',
    historia: 'Cidade com rica história e cultura, repleta de pontos turísticos únicos que atraem visitantes do mundo inteiro.',
  },
};

export default function DetalhesCidadeScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();

  const cidade: Cidade = cidadesRecomendadas.find((c) => c.id === params.id) ?? {
    id: '0',
    nome: 'Taquaritinga do Norte',
    estado: 'PE',
    regiao: 'Nordeste',
    avaliacao: 4.0,
    categoria: 'Histórico',
    imagemUrl: 'https://picsum.photos/seed/taquaritinga/400/300',
  };

  const det = detalhesExtra.default;
  const [showReviews, setShowReviews] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: cidade.imagemUrl }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.heroTitle, { fontSize: r.font(20) }]}>Detalhes</Text>
          </View>
        </View>

        {/* Likes bar */}
        <View style={styles.likesBar}>
          <View style={styles.avatarGroup}>
            {['rayssa', 'fabio', 'jonas'].map((s) => (
              <Image
                key={s}
                source={{ uri: `https://picsum.photos/seed/${s}/40/40` }}
                style={styles.miniAvatar}
              />
            ))}
          </View>
          <Text style={[styles.likesText, { fontSize: r.font(15) }]}>+20 Gostaram</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <MaterialIcons name="share" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={[styles.body, { paddingHorizontal: 20 }]}>
          <Text style={[styles.cidadeNome, { fontSize: r.font(24) }]}>{cidade.nome}</Text>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <Text style={[styles.ratingNum, { fontSize: r.font(16) }]}>{cidade.avaliacao.toFixed(1)}</Text>
            <StarRating value={cidade.avaliacao} size={18} />
            <TouchableOpacity onPress={() => setShowReviews((v) => !v)}>
              <Text style={[styles.verMaisBtn, { fontSize: r.font(14) }]}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          {!showReviews ? (
            <>
              {/* Info cards */}
              <InfoCard icon="place" title="Local" desc={`${cidade.regiao}. ${det.local}`} r={r} />
              <InfoCard icon="people" title="População Residente" desc={det.populacao} r={r} />
              <InfoCard icon="attach-money" title="Valor Estimado de Viagem" desc={det.valorEstimado} r={r} />

              {/* História */}
              <Text style={[styles.sectionTitle, { fontSize: r.font(18) }]}>História</Text>
              <Text style={[styles.historiaText, { fontSize: r.font(15) }]}>{det.historia}</Text>
            </>
          ) : (
            <>
              {/* Community reviews */}
              {avaliacoesComunidade.map((av) => (
                <View key={av.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    {av.avatarUrl ? (
                      <Image source={{ uri: av.avatarUrl }} style={styles.reviewAvatar} />
                    ) : (
                      <View style={[styles.reviewAvatar, styles.reviewAvatarLetter]}>
                        <Text style={styles.reviewAvatarLetterText}>{av.avatarLetra}</Text>
                      </View>
                    )}
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.reviewMeta}>
                        <Text style={[styles.reviewAutor, { fontSize: r.font(15) }]}>{av.autorNome}</Text>
                        <Text style={[styles.reviewData, { fontSize: r.font(13) }]}>{av.data}</Text>
                        <Text style={[styles.reviewNota, { fontSize: r.font(15) }]}>
                          {av.nota.toFixed(1)}{' '}
                          <MaterialIcons name="star" size={14} color="#F59E0B" />
                        </Text>
                      </View>
                      {av.comentario ? (
                        <Text style={[styles.reviewComentario, { fontSize: r.font(14) }]}>{av.comentario}</Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.reviewDivider} />
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  icon,
  title,
  desc,
  r,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
  r: ReturnType<typeof import('../utils/responsive').useResponsive>;
}) {
  return (
    <View style={infoStyles.card}>
      <View style={infoStyles.iconBox}>
        <MaterialIcons name={icon} size={24} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[infoStyles.title, { fontSize: r.font(15) }]}>{title}</Text>
        <Text style={[infoStyles.desc, { fontSize: r.font(14) }]}>{desc}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(121,116,231,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: Colors.textWhite, fontWeight: '700', marginBottom: 2 },
  desc: { color: 'rgba(255,255,255,0.75)' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  heroWrapper: { position: 'relative', height: 260 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  backBtn: { marginRight: 12 },
  heroTitle: { color: '#FFFFFF', fontWeight: '700' },
  likesBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarGroup: { flexDirection: 'row' },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -6,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  likesText: { color: Colors.primary, fontWeight: '600', flex: 1 },
  shareBtn: {},
  body: { paddingTop: 24 },
  cidadeNome: { color: Colors.textWhite, fontWeight: '700', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  ratingNum: { color: Colors.primary, fontWeight: '700' },
  verMaisBtn: { color: Colors.primary, marginLeft: 4 },
  sectionTitle: { color: Colors.textWhite, fontWeight: '700', marginTop: 8, marginBottom: 12 },
  historiaText: { color: 'rgba(255,255,255,0.8)', lineHeight: 24 },
  // Reviews
  reviewCard: { marginBottom: 4 },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22 },
  reviewAvatarLetter: {
    backgroundColor: '#4B4B8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarLetterText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 },
  reviewAutor: { color: Colors.primary, fontWeight: '600' },
  reviewData: { color: Colors.textGray },
  reviewNota: { color: Colors.textWhite, fontWeight: '600', marginLeft: 'auto' },
  reviewComentario: { color: 'rgba(255,255,255,0.8)' },
  reviewDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
});
