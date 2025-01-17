import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useHardwareStore } from '../../stores/hardware-store';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

interface Hardware {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  details?: string;
  monthlyRentingCost: number;
}

export default function HardwareList() {
  const { hardware, initializeStore, isInitialized } = useHardwareStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Initialize store when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeStore();
    }
  }, [isInitialized]);

  const getStockCount = (name: string) => {
    return hardware.filter(item => item.name === name).length;
  };

  const filteredHardware = useMemo(() => {
    let filtered = hardware;
    
    if (selectedBrand !== 'All Brands') {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query)
      );
    }

    const uniqueItems = filtered.reduce((acc, current) => {
      const exists = acc.find(item => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, [] as Hardware[]);

    return uniqueItems;
  }, [hardware, selectedBrand, searchQuery]);

  const brands = ['All Brands', ...new Set(hardware.map(item => item.brand))];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const renderItem = ({ item }: { item: Hardware }) => {
    return (
      <Animated.View style={[styles.tableRow, { opacity: fadeAnim }]}>
        <View style={[styles.codeColumn, styles.columnSpacing]}>
          <ThemedText>{item.serialNumber}</ThemedText>
        </View>
        <View style={[styles.componentColumn, styles.columnSpacing]}>
          <ThemedText>{item.name}</ThemedText>
        </View>
        <View style={[styles.modelColumn, styles.columnSpacing]}>
          <ThemedText>{item.model}</ThemedText>
        </View>
        <View style={[styles.stockColumn, styles.columnSpacing]}>
          <ThemedText>{getStockCount(item.name)}</ThemedText>
        </View>
        <TouchableOpacity 
          style={[styles.iconButton, styles.columnSpacing]}
          onPress={() => {
            handleRowPress(item.id);
            router.push({
              pathname: '/add-hardware',
              params: { editItem: JSON.stringify(item) }
            });
          }}
        >
          <Ionicons name="pencil" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, styles.columnSpacing]}
          onPress={() => {
            Alert.alert(
              "Delete Hardware",
              "Are you sure you want to delete this item?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { 
                  text: "Delete", 
                  onPress: () => deleteHardware(item.id),
                  style: "destructive"
                }
              ]
            );
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <View style={[styles.codeColumn, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Serial Number</ThemedText>
      </View>
      <View style={[styles.componentColumn, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Name</ThemedText>
      </View>
      <View style={[styles.modelColumn, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Model</ThemedText>
      </View>
      <View style={[styles.stockColumn, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Stock</ThemedText>
      </View>
      <View style={[styles.iconButton, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Edit</ThemedText>
      </View>
      <View style={[styles.iconButton, styles.columnSpacing]}>
        <ThemedText type="defaultSemiBold">Delete</ThemedText>
      </View>
    </View>
  );

  const handleRowPress = (id: string) => {
    setSelectedId(id);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const deleteHardware = async (id: string) => {
    try {
      const { removeHardware } = useHardwareStore.getState();
      
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(async () => {
        // After animation completes, remove the item
        await removeHardware(id);
      });
    } catch (error) {
      console.error('Error deleting hardware:', error);
      Alert.alert('Error', 'Failed to delete hardware item');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { borderColor: textColor + '40' }]}>
          <Ionicons name="search" size={20} color={textColor + '80'} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search by name..."
            placeholderTextColor={textColor + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* Handle filter */}}
        >
          <Ionicons name="filter" size={20} color={textColor} />
          <ThemedText style={styles.filterText}>Filter</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-hardware')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>New</ThemedText>
        </TouchableOpacity>
      </View>

      <TableHeader />
      
      <FlatList
        data={filteredHardware}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No hardware items found
            </ThemedText>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    alignItems: 'center',
  },
  columnSpacing: {
    marginHorizontal: 8,
    paddingVertical: 4,
  },
  codeColumn: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentColumn: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  filterText: {
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0A7EA4',
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  modelColumn: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 