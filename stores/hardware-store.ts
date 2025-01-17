import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Hardware {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  details?: string;
  monthlyRentingCost: number;
}

interface HardwareStore {
  hardware: Hardware[];
  isInitialized: boolean;
  addHardware: (item: Omit<Hardware, 'id'>) => void;
  updateHardware: (item: Hardware) => void;
  removeHardware: (id: string) => void;
  initializeStore: () => Promise<void>;
}

export const useHardwareStore = create<HardwareStore>((set) => ({
  hardware: [],
  isInitialized: false,

  initializeStore: async () => {
    try {
      const storedHardware = await AsyncStorage.getItem('hardware');
      if (storedHardware) {
        set({ hardware: JSON.parse(storedHardware), isInitialized: true });
      } else {
        set({ hardware: [], isInitialized: true });
      }
    } catch (error) {
      console.error('Error initializing store:', error);
      set({ hardware: [], isInitialized: true });
    }
  },

  addHardware: (item) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    set((state) => {
      const newHardware = [...state.hardware, newItem];
      AsyncStorage.setItem('hardware', JSON.stringify(newHardware));
      return { hardware: newHardware };
    });
  },

  updateHardware: async (updatedItem) => {
    set((state) => {
      const updatedHardware = state.hardware.map((item) => 
        item.id === updatedItem.id ? { ...updatedItem } : item
      );
      
      // Save to AsyncStorage
      AsyncStorage.setItem('hardware', JSON.stringify(updatedHardware))
        .catch(error => console.error('Error saving to AsyncStorage:', error));
      
      return { hardware: updatedHardware };
    });
  },

  removeHardware: async (id) => {
    set((state) => {
      const updatedHardware = state.hardware.filter(item => item.id !== id);
      
      // Save to AsyncStorage
      AsyncStorage.setItem('hardware', JSON.stringify(updatedHardware))
        .catch(error => console.error('Error saving to AsyncStorage:', error));
      
      return { hardware: updatedHardware };
    });
  },
})); 