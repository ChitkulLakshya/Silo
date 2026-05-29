import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function Header() {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white">
      <View className="flex-row items-center">
        <View className="relative">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' }}
            className="w-10 h-10 rounded-xl bg-yellow-100 border border-yellow-200"
          />
          <View className="absolute bottom-[-1px] right-[-1px] w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </View>
        <View className="ml-3">
          <Text className="text-black font-extrabold text-sm">arlene@mail.com</Text>
          <TouchableOpacity>
            <Text className="text-blue-600 text-[12px] font-semibold mt-0.5">Change email</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white">
          <Feather name="search" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-white">
          <Feather name="grid" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
