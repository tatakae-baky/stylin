import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, ImageSourcePropType } from 'react-native';
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
import { useSaved } from '../context/SavedContext';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['#808080', '#000000', '#1a1a1a'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Add mock reviews type and data
interface Review {
  id: string;
  user: string;
  userImage: ImageSourcePropType | null;
  rating: number;
  date: string;
  comment: string;
  images: ImageSourcePropType[];
  verified: boolean;
  likes: number;
  size: string;
  color: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    user: 'Sarah M.',
    userImage: null,
    rating: 5,
    date: '2 days ago',
    comment: 'Absolutely love this! The fit is perfect and the material is so comfortable. The color is exactly as shown in the pictures.',
    images: [],
    verified: true,
    likes: 24,
    size: 'M',
    color: 'Black'
  },
  {
    id: '2',
    user: 'Michael R.',
    userImage: null,
    rating: 4,
    date: '1 week ago',
    comment: 'Great product overall. The size runs a bit large but still looks good. The material quality is excellent.',
    images: [],
    verified: true,
    likes: 18,
    size: 'L',
    color: 'Gray'
  },
];

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
  const { state, dispatch } = useSaved();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const flatListRef = useRef<FlatList>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Find the product based on the ID
  const product = products.find(p => p.id === id);
  const isSaved = Boolean(product && state.items[product.id]);
  
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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSave = () => {
    if (product) {
      dispatch({
        type: 'TOGGLE_SAVE',
        payload: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          image: product.image,
          brandLogo: product.brandLogo,
        },
      });
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
          <View className="absolute top-5 left-7 z-10">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-white rounded-full p-2 shadow-sm"
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="absolute top-5 right-7 z-10">
            <TouchableOpacity 
              className="bg-white rounded-full p-2 shadow-sm"
              onPress={handleSave}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color={isSaved ? "#000" : "black"} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 mb-20" showsVerticalScrollIndicator={false}>
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
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-4">
                  <Text 
                    style={{ fontFamily: FONTS.logo.extraBold }} 
                    className="text-xl text-gray-900"
                  >
                    {product?.name}
                  </Text>
                  <View className="flex-row items-center mt-1 space-x-1">
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={{ fontFamily: FONTS.regular }} className="text-sm">5.0 (7,932 reviews)</Text>
                  </View>
                </View>
                
                <Text 
                  style={{ fontFamily: FONTS.logo.extraBold }} 
                  className="text-2xl text-right text-black"
                >
                  {product?.price} BDT
                </Text>
              </View>

              {/* Brand Section */}
              <View className="flex-row justify-between items-center mt-4 py-4 border-t border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-full overflow-hidden shadow-sm mr-3">
                    <Animated.Image 
                      source={product?.brandLogo}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View>
                    <Text style={{ fontFamily: FONTS.medium }} className="text-base">{product?.brand}</Text>
                    <Text style={{ fontFamily: FONTS.regular }} className="text-sm text-gray-600">3.2k Followers</Text>
                  </View>
                </View>
                  <TouchableOpacity 
                  className={`px-6 py-2.5 rounded-full ${isFollowing ? 'bg-gray-100' : 'bg-black'}`}
                  onPress={handleFollow}
                >
                  <Text 
                    style={{ fontFamily: FONTS.medium }} 
                    className={`text-base ${isFollowing ? 'text-black' : 'text-white'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                  </TouchableOpacity>
              </View>

              {/* Size and Color Selection */}
              <View className="flex-row justify-between items-start mt-1 py-1">
                <View className="flex-1 mr-4">
                  <Text style={{ fontFamily: FONTS.medium }} className="text-base mb-3">Choose Size</Text>
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
                  <Text style={{ fontFamily: FONTS.medium }} className="text-base mb-3">Color</Text>
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

              {/* Product Details Section */}
              <View className="mt-6 pb-4 border-b border-gray-100">
                <Text style={{ fontFamily: FONTS.logo.extraBold }} className="text-lg mb-4">Product Details</Text>
                
                {/* Product Description */}
                <View className="mb-6">
                  <View className="flex-row items-start mb-2">
                    <Ionicons name="information-circle-outline" size={20} color="#666" style={{ marginTop: 2 }} />
                    <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 ml-2 flex-1">
                      {product?.isCollectionItem ? `Part of ${product.collection} - ` : ''}
                      Its simple and elegant shape makes it perfect for those of you who like minimalist clothes and casual style. Perfect for everyday wear.
                    </Text>
                  </View>
                </View>

                {/* Product Specifications */}
                <View className="space-y-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-8">
                        <Ionicons name="pricetag-outline" size={18} color="#666" />
                      </View>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 w-24">SKU</Text>
                    </View>
                    <Text style={{ fontFamily: FONTS.medium }} className="text-right">{product.id}</Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-8">
                        <Ionicons name="shirt-outline" size={18} color="#666" />
                      </View>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 w-24">Material</Text>
                    </View>
                    <Text style={{ fontFamily: FONTS.medium }} className="text-right">100% Cotton</Text>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-8">
                        <Ionicons name="cube-outline" size={18} color="#666" />
                      </View>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 w-24">Stock Status</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-green-600 mr-2" />
                      <Text style={{ fontFamily: FONTS.medium }} className="text-green-600">
                        In Stock
                      </Text>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-500 ml-1">
                        (12 items left)
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View className="w-8">
                        <Ionicons name="time-outline" size={18} color="#666" />
                      </View>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 w-24">Delivery</Text>
                    </View>
                    <Text style={{ fontFamily: FONTS.medium }} className="text-right">3-5 Business Days</Text>
                  </View>
                </View>
              </View>

              {/* Reviews Summary */}
              <TouchableOpacity 
                className="py-4 border-b border-gray-100"
                onPress={() => router.push({ pathname: "/reviews/[id]", params: { id: product.id } })}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-baseline">
                    <Text style={{ fontFamily: FONTS.logo.extraBold }} className="text-2xl mr-2">5.0</Text>
                    <View className="flex-row items-center">
                      {[1,2,3,4,5].map((star) => (
                        <Ionicons key={star} name="star" size={14} color="#FFD700" />
                      ))}
                      <Text style={{ fontFamily: FONTS.regular }} className="text-sm text-gray-600 ml-2">
                        (7,932)
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text style={{ fontFamily: FONTS.medium }} className="text-sm text-gray-600 mr-2">
                      View All
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                  </View>
                </View>

                {/* Rating Distribution */}
                <View className="space-y-1.5 mb-4">
                  {[5,4,3,2,1].map((rating) => (
                    <View key={rating} className="flex-row items-center">
                      <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500 w-4 mr-2">
                        {rating}
                      </Text>
                      <View className="flex-1 h-1 bg-gray-100 rounded-full">
                        <View 
                          className="h-1 bg-yellow-400 rounded-full" 
                          style={{ 
                            width: rating === 5 ? '85%' : 
                                   rating === 4 ? '10%' : 
                                   rating === 3 ? '3%' : 
                                   rating === 2 ? '1%' : '1%' 
                          }} 
                        />
                      </View>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500 w-8 text-right ml-2">
                        {rating === 5 ? '85%' : 
                         rating === 4 ? '10%' : 
                         rating === 3 ? '3%' : 
                         rating === 2 ? '1%' : '1%'}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Preview Reviews */}
                <View>
                  {MOCK_REVIEWS.slice(0, 2).map((review, index) => (
                    <View 
                      key={review.id} 
                      className={`p-3 bg-gray-50 rounded-xl ${index === 0 ? 'mb-3' : ''}`}
                    >
                      <View className="flex-row items-center justify-between mb-1.5">
                        <View className="flex-row items-center">
                          <Text style={{ fontFamily: FONTS.medium }} className="text-sm">{review.user}</Text>
                          <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500 ml-2">
                            {review.size} · {review.color}
                          </Text>
                        </View>
                        <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500">
                          {review.date}
                        </Text>
                      </View>
                      
                      <View className="flex-row items-center mb-1.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Ionicons key={i} name="star" size={12} color="#FFD700" />
                        ))}
                      </View>
                      
                      <Text 
                        style={{ fontFamily: FONTS.regular }} 
                        className="text-sm text-gray-600 mb-2"
                        numberOfLines={2}
                      >
                        {review.comment}
                      </Text>

                      <View className="flex-row items-center justify-between pt-2 border-t border-gray-200">
                        <TouchableOpacity className="flex-row items-center">
                          <Ionicons name="heart-outline" size={16} color="#666" />
                          <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-600 ml-1">
                            Helpful ({review.likes})
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Ionicons name="share-social-outline" size={16} color="#666" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              {/* Return Policy */}
              <View className="py-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-3">
                  <Text style={{ fontFamily: FONTS.logo.extraBold }} className="text-lg">Return Policy</Text>
                  <TouchableOpacity onPress={() => {/* Handle full policy view */}}>
                    <Text style={{ fontFamily: FONTS.medium }} className="text-sm text-black">
                      View Full Policy
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="space-y-3 bg-gray-50 p-4 rounded-xl">
                  <View className="flex-row items-start">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="checkmark-circle" size={20} color="green" />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text style={{ fontFamily: FONTS.medium }} className="text-base mb-0.5">7 Days Return</Text>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 text-sm">
                        Easy returns within 7 days of delivery
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-start">
                    <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
                      <Ionicons name="shirt" size={20} color="green" />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text style={{ fontFamily: FONTS.medium }} className="text-base mb-0.5">Free Size Returns</Text>
                      <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 text-sm">
                        Free returns for size/fit issues
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Enhanced You May Also Like Section */}
              <View className="py-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                  <Text style={{ fontFamily: FONTS.logo.extraBold }} className="text-lg">You May Also Like</Text>
                  <TouchableOpacity 
                    className="py-1 px-2 -mr-2"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={{ fontFamily: FONTS.medium }} className="text-sm text-black">
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                >
                  {products
                    .filter(p => p.id !== product.id && p.brand === product.brand)
                    .slice(0, 5)
                    .map((relatedProduct) => (
                    <TouchableOpacity 
                      key={relatedProduct.id}
                      className="mr-4 w-40"
                      onPress={() => router.push({ pathname: "/product/[id]", params: { id: relatedProduct.id } })}
                    >
                      <View className="w-40 h-52 rounded-xl overflow-hidden bg-gray-50">
                        <Animated.Image
                          source={relatedProduct.image}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View className="mt-2">
                        <Text 
                          style={{ fontFamily: FONTS.medium }} 
                          className="text-sm text-gray-900"
                          numberOfLines={1}
                        >
                          {relatedProduct.name}
                        </Text>
                        <Text 
                          style={{ fontFamily: FONTS.regular }} 
                          className="text-sm text-gray-600 mt-0.5"
                        >
                          {relatedProduct.price} BDT
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>

          {/* Sticky Add to Cart Button */}
          <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-2 border-t border-gray-100">
            <TouchableOpacity 
              className="bg-black rounded-full py-4 items-center flex-row justify-center space-x-2"
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
        </Animated.View>
      </SafeAreaView>
    </>
  );
} 