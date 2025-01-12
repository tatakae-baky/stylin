import { View, Text, SafeAreaView } from 'react-native';
import Header from '../components/shared/Header';
import MasonryGrid from '../components/shared/MasonryGrid';
import { useSaved } from '../context/SavedContext';

export default function SavedScreen() {
  const { state } = useSaved();
  const savedItems = Object.values(state.items).map(item => ({
    id: item.id,
    image: item.image,
    name: item.name,
    price: `${item.price} BDT`,
    brandName: item.brand,
    brandLogo: item.brandLogo || require('../../assets/images/sleek/sleek_logo.jpg'), // Make sure to add a default brand logo
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      {savedItems.length > 0 ? (
        <MasonryGrid data={savedItems} />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-xl text-gray-500">Your saved items will appear here</Text>
        </View>
      )}
    </SafeAreaView>
  );
} 