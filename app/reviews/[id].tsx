import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../constants/fonts';
import { products } from '../../constants/data';
import Animated from 'react-native-reanimated';

const MOCK_REVIEWS = [
  {
    id: '1',
    user: 'Sarah M.',
    userImage: null,
    rating: 5,
    date: '2 days ago',
    comment: 'Absolutely love this! The fit is perfect and the material is so comfortable. The color is exactly as shown in the pictures. I got so many compliments wearing this.',
    images: [
      require('../../assets/images/lilith/jumpsuit collection/summer.jpg'),
      require('../../assets/images/lilith/jumpsuit collection/summer_2.jpg'),
    ],
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
    comment: 'Great product overall. The size runs a bit large but still looks good. The material quality is excellent and worth the price.',
    images: [
      require('../../assets/images/lilith/jumpsuit collection/summer_3.jpg'),
    ],
    verified: true,
    likes: 18,
    size: 'L',
    color: 'Gray'
  },
  {
    id: '3',
    user: 'Emma W.',
    userImage: null,
    rating: 5,
    date: '2 weeks ago',
    comment: 'Perfect for everyday wear! The fabric is breathable and the design is very trendy. Already ordered another one in a different color.',
    images: [
      require('../../assets/images/lilith/jumpsuit collection/summer_4.jpg'),
      require('../../assets/images/lilith/jumpsuit collection/summer_5.jpg'),
    ],
    verified: true,
    likes: 31,
    size: 'S',
    color: 'White'
  },
  {
    id: '4',
    user: 'David K.',
    userImage: null,
    rating: 5,
    date: '3 weeks ago',
    comment: 'Exceeded my expectations! The attention to detail is impressive. Shipping was fast too.',
    images: [
      require('../../assets/images/lilith/jumpsuit collection/summer_6.jpg'),
    ],
    verified: true,
    likes: 15,
    size: 'M',
    color: 'Black'
  },
  {
    id: '5',
    user: 'Lisa P.',
    userImage: null,
    rating: 4,
    date: '1 month ago',
    comment: 'Beautiful design and great quality. Just wish it had more color options. Would definitely recommend!',
    images: [],
    verified: true,
    likes: 9,
    size: 'S',
    color: 'Gray'
  },
];

export default function ReviewsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);

  if (!product) return null;

  return (
    <>
      <Stack.Screen options={{ 
        headerShown: false 
      }} />
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3"
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontFamily: FONTS.medium }} className="text-lg">
            Reviews
          </Text>
        </View>

        <ScrollView className="flex-1">
          <View className="p-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text style={{ fontFamily: FONTS.medium }} className="text-2xl">4.9</Text>
                <Text style={{ fontFamily: FONTS.regular }} className="text-sm text-gray-600">
                  out of 5
                </Text>
              </View>
              <View className="flex-1 ml-4">
                {[5,4,3,2,1].map((rating) => (
                  <View key={rating} className="flex-row items-center mb-1">
                    <Text style={{ fontFamily: FONTS.regular }} className="text-sm text-gray-600 w-8">
                      {rating}★
                    </Text>
                    <View className="flex-1 h-2 bg-gray-200 rounded-full ml-2">
                      <View 
                        className="h-2 bg-yellow-400 rounded-full" 
                        style={{ 
                          width: rating === 5 ? '80%' : 
                                 rating === 4 ? '15%' : 
                                 rating === 3 ? '3%' : 
                                 rating === 2 ? '1%' : '1%' 
                        }} 
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="p-4">
            {MOCK_REVIEWS.map((review) => (
              <View key={review.id} className="mb-6 pb-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                      <Text style={{ fontFamily: FONTS.medium }} className="text-gray-500">
                        {review.user.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: FONTS.medium }} className="text-base">
                        {review.user}
                      </Text>
                      <View className="flex-row items-center mt-0.5">
                        <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500">
                          Size: {review.size}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                        <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500">
                          Color: {review.color}
                        </Text>
                      </View>
                    </View>
                    {review.verified && (
                      <View className="bg-green-50 rounded-full px-2 py-1 ml-2">
                        <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-green-600">
                          Verified
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontFamily: FONTS.regular }} className="text-xs text-gray-500">
                    {review.date}
                  </Text>
                </View>

                <View className="flex-row mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>

                <Text style={{ fontFamily: FONTS.regular }} className="text-gray-600 mb-3">
                  {review.comment}
                </Text>

                {review.images.length > 0 && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    className="mb-3"
                  >
                    {review.images.map((image, index) => (
                      <View key={index} className="mr-2 rounded-xl overflow-hidden">
                        <Animated.Image 
                          source={image}
                          className="w-24 h-24"
                          resizeMode="cover"
                        />
                      </View>
                    ))}
                  </ScrollView>
                )}

                <View className="flex-row items-center justify-between">
                  <TouchableOpacity className="flex-row items-center">
                    <Ionicons name="heart-outline" size={18} color="#666" />
                    <Text style={{ fontFamily: FONTS.regular }} className="text-sm text-gray-600 ml-1">
                      Helpful ({review.likes})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="share-social-outline" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
} 