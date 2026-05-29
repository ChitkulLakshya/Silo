import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { saveTokens } from '../utils/auth';

WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  // Using Expo Auth Session for Google
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID || 'dummy-android-client-id.apps.googleusercontent.com',
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || 'dummy-ios-client-id.apps.googleusercontent.com',
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID || 'dummy-web-client-id.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/gmail.modify'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        saveTokens(authentication.accessToken, authentication.refreshToken).then(() => {
          onLoginSuccess();
        });
      }
    }
  }, [response]);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View className="flex-1 items-center justify-center px-8">
        
        {/* Logo Section */}
        <View className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200 items-center justify-center mb-8 border border-gray-100">
          <MaterialCommunityIcons name="shield-lock-outline" size={48} color="#0A56CF" />
        </View>

        <Text className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          SILO
        </Text>
        <Text className="text-lg text-gray-500 font-medium text-center mb-12">
          Enterprise Secure Mail
        </Text>

        {/* Action Section */}
        <View className="w-full">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => promptAsync()}
            disabled={!request}
            className="w-full bg-[#0A56CF] rounded-2xl py-4 flex-row items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <MaterialCommunityIcons name="google" size={24} color="#ffffff" className="mr-3" />
            <Text className="text-white font-bold text-lg ml-2">Connect Work Email</Text>
          </TouchableOpacity>
        </View>

        {/* Security Microcopy */}
        <View className="mt-8 bg-gray-100 rounded-2xl p-4 flex-row items-start border border-gray-200">
          <Feather name="info" size={20} color="#4B5563" className="mt-0.5" />
          <Text className="text-sm text-gray-600 font-medium ml-3 flex-1 leading-relaxed">
            Your data is saved locally on this device. This connection is strictly sandboxed to email and will <Text className="font-bold text-gray-900">never</Text> sync with your device's Google Photos, Drive, or system accounts.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
