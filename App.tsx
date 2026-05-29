import React, { useState, useEffect } from 'react';
import { SectionList, Text, View, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './src/components/Header';
import { TabBar } from './src/components/TabBar';
import { EmailListItem, EmailData } from './src/components/EmailListItem';
import { FloatingActionButton } from './src/components/FloatingActionButton';
import { ComposeScreen } from './src/components/ComposeScreen';
import { EmailDetailsScreen } from './src/components/EmailDetailsScreen';
import { LoginScreen } from './src/components/LoginScreen';
import { initDB } from './src/store/database';
import { isAuthenticated } from './src/utils/auth';
import './global.css';

const EMAIL_DATA = [
  {
    title: 'Today',
    data: [
      {
        id: '1',
        sender: 'Linkedin Job Alerts',
        subject: "24+ new job for 'Product Designer'",
        snippet: 'Product Designer and other roles available...',
        time: '6:20 pm',
        iconType: 'linkedin',
      },
      {
        id: '2',
        sender: 'Google',
        subject: 'Critical security alert',
        snippet: 'Some of your saved passwords were found in...',
        time: '6:22 pm',
        iconType: 'google',
      },
      {
        id: '3',
        sender: 'Dribbble',
        subject: 'Comment on Super ⭐',
        snippet: 'Dribbble Hi Arlene, You have a new comment...',
        time: '8:10 pm',
        iconType: 'dribbble',
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: '4',
        sender: 'Apple',
        subject: 'Your receipt from Apple.',
        snippet: 'Your Apple ID was used to purchase...',
        time: '6:20 pm',
        iconType: 'apple',
      },
      {
        id: '5',
        sender: 'Design Team',
        subject: 'Design meeting',
        snippet: 'Hello Everyone, We have a team...',
        time: '4:32 am',
        iconType: 'design_team',
      },
      {
        id: '6',
        sender: 'Dribbble',
        subject: 'Comment on Packgy',
        snippet: 'Dribbble Hi Arlene, You have a new comment...',
        time: '6:22 pm',
        iconType: 'dribbble',
      },
    ],
  },
];

type Screen = 'loading' | 'login' | 'inbox' | 'compose' | 'details';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('loading');
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Initialize the SQLite local database
        await initDB();
        
        // Check if the user has an existing refresh token in secure storage
        const authenticated = await isAuthenticated();
        
        if (authenticated) {
          setCurrentScreen('inbox');
        } else {
          setCurrentScreen('login');
        }
      } catch (e) {
        console.error("App initialization failed", e);
        setCurrentScreen('login');
      }
    }
    
    prepareApp();
  }, []);

  const handleSelectEmail = (email: EmailData) => {
    setSelectedEmail(email);
    setCurrentScreen('details');
  };

  if (currentScreen === 'loading') {
    return (
      <View className="flex-1 bg-[#F9FAFB] items-center justify-center">
        <ActivityIndicator size="large" color="#0A56CF" />
      </View>
    );
  }

  if (currentScreen === 'login') {
    return (
      <SafeAreaProvider>
        <LoginScreen onLoginSuccess={() => setCurrentScreen('inbox')} />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'compose') {
    return (
      <SafeAreaProvider>
        <ComposeScreen onClose={() => setCurrentScreen('inbox')} />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'details' && selectedEmail) {
    return (
      <SafeAreaProvider>
        <EmailDetailsScreen email={selectedEmail} onClose={() => setCurrentScreen('inbox')} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        
        <Header />
        
        <View className="px-6 pt-6 pb-6">
          <Text className="text-[32px] font-extrabold text-black leading-tight tracking-tight">
            24 unread mail{'\n'}in inbox
          </Text>
        </View>

        <View className="mb-4">
          <TabBar />
        </View>

        <SectionList
          sections={EMAIL_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EmailListItem email={item} onPress={() => handleSelectEmail(item)} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className="px-6 py-2 bg-[#F9FAFB] mt-4">
              <Text className="text-gray-800 font-extrabold text-[15px]">{title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={true}
        />

        <FloatingActionButton onPress={() => setCurrentScreen('compose')} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
