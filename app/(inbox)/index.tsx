import React, { useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { useEmails } from '../../src/hooks/useGmail';
import { InboxItem } from '../../src/components/InboxItem';
import { ComposerSheet } from '../../src/components/ComposerSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function InboxScreen() {
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useEmails();
  
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }, [isFetchingNextPage]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-red-500">Error loading emails</Text>
      </View>
    );
  }

  // Flatten infinite query pages
  const emails = data?.pages.flatMap((page) => page.emails) ?? [];

  return (
    <View className="flex-1 bg-white">
      {emails.length === 0 ? (
        <Text className="text-xl text-gray-500 text-center mt-10">Your inbox is empty.</Text>
      ) : (
        <FlatList
          data={emails}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          windowSize={5}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity 
        className="absolute bottom-8 right-8 bg-black w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={handlePresentModalPress}
      >
        <Text className="text-white text-3xl mb-1">+</Text>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%', '90%']}
        index={1}
      >
        <ComposerSheet onClose={() => bottomSheetModalRef.current?.dismiss()} />
      </BottomSheetModal>
    </View>
  );
}
