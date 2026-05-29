import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSendEmail } from '../hooks/useGmail';
import { buildMimeMessage } from '../utils/gmailParser';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface ComposerSheetProps {
  onClose: () => void;
}

export function ComposerSheet({ onClose }: ComposerSheetProps) {
  const { user } = useAuth();
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Custom Premium Header */}
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
        <TouchableOpacity onPress={onClose} className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <Feather name="x" size={20} color="#1A1C1E" />
        </TouchableOpacity>
        
        <Text className="text-lg font-black text-[#1A1C1E]">Compose</Text>
        
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
            <Feather name="paperclip" size={18} color="#6C737F" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSend}
            disabled={isPending}
            className="w-10 h-10 items-center justify-center rounded-full bg-[#0B69FF]/10"
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#0B69FF" />
            ) : (
              <Ionicons name="send" size={16} color="#0B69FF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 mt-4" showsVerticalScrollIndicator={false}>
        {/* From Field */}
        <View className="flex-row items-center border-b border-gray-100 py-3 mb-2">
          <Text className="text-gray-400 font-bold text-sm mr-2 w-14">From:</Text>
          <Text className="text-gray-800 font-semibold text-sm flex-1">{user?.email || 'arlene@mail.com'}</Text>
        </View>

        {/* To Field */}
        <View className="flex-row items-center border-b border-gray-100 py-3 mb-2">
          <Text className="text-gray-400 font-bold text-sm mr-2 w-14">To:</Text>
          <TextInput
            placeholder="recipient@mail.com"
            placeholderTextColor="#9ca3af"
            value={to}
            onChangeText={setTo}
            autoCapitalize="none"
            keyboardType="email-address"
            className="text-gray-800 font-semibold text-sm flex-1 p-0"
          />
        </View>

        {/* Subject Field */}
        <View className="flex-row items-center border-b border-gray-100 py-3 mb-4">
          <Text className="text-gray-400 font-bold text-sm mr-2 w-14">Subject:</Text>
          <TextInput
            placeholder="Design Meetup"
            placeholderTextColor="#9ca3af"
            value={subject}
            onChangeText={setSubject}
            className="text-gray-800 font-semibold text-sm flex-1 p-0"
          />
        </View>

        {/* Message Body Field */}
        <View className="flex-1 min-h-[220] py-2">
          <TextInput
            placeholder="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint..."
            placeholderTextColor="#9ca3af"
            value={body}
            onChangeText={setBody}
            multiline
            textAlignVertical="top"
            className="text-gray-800 text-sm flex-1 leading-relaxed p-0"
          />
        </View>
      </ScrollView>

      {/* Bottom keyboard accessory action bar matching the design */}
      <View className="flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <View className="flex-row items-center gap-6">
          <TouchableOpacity>
            <Feather name="image" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="file" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="camera" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="clock" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
