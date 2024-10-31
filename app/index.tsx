import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'DUMMY_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'DUMMY_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'DUMMY_WEB_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/gmail.modify'],
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(inbox)');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        login(authentication.accessToken).then(() => {
          router.replace('/(inbox)');
        });
      }
    }
  }, [response, login, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold mb-8 text-black">Zen Mail</Text>
      <TouchableOpacity 
        className="bg-black px-8 py-4 rounded-full"
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text className="text-white font-semibold text-lg">Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
