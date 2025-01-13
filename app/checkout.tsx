import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, TextInput, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useCart } from './context/_CartContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
  quantity: number;
  color?: string;
  size?: string;
}

interface ShippingInfo {
  label: string;
  address: string;
  city: string;
}

interface CouponData {
  code: string;
  discount: string;
}

type CheckoutScreenRouteProp = RouteProp<{
  Checkout: {
    shippingMethod: string;
  };
}, 'Checkout'>;

export default function Checkout() {
  const router = useRouter();
  const route = useRoute<CheckoutScreenRouteProp>();
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('apple-pay');
  const [isEditing, setIsEditing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    label: 'Work',
    address: '257 Maple Street, Apartment 2B',
    city: 'New York, NY 10013'
  });
  const { state } = useCart();
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  // Get shipping method from route params
  const shippingMethod = route.params?.shippingMethod || 'standard';

  // Calculate costs
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'standard' ? 60 
    : shippingMethod === 'vip' ? 150 
    : shippingMethod === 'stylin' ? 300 : 0;
  const discount = appliedCoupon ? 
    (appliedCoupon.code.toLowerCase() === 'stylin10' ? subtotal * 0.1 : 
     appliedCoupon.code.toLowerCase() === 'newuser20' ? subtotal * 0.2 : 0) 
    : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shippingCost + tax - discount;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/cart');
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleShippingInfoChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = () => {
    router.push('/order-success');
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'stylin10') {
      setAppliedCoupon({
        code: couponCode,
        discount: '10%'
      });
    } else if (couponCode.toLowerCase() === 'newuser20') {
      setAppliedCoupon({
        code: couponCode,
        discount: '20%'
      });
    } else {
      // Show error or invalid coupon message
      alert('Invalid coupon code');
    }
    setCouponCode('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Shipping Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shipping information</Text>
            <TouchableOpacity onPress={toggleEdit}>
              <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.input}
                value={shippingInfo.label}
                onChangeText={(value) => handleShippingInfoChange('label', value)}
                placeholder="Label (e.g., Work, Home)"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={shippingInfo.address}
                onChangeText={(value) => handleShippingInfoChange('address', value)}
                placeholder="Street Address"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={shippingInfo.city}
                onChangeText={(value) => handleShippingInfoChange('city', value)}
                placeholder="City, State ZIP"
                placeholderTextColor="#999"
              />
            </View>
          ) : (
            <TouchableOpacity style={styles.addressCard} onPress={toggleEdit}>
              <View style={styles.addressIcon}>
                <Ionicons name="location-outline" size={24} color="#000" />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{shippingInfo.label}</Text>
                <Text style={styles.addressText}>{shippingInfo.address}</Text>
                <Text style={styles.addressText}>{shippingInfo.city}</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.itemCount}>
              <Text style={styles.itemCountText}>{state.items.length} items</Text>
            </View>
          </View>

          {/* Coupon Section */}
          <View style={styles.couponContainer}>
            <View style={styles.couponHeader}>
              <MaterialIcons name="local-offer" size={20} color="#666" />
              <Text style={styles.couponHeaderText}>Apply Coupon</Text>
            </View>
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApplyCoupon}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {appliedCoupon && (
              <View style={styles.appliedCouponContainer}>
                <View style={styles.appliedCouponLeft}>
                  <MaterialIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.appliedCouponText}>
                    Coupon {appliedCoupon.code} applied - {appliedCoupon.discount} off
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setAppliedCoupon(null)}>
                  <MaterialIcons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.availableCoupons}>
              <Text style={styles.availableCouponsTitle}>Available Coupons:</Text>
              <View style={styles.couponsList}>
                <View style={styles.couponItem}>
                  <View style={styles.couponItemLeft}>
                    <MaterialIcons name="local-offer" size={16} color="#6B4CE6" />
                    <Text style={styles.couponCode}>STYLIN10</Text>
                  </View>
                  <Text style={styles.couponDiscount}>10% off on all items</Text>
                </View>
                <View style={styles.couponItem}>
                  <View style={styles.couponItemLeft}>
                    <MaterialIcons name="local-offer" size={16} color="#B4833E" />
                    <Text style={styles.couponCode}>NEWUSER20</Text>
                  </View>
                  <Text style={styles.couponDiscount}>20% off for new users</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Cart Items Summary */}
          <View style={styles.cartSummary}>
            {state.items.map((item: CartItem, index: number) => (
              <View key={index} style={styles.summaryItem}>
                <View style={styles.summaryItemLeft}>
                  <Image 
                    source={item.image} 
                    style={styles.summaryItemImage}
                  />
                  <View style={styles.summaryItemDetails}>
                    <Text style={styles.summaryItemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.summaryItemMeta}>
                      <Text style={styles.summaryItemQuantity}>{item.quantity}x</Text>
                      {item.color && (
                        <View style={styles.metaItem}>
                          <MaterialIcons name="palette" size={14} color="#666" />
                          <Text style={styles.metaText}>{item.color}</Text>
                        </View>
                      )}
                      {item.size && (
                        <View style={styles.metaItem}>
                          <MaterialIcons name="straighten" size={14} color="#666" />
                          <Text style={styles.metaText}>{item.size}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Text style={styles.summaryItemPrice}>
                  {(item.price * item.quantity).toFixed(2)} BDT
                </Text>
              </View>
            ))}
          </View>

          {/* Cost Breakdown */}
          <View style={styles.costBreakdown}>
            <View style={styles.costRow}>
              <View style={styles.costLabelContainer}>
                <MaterialIcons name="shopping-cart" size={18} color="#666" />
                <Text style={styles.costLabel}>Subtotal</Text>
              </View>
              <Text style={styles.costValue}>{subtotal.toFixed(2)} BDT</Text>
            </View>
            <View style={styles.costRow}>
              <View style={styles.costLabelContainer}>
                <MaterialIcons name="local-shipping" size={18} color="#666" />
                <Text style={styles.costLabel}>Shipping</Text>
              </View>
              <Text style={styles.costValue}>{shippingCost.toFixed(2)} BDT</Text>
            </View>
            <View style={styles.costRow}>
              <View style={styles.costLabelContainer}>
                <MaterialIcons name="receipt" size={18} color="#666" />
                <Text style={styles.costLabel}>Tax (5%)</Text>
              </View>
              <Text style={styles.costValue}>{tax.toFixed(2)} BDT</Text>
            </View>
            {appliedCoupon && (
              <View style={styles.costRow}>
                <View style={styles.costLabelContainer}>
                  <MaterialIcons name="local-offer" size={18} color="#16a34a" />
                  <Text style={[styles.costLabel, styles.discountText]}>
                    Discount ({appliedCoupon.discount})
                  </Text>
                </View>
                <Text style={[styles.costValue, styles.discountText]}>-{discount.toFixed(2)} BDT</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} BDT</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment method</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Add a card</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.paymentMethods}>
            <TouchableOpacity 
              style={[styles.paymentCard, selectedPayment === 'apple-pay' && styles.selectedCard]}
              onPress={() => setSelectedPayment('apple-pay')}
            >
              <View style={styles.paymentLogo}>
                <Image source={require('../assets/images/apple-pay.png')} style={styles.paymentIcon} />
              </View>
              <Text style={styles.paymentText}>Apple Pay</Text>
              <View style={[styles.radioButton, selectedPayment === 'apple-pay' && styles.radioButtonActive]}>
                {selectedPayment === 'apple-pay' && <View style={styles.radioButtonSelected} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentCard, selectedPayment === 'paypal' && styles.selectedCard]}
              onPress={() => setSelectedPayment('paypal')}
            >
              <View style={styles.paymentLogo}>
                <Image source={require('../assets/images/paypal.png')} style={styles.paymentIcon} />
              </View>
              <Text style={styles.paymentText}>Pay Pal</Text>
              <View style={[styles.radioButton, selectedPayment === 'paypal' && styles.radioButtonActive]}>
                {selectedPayment === 'paypal' && <View style={styles.radioButtonSelected} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.paymentCard, selectedPayment === 'visa' && styles.selectedCard]}
              onPress={() => setSelectedPayment('visa')}
            >
              <View style={styles.paymentLogo}>
                <Image source={require('../assets/images/visa.png')} style={styles.paymentIcon} />
              </View>
              <Text style={styles.paymentText}>Visa</Text>
              <Text style={styles.cardNumber}>**** 9010</Text>
              <View style={[styles.radioButton, selectedPayment === 'visa' && styles.radioButtonActive]}>
                {selectedPayment === 'visa' && <View style={styles.radioButtonSelected} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderText}>Place an order • {total.toFixed(2)} BDT</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 100, // Space for the bottom button
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.5,
  },
  editButton: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  paymentLogo: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
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
  shippingMethods: {
    marginTop: 16,
    gap: 12,
  },
  shippingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedShippingCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  shippingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  placeOrderButton: {
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
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  editForm: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  // Standard Card Styles
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

  // VIP Card Styles
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

  // Stylin Card Styles
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

  couponContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
  },
  applyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  appliedCouponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  appliedCouponText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '500',
  },
  cartSummary: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  summaryItemQuantity: {
    fontSize: 13,
    color: '#666',
  },
  summaryItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  costBreakdown: {
    gap: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 15,
    color: '#666',
  },
  costValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  discountText: {
    color: '#16a34a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  itemCount: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  itemCountText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  couponHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  availableCoupons: {
    marginTop: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
  },
  availableCouponsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  couponsList: {
    gap: 8,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  couponItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  couponDiscount: {
    fontSize: 13,
    color: '#666',
  },
  appliedCouponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  summaryItemDetails: {
    flex: 1,
  },
  summaryItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  costLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 