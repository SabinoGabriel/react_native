import { useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import HomeScreenContent from '../components/home/HomeScreenContent';
import { Cidade, cidadesRecomendadas, ultimasVisualizadas } from '../data/mockCidades';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Colors } from '../constants/Colors';

type NavKey = 'explorar' | 'roteiro' | 'mapa' | 'perfil';

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState<Cidade[] | null>(null);
  const [navAtivo, setNavAtivo] = useState<NavKey>('explorar');

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

  // Se não tiver nada no Firebase ainda, usa o mock para o app não ficar vazio
  const recomendadasFiltradas = cidadesFirestore && cidadesFirestore.length > 0 
    ? cidadesFirestore 
    : cidadesRecomendadas;

  const ultimas = cidadesFirestore && cidadesFirestore.length > 0 
    ? cidadesFirestore.slice(0, 3) 
    : ultimasVisualizadas;

  function handleBusca() {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      setResultadoBusca(null);
      return;
    }
    const todas = [...recomendadasFiltradas, ...ultimas];
    setResultadoBusca(todas.filter((c) => c.nome.toLowerCase().includes(termo)));
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ color: Colors.textSecondary, marginTop: 16 }}>Carregando cidades...</Text>
      </View>
    );
  }


  return (
    <HomeScreenContent
      busca={busca}
      resultadoBusca={resultadoBusca}
      recomendadas={recomendadasFiltradas}
      ultimas={ultimas}
      navAtivo={navAtivo}
      onChangeBusca={(t) => {
        setBusca(t);
        if (!t.trim()) setResultadoBusca(null);
      }}
      onSubmitBusca={handleBusca}
      onChangeNav={setNavAtivo}
    />
  );
}
