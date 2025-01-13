import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, TextInput, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCart } from './context/_CartContext';
import { useRouter, useNavigation } from 'expo-router';

interface CouponData {
  code: string;
  discount: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample recommended products data
const recommendedProducts = [
  {
    id: 'rec1',
    name: 'Winter Special Jacket',
    brand: 'Sleek',
    price: 2499,
    image: require('../assets/images/sleek/Winter Special Collection/winteroo_1.jpg')
  },
  {
    id: 'rec2',
    name: 'Classic Denim Jacket',
    brand: 'Sleek',
    price: 3999,
    image: require('../assets/images/sleek/FW24 Collection/Jacket_5.jpg')
  },
  {
    id: 'rec3',
    name: 'Premium Leather Jacket',
    brand: 'Sleek',
    price: 2999,
    image: require('../assets/images/sleek/FW24 Collection/Jacket_6.jpg')
  }
];

export default function Cart() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const navigation = useNavigation();
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
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

  const handleCheckout = () => {
    // Pass the selected shipping method to checkout
    router.push({
      pathname: '/checkout',
      params: { shippingMethod: selectedShipping }
    });
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
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {state.items.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            {state.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.cartItem}>
                  <Image 
                    source={item.image}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  
                  <View style={styles.productDetails}>
                    <View style={styles.productHeader}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.productTitle}>{item.name}</Text>
                        <Text style={styles.productSubtitle}>{item.brand}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveItem(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close" size={18} color="#999" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.priceAndQuantity}>
                      <Text style={styles.price}>{item.price.toFixed(0)} BDT</Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity 
                          style={styles.quantityButton}
                          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {index < state.items.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}

            {/* Simple Total */}
            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalText}>Subtotal:</Text>
                <Text style={styles.totalAmount}>
                  {state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)} BDT
                </Text>
              </View>
            </View>

