import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import StarRating from '../../components/ui/StarRating';
import { Colors } from '../../constants/Colors';
import { minhasAvaliacoes, Avaliacao } from '../../data/mockAvaliacoes';
import { useResponsive } from '../../utils/responsive';

export default function AvaliacoesScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(minhasAvaliacoes);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [novaNota, setNovaNota] = useState(1);
  const [novaCidade, setNovaCidade] = useState('');
  const [novoEstado, setNovoEstado] = useState('');
  const [novoComentario, setNovoComentario] = useState('');
  const [novaPublica, setNovaPublica] = useState(true);

  const totalDestinos = avaliacoes.length;
  const mediaNotas =
    totalDestinos > 0
      ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / totalDestinos).toFixed(1)
      : '0.0';

  function handleAddAvaliacao() {
    if (!novaCidade.trim()) return;
    const nova: Avaliacao = {
      id: Date.now().toString(),
      cidadeNome: novaCidade.trim(),
      cidadeEstado: novoEstado.trim(),
      nota: novaNota,
      data: new Date().toLocaleDateString('pt-BR'),
      comentario: novoComentario.trim(),
      publica: novaPublica,
    };
    setAvaliacoes((prev) => [nova, ...prev]);
    setNovaCidade('');
    setNovoEstado('');
    setNovoComentario('');
    setNovaNota(1);
    setNovaPublica(true);
    setModalVisible(false);
  }

  function handleDelete(id: string) {
    setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: r.scaleY(8) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: r.font(20) }]}>Minhas Avaliações</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.userName, { fontSize: r.font(20) }]}>Isabella Arruda</Text>
        <View style={styles.divider} />
        <Text style={[styles.stat, { fontSize: r.font(15) }]}>
          <Text style={styles.statHighlight}>• {totalDestinos} destinos avaliados</Text>
        </Text>
        <View style={styles.statRow}>
          <Text style={[styles.statHighlight, { fontSize: r.font(15) }]}>• média de {mediaNotas}</Text>
          <MaterialIcons name="star" size={16} color="#F59E0B" style={{ marginLeft: 4 }} />
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setModalVisible(true)}>
              <MaterialIcons name="add" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, styles.iconBtnFilled]} onPress={() => setEditMode((v) => !v)}>
              <MaterialIcons name="edit" size={18} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.divider} />

        {avaliacoes.map((av) => (
          <View key={av.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <MaterialIcons name="place" size={18} color={Colors.textWhite} />
                <Text style={[styles.cardCidade, { fontSize: r.font(16) }]}>
                  {av.cidadeNome}, {av.cidadeEstado}
                </Text>
              </View>
              <TouchableOpacity style={styles.verCidadeBtn} onPress={() => {}}>
                <Text style={[styles.verCidadeText, { fontSize: r.font(12) }]}>Ver cidade→</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardStarRow}>
              <StarRating value={av.nota} size={18} />
              <Text style={[styles.cardData, { fontSize: r.font(12) }]}>{av.data}</Text>
            </View>
            <View style={styles.cardDivider} />
            {av.comentario ? (
              <Text style={[styles.cardComentario, { fontSize: r.font(13) }]}>{av.comentario}</Text>
            ) : null}
            {editMode && (
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(av.id)}>
                <MaterialIcons name="delete" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={[styles.modalLabel, { fontSize: r.font(16) }]}>Avaliação:</Text>
            <StarRating value={novaNota} size={28} onPress={setNovaNota} />

            <View style={styles.modalRow}>
              <Text style={[styles.modalLabel, { fontSize: r.font(16) }]}>Local:</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Cidade"
                placeholderTextColor={Colors.textGray}
                value={novaCidade}
                onChangeText={setNovaCidade}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Estado"
                placeholderTextColor={Colors.textGray}
                value={novoEstado}
                onChangeText={setNovoEstado}
              />
            </View>

            <Text style={[styles.modalLabel, { fontSize: r.font(16), marginTop: 12 }]}>
              Classificação Detalhada:
            </Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Até 200 Caracteres..."
              placeholderTextColor={Colors.textGray}
              multiline
              maxLength={200}
              value={novoComentario}
              onChangeText={setNovoComentario}
            />

            <View style={styles.modalFooter}>
              <View style={styles.switchRow}>
                <Switch
                  value={novaPublica}
                  onValueChange={setNovaPublica}
                  trackColor={{ true: Colors.primary, false: Colors.textGray }}
                />
                <Text style={[styles.switchLabel, { fontSize: r.font(14) }]}>Público</Text>
              </View>
              <Pressable style={styles.enviarBtn} onPress={handleAddAvaliacao}>
                <Text style={[styles.enviarText, { fontSize: r.font(14) }]}>ENVIAR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  userName: { color: Colors.textWhite, fontWeight: '700', marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#3F3F8A', marginVertical: 8 },
  stat: { color: Colors.textWhite },
  statHighlight: { color: '#F59E0B', fontWeight: '600' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  actionButtons: { flexDirection: 'row', marginLeft: 'auto', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnFilled: { backgroundColor: '#3D3D8E' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardCidade: { color: Colors.textWhite, fontWeight: '700' },
  verCidadeBtn: {
    backgroundColor: 'rgba(121,116,231,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verCidadeText: { color: Colors.textWhite },
  cardStarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  cardData: { color: Colors.textGray },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 10 },
  cardComentario: { color: Colors.textWhite },
  deleteBtn: { position: 'absolute', right: 12, bottom: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 8,
  },
  modalLabel: { color: Colors.textDark, fontWeight: '700' },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  modalInput: {
    flex: 1,
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: Colors.textDark,
  },
  modalTextArea: {
    height: 100,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingTop: 10,
    color: Colors.textDark,
    textAlignVertical: 'top',
  },
  modalFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { color: Colors.textDark },
  enviarBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enviarText: { color: Colors.textWhite, fontWeight: '700' },
});
