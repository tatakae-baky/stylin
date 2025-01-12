import { View, SafeAreaView } from 'react-native';
import { useState, useMemo } from 'react';
import Header from '../components/shared/Header';
import MasonryGrid from '../components/shared/MasonryGrid';
import { products } from '../../constants/data';

// Sample product data with updated brand logos
const PRODUCTS = [
  {
    name: 'ABC Collection',
    price: '4200 BDT',
    brandName: 'Sleek',
    brandLogo: require('../../assets/images/sleek/sleek_logo.jpg'),
  },
  {
    name: 'Classic Polo Shirt',
    price: '1500 BDT',
    brandName: 'Undyingbrand',
    brandLogo: require('../../assets/images/undyingbrand/undyingbrand_logo.jpg'),
  },
  {
    name: 'Mermaid Collection',
    price: '2500 BDT',
    brandName: 'Defclo',
    brandLogo: require('../../assets/images/defclo/defclo_logo.jpg'),
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const gridData = useMemo(() => {
    return products.map(product => ({
      id: product.id,
      image: product.image,
      name: product.name,
      price: `${product.price} BDT`,
      brandName: product.brand,
      brandLogo: product.brandLogo,
    }));
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Implement search logic here
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    // Implement filter logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        onSearch={handleSearch}
        onFilterSelect={handleFilterSelect}
      />
      <View className="flex-1">
        <MasonryGrid data={gridData} />
      </View>
    </SafeAreaView>
  );
} 