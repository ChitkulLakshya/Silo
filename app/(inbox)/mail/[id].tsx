import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../../src/context/AuthContext';

export default function MailScreen() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useAuth();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmailBody() {
      try {
        const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = await res.json();
        
        let bodyPart = data.payload?.parts?.find((part: any) => part.mimeType === 'text/html');
        if (!bodyPart) {
          bodyPart = data.payload?.parts?.find((part: any) => part.mimeType === 'text/plain');
        }
        
        let rawBody = bodyPart?.body?.data || '';
        rawBody = rawBody.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(rawBody);

        const wrappedHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              <style>
                body { font-family: -apple-system, sans-serif; padding: 16px; margin: 0; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              ${decoded}
            </body>
          </html>
        `;
        
        setHtmlContent(wrappedHtml);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    if (id && accessToken) {
      fetchEmailBody();
    }
  }, [id, accessToken]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {htmlContent ? (
        <WebView 
          source={{ html: htmlContent }} 
          originWhitelist={['*']}
          style={{ flex: 1 }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>Could not load email body.</Text>
        </View>
      )}
    </View>
  );
}
