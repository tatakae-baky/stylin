import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Image, Platform, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FONTS, FONT_SIZES } from '../../../constants/fonts';
import { products } from '../../../constants/data';
import SearchBar from './SearchBar';

type SearchItem = {
  text: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

// Predefined search suggestions with icons
const TRENDING_SEARCHES: SearchItem[] = [
  { text: 'Summer Collection', icon: 'wb-sunny' },
  { text: 'Denim Jackets', icon: 'style' },
  { text: 'Party Wear', icon: 'local-activity' },
  { text: 'Traditional', icon: 'stars' },
  { text: 'Casual Wear', icon: 'weekend' }
];

const QUICK_FILTERS: SearchItem[] = [
  { text: 'Under 2000 BDT', icon: 'local-offer' },
  { text: 'New Arrivals', icon: 'fiber-new' },
  { text: 'Best Sellers', icon: 'star' },
  { text: 'Discounted', icon: 'local-mall' },
  { text: 'Premium', icon: 'grade' }
];

interface SearchOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onSearch: (text: string) => void;
}

export default function SearchOverlay({ isVisible, onClose, onSearch }: SearchOverlayProps) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingProducts] = useState(products.slice(0, 4)); // Reduced to 4 for better layout

  const slideAnim = useState(new Animated.Value(0))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchText) {
      const filtered = products
        .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
        .map(p => p.name)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const renderSearchChips = (items: SearchItem[], title: string, isFilter = false) => (
    <View className="mb-6">
      <Text style={{ fontFamily: FONTS.medium }} className="px-4 mb-3 text-base">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSearch(item.text)}
            className={`mx-2 px-4 py-3 rounded-xl flex-row items-center ${
              isFilter ? 'bg-black' : 'bg-gray-100'
            }`}
            style={{
              elevation: isFilter ? 4 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <MaterialIcons 
              name={item.icon} 
              size={16} 
              color={isFilter ? '#fff' : '#666'} 
              style={{ marginRight: 6 }}
            />
            <Text 
              style={{ 
                fontFamily: FONTS.medium,
                color: isFilter ? '#fff' : '#000'
              }} 
              className="text-sm"
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 999,
        opacity: opacityAnim,
        transform: [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0],
          })
        }]
      }]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight }}>
        <View className="flex-row items-center px-4 py-2 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} className="mr-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <SearchBar
            placeholder="Search products, brands..."
            onSearch={handleSearch}
            autoFocus={true}
            value={searchText}
            isOverlay={true}
          />
        </View>

        <ScrollView className="flex-1">
          {suggestions.length > 0 ? (
            <View className="py-4">
              <Text style={{ fontFamily: FONTS.medium }} className="px-4 mb-2">Suggestions</Text>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity 
                  key={index}
                  className="flex-row items-center px-4 py-3"
                  onPress={() => handleSearch(suggestion)}
                >
                  <Ionicons name="search-outline" size={16} color="#666" className="mr-2" />
                  <Text style={{ fontFamily: FONTS.regular }}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <>
              <View className="pt-4">
                {renderSearchChips(TRENDING_SEARCHES, "🔥 Trending Searches")}
                {renderSearchChips(QUICK_FILTERS, "⚡ Quick Filters", true)}
                
                <View className="px-4">
                  <Text style={{ fontFamily: FONTS.medium }} className="mb-4">Trending Products</Text>
                  <View className="flex-row flex-wrap justify-between">
                    {trendingProducts.map((product) => (
                      <TouchableOpacity 
                        key={product.id}
                        className="w-[48%] mb-4 bg-white rounded-lg overflow-hidden shadow"
                        style={{ elevation: 2 }}
                      >
                        <Image 
                          source={product.image}
                          style={{ width: '100%', height: 180, borderRadius: 8 }}
                          resizeMode="cover"
                          defaultSource={require('../../../assets/images/avatar-placeholder.jpg')}
                        />
                        <View className="p-2">
                          <View className="flex-row items-center mb-1">
                            {product.brandLogo && (
                              <Image 
                                source={product.brandLogo}
                                style={{ width: 20, height: 20, borderRadius: 10, marginRight: 6 }}
                              />
                            )}
                            <Text style={{ fontFamily: FONTS.medium }} className="text-xs">{product.brand}</Text>
                          </View>
                          <Text 
                            style={{ fontFamily: FONTS.regular }} 
                            className="text-sm mb-1"
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>
                          <Text style={{ fontFamily: FONTS.medium }} className="text-sm">
                            {product.price} BDT
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
}