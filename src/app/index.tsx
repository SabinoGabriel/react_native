import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import SplashLogoScreen from '../components/ui/SplashLogoScreen';
import Logo from '../../assets/icons/logo.png';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashLogoScreen logoSource={Logo} />;
}
