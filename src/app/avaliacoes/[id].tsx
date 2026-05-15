import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

type Review = {
  id: string;
  cityId: string;
  userId: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: any;
};

export default function AvaliacoesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [novoTexto, setNovoTexto] = useState('');
  const [novaNota, setNovaNota] = useState(5);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const q = query(collection(db, 'reviews'), where('cityId', '==', id));
      const querySnapshot = await getDocs(q);
      const items: Review[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Review);
      });
      return items;
    }
  });

  const mutation = useMutation({
    mutationFn: async (newReview: Partial<Review>) => {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        createdAt: serverTimestamp()
      });
    },
    onSuccess: () => {
      setNovoTexto('');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
    onError: (error) => {
      Alert.alert("Erro", "Você precisa estar logado para avaliar.");
    }
  });

  function handleSubmit() {
    if (!auth.currentUser) {
      Alert.alert("Atenção", "Faça login para poder enviar sua avaliação.");
      return;
    }
    if (!novoTexto.trim()) return;

    mutation.mutate({
      cityId: id,
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || auth.currentUser.email || 'Usuário',
      text: novoTexto,
      rating: novaNota
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliações</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Sua Avaliação</Text>
        <View style={styles.starsContainer}>
          {[1,2,3,4,5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setNovaNota(star)}>
              <Ionicons 
                name={star <= novaNota ? "star" : "star-outline"} 
                size={32} 
                color={Colors.primary} 
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="O que achou deste lugar?"
          placeholderTextColor={Colors.textSecondary}
          value={novoTexto}
          onChangeText={setNovoTexto}
          multiline
        />
        <TouchableOpacity 
          style={[styles.submitBtn, mutation.isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Enviar Avaliação</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Comentários da Comunidade</Text>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : reviews?.length === 0 ? (
          <Text style={styles.emptyText}>Seja o primeiro a avaliar!</Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{item.userName}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={14} color={Colors.primary} />
                    <Text style={styles.reviewRatingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  formContainer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,219,137,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewRatingText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  reviewText: {
    color: Colors.textSecondary,
    lineHeight: 22,
  }
});
