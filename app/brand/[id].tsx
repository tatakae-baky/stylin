import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FONTS, FONT_SIZES } from '../../constants/fonts';
import { products } from '../../constants/data';
import MasonryGrid from '../components/shared/MasonryGrid';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTER_OPTIONS = [
  { id: 'items', label: 'Items' },
  { id: 'activity', label: 'Activity' },
  { id: 'analytics', label: 'Analytics' },
];

export default function BrandScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Filter products for this brand
  const brandProducts = products.filter(product => product.brand === id);
  const brandInfo = brandProducts[0]; // Get brand info from first product

  // Transform products to match MasonryGrid's ProductData interface
  const gridProducts = brandProducts.map(product => ({
    id: product.id,
    image: product.image,
    name: product.name,
    price: `${product.price.toLocaleString()} BDT`,
    brandName: product.brand,
    brandLogo: product.brandLogo
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.brandInfo}>
          <Image source={brandInfo.brandLogo} style={styles.brandLogo} />
          <View>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandName}>{id}</Text>
              <MaterialCommunityIcons name="check-decagram" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.brandDescription}>
              Take the red bean to join the garden. View and collect our exclusive products.
            </Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{brandProducts.length}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.min(...brandProducts.map(p => p.price)).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Floor Price</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1%</Text>
            <Text style={styles.statLabel}>Listed</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterTab,
              option.id === 'items' && styles.activeTab
            ]}
          >
            <Text style={[
              styles.filterLabel,
              option.id === 'items' && styles.activeLabel
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search and Sort */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search by name or trait</Text>
        </View>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView style={styles.productsContainer}>
        <View style={styles.gridContainer}>
          <MasonryGrid data={gridProducts} />
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
  header: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandName: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xl,
    color: '#000',
  },
  brandDescription: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#666',
    maxWidth: SCREEN_WIDTH - 120,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.lg,
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: '#666',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  filterLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  activeLabel: {
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  sortButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  productsContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 16,
  },
}); 