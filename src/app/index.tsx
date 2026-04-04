import { Stack } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { Colors } from '../constants/Colors';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Image
        source={{
          uri: 'https://img.icons8.com/fluency/256/airplane-take-off.png',
        }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
