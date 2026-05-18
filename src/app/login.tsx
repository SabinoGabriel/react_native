import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ActivityIndicator, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import AuthLinkAction from '../components/auth/components/AuthLinkAction';
import AuthScreenLayout from '../components/auth/components/AuthScreenLayout';
import FormField from '../components/auth/components/FormField';
import RememberOptionsRow from '../components/auth/components/RememberOptionsRow';
import FloatingToast from '../components/ui/FloatingToast';
import CustomInput from '../components/ui/CustomInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast() {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  async function handleLogin() {
    let valido = true;
    const emailValido = EMAIL_REGEX.test(email.trim());

    if (!email.trim()) {
      setErroEmail('O e-mail é obrigatório.');
      valido = false;
    } else if (!emailValido) {
      setErroEmail('Informe um e-mail válido.');
      valido = false;
    } else {
      setErroEmail('');
    }

    if (!senha) {
      setErroSenha('A senha é obrigatória.');
      valido = false;
    } else if (emailValido && senha.length < 6) {
      setErroSenha('');
      showToast();
      return;
    } else {
      setErroSenha('');
    }

    if (valido) {
      if (!auth) {
        Alert.alert('Firebase nao configurado', 'Crie um arquivo .env com as variaveis EXPO_PUBLIC_FIREBASE_* para habilitar o login.');
        return;
      }

      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email.trim(), senha);
        router.replace('/home');
      } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          showToast();
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
        }
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <AuthScreenLayout
      title="Login"
      primaryAction={
        loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <PrimaryButton title="Login" onPress={handleLogin} />
        )
      }
      footerAction={<AuthLinkAction label="Criar conta" onPress={() => router.push('/cadastro')} />}
      overlay={<FloatingToast message="Usuário ou senha inválidos." opacity={toastOpacity} />}
    >
      <FormField error={erroEmail}>
        <CustomInput
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </FormField>

      <FormField error={erroSenha}>
        <CustomInput
          placeholder="Senha"
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
          right={
            <Pressable onPress={() => setMostrarSenha((v) => !v)}>
              <MaterialIcons
                name={mostrarSenha ? 'visibility-off' : 'visibility'}
                size={22}
                color={Colors.textGray}
              />
            </Pressable>
          }
        />
      </FormField>

      <RememberOptionsRow
        rememberValue={lembrar}
        onChangeRemember={setLembrar}
        onPressForgot={() => router.push('/redefinir')}
      />
    </AuthScreenLayout>
  );
}
