import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { FONTS, FONT_SIZES } from '../../../constants/fonts';

const FILTER_OPTIONS = ['Brand', 'Price', 'Product', 'Category', 'Color', 'Size', 'Material', 'Style', 'Occasion', 'Season'];

interface FilterOptionsProps {
  onFilterSelect?: (filter: string) => void;
}

export default function FilterOptions({ onFilterSelect }: FilterOptionsProps) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterPress = (option: string) => {
    const newFilter = selectedFilter === option ? null : option;
    setSelectedFilter(newFilter);
    onFilterSelect?.(newFilter || '');
  };

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="mt-4"
      >
        <View style={{ paddingHorizontal: 16, flexDirection: 'row' }}>
          {FILTER_OPTIONS.map((option, index) => (
            <TouchableOpacity 
              key={option}
              className={`px-6 py-1.5 rounded-full border shadow-sm ${
                selectedFilter === option 
                  ? 'bg-black border-black' 
                  : 'bg-gray-50 border-gray-100'
              } ${index > 0 ? 'ml-1.5' : ''}`}
              onPress={() => handleFilterPress(option)}
            >
              <Text style={{
                fontFamily: selectedFilter === option ? FONTS.medium : FONTS.regular,
                fontSize: FONT_SIZES.sm,
                color: selectedFilter === option ? '#fff' : '#4B5563'
              }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 