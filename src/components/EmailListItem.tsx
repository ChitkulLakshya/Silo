import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export interface EmailData {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  time: string;
  iconType: string;
}

const renderIcon = (type: string) => {
  switch (type) {
    case 'linkedin':
      return (
        <View className="w-11 h-11 rounded-xl bg-[#E8F2FE] items-center justify-center">
          <FontAwesome name="linkedin" size={22} color="#0077b5" />
        </View>
      );
    case 'google':
      return (
        <View className="w-11 h-11 rounded-xl bg-white border border-gray-150 items-center justify-center">
          <FontAwesome name="google" size={20} color="#DB4437" />
        </View>
      );
    case 'dribbble':
      return (
        <View className="w-11 h-11 rounded-xl bg-[#FEEBF3] items-center justify-center">
          <Ionicons name="basketball" size={24} color="#ea4c89" />
        </View>
      );
    case 'apple':
      return (
        <View className="w-11 h-11 rounded-xl bg-gray-100 items-center justify-center">
          <FontAwesome name="apple" size={22} color="black" />
        </View>
      );
    case 'design_team':
      return (
        <View className="w-11 h-11 rounded-xl bg-[#EEF2FF] items-center justify-center">
          <MaterialCommunityIcons name="account-group-outline" size={22} color="#4F46E5" />
        </View>
      );
    default:
      return (
        <View className="w-11 h-11 rounded-xl bg-gray-200 items-center justify-center">
          <Text className="text-gray-500 font-bold text-base">{type.charAt(0).toUpperCase()}</Text>
        </View>
      );
  }
};

export function EmailListItem({ email, onPress }: { email: EmailData; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row px-6 py-3.5 bg-white active:bg-gray-50">
      {renderIcon(email.iconType)}
      <View className="flex-1 ml-4 justify-center">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-black font-extrabold text-[15px]">{email.sender}</Text>
          <Text className="text-gray-400 text-[12px] font-bold">{email.time}</Text>
        </View>
        <Text className="text-black font-bold text-[13px] mb-1" numberOfLines={1}>{email.subject}</Text>
        <Text className="text-gray-400 text-[13px] font-medium" numberOfLines={1}>{email.snippet}</Text>
      </View>
    </TouchableOpacity>
  );
}
