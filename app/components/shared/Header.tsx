import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import SearchBar from './SearchBar';
import FilterOptions from './FilterOptions';
import { FONTS, FONT_SIZES } from '../../../constants/fonts';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  onSearch?: (text: string) => void;
  onFilterSelect?: (filter: string) => void;
  showFilters?: boolean;
  onSearchFocus?: () => void;
}

export default function Header({ 
  onSearch, 
  onFilterSelect, 
  showFilters = true,
  onSearchFocus 
}: HeaderProps) {
  const { state } = useCart();
  const router = useRouter();
  const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <View>
      <View className="pt-2 px-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity>
            <Text style={{ 
              fontFamily: FONTS.logo.extraBold,
              fontWeight: '900',
              fontSize: FONT_SIZES.xl,
              lineHeight: FONT_SIZES.xl,
              includeFontPadding: false,
              padding: 0,
              margin: 0
            }}>
              stylin'
            </Text>
          </TouchableOpacity>
          
          <SearchBar 
            onSearch={onSearch}
            onFocus={onSearchFocus}
          />
          
          <TouchableOpacity 
            onPress={() => router.push('/cart')}
            className="relative"
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
            {cartItemsCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-black rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {showFilters && (
        <FilterOptions onFilterSelect={onFilterSelect} />
      )}
    </View>
  );
} 