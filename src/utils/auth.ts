import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'SILO_GOOGLE_REFRESH_TOKEN';
const ACCESS_TOKEN_KEY = 'SILO_GOOGLE_ACCESS_TOKEN';

export const saveTokens = async (accessToken: string, refreshToken?: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getRefreshToken();
  return !!token;
};
