import { View, Text, Dimensions } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import SwipeableProductCard from './SwipeableProductCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate height based on screen height, with a minimum of 570
const CARD_HEIGHT = Math.max(570, SCREEN_HEIGHT * 0.75);

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
}

interface SwipeableProductStackProps {
  products: Product[];
  onSwipeLeft?: (product: Product) => void;
  onSwipeRight?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function SwipeableProductStack({
  products,
  onSwipeLeft,
  onSwipeRight,
  onAddToCart,
}: SwipeableProductStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFocused = useIsFocused();

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    const currentProduct = products[currentIndex];
    
    switch (direction) {
      case 'left':
        onSwipeLeft?.(currentProduct);
        break;
      case 'right':
        onSwipeRight?.(currentProduct);
        break;
      case 'up':
        onAddToCart?.(currentProduct);
        break;
    }
    
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, products, onSwipeLeft, onSwipeRight, onAddToCart]);

  const renderedProducts = useMemo(() => {
    if (currentIndex >= products.length) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">No more products to explore</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-4">
        <View style={{ height: CARD_HEIGHT }} className="w-full">
          {products.map((product, index) => {
            if (index < currentIndex) return null;
            if (index > currentIndex + 1) return null;

            const isTop = index === currentIndex;

            return (
              <SwipeableProductCard
                key={product.id}
                {...product}
                onSwipe={handleSwipe}
                isTop={isTop}
                isFocused={isFocused}
              />
            );
          }).reverse()}
        </View>
      </View>
    );
  }, [currentIndex, products, handleSwipe, isFocused]);

  return renderedProducts;
} 