import { View, SafeAreaView } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import Header from '../components/shared/Header';
import MasonryGrid from '../components/shared/MasonryGrid';
import SearchOverlay from '../components/shared/SearchOverlay';
import { products } from '../../constants/data';

const defaultTabBarStyle = {
  backgroundColor: '#ffffff',
  borderTopWidth: 0.5,
  borderTopColor: '#e5e5e5',
  height: 60,
  paddingBottom: 8,
};

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigation = useNavigation();

  // Reset tab bar style when component unmounts
  useEffect(() => {
    return () => {
      navigation.setOptions({
        tabBarStyle: defaultTabBarStyle,
      });
    };
  }, []);

  const gridData = useMemo(() => {
    let filteredProducts = products;
    
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredProducts.map(product => ({
      id: product.id,
      image: product.image,
      name: product.name,
      price: `${product.price} BDT`,
      brandName: product.brand,
      brandLogo: product.brandLogo,
    }));
  }, [searchQuery, selectedFilter]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
    navigation.setOptions({
      tabBarStyle: { display: 'none' }
    });
  };

  const handleSearchClose = () => {
    setIsSearchActive(false);
    setSearchQuery('');
    navigation.setOptions({
      tabBarStyle: defaultTabBarStyle
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        onSearch={handleSearch}
        onFilterSelect={handleFilterSelect}
        onSearchFocus={handleSearchFocus}
      />
      <View className="flex-1">
        <MasonryGrid data={gridData} />
      </View>

      <SearchOverlay
        isVisible={isSearchActive}
        onClose={handleSearchClose}
        onSearch={handleSearch}
      />
    </SafeAreaView>
  );
} 