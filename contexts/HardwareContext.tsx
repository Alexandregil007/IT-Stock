import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveHardwareItems, loadHardwareItems } from '@/utils/storage';

export interface HardwareItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  monthlyRent: number;
  details?: string;
}

interface HardwareContextType {
  hardware: HardwareItem[];
  addHardware: (item: Omit<HardwareItem, 'id'>) => void;
  isLoading: boolean;
  searchHardware: (query: string) => HardwareItem[];
  filterByBrand: (brand: string | null) => HardwareItem[];
  getAllBrands: () => string[];
}

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [hardware, setHardware] = useState<HardwareItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadHardwareItems().then((items) => {
      setHardware(items);
      setIsLoading(false);
    });
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveHardwareItems(hardware);
    }
  }, [hardware, isLoading]);

  const addHardware = (newItem: Omit<HardwareItem, 'id'>) => {
    setHardware(prev => {
      // Check for duplicate serial number
      const isDuplicateSerial = prev.some(item => 
        item.serialNumber.toLowerCase() === newItem.serialNumber.toLowerCase()
      );

      if (isDuplicateSerial) {
        throw new Error('Serial number must be unique');
      }

      return [
        ...prev,
        {
          ...newItem,
          id: Date.now().toString(),
        },
      ];
    });
  };

  const searchHardware = (query: string): HardwareItem[] => {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return hardware;

    return hardware.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm) ||
      item.model.toLowerCase().includes(searchTerm)
    );
  };

  const filterByBrand = (brand: string | null): HardwareItem[] => {
    if (!brand) return hardware;
    return hardware.filter(item => item.brand === brand);
  };

  const getAllBrands = (): string[] => {
    const brands = new Set(hardware.map(item => item.brand));
    return Array.from(brands).sort();
  };

  return (
    <HardwareContext.Provider value={{ 
      hardware, 
      addHardware, 
      isLoading,
      searchHardware,
      filterByBrand,
      getAllBrands,
    }}>
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware() {
  const context = useContext(HardwareContext);
  if (context === undefined) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
} 