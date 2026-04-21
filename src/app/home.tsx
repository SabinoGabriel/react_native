import { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import {
  Cidade,
  categorias,
  cidadesRecomendadas,
  ultimasVisualizadas,
} from '../data/mockCidades';

function CidadeCard({ cidade }: { cidade: Cidade }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: cidade.imagemUrl }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardNome}>
          {cidade.nome}, {cidade.estado}
        </Text>
        <Text style={styles.cardRegiao}>{cidade.regiao}</Text>
        <Text style={styles.cardAvaliacao}>⭐ {cidade.avaliacao.toFixed(1)}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState<Cidade[] | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');

  function handleBusca() {
    const termo = busca.trim().toLowerCase();
    if (!termo) {
      setResultadoBusca(null);
      return;
    }
    const todas = [...cidadesRecomendadas, ...ultimasVisualizadas];
    setResultadoBusca(
      todas.filter((c) => c.nome.toLowerCase().includes(termo))
    );
  }

  const recomendadasFiltradas =
    categoriaAtiva === 'Todas'
      ? cidadesRecomendadas
      : cidadesRecomendadas.filter((c) => c.categoria === categoriaAtiva);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Busca */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor={Colors.textGray}
          value={busca}
          onChangeText={(t) => {
            setBusca(t);
            if (!t.trim()) setResultadoBusca(null);
          }}
          onSubmitEditing={handleBusca}
          returnKeyType="search"
        />
      </View>

      {/* Resultados da busca */}
      {resultadoBusca !== null && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Resultados ({resultadoBusca.length})
          </Text>
          {resultadoBusca.length === 0 ? (
            <Text style={styles.semResultado}>Nenhuma cidade encontrada.</Text>
          ) : (
            <FlatList
              horizontal
              data={resultadoBusca}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CidadeCard cidade={item} />}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      )}

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriasScroll}
        contentContainerStyle={styles.categoriasContent}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              categoriaAtiva === cat && styles.chipAtivo,
            ]}
            onPress={() => setCategoriaAtiva(cat)}
          >
            <Text
              style={[
                styles.chipTexto,
                categoriaAtiva === cat && styles.chipTextoAtivo,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cidades recomendadas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cidades recomendadas</Text>
        <FlatList
          horizontal
          data={recomendadasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CidadeCard cidade={item} />}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.semResultado}>
              Nenhuma cidade nesta categoria.
            </Text>
          }
        />
      </View>

      {/* Últimas visualizações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas visualizações</Text>
        <FlatList
          horizontal
          data={ultimasVisualizadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CidadeCard cidade={item} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const CARD_WIDTH = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: 56,
    paddingBottom: 32,
  },

  /* Busca */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232280',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: Colors.textWhite,
    fontSize: 15,
  },

  /* Categorias */
  categoriasScroll: {
    marginBottom: 24,
  },
  categoriasContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#232280',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chipAtivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipTexto: {
    color: Colors.textWhite,
    fontSize: 13,
  },
  chipTextoAtivo: {
    color: Colors.textWhite,
    fontWeight: '600',
  },

  /* Seções */
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  semResultado: {
    color: Colors.textGray,
    fontSize: 14,
    paddingHorizontal: 16,
  },

  /* Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#232280',
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 16,
  },
  cardImage: {
    width: CARD_WIDTH,
    height: 110,
  },
  cardBody: {
    padding: 10,
  },
  cardNome: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardRegiao: {
    color: Colors.textGray,
    fontSize: 12,
    marginBottom: 4,
  },
  cardAvaliacao: {
    color: Colors.textWhite,
    fontSize: 13,
  },
});
