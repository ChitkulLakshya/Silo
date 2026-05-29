import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ParsedEmail } from '../utils/gmailParser';
import { useArchiveEmail } from '../hooks/useGmail';
import { Ionicons } from '@expo/vector-icons';

interface InboxItemProps {
  email: ParsedEmail;
}

// Function to generate a premium company logo or avatar based on the sender name
const renderAvatar = (sender: string) => {
  const normalizedSender = sender.toLowerCase();
  
  if (normalizedSender.includes('linkedin')) {
    return (
      <View className="w-11 h-11 bg-[#0077B5] rounded-full items-center justify-center">
        <Text className="text-white font-extrabold text-lg lowercase">in</Text>
      </View>
    );
  }
  
  if (normalizedSender.includes('google')) {
    return (
      <View className="w-11 h-11 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm">
        <Text className="text-[#4285F4] font-black text-xl">G</Text>
      </View>
    );
  }
  
  if (normalizedSender.includes('dribbble')) {
    return (
      <View className="w-11 h-11 bg-[#EA4C89] rounded-full items-center justify-center">
        <Ionicons name="basketball-outline" size={20} color="#FFFFFF" />
      </View>
    );
  }
  
  if (normalizedSender.includes('apple')) {
    return (
      <View className="w-11 h-11 bg-black rounded-full items-center justify-center">
        <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
      </View>
    );
  }
  
  if (normalizedSender.includes('design')) {
    return (
      <View className="w-11 h-11 bg-[#6C5CE7] rounded-full items-center justify-center">
        <Text className="text-white font-extrabold text-sm uppercase">DT</Text>
      </View>
    );
  }

  // Fallback: Muted pastel circular avatar with sender initials
  const initials = sender.trim().substring(0, 2).toUpperCase();
  const colors = [
    'bg-[#A8E6CF]', 'bg-[#DCEDC1]', 'bg-[#FFD3B6]', 
    'bg-[#FFAAA6]', 'bg-[#FF8B94]', 'bg-[#D1A3F4]',
    'bg-[#A3D2F4]', 'bg-[#F4D3A3]', 'bg-[#A3F4DF]'
  ];
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < sender.length; i++) {
    hash = sender.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  
  return (
    <View className={`w-11 h-11 ${colors[colorIndex]} rounded-full items-center justify-center`}>
      <Text className="text-gray-800 font-extrabold text-sm uppercase">{initials}</Text>
    </View>
  );
};

export function InboxItem({ email }: InboxItemProps) {
  const router = useRouter();
  const { mutate: archiveEmail } = useArchiveEmail();

  const handleArchive = () => {
    archiveEmail(email.id, {
      onError: (err) => {
        Alert.alert('Error', 'Failed to archive email. Please try again.');
      }
    });
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        className="bg-red-500 justify-center px-6 rounded-r-2xl"
        onPress={handleArchive}
      >
        <Text className="text-white font-extrabold tracking-wide">Archive</Text>
      </TouchableOpacity>
    );
  };

  // Mock timestamp for exact replica styling
  const mockTimes = ['6:20 pm', '6:22 pm', '8:10 pm', '4:32 am'];
  let hash = 0;
  for (let i = 0; i < email.id.length; i++) {
    hash = email.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const time = mockTimes[Math.abs(hash) % mockTimes.length];

  return (
    <View className="px-6 py-1 bg-transparent">
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity 
          activeOpacity={0.7}
          className="flex-row bg-white p-4 rounded-2xl shadow-sm border border-gray-50/50"
          onPress={() => router.push(`/(inbox)/mail/${email.id}`)}
        >
          {renderAvatar(email.sender)}
          
          <View className="flex-1 ml-3.5 pr-2">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-bold text-gray-900 text-[15px]" numberOfLines={1}>
                {email.sender.split('<')[0].trim()}
              </Text>
              <Text className="text-[11px] font-bold text-gray-400">{time}</Text>
            </View>
            <Text className="text-gray-800 font-bold text-xs mb-0.5" numberOfLines={1}>
              {email.subject}
            </Text>
            <Text className="text-gray-400 text-xs" numberOfLines={1}>
              {email.snippet}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
}
