import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/shared/Header';
import AdCarousel from '../components/shared/AdCarousel';
import { FONTS, FONT_SIZES } from '../../constants/fonts';
import { products, Product } from '../../constants/data';

// Import ad banner images
const adBanners = [
  require('../../assets/images/ad_banners/Stylin AD.png'),
  require('../../assets/images/ad_banners/MegaBank AD.png'),
  require('../../assets/images/ad_banners/Swiggy AD.png'),
  require('../../assets/images/ad_banners/BigBasket AD.png'),
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface BrandData {
  logo: any;
  collections: Set<string>;
  productCount: number;
}

interface GroupedProducts {
  [key: string]: BrandData;
}

// Group products by brand
const groupedProducts = products.reduce<GroupedProducts>((acc, product) => {
  if (!acc[product.brand]) {
    acc[product.brand] = {
      logo: product.brandLogo,
      collections: new Set<string>(),
      productCount: 0
    };
  }
  acc[product.brand].productCount++;
  if (product.collection) {
    acc[product.brand].collections.add(product.collection);
  }
  return acc;
}, {});

// Get unique collections with their first product
const uniqueCollections = Array.from(
  products.reduce((map, product) => {
    if (product.collection && !map.has(product.collection)) {
      map.set(product.collection, product);
    }
    return map;
  }, new Map<string, Product>())
).map(([collection, product]) => ({
  collection,
  images: product.collectionImages || [],
}));

export default function ShopsScreen() {
  const router = useRouter();

  const handleBrandPress = (brand: string) => {
    // Navigate to brand details or filter products by brand
    console.log('Selected brand:', brand);
  };

  const handleSearch = (text: string) => {
    // Implement search functionality
    console.log('Searching for:', text);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header onSearch={handleSearch} showFilters={false} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Ad Banner Carousel */}
        <View style={styles.carouselContainer}>
          <AdCarousel images={adBanners} height={150} />
        </View>

        <View className="px-4 pt-4">
          <Text style={styles.sectionTitle}>Featured Brands</Text>
          
          <View style={styles.brandsGrid}>
            {Object.entries(groupedProducts).map(([brand, data]) => (
              <TouchableOpacity
                key={brand}
                style={styles.brandCard}
                onPress={() => handleBrandPress(brand)}
                activeOpacity={0.7}
              >
                <View style={styles.brandLogoContainer}>
                  <Image
                    source={data.logo}
                    style={styles.brandLogo}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandName}>{brand}</Text>
                  <Text style={styles.brandStats}>
                    {data.collections.size} Collections • {data.productCount} Items
                  </Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={20} color="#000" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newArrivalsContainer}
          >
            {products.slice(0, 5).map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.newArrivalCard,
                  { marginLeft: product.id === products[0].id ? 16 : 0 }
                ]}
                onPress={() => router.push(`/product/${product.id}`)}
                activeOpacity={0.7}
              >
                <Image
                  source={product.image}
                  style={styles.newArrivalImage}
                  resizeMode="cover"
                />
                <View style={styles.newArrivalInfo}>
                  <Text style={styles.newArrivalName}>{product.name}</Text>
                  <Text style={styles.newArrivalPrice}>{product.price} BDT</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Popular Collections</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectionsContainer}
          >
            {uniqueCollections.slice(0, 5).map(({ collection, images }, index) => (
              <TouchableOpacity
                key={collection}
                style={[
                  styles.collectionCard,
                  { marginLeft: index === 0 ? 16 : 0 }
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.collectionName}>{collection}</Text>
                <View style={styles.collectionImageContainer}>
                  {images.slice(0, 4).map((image, index) => (
                    <Image
                      key={index}
                      source={image}
                      style={[
                        styles.collectionThumbnail,
                        index === 1 && { marginLeft: 4 },
                        index === 2 && { marginTop: 4 },
                        index === 3 && { marginTop: 4, marginLeft: 4 }
                      ]}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONTS.logo.extraBold,
    fontSize: FONT_SIZES['2xl'],
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  brandLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    marginBottom: 4,
    color: '#000',
  },
  brandStats: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
  arrowContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  featuredSection: {
    marginTop: 32,
  },
  newArrivalsContainer: {
    paddingRight: 16,
  },
  newArrivalCard: {
    width: 120,
    marginRight: 12,
  },
  newArrivalImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  newArrivalInfo: {
    marginTop: 8,
  },
  newArrivalName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: '#000',
    marginBottom: 4,
  },
  newArrivalPrice: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
  collectionsContainer: {
    paddingRight: 16,
  },
  collectionCard: {
    width: 220,
    marginRight: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
  },
  collectionName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: '#000',
    marginBottom: 12,
  },
  collectionImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  collectionThumbnail: {
    width: '48.5%',
    height: '48.5%',
  },
  carouselContainer: {
    marginVertical: 12,
    backgroundColor: '#fff',
  },
}); 