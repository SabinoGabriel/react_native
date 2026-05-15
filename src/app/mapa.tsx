import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Cidade, cidadesRecomendadas } from '../data/mockCidades';

export default function MapaScreen() {
  const router = useRouter();

  const { data: cidadesFirestore, isLoading } = useQuery({
    queryKey: ['cidades'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'cities'));
      const cidades: Cidade[] = [];
      snapshot.forEach((doc) => {
        cidades.push({ id: doc.id, ...doc.data() } as Cidade);
      });
      return cidades;
    }
  });

  const cidadesAtivas = (cidadesFirestore && cidadesFirestore.length > 0) ? cidadesFirestore : cidadesRecomendadas;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa Interativo</Text>
      </View>

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: -14.2350,
          longitude: -51.9253,
          latitudeDelta: 35,
          longitudeDelta: 35,
        }}
        userInterfaceStyle="dark"
      >
        {cidadesAtivas.map((cidade) => (
          cidade.latitude && cidade.longitude ? (
            <Marker
              key={cidade.id}
              coordinate={{ latitude: cidade.latitude, longitude: cidade.longitude }}
              title={cidade.nome}
              description={`${cidade.estado} - ${cidade.categoria}`}
              onCalloutPress={() => router.push(`/cidade/${cidade.id}`)}
            />
          ) : null
        ))}
      </MapView>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={cidadesAtivas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.pinCard}
                onPress={() => router.push(`/cidade/${item.id}`)}
              >
                <View style={styles.pinIcon}>
                  <Ionicons name="location" size={24} color="#FFF" />
                </View>
                <View style={styles.pinInfo}>
                  <Text style={styles.pinTitle}>{item.nome}</Text>
                  <Text style={styles.pinSubtitle}>{item.estado} - {item.categoria}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{color: Colors.textSecondary, textAlign: 'center'}}>Nenhuma cidade mapeada.</Text>
            }
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  map: {
    height: Dimensions.get('window').height * 0.4,
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  pinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pinInfo: {
    flex: 1,
  },
  pinTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  }
});
