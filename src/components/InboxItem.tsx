import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ParsedEmail } from '../utils/gmailParser';
import { useArchiveEmail } from '../hooks/useGmail';

interface InboxItemProps {
  email: ParsedEmail;
}

export function InboxItem({ email }: InboxItemProps) {
  const router = useRouter();
  const { mutate: archiveEmail } = useArchiveEmail();

  const handleArchive = () => {
    archiveEmail(email.id, {
      onError: (err) => {
        Alert.alert('Error', 'Failed to archive email. Plese try again.');
      }
    });
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        className="bg-red-500 justify-center px-6"
        onPress={handleArchive}
      >
        <Text className="text-white font-bold">Archive</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        className="bg-white p-4 border-b border-gray-100"
        onPress={() => router.push(`/(inbox)/mail/${email.id}`)}
      >
        <Text className="font-bold text-gray-900" numberOfLines={1}>{email.sender}</Text>
        <Text className="text-gray-800 font-semibold mt-1" numberOfLines={1}>{email.subject}</Text>
        <Text className="text-gray-500 mt-1" numberOfLines={1}>{email.snippet}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
}
