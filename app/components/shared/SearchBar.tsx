import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, FONT_SIZES } from '../../../constants/fonts';

const PLACEHOLDER_TEXTS = [
  "Search for brands...",
  "Search for hoodies...",
  "Search for lehengas...",
  "Search for jackets...",
  "Search for dresses...",
  "Search for traditional wear..."
];

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  autoFocus?: boolean;
  value?: string;
  isOverlay?: boolean;
}

export default function SearchBar({ 
  onSearch,
  onFocus,
  autoFocus = false,
  value,
  isOverlay = false
}: SearchBarProps) {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animatePlaceholder = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      setCurrentPlaceholderIndex((prevIndex) => 
        prevIndex === PLACEHOLDER_TEXTS.length - 1 ? 0 : prevIndex + 1
      );
    };

    const intervalId = setInterval(() => {
      animatePlaceholder();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const searchBarContent = (
    <View className="flex-row items-center bg-white border border-gray-500 rounded-full px-4 py-2.5">
      <Ionicons name="search" size={16} color="#666" />
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: 0 }] }}>
        <TextInput
          placeholder={PLACEHOLDER_TEXTS[currentPlaceholderIndex]}
          style={{ 
            fontFamily: FONTS.regular,
            fontSize: FONT_SIZES.sm,
            flex: 1,
            marginLeft: 6,
            padding: 0,
            height: 24,
            includeFontPadding: false,
            textAlignVertical: 'center'
          }}
          placeholderTextColor="#666"
          onChangeText={onSearch}
          onFocus={onFocus}
          autoFocus={autoFocus}
          value={value}
          editable={isOverlay}
          showSoftInputOnFocus={isOverlay}
        />
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 mx-4">
      {isOverlay ? (
        searchBarContent
      ) : (
        <TouchableOpacity onPress={onFocus} activeOpacity={0.7}>
          {searchBarContent}
        </TouchableOpacity>
      )}
    </View>
  );
} 