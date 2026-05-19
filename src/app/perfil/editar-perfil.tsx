import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { doc, updateDoc } from 'firebase/firestore';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { db, isFirebaseConfigured } from '../../services/firebase';
import { useResponsive } from '../../utils/responsive';

function Field({ label, value, onChangeText, placeholder, keyboardType }: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}) {
  const r = useResponsive();
  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.fieldLabel, { fontSize: r.font(14) }]}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, { fontSize: r.font(15) }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textGray}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
}

export default function EditarPerfilScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const { user, userData, refreshUserData } = useAuth();

  const [nome, setNome] = useState(userData?.nome ?? '');
  const [telefone, setTelefone] = useState(userData?.telefone ?? '');
  const [dataNascimento, setDataNascimento] = useState(userData?.dataNascimento ?? '');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    const nomeTrim = nome.trim();
    if (!nomeTrim) {
      Alert.alert('Atenção', 'O nome não pode estar vazio.');
      return;
    }

    // DEV_FALLBACK: remove after Firebase integration is complete.
    if (!isFirebaseConfigured || !db || !user) {
      Alert.alert('Modo desenvolvimento', 'Perfil simulado. Nada foi salvo no Firebase.');
      router.back();
      return;
    }

    setSalvando(true);
    try {
      await updateDoc(doc(db, 'usuarios', user.uid), {
        nome: nomeTrim,
        ...(telefone.trim() && { telefone: telefone.trim() }),
        ...(dataNascimento.trim() && { dataNascimento: dataNascimento.trim() }),
        updatedAt: new Date().toISOString(),
      });
      await refreshUserData();
      router.back();
    } catch (error: any) {
      console.error('[editar-perfil]', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: r.scaleY(8) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: r.font(20) }]}>Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <MaterialIcons name="person" size={r.scaleX(56)} color={Colors.textWhite} />
            </View>
            <TouchableOpacity style={styles.avatarEditBtn} activeOpacity={0.8}>
              <MaterialIcons name="camera-alt" size={16} color={Colors.textWhite} />
            </TouchableOpacity>
          </View>

          <Field label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome completo" />
          <Field
            label="Email"
            value={userData?.email ?? ''}
            onChangeText={() => {}}
            keyboardType="email-address"
          />
          <Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(xx) xxxxx-xxxx" keyboardType="phone-pad" />
          <Field label="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} placeholder="DD/MM/AAAA" />

          <TouchableOpacity
            style={[styles.saveBtn, { marginTop: r.scaleY(12) }, salvando && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.saveBtnText, { fontSize: r.font(16) }]}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: { paddingHorizontal: 24, paddingTop: 8, alignItems: 'center' },
  avatarWrapper: { marginBottom: 32, position: 'relative' },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(121,116,231,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldWrapper: { alignSelf: 'stretch', marginBottom: 20 },
  fieldLabel: { color: Colors.textWhite, fontWeight: '700', marginBottom: 8 },
  fieldInput: {
    color: Colors.textDark,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  saveBtn: {
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
});
