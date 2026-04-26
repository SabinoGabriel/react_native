import { useRouter } from 'expo-router';
import { useState } from 'react';
import AuthLinkAction from '../components/auth/components/AuthLinkAction';
import AuthScreenLayout from '../components/auth/components/AuthScreenLayout';
import CustomInput from '../components/ui/CustomInput';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function RedefinirScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  function handleEnviar() {
    router.push('/verificacao');
  }

  return (
    <AuthScreenLayout
      title="Redefinir Senha"
      titleAlign="center"
      description="Informe seu e-mail e enviaremos um código para redefinir sua senha."
      primaryAction={<PrimaryButton title="Enviar código" onPress={handleEnviar} />}
      footerAction={<AuthLinkAction label="Voltar ao login" onPress={() => router.push('/login')} />}
    >
      <CustomInput
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
    </AuthScreenLayout>
  );
}
