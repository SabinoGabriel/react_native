import React from 'react'; // aria-label
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Cidade, cidadesRecomendadas, ultimasVisualizadas } from '../../data/mockCidades';

export default function CidadeDetalhes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: cidade, isLoading } = useQuery({
    queryKey: ['cidade', id],
    queryFn: async () => {
      const docRef = doc(db, 'cities', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Cidade;
      }
      
      // Fallback para mock local caso o firebase esteja vazio (para estudantes/teste)
      const mockTodas = [...cidadesRecomendadas, ...ultimasVisualizadas];
      const mockCidade = mockTodas.find(c => c.id === id);
      return mockCidade || null;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!cidade) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.textSecondary }}>Cidade não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: cidade.imagemUrl }} style={styles.image} />
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{cidade.nome}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color={Colors.primary} />
            <Text style={styles.ratingText}>{cidade.avaliacao.toFixed(1)}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{cidade.estado} - {cidade.regiao}</Text>
        
        <Text style={styles.sectionTitle}>Sobre a cidade</Text>
        <Text style={styles.description}>
          Conheça {cidade.nome}, um dos destinos mais incríveis da região {cidade.regiao}.
          Aqui você encontrará diversas atrações focadas em {cidade.categoria}.
        </Text>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push(`/roteiro/${cidade.id}`)}
          >
            <Ionicons name="map-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Ver Roteiros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push(`/avaliacoes/${cidade.id}`)}
          >
            <Ionicons name="chatbubbles-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionText}>Avaliações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.background,
    marginTop: -30,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 219, 137, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'column',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  }
});
