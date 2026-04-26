import { useRouter } from 'expo-router';
import { useState } from 'react';
import AuthLinkAction from '../components/auth/components/AuthLinkAction';
import AuthScreenLayout from '../components/auth/components/AuthScreenLayout';
import OtpInputRow from '../components/auth/components/OtpInputRow';
import PrimaryButton from '../components/ui/PrimaryButton';

export default function VerificacaoScreen() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');

  function handleVerificar() {
    router.replace('/');
  }

  function handleReenviar() {
    console.warn('Reenvio de código ainda não implementado.');
  }

  return (
    <AuthScreenLayout
      title="Verificação"
      titleAlign="center"
      description="Digite o código de 6 dígitos enviado para o seu e-mail."
      primaryAction={<PrimaryButton title="Verificar" onPress={handleVerificar} />}
      footerAction={<AuthLinkAction label="Reenviar código" onPress={handleReenviar} />}
    >
      <OtpInputRow value={codigo} onChange={setCodigo} />
    </AuthScreenLayout>
  );
}
