import { View, Text, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
  useSharedValue,
  interpolate,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Link, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/_CartContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = 120;
const VERTICAL_SWIPE_THRESHOLD = 100;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeableProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
  collection?: string;
  collectionImages?: any[];
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isTop?: boolean;
  isFocused: boolean;
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
        <Ionicons className="opacity-60" name="cart" size={24} color="white"  />
      </View>
      <Text className="text-white text-sm text-center bg-black/50 px-3 py-1 mb-10 rounded-full opacity-60">
        Swipe up to add to cart
      </Text>
    </Animated.View>
  );
}

function SwipeText({ direction, translateX, translateY }: { 
  direction: 'left' | 'right' | 'up';
  translateX: Animated.SharedValue<number>;
  translateY: Animated.SharedValue<number>;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  const getText = () => {
    switch (direction) {
      case 'left':
        return 'BOO';
      case 'right':
        return 'MINE';
      case 'up':
        return 'Buying it';
    }
  };

  const getBackgroundColor = () => {
    switch (direction) {
      case 'left':
        return '#B40000'; // Solid red
      case 'right':
        return '#2EA043'; // Solid green
      case 'up':
        return '#000000'; // Solid black
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const shouldShow = direction === 'up' 
      ? translateY.value < -VERTICAL_SWIPE_THRESHOLD / 2
      : direction === 'right'
        ? translateX.value > SWIPE_THRESHOLD / 2
        : translateX.value < -SWIPE_THRESHOLD / 2;

    opacity.value = withSpring(shouldShow ? 1 : 0, {
      damping: 15,
      stiffness: 90
    });
    scale.value = withSpring(shouldShow ? 1 : 0.5, {
      damping: 12,
      stiffness: 100
    });

    const xOffset = direction === 'up' 
      ? 0 
      : direction === 'right'
        ? -40
        : 40;

    const yOffset = direction === 'up' ? 40 : 0;

    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateX: xOffset },
        { translateY: yOffset },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          alignSelf: 'center',
          top: '45%',
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 8,
          minWidth: direction === 'up' ? 120 : 100,
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: direction === 'up' ? 24 : 28,
          fontWeight: '600',
          color: '#FFFFFF',
          letterSpacing: 0.5,
          textAlign: 'center',
          includeFontPadding: false,
        }}
      >
        {getText()}
      </Text>
    </Animated.View>
  );
}

export default function SwipeableProductCard({
  id,
  name,
  brand,
  price,
  image,
  collection,
  collectionImages,
  onSwipe,
  isTop = true,
  isFocused,
}: SwipeableProductCardProps) {
  const router = useRouter();
  const { dispatch } = useCart();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleNavigateToDetails = () => {
    router.push({
      pathname: "/product/[id]",
      params: { 
        id,
        collection,
        hasCollection: collection ? 'true' : 'false'
      }
    });
  };

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { id, name, brand, price, image, quantity: 1 }
    });
    setIsAddedToCart(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const cardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10]
    );

    const cardScale = isTop
      ? scale.value
      : interpolate(
          Math.abs(translateX.value),
          [0, SCREEN_WIDTH / 2],
          [0.85, 1]
        );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: cardScale },
      ],
      opacity: opacity.value,
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      scale.value = withSpring(1.1);
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      const tossX = event.velocityX * 0.1;
      
      // Handle vertical swipe up to add to cart
      if (translateY.value < -VERTICAL_SWIPE_THRESHOLD) {
        translateY.value = withTiming(-SCREEN_WIDTH, {
          duration: 400,
        });
        opacity.value = withTiming(0, {
          duration: 300,
        }, () => {
          runOnJS(handleAddToCart)();
          runOnJS(onSwipe)('up');
        });
        return;
      }
      
      // Handle horizontal swipe
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD || Math.abs(tossX) > SCREEN_WIDTH / 4) {
        const direction = translateX.value > 0 ? 'right' : 'left';
        translateX.value = withSpring(direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5, {
          velocity: event.velocityX,
          damping: 15,
        });
        translateY.value = withSpring(0);
        opacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        runOnJS(onSwipe)(direction);
      } else {
        // Reset position if not swiped far enough
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
      scale.value = withSpring(1);
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      'worklet';
      runOnJS(handleNavigateToDetails)();
    });

  const composedGestures = Gesture.Exclusive(panGesture, tapGesture);

  return (
    <View className="absolute inset-0">
      <GestureDetector gesture={composedGestures}>
        <Animated.View style={[cardStyle]}>
          <View className="w-full h-full">
            <Image
              source={image}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            <SwipeText direction="left" translateX={translateX} translateY={translateY} />
            <SwipeText direction="right" translateX={translateX} translateY={translateY} />
            <SwipeText direction="up" translateX={translateX} translateY={translateY} />
            {isFocused && (
              <View className="absolute bottom-20 left-0 right-0 items-center">
                <FloatingIcon />
              </View>
            )}
            <View className="absolute bottom-4 left-4">
              <Text className="text-xl font-bold text-white">{name}</Text>
              <Text className="text-gray-100">{brand}</Text>
              <Text className="text-lg font-bold text-white">{price} BDT</Text>
              {collection && (
                <Text className="text-sm text-gray-200 mt-1">Part of {collection}</Text>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
} 