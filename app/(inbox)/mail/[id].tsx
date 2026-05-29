import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../../src/context/AuthContext';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useArchiveEmail } from '../../../src/hooks/useGmail';

export default function MailScreen() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const router = useRouter();
  const { mutate: archiveEmail } = useArchiveEmail();
  
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    async function fetchEmailBody() {
      try {
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        
        // Parse headers
        const headers = data.payload?.headers || [];
        const getHeader = (name: string) => {
          const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
          return header ? header.value : '';
        };

        const parsedSender = getHeader('From');
        const parsedRecipient = getHeader('To');
        const parsedSubject = getHeader('Subject');

        setSender(parsedSender);
        setRecipient(parsedRecipient);
        setSubject(parsedSubject);
        
        let bodyPart = data.payload?.parts?.find((part: any) => part.mimeType === 'text/html');
        if (!bodyPart) {
          bodyPart = data.payload?.parts?.find((part: any) => part.mimeType === 'text/plain');
        }
        
        let rawBody = bodyPart?.body?.data || '';
        rawBody = rawBody.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(rawBody);

        const wrappedHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              <style>
                body { font-family: -apple-system, sans-serif; padding: 16px; margin: 0; color: #374151; font-size: 15px; line-height: 1.6; }
                img { max-width: 100%; height: auto; border-radius: 8px; }
                a { color: #0B69FF; text-decoration: none; font-weight: 600; }
              </style>
            </head>
            <body>
              ${decoded}
            </body>
          </html>
        `;
        
        setHtmlContent(wrappedHtml);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    if (id && accessToken) {
      fetchEmailBody();
    }
  }, [id, accessToken]);

  const handleArchive = () => {
    archiveEmail(id as string, {
      onSuccess: () => {
        Alert.alert('Success', 'Email archived successfully.');
        router.back();
      },
      onError: () => {
        Alert.alert('Error', 'Failed to archive email.');
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F8F9FA]">
        <ActivityIndicator size="large" color="#0B69FF" />
      </View>
    );
  }

  // Muted sender display format
  const cleanSenderName = sender.split('<')[0].trim();
  const cleanSenderEmail = sender.includes('<') ? sender.split('<')[1].replace('>', '').trim() : '';

  return (
    <View className="flex-1 bg-white">
      {/* Detail Header Actions */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-white border-b border-gray-50">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <Feather name="x" size={20} color="#1A1C1E" />
        </TouchableOpacity>
        
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={handleArchive}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Feather name="trash-2" size={18} color="#6C737F" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleArchive}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Feather name="archive" size={18} color="#6C737F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sender Details Header Card */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }} 
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-gray-900 font-bold text-base">{cleanSenderName}</Text>
            <Text className="text-gray-400 text-xs font-semibold" numberOfLines={1}>
              To: {recipient.split('<')[0].trim() || recipient}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => setIsStarred(!isStarred)}
          className={`w-10 h-10 items-center justify-center rounded-full ${isStarred ? 'bg-[#FF9F0A]/10' : 'bg-gray-50'}`}
        >
          <Ionicons 
            name={isStarred ? "star" : "star-outline"} 
            size={18} 
            color={isStarred ? "#FF9F0A" : "#6C737F"} 
          />
        </TouchableOpacity>
      </View>

      {/* Main Subject Block */}
      <View className="px-6 pb-2">
        <Text className="text-2xl font-black text-gray-900 leading-tight">
          {subject || 'Design Meetup'}
        </Text>
      </View>

      {/* Email Body Content */}
      <View className="flex-1 bg-white">
        {htmlContent ? (
          <WebView 
            source={{ html: htmlContent }} 
            originWhitelist={['*']}
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-400 font-semibold">Could not load email body.</Text>
          </View>
        )}
      </View>

      {/* Reply / Forward Footer capsule buttons matching the design */}
      <View className="flex-row items-center gap-4 px-6 py-5 border-t border-gray-50 bg-white">
        <TouchableOpacity className="flex-1 bg-gray-50 border border-gray-100 py-3.5 rounded-full flex-row items-center justify-center">
          <Feather name="corner-up-left" size={16} color="#6C737F" className="mr-2" />
          <Text className="text-gray-600 font-bold text-sm">Reply</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 bg-gray-50 border border-gray-100 py-3.5 rounded-full flex-row items-center justify-center">
          <Feather name="corner-up-right" size={16} color="#6C737F" className="mr-2" />
          <Text className="text-gray-600 font-bold text-sm">Forward</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
