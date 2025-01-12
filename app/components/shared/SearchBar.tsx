import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, FONT_SIZES } from '../../../constants/fonts';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
}

export default function SearchBar({ 
  placeholder = "Looking for something?",
  onSearch 
}: SearchBarProps) {
  return (
    <View className="flex-1 mx-4">
      <View className="flex-row items-center bg-white border border-gray-500 rounded-full px-4 py-1">
        <Ionicons name="search" size={16} color="#666" />
        <TextInput
          placeholder={placeholder}
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
        />
      </View>
    </View>
  );
} 