import AsyncStorage from '@react-native-async-storage/async-storage';
import { HardwareItem } from '@/contexts/HardwareContext';

const STORAGE_KEY = 'hardware_items';

export async function saveHardwareItems(items: HardwareItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving hardware items:', error);
  }
}

export async function loadHardwareItems(): Promise<HardwareItem[]> {
  try {
    const items = await AsyncStorage.getItem(STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading hardware items:', error);
    return [];
  }
} 