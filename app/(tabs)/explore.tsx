import { View, SafeAreaView, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../components/shared/Header';
import SwipeableProductStack from '../components/shared/SwipeableProductStack';
import { products } from '../../constants/data';

export default function ExploreScreen() {
  const handleSwipeLeft = (product: any) => {
    console.log('Disliked:', product.name);
  };

  const handleSwipeRight = (product: any) => {
    console.log('Liked:', product.name);
  };

  const handleAddToCart = (product: any) => {
    console.log('Added to cart:', product.name);
    // Here you would typically dispatch an action to add the product to the cart
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <Header />
        <View className="flex-1 mt-4 mb-4">
          {products.length > 0 ? (
            <SwipeableProductStack
              products={products}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg text-gray-500">
                No more products to explore
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
} 