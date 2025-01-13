import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrderSuccess() {
  const router = useRouter();
  const [checkmarkScale] = React.useState(new Animated.Value(0));
  const [fadeIn] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Animate checkmark
    Animated.spring(checkmarkScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Fade in text and buttons
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  const handleOrderDetails = () => {
    // Navigate to order details page
    router.push('/orders');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}></Text>
        </View>

        {/* Success Animation */}
        <View style={styles.successContainer}>
          <Animated.View 
            style={[
              styles.checkmarkCircle,
              { transform: [{ scale: checkmarkScale }] }
            ]}
          >
            <Ionicons name="checkmark" size={40} color="#fff" />
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeIn }]}>
          <Text style={styles.title}>Thank you for{'\n'}shopping with us!</Text>
          <Text style={styles.orderNumber}>Your order #FD23640065 is confirmed{'\n'}and in processing.</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>You have earned 34 points!</Text>
          </View>
        </Animated.View>

        {/* Support Text */}
        <Animated.View style={[styles.supportContainer, { opacity: fadeIn }]}>
          <Text style={styles.supportText}>
            Need assistance? We're here for you! If you have any questions or need support regarding your purchase, reach out to our Customer{' '}
            <Text style={styles.supportLink}>Support</Text>
          </Text>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeIn }]}>
          <TouchableOpacity 
            style={styles.orderDetailsButton}
            onPress={handleOrderDetails}
          >
            <Text style={styles.orderDetailsText}>Order Details</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  orderNumber: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  pointsContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  supportContainer: {
    marginBottom: 40,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  supportLink: {
    color: '#000',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  orderDetailsButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    alignItems: 'center',
  },
  orderDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  doneButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 