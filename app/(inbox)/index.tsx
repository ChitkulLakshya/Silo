import React, { useCallback, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useEmails } from '../../src/hooks/useGmail';
import { InboxItem } from '../../src/components/InboxItem';
import { ComposerSheet } from '../../src/components/ComposerSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

export default function InboxScreen() {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useEmails();
  
  const { user } = useAuth();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [activeCategory, setActiveCategory] = useState('Inbox');

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderItem = useCallback(({ item }: any) => {
    return <InboxItem email={item} />;
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#0B69FF" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#F8F9FA] items-center justify-center">
        <ActivityIndicator size="large" color="#0B69FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#F8F9FA] items-center justify-center p-6">
        <Text className="text-red-500 font-semibold text-center">Error loading emails</Text>
      </View>
    );
  }

  const emails = data?.pages.flatMap((page) => page.emails) ?? [];

  // Group emails for Today / Yesterday view matching the design mockup
  const todayEmails = emails.slice(0, 3);
  const yesterdayEmails = emails.slice(3);

  const categories = [
    { name: 'Inbox', icon: 'mail-outline', count: emails.length },
    { name: 'Outbox', icon: 'send-outline' },
    { name: 'Promotions', icon: 'pricetag-outline' },
    { name: 'Social', icon: 'people-outline' },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FA]">
      {/* Premium Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-[#F8F9FA]">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }} 
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-gray-900 font-bold text-sm">{user?.email || 'arlene@mail.com'}</Text>
            <TouchableOpacity>
              <Text className="text-gray-400 text-xs font-semibold">Change email</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
            <Feather name="search" size={18} color="#1A1C1E" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
            <Feather name="grid" size={18} color="#1A1C1E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Headline */}
      <View className="px-6 py-4">
        <Text className="text-3xl font-extrabold text-gray-900 leading-tight">
          {emails.length} unread mail{'\n'}in inbox
        </Text>
      </View>

      {/* Horizontal Category Scroll */}
      <View className="py-2">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setActiveCategory(cat.name)}
                className={`flex-row items-center px-4 py-2.5 rounded-full ${
                  isActive ? 'bg-[#0B69FF]' : 'bg-white border border-gray-100'
                }`}
                style={isActive ? { shadowColor: '#0B69FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 } : null}
              >
                <Ionicons 
                  name={cat.icon as any} 
                  size={16} 
                  color={isActive ? '#FFFFFF' : '#6C737F'} 
                />
                <Text className={`ml-2 font-bold text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Email List grouped by Today / Yesterday */}
      <ScrollView 
        className="flex-1 mt-4" 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {emails.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <Text className="text-lg font-semibold text-gray-400">Your inbox is empty.</Text>
          </View>
        ) : (
          <>
            {todayEmails.length > 0 && (
              <View className="mb-6">
                <Text className="px-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Today</Text>
                {todayEmails.map((email) => (
                  <InboxItem key={email.id} email={email} />
                ))}
              </View>
            )}

            {yesterdayEmails.length > 0 && (
              <View>
                <Text className="px-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Yesterday</Text>
                {yesterdayEmails.map((email) => (
                  <InboxItem key={email.id} email={email} />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button - FAB matching the design */}
      <TouchableOpacity 
        activeOpacity={0.8}
        className="absolute bottom-8 right-6 bg-[#35C2C1] px-5 py-3.5 rounded-2xl flex-row items-center shadow-lg"
        style={{ shadowColor: '#35C2C1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 }}
        onPress={handlePresentModalPress}
      >
        <Feather name="plus" size={18} color="#FFFFFF" className="mr-1.5" />
        <Text className="text-white font-extrabold text-sm tracking-wide">Compose</Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%', '92%']}
        index={1}
        backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius: 32 }}
      >
        <ComposerSheet onClose={() => bottomSheetModalRef.current?.dismiss()} />
      </BottomSheetModal>
    </View>
  );
}
