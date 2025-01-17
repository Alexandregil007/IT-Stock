import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      {/* Watermark */}
      <View style={styles.watermarkContainer}>
        <ThemedText style={styles.watermarkText}>
          Application Made By: Alexandre Gil
        </ThemedText>
      </View>

      <View style={styles.contentContainer}>
        <ThemedText type="title">IT Hardware Management 🚀</ThemedText>
        <ThemedText style={styles.description}>
          Welcome to the IT Hardware Management for Decathlon Lisboa-Oriente.
          Use the tabs below to add new hardware or view your inventory.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  watermarkText: {
    fontSize: 12,
    opacity: 0.08,
    fontStyle: 'italic',
    lineHeight: 12,
  },
});
