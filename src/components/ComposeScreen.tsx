import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export function ComposeScreen({ onClose }: { onClose: () => void }) {
  const [to, setTo] = useState('jacob23@mail.com');
  const [subject, setSubject] = useState('Design Meetup');
  const [body, setBody] = useState(
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-150">
        <TouchableOpacity 
          onPress={onClose} 
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white"
        >
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>
        
        <Text className="text-black font-extrabold text-lg">Compose</Text>
        
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white">
            <Feather name="paperclip" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white"
          >
            <Feather name="send" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          {/* Fields */}
          <View className="flex-row items-center py-4 border-b border-gray-100">
            <Text className="text-gray-400 font-semibold text-sm w-16">From:</Text>
            <Text className="text-black font-semibold text-sm">arlene@mail.com</Text>
          </View>
          
          <View className="flex-row items-center py-4 border-b border-gray-100">
            <Text className="text-gray-400 font-semibold text-sm w-16">To:</Text>
            <TextInput 
              value={to} 
              onChangeText={setTo}
              className="flex-1 text-black font-semibold text-sm p-0"
              style={{ paddingVertical: 0 }}
            />
          </View>

          <View className="flex-row items-center py-4 border-b border-gray-100">
            <Text className="text-gray-400 font-semibold text-sm w-16">Subject:</Text>
            <TextInput 
              value={subject} 
              onChangeText={setSubject}
              className="flex-1 text-black font-semibold text-sm p-0"
              style={{ paddingVertical: 0 }}
            />
          </View>

          {/* Body */}
          <TextInput
            multiline
            value={body}
            onChangeText={setBody}
            textAlignVertical="top"
            className="flex-1 text-black text-[15px] leading-6 py-6 p-0 min-h-[200px]"
            placeholder="Write your email here..."
            style={{ paddingVertical: 0 }}
          />

          <TouchableOpacity className="mt-2 mb-12">
            <Text className="text-blue-600 font-semibold text-[15px] underline">Meetup Place Here</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Accessory Bar */}
        <View className="flex-row items-center justify-around py-4 border-t border-gray-100 bg-white">
          <TouchableOpacity><Feather name="image" size={20} color="#6B7280" /></TouchableOpacity>
          <TouchableOpacity><Feather name="file-text" size={20} color="#6B7280" /></TouchableOpacity>
          <TouchableOpacity><Feather name="camera" size={20} color="#6B7280" /></TouchableOpacity>
          <TouchableOpacity><Feather name="clock" size={20} color="#6B7280" /></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