            {/* Shipping Method */}
            <View style={styles.shippingMethodSection}>
              <Text style={styles.sectionTitle}>Shipping method</Text>
              <View style={styles.shippingMethods}>
                <TouchableOpacity 
                  style={[styles.shippingCard, styles.standardCard, selectedShipping === 'standard' && styles.selectedStandardCard]}
                  onPress={() => setSelectedShipping('standard')}
                >
                  <View style={[styles.shippingIconContainer, styles.standardIcon]}>
                    <MaterialIcons name="local-shipping" size={24} color={selectedShipping === 'standard' ? '#000' : '#666'} />
                  </View>
                  <View style={styles.shippingDetails}>
                    <View style={styles.shippingNameRow}>
                      <Text style={[styles.shippingName, selectedShipping === 'standard' && styles.selectedText]}>Standard Delivery</Text>
                      <Text style={[styles.shippingPrice, selectedShipping === 'standard' && styles.selectedText]}>60 BDT</Text>
                    </View>
                    <Text style={styles.estimatedDelivery}>
                      Delivery time: 3-5 business days
                    </Text>
                  </View>
                  <View style={[styles.radioButton, selectedShipping === 'standard' && styles.radioButtonActive]}>
                    {selectedShipping === 'standard' && <View style={styles.radioButtonSelected} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.shippingCard, styles.vipCard, selectedShipping === 'vip' && styles.selectedVipCard]}
                  onPress={() => setSelectedShipping('vip')}
                >
                  <View style={[styles.shippingIconContainer, styles.vipIcon]}>
                    <MaterialIcons name="flight" size={24} color={selectedShipping === 'vip' ? '#6B4CE6' : '#8E72FF'} />
                  </View>
                  <View style={styles.shippingDetails}>
                    <View style={styles.shippingNameRow}>
                      <Text style={[styles.shippingName, styles.vipText, selectedShipping === 'vip' && styles.selectedVipText]}>VIP Delivery</Text>
                      <Text style={[styles.shippingPrice, styles.vipText, selectedShipping === 'vip' && styles.selectedVipText]}>150 BDT</Text>
                    </View>
                    <Text style={[styles.estimatedDelivery, styles.vipDeliveryText]}>
                      Delivery time: 1-2 business days
                    </Text>
                  </View>
                  <View style={[styles.radioButton, styles.vipRadio, selectedShipping === 'vip' && styles.selectedVipRadio]}>
                    {selectedShipping === 'vip' && <View style={styles.vipRadioSelected} />}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.shippingCard, styles.stylinCard, selectedShipping === 'stylin' && styles.selectedStylinCard]}
                  onPress={() => setSelectedShipping('stylin')}
                >
                  <View style={[styles.shippingIconContainer, styles.stylinIcon]}>
                    <MaterialIcons name="rocket-launch" size={24} color={selectedShipping === 'stylin' ? '#B4833E' : '#FFB649'} />
                  </View>
                  <View style={styles.shippingDetails}>
                    <View style={styles.shippingNameRow}>
                      <Text style={[styles.shippingName, styles.stylinText, selectedShipping === 'stylin' && styles.selectedStylinText]}>Stylin' Delivery</Text>
                      <Text style={[styles.shippingPrice, styles.stylinText, selectedShipping === 'stylin' && styles.selectedStylinText]}>300 BDT</Text>
                    </View>
                    <Text style={[styles.estimatedDelivery, styles.stylinDeliveryText]}>
                      Delivery time: Within 24 hours
                    </Text>
                  </View>
                  <View style={[styles.radioButton, styles.stylinRadio, selectedShipping === 'stylin' && styles.selectedStylinRadio]}>
                    {selectedShipping === 'stylin' && <View style={styles.stylinRadioSelected} />}
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.shippingNote}>
                Please note that delivery times are estimates and may vary based on your location and product availability. For Stylin' Delivery, orders must be placed before 4 PM to ensure next-day delivery.
              </Text>
            </View>

            {/* Enhanced You May Also Like Section */}
            <View style={styles.recommendedSection}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>You May Also Like</Text>
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
              >
                {recommendedProducts.map((product) => (
                  <TouchableOpacity 
                    key={product.id}
                    style={styles.recommendedItem}
                    onPress={() => router.push(`/product/${product.id}`)}
                  >
                    <View style={styles.recommendedImageContainer}>
                      <Image
                        source={product.image}
                        style={styles.recommendedImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.recommendedDetails}>
                      <Text 
                        style={styles.recommendedName}
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <Text style={styles.recommendedBrand}>{product.brand}</Text>
                      <Text style={styles.recommendedPrice}>
                        {product.price.toFixed(0)} BDT
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>

      {state.items.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout • {state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)} BDT
            </Text>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
  },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  priceAndQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  quantity: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginHorizontal: 12,
  },
  itemDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
  },
  totalContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  shippingMethodSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  shippingMethods: {
    gap: 12,
  },
  shippingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  standardCard: {
    backgroundColor: '#f8f8f8',
  },
  selectedStandardCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  standardIcon: {
    backgroundColor: '#fff',
  },
  vipCard: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E9E3FF',
  },
  selectedVipCard: {
    backgroundColor: '#F8F6FF',
    borderColor: '#6B4CE6',
  },
  vipIcon: {
    backgroundColor: '#EDE9FF',
    borderWidth: 1,
    borderColor: '#E9E3FF',
  },
  vipText: {
    color: '#6B4CE6',
  },
  selectedVipText: {
    color: '#5538B5',
  },
  vipDeliveryText: {
    color: '#8E72FF',
  },
  stylinCard: {
    backgroundColor: '#FFF9F0',
    borderWidth: 1,
    borderColor: '#FFE5BC',
  },
  selectedStylinCard: {
    backgroundColor: '#FFFAF3',
    borderColor: '#B4833E',
  },
  stylinIcon: {
    backgroundColor: '#FFF4E3',
    borderWidth: 1,
    borderColor: '#FFE5BC',
  },
  stylinText: {
    color: '#B4833E',
  },
  selectedStylinText: {
    color: '#8A6230',
  },
  stylinDeliveryText: {
    color: '#D69D4B',
  },
  shippingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shippingDetails: {
    flex: 1,
    marginRight: 8,
  },
  shippingNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shippingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedText: {
    color: '#000',
  },
  shippingPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  estimatedDelivery: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  shippingNote: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 24,
    fontStyle: 'italic',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: '#000',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  vipRadio: {
    borderColor: '#8E72FF',
  },
  selectedVipRadio: {
    borderColor: '#6B4CE6',
  },
  vipRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6B4CE6',
  },
  stylinRadio: {
    borderColor: '#FFB649',
  },
  selectedStylinRadio: {
    borderColor: '#B4833E',
  },
  stylinRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B4833E',
  },
  recommendedSection: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 32,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  recommendedList: {
    paddingRight: 16,
    paddingBottom: 16,
  },
  recommendedItem: {
    marginRight: 16,
    width: 160,
    marginBottom: 16,
  },
  recommendedImageContainer: {
    width: 160,
    height: 208,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedDetails: {
    marginTop: 8,
    marginBottom: 16,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  recommendedBrand: {
    fontSize: 14,
    color: '#666',
  },
  recommendedPrice: {
    fontSize: 14,
    color: '#666',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 