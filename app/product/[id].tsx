import { View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, ImageSourcePropType, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useState, useCallback, useRef } from 'react';
import Animated, { 
  FadeIn,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../constants/fonts';
import { products } from '../../constants/data';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['#808080', '#000000', '#1a1a1a'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function PaginationDot({ isActive }: { isActive: boolean }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? 16 : 8, { mass: 0.5 }),
      opacity: withSpring(isActive ? 1 : 0.5, { mass: 0.5 }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          backgroundColor: '#000',
          borderRadius: 4,
          marginHorizontal: 3,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const flatListRef = useRef<FlatList>(null);

  // Find the product based on the ID
  const product = products.find(p => p.id === id);
  
  // Get the images to display (either collection images or single product image)
  const displayImages = product?.isCollectionItem && product.collectionImages ? product.collectionImages : [product?.image];

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      <SafeAreaView className="flex-1 bg-white">
        <Animated.View 
          entering={FadeIn.duration(300)}
          className="flex-1"
        >
          <View className="absolute top-12 left-4 z-10">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-white rounded-full p-2 shadow-sm"
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="absolute top-12 right-4 z-10">
            <TouchableOpacity 
              className="bg-white rounded-full p-2 shadow-sm"
            >
              <Ionicons name="heart-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View>
              <View className="h-[400px]">
                {product?.isCollectionItem ? (
                  // Collection product - show carousel
                  <>
                    <FlatList
                      ref={flatListRef}
                      data={displayImages}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onViewableItemsChanged={onViewableItemsChanged}
                      viewabilityConfig={viewabilityConfig}
                      renderItem={({ item }) => (
                        <View style={{ width: SCREEN_WIDTH, height: 400 }}>
                          <Animated.Image
                            source={item}
                            style={{ width: SCREEN_WIDTH - 32, height: 400, borderRadius: 15, marginHorizontal: 16}}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                      keyExtractor={(_, index) => index.toString()}
                    />
                    
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
                      {displayImages.map((_, index) => (
                        <PaginationDot
                          key={index}
                          isActive={index === activeIndex}
                        />
                      ))}
                    </View>
                  </>
                ) : (
                  // Standalone product - show single image
                  <View style={{ width: SCREEN_WIDTH, height: 400 }}>
                    <Animated.Image
                      source={product?.image}
                      style={{ width: SCREEN_WIDTH - 32, height: 400, borderRadius: 15, marginHorizontal: 16}}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </View>

            <View className="px-4 pt-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text style={{ fontFamily: FONTS.logo.extraBold }} className="text-2xl">{product?.name}</Text>
                  <View className="flex-row items-center mt-1 space-x-1">
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ fontFamily: FONTS.regular }} className="text-sm">5.0 (7,932 reviews)</Text>
                  </View>
                </View>
                
                <View className="flex-row items-center bg-gray-100 rounded-full">
                  <TouchableOpacity 
                    onPress={decrementQuantity}
                    className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
                  >
                    <Text className="text-lg" style={{ fontFamily: FONTS.medium }}>-</Text>
                  </TouchableOpacity>
                  <Text className="text-base mx-4" style={{ fontFamily: FONTS.medium }}>{quantity}</Text>
                  <TouchableOpacity 
                    onPress={incrementQuantity}
                    className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
                  >
                    <Text className="text-lg" style={{ fontFamily: FONTS.medium }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 mt-2">
                {product?.isCollectionItem ? `Part of ${product.collection} - ` : ''}
                Its simple and elegant shape makes it perfect for those of you who like minimalist clothes and casual style. Perfect for everyday wear.
              </Text>

              <View className="flex-row justify-between items-start mt-6">
                <View className="flex-1 mr-4">
                  <Text style={{ fontFamily: FONTS.regular }} className="text-sm mb-2">Choose Size</Text>
                  <View className="flex-row gap-2">
                    {SIZES.map((size) => (
                      <TouchableOpacity
                        key={size}
                        onPress={() => setSelectedSize(size)}
                        className={`border rounded-full w-9 h-9 items-center justify-center ${
                          selectedSize === size ? 'bg-black border-black' : 'border-gray-300'
                        }`}
                      >
                        <Text
                          style={{ fontFamily: FONTS.regular }}
                          className={`text-sm ${selectedSize === size ? 'text-white' : 'text-black'}`}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="flex-2">
                  <Text style={{ fontFamily: FONTS.regular }} className="text-sm mb-2">Color</Text>
                  <View className="flex-row gap-2">
                    {COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full items-center justify-center`}
                        style={{ backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: '#000' }}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                className="bg-black rounded-full py-4 items-center mt-6 mb-4 flex-row justify-center space-x-2"
                onPress={() => {
                  // Handle add to cart
                }}
              >
                <Ionicons name="cart-outline" size={24} color="white" />
                <Text style={{ fontFamily: FONTS.medium }} className="text-white text-lg">
                  Add to Cart | {product.price} BDT
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </>
  );
} 