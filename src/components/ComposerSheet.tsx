import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSendEmail } from '../hooks/useGmail';
import { buildMimeMessage } from '../utils/gmailParser';

interface ComposerSheetProps {
  onClose: () => void;
}

export function ComposerSheet({ onClose }: ComposerSheetProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { mutate: sendEmail, isPending } = useSendEmail();

  const handleSend = () => {
    if (!to || !subject || !body) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const base64Message = buildMimeMessage(to, subject, body);
      sendEmail(base64Message, {
        onSuccess: () => {
          Alert.alert('Success', 'Email sent successfully.');
          setTo('');
          setSubject('');
          setBody('');
          onClose();
        },
        onError: (err) => {
          Alert.alert('Error', 'Failed to send email. Please try again.');
          console.error(err);
        }
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to format email.');
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-black">New Message</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-gray-500 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View className="border-b border-gray-100 py-2 mb-4">
          <TextInput
            placeholder="To"
            placeholderTextColor="#9ca3af"
            value={to}
            onChangeText={setTo}
            autoCapitalize="none"
            keyboardType="email-address"
            className="text-black text-base"
          />
        </View>

        <View className="border-b border-gray-100 py-2 mb-4">
          <TextInput
            placeholder="Subject"
            placeholderTextColor="#9ca3af"
            value={subject}
            onChangeText={setSubject}
            className="text-black text-base"
          />
        </View>

        <View className="flex-1 py-2 mb-4">
          <TextInput
            placeholder="Write your message here..."
            placeholderTextColor="#9ca3af"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            className="text-black text-base flex-1 min-h-[150]"
          />
        </View>
      </View>

      <TouchableOpacity 
        className="bg-black w-full py-4 rounded-full items-center justify-center mt-4 mb-6"
        onPress={handleSend}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">Send</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
