import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Logo from '../../assets/icons/logo.png';
import SplashLogoScreen from '../components/ui/SplashLogoScreen';
import { isFirebaseConfigured } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const SPLASH_MS = 3000;

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!splashDone) return;

    // Modo desenvolvimento: sem Firebase nao ha sessao para checar, vai direto pro login.
    if (!isFirebaseConfigured) {
      router.replace('/login');
      return;
    }

    // Com Firebase: espera AuthContext terminar de carregar antes de decidir a rota.
    if (loading) return;

    router.replace(user ? '/home' : '/login');
  }, [splashDone, loading, user, router]);

  return <SplashLogoScreen logoSource={Logo} />;
}
