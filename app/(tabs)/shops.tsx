import React, { useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/shared/Header';
import { FONTS, FONT_SIZES } from '../../constants/fonts';
import { products } from '../../constants/data';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface BrandData {
  logo: any;
  collections: Set<string>;
  productCount: number;
  floorPrice: number;
  totalVolume: number;
}

interface GroupedProducts {
  [key: string]: BrandData;
}

// Group products by brand
const groupedProducts = products.reduce<GroupedProducts>((acc, product) => {
  if (!acc[product.brand]) {
    acc[product.brand] = {
      logo: product.brandLogo,
      collections: new Set(),
      productCount: 0,
      floorPrice: Infinity,
      totalVolume: 0
    };
  }
  acc[product.brand].productCount++;
  if (product.collection) {
    acc[product.brand].collections.add(product.collection);
  }
  acc[product.brand].floorPrice = Math.min(acc[product.brand].floorPrice, product.price);
  acc[product.brand].totalVolume += product.price;
  return acc;
}, {});

const FILTER_OPTIONS = [
  { id: 'recent', icon: '🕒', label: 'Recent' },
  { id: 'trending', icon: '🔥', label: 'Trending' },
  { id: 'top', icon: '💎', label: 'Top' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'collections', label: 'Collections' },
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ShopsScreen() {
  const router = useRouter();

  const handleSearch = useCallback((text: string) => {
    console.log('Searching for:', text);
  }, []);

  const handleBrandPress = useCallback((brand: string) => {
    router.push({
      pathname: "/brand/[id]",
      params: { id: brand }
    });
  }, [router]);

  const renderBrandCard = useCallback(([brand, data]: [string, BrandData], index: number) => (
    <AnimatedTouchableOpacity
      key={brand}
      style={styles.brandCard}
      onPress={() => handleBrandPress(brand)}
      activeOpacity={0.7}
      entering={FadeInDown.delay(index * 100)}
    >
      <Image 
        source={data.logo} 
        style={styles.brandCover} 
        resizeMode="cover"
        fadeDuration={0}
      />
      <View style={styles.brandInfo}>
        <View style={styles.brandHeader}>
          <Image 
            source={data.logo} 
            style={styles.brandLogo} 
            resizeMode="contain"
            fadeDuration={0}
          />
          <Text style={styles.brandName}>{brand}</Text>
        </View>
        <Text style={styles.brandStats}>
          Floor price {data.floorPrice.toLocaleString()} BDT
        </Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {data.collections.size} Collections • {data.productCount} Items
          </Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  ), [handleBrandPress]);

  const renderCollectionCard = useCallback(([brand, data]: [string, BrandData], index: number) => (
    <AnimatedTouchableOpacity
      key={brand}
      style={styles.collectionCard}
      onPress={() => handleBrandPress(brand)}
      activeOpacity={0.7}
      entering={FadeInDown.delay(index * 100)}
    >
      <Image 
        source={data.logo} 
        style={styles.collectionCover} 
        resizeMode="cover"
        fadeDuration={0}
      />
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{brand} Collection</Text>
        <Text style={styles.collectionStats}>
          {data.productCount} Items
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  ), [handleBrandPress]);

  const brandEntries = useMemo(() => Object.entries(groupedProducts), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header onSearch={handleSearch} showFilters={false} />
      
      {/* Featured Banner */}
      <Animated.View style={styles.featuredBanner} entering={FadeInDown}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Discover New Brands</Text>
          <Text style={styles.bannerSubtitle}>Explore unique collections from top designers</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
          removeClippedSubviews={true}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                category.id === 'all' && styles.activeCategoryButton
              ]}
            >
              <Text style={[
                styles.categoryText,
                category.id === 'all' && styles.activeCategoryText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Options */}
      <View style={styles.filterOptionsContainer}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterOption,
              option.id === 'recent' && styles.activeFilter
            ]}
          >
            <Text style={styles.filterIcon}>{option.icon}</Text>
            <Text style={[
              styles.filterLabel,
              option.id === 'recent' && styles.activeFilterLabel
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        {/* Featured Brands Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Brands</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.brandsGrid}>
            {brandEntries.map(renderBrandCard)}
          </View>
        </View>

        {/* Popular Collections Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Collections</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectionsScroll}
            removeClippedSubviews={true}
          >
            {brandEntries.map(renderCollectionCard)}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  featuredBanner: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 160,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xl,
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#000',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  activeCategoryText: {
    color: '#fff',
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 6,
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  filterIcon: {
    fontSize: 16,
  },
  filterLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  activeFilterLabel: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: '#000',
  },
  viewAll: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#3B82F6',
  },
  brandsGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  brandCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  brandCover: {
    width: '100%',
    height: 120,
  },
  brandInfo: {
    padding: 12,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  brandName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: '#000',
  },
  brandStats: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#000',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
  collectionsScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  collectionCard: {
    width: 200,
    marginRight: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  collectionCover: {
    width: '100%',
    height: 150,
  },
  collectionInfo: {
    padding: 12,
  },
  collectionName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.base,
    color: '#000',
    marginBottom: 4,
  },
  collectionStats: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
}); 