import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import AuthLinkAction from '../components/auth/components/AuthLinkAction';
import AuthScreenLayout from '../components/auth/components/AuthScreenLayout';
import FormField from '../components/auth/components/FormField';
import CustomInput from '../components/ui/CustomInput';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Colors } from '../constants/Colors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroConfirmar, setErroConfirmar] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    let valido = true;

    if (!nome.trim()) {
      setErroNome('O nome é obrigatório.');
      valido = false;
    } else {
      setErroNome('');
    }

    if (!email.trim()) {
      setErroEmail('O e-mail é obrigatório.');
      valido = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setErroEmail('Informe um e-mail válido.');
      valido = false;
    } else {
      setErroEmail('');
    }

    if (!senha) {
      setErroSenha('A senha é obrigatória.');
      valido = false;
    } else if (senha.length < 6) {
      setErroSenha('A senha deve ter no mínimo 6 caracteres.');
      valido = false;
    } else {
      setErroSenha('');
    }

    if (!confirmarSenha) {
      setErroConfirmar('Confirme a sua senha.');
      valido = false;
    } else if (confirmarSenha !== senha) {
      setErroConfirmar('As senhas não coincidem.');
      valido = false;
    } else {
      setErroConfirmar('');
    }

    if (valido) {
      // Modo desenvolvimento: Firebase ausente -> nao chama Auth/Firestore,
      // simula o cadastro e volta para /login para permitir testar a navegacao.
      if (!isFirebaseConfigured || !auth || !db) {
        Alert.alert(
          'Modo desenvolvimento',
          'Cadastro simulado. Como o Firebase não está configurado, nenhuma conta real foi criada.',
          [{ text: 'OK', onPress: () => router.replace('/login') }],
        );
        return;
      }

      setLoading(true);
      let contaCriada = false;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
        const user = userCredential.user;
        contaCriada = true;

        await setDoc(doc(db, 'usuarios', user.uid), {
          nome: nome.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
          preferenciasConcluidas: false,
          preferencias: {},
        });

        // createUserWithEmailAndPassword loga automaticamente; saimos para forcar o fluxo
        // de login manual e cair no onboarding de preferencias depois.
        await signOut(auth);

        router.replace('/login');
      } catch (error: any) {
        console.error('[cadastro]', error);
        let mensagem = 'Erro ao criar conta. Tente novamente.';

        if (contaCriada) {
          // Conta criada no Auth mas Firestore falhou
          mensagem =
            'Sua conta foi criada, mas nao foi possivel salvar seu perfil. ' +
            'Verifique as Regras do Firestore (colecao "usuarios") e tente fazer login.';
          // Garante que nao fique logado num estado inconsistente
          try { await signOut(auth); } catch {}
          router.replace('/login');
        } else if (error.code === 'auth/email-already-in-use') {
          mensagem = 'Este e-mail já está em uso.';
        } else if (error.code === 'auth/invalid-email') {
          mensagem = 'Informe um e-mail válido.';
        } else if (error.code === 'auth/weak-password') {
          mensagem = 'A senha precisa ter pelo menos 6 caracteres.';
        } else if (error.code === 'auth/network-request-failed') {
          mensagem = 'Falha de conexão. Verifique sua internet.';
        }

        Alert.alert('Erro', mensagem);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <AuthScreenLayout
      title="Cadastro"
      primaryAction={
        loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <PrimaryButton title="Cadastrar" onPress={handleCadastro} />
        )
      }
      footerAction={<AuthLinkAction label="Já possui conta? Faça o Login" onPress={() => router.push('/login')} />}
    >
      <FormField error={erroNome}>
        <CustomInput
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />
      </FormField>

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

      <FormField error={erroConfirmar}>
        <CustomInput
          placeholder="Confirmar senha"
          secureTextEntry={!mostrarConfirmar}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          right={
            <Pressable onPress={() => setMostrarConfirmar((v) => !v)}>
              <MaterialIcons
                name={mostrarConfirmar ? 'visibility-off' : 'visibility'}
                size={22}
                color={Colors.textGray}
              />
            </Pressable>
          }
        />
      </FormField>
    </AuthScreenLayout>
  );
}
