import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export function EmailDetailsScreen({ email, onClose }: { email: any; onClose: () => void }) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <TouchableOpacity 
          onPress={onClose} 
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white"
        >
          <Feather name="x" size={20} color="black" />
        </TouchableOpacity>
        
        <View className="flex-row gap-2">
          <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white">
            <Feather name="trash-2" size={18} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white">
            <MaterialCommunityIcons name="archive-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Sender Card */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' }}
              className="w-10 h-10 rounded-xl bg-yellow-100"
            />
            <View className="ml-3">
              <Text className="text-black font-bold text-[15px]">{email.sender}</Text>
              <Text className="text-gray-400 text-xs mt-0.5 font-semibold">to: jacob23@mail.com</Text>
            </View>
          </View>
          
          <TouchableOpacity className="w-10 h-10 rounded-xl bg-[#FFF6E9] items-center justify-center">
            <FontAwesome name="star" size={18} color="#FF9C07" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="text-black font-bold text-[24px] leading-8 mb-6">{email.subject}</Text>

        {/* Content Body */}
        <Text className="text-gray-800 text-[15px] leading-6 mb-4">
          Hey Jacob,
        </Text>
        <Text className="text-gray-800 text-[15px] leading-6 mb-6">
          {email.snippet} Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
        </Text>
        <Text className="text-gray-800 text-[15px] leading-6 mb-8">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
        </Text>

        <TouchableOpacity className="mb-12">
          <Text className="text-blue-600 font-semibold text-[15px] underline">Meetup Place Here</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity 
            onPress={onClose}
            className="flex-row flex-1 items-center justify-center bg-white border border-gray-200 py-3.5 rounded-[20px] active:bg-gray-50"
          >
            <Feather name="corner-up-left" size={16} color="#4B5563" />
            <Text className="text-gray-800 font-bold ml-2 text-[14px]">Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onClose}
            className="flex-row flex-1 items-center justify-center bg-white border border-gray-200 py-3.5 rounded-[20px] active:bg-gray-50"
          >
            <Feather name="corner-up-right" size={16} color="#4B5563" />
            <Text className="text-gray-800 font-bold ml-2 text-[14px]">Forward</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
