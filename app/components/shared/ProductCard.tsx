import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { Ionicons } from "@expo/vector-icons";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: any;
  collection?: string;
  collectionImages?: any[];
}

export default function ProductCard({ id, name, brand, price, image, collection, collectionImages }: ProductCardProps) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { id, name, brand, price, image, quantity: 1 }
    });
  };

  return (
    <View className="relative mb-4">
      <Link href={{ 
        pathname: "/product/[id]", 
        params: { 
          id,
          collection,
          hasCollection: collection ? 'true' : 'false'
        } 
      }} asChild>
        <TouchableOpacity>
          <Image
            source={image}
            className="w-full h-[500px] rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-4 left-4">
            <Text className="text-gray-100">{brand}</Text>
            <Text className="text-lg font-bold text-white">{price} BDT</Text>
            {collection && (
              <Text className="text-sm text-gray-200 mt-1">Part of {collection}</Text>
            )}
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity 
        onPress={handleAddToCart}
        className="absolute bottom-4 right-4 bg-black p-3 rounded-full"
      >
        <Ionicons name="cart-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
} 