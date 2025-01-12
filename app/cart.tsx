import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from './context/CartContext';
import { useRouter, useNavigation } from 'expo-router';

export default function Cart() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const navigation = useNavigation();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {state.items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            {state.items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={item.image}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>
                
                <View style={styles.productDetails}>
                  <View style={styles.productHeader}>
                    <View>
                      <Text style={styles.productTitle}>{item.name}</Text>
                      <Text style={styles.brandText}>{item.brand}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeButton} 
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bottomSection}>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={16} color="#000" />
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={16} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.price}>{item.price.toFixed(0)} BDT</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalAmount}>{state.total.toFixed(0)} BDT</Text>
            </View>
          </>
        )}
      </ScrollView>

      {state.items.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => {/* Handle checkout */}}
          >
            <Text style={styles.checkoutText}>Checkout Now • {state.total.toFixed(0)} BDT</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginRight: 40, // To offset the back button width and maintain center alignment
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    width: 100,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  removeButton: {
    padding: 4,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
    marginBottom: 80,
  },
  totalLabel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 