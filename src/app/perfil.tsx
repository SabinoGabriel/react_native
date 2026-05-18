import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useResponsive } from '../utils/responsive';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

type MenuItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
};

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  const r = useResponsive();
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <MaterialIcons name={icon} size={r.scaleX(26)} color={Colors.textWhite} style={styles.menuIcon} />
      <Text style={[styles.menuLabel, { fontSize: r.font(18) }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function PerfilMenuScreen() {
  const router = useRouter();
  const r = useResponsive();
  const insets = useSafeAreaInsets();
  const { userData, loading } = useAuth();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.replace('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={r.scaleX(48)} color={Colors.textWhite} />
          </View>
        </View>
        <Text style={[styles.name, { fontSize: r.font(22) }]}>{userData?.nome || 'Usuário'}</Text>

        <View style={styles.divider} />

        <MenuItem icon="person-outline" label="Meu Perfil" onPress={() => router.push('/meu-perfil')} />
        <MenuItem icon="bookmark-border" label="Roteiros Favoritos" onPress={() => router.push('/roteiros-favoritos')} />
        <MenuItem icon="star-border" label="Minhas Avaliações" onPress={() => router.push('/avaliacoes')} />
        <MenuItem icon="auto-awesome" label="Preferências" onPress={() => {}} />
        <MenuItem icon="settings" label="Configurações" onPress={() => router.push('/configuracoes')} />
        <MenuItem icon="logout" label="Sair da conta" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 28, paddingTop: 32 },
  topRow: { marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(121,116,231,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  name: {
    color: Colors.textWhite,
    fontWeight: '700',
    marginBottom: 20,
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  menuIcon: { marginRight: 16 },
  menuLabel: { color: Colors.textWhite, fontWeight: '500' },
});
