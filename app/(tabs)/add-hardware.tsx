import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHardwareStore } from '@/stores/hardware-store';
import { router, useLocalSearchParams } from 'expo-router';

export default function AddHardwareScreen() {
  const { addHardware, updateHardware } = useHardwareStore();
  const params = useLocalSearchParams();
  const editItem = params.editItem ? JSON.parse(params.editItem as string) : null;
  
  const [formData, setFormData] = useState({
    id: editItem?.id || '',
    name: editItem?.name || '',
    brand: editItem?.brand || '',
    model: editItem?.model || '',
    serialNumber: editItem?.serialNumber || '',
    details: editItem?.details || '',
    monthlyRentingCost: editItem?.monthlyRentingCost?.toString() || '',
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.brand || !formData.model || !formData.serialNumber || !formData.monthlyRentingCost) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editItem) {
        // Update existing hardware
        await updateHardware({
          id: editItem.id,
          name: formData.name,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          monthlyRentingCost: Number(formData.monthlyRentingCost),
          details: formData.details,
        });
      } else {
        // Add new hardware
        await addHardware({
          name: formData.name,
          brand: formData.brand,
          model: formData.model,
          serialNumber: formData.serialNumber,
          monthlyRentingCost: Number(formData.monthlyRentingCost),
          details: formData.details,
        });
      }

      // Navigate back to hardware list
      router.push('/(tabs)/hardware-list');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save hardware');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <ThemedText type="title">
            {editItem ? 'Edit Hardware' : 'Add New Hardware'}
          </ThemedText>
        </View>

        <ThemedView 
          style={styles.formContainer}
          lightColor="#FFFFFF"
          darkColor="#2D3133"
        >
          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter hardware name"
              placeholderTextColor="#687076"
              editable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Brand *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.brand}
              onChangeText={(text) => setFormData(prev => ({ ...prev, brand: text }))}
              placeholder="Enter brand name"
              placeholderTextColor="#687076"
              editable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Model *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.model}
              onChangeText={(text) => setFormData(prev => ({ ...prev, model: text }))}
              placeholder="Enter model number"
              placeholderTextColor="#687076"
              editable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Serial Number *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.serialNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, serialNumber: text }))}
              placeholder="Enter serial number"
              placeholderTextColor="#687076"
              editable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Monthly Rent *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.monthlyRentingCost}
              onChangeText={(text) => setFormData(prev => ({ ...prev, monthlyRentingCost: text }))}
              placeholder="Enter monthly rent"
              placeholderTextColor="#687076"
              keyboardType="numeric"
              editable={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold">Details</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.details}
              onChangeText={(text) => setFormData(prev => ({ ...prev, details: text }))}
              placeholder="Enter additional details"
              placeholderTextColor="#687076"
              multiline
              numberOfLines={4}
              editable={true}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <ThemedText style={styles.submitButtonText}>
              {editItem ? 'Save Changes' : 'Add Hardware'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  submitButton: {
    backgroundColor: '#0A7EA4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 