import { View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface SwipeableCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
}

function FloatingIcon() {
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Start the floating animation with a slight delay
    const delay = Math.random() * 1000; // Random delay to prevent all icons from moving in sync
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, {
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(0, {
            duration: 1200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        ),
        -1, // Infinite repeat
        true // Reverse animation
      )
    );
  }, []); // Empty dependency array since we only want to start the animation once

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View 
      style={[animatedStyle]} 
      className="items-center"
    >
      <View className="bg-black/50 rounded-full p-2 mb-2">
        <Ionicons name="cart" size={24} color="white" />
      </View>
      <Text className="text-white text-sm text-center bg-black/50 px-3 py-1 mb-6 rounded-full">
        Swipe up to add to cart
      </Text>
    </Animated.View>
  );
}

export default function SwipeableCard({ id, name, brand, price, image }: SwipeableCardProps) {
  return (
    <View className="w-full h-full">
      <Image
        source={image}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
      <View className="absolute bottom-20 left-0 right-0 items-center">
        <FloatingIcon />
      </View>
      <View className="absolute bottom-4 left-4">
        <Text className="text-xl font-bold text-white">{name}</Text>
        <Text className="text-gray-100">{brand}</Text>
        <Text className="text-lg font-bold text-white">{price} BDT</Text>
      </View>
    </View>
  );
} 