import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export function TabBar() {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="px-6 py-2"
      contentContainerStyle={{ gap: 12, paddingRight: 48 }}
    >
      <TouchableOpacity className="flex-row items-center bg-[#0A56CF] px-5 py-3 rounded-[20px]">
        <MaterialCommunityIcons name="inbox-arrow-down" size={18} color="white" />
        <Text className="text-white font-bold ml-2 text-[14px]">Inbox</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-5 py-3 rounded-[20px]">
        <MaterialCommunityIcons name="inbox-arrow-up" size={18} color="#6B7280" />
        <Text className="text-gray-500 font-semibold ml-2 text-[14px]">Outbox</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-5 py-3 rounded-[20px]">
        <Feather name="tag" size={16} color="#6B7280" />
        <Text className="text-gray-500 font-semibold ml-2 text-[14px]">Promotions</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 px-5 py-3 rounded-[20px]">
        <Feather name="info" size={16} color="#6B7280" />
        <Text className="text-gray-500 font-semibold ml-2 text-[14px]">Social</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
