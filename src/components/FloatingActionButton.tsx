import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <View className="absolute bottom-8 right-6">
      <TouchableOpacity 
        onPress={onPress}
        className="flex-row items-center bg-[#43BFB5] px-5 py-3.5 rounded-[20px] shadow-lg shadow-teal-500/40 active:bg-[#39A39A]"
      >
        <Feather name="plus-circle" size={18} color="white" />
        <Text className="text-white font-extrabold ml-2 text-[15px]">Compose</Text>
      </TouchableOpacity>
    </View>
  );
}
