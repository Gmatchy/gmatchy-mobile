import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

/**
 * Local storage (async)
 */

const setLocalStorageItem = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.warn(`Failed to set key "${key}":`, err);
    throw err;
  }
};

const getLocalStorageItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {
    console.warn(`Failed to get key "${key}":`, err);
    return null;
  }
};

const removeLocalStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn(`Failed to remove key "${key}":`, err);
    throw err;
  }
};

/**
 * Sensitive storage (SecureStore) (async)
 */

const setSecureLocalStorageItem = async (
  key: string,
  value: string | null
): Promise<void> => {
  try {
    if (value === null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (err) {
    console.warn(`SecureStore: Failed to set "${key}":`, err);
  }
};

const getSecureLocalStorageItem = async (
  key: string
): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.warn(`SecureStore: Failed to get "${key}":`, err);
    return null;
  }
};

const removeSecureLocalStorageItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.warn(`SecureStore: Failed to remove "${key}":`, err);
  }
};

const localStorage = {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  setSecureLocalStorageItem,
  getSecureLocalStorageItem,
  removeSecureLocalStorageItem,
};

export default localStorage;
