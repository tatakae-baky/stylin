import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  withSequence,
  withSpring,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../../context/_CartContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const SIDE_PADDING = 7;
const COLUMN_GAP = 5;
const COLUMN_WIDTH = (SCREEN_WIDTH - (2 * SIDE_PADDING + COLUMN_GAP)) / NUM_COLUMNS;
const DEFAULT_ASPECT_RATIO = 4/3;

interface ProductData {
  id: string;
  image: any;
  name: string;
  price: string;
  brandName: string;
  brandLogo: any;
}

interface MasonryGridProps {
  data: Array<ProductData>;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

export default function MasonryGrid({ data = [] }: MasonryGridProps) {
  const router = useRouter();
  const { dispatch: cartDispatch } = useCart();
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: string]: boolean }>({});
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});
  const [recentlyAdded, setRecentlyAdded] = useState<{ [key: string]: boolean }>({});

  const handleAddToCart = useCallback((e: any, item: ProductData) => {
    e.stopPropagation();
    
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (recentlyAdded[item.id]) {
      // Remove from cart
      cartDispatch({
        type: 'REMOVE_ITEM',
        payload: item.id
      });
      setRecentlyAdded(prev => ({ ...prev, [item.id]: false }));
    } else {
      // Add to cart
      cartDispatch({
        type: 'ADD_ITEM',
        payload: {
          id: item.id,
          name: item.name,
          brand: item.brandName,
          price: parseFloat(item.price.replace(' BDT', '')),
          image: item.image,
          quantity: 1
        }
      });
      setRecentlyAdded(prev => ({ ...prev, [item.id]: true }));
    }
  }, [cartDispatch, recentlyAdded]);

  const calculateImageHeight = useCallback((originalWidth: number, originalHeight: number) => {
    const scaleFactor = COLUMN_WIDTH / originalWidth;
    const calculatedHeight = originalHeight * scaleFactor;
    const minHeight = COLUMN_WIDTH * 0.75;
    const maxHeight = COLUMN_WIDTH * 1.5;
    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  }, []);

  const getImageDimensions = useCallback(async (image: any, id: string) => {
    if (imageDimensions[id]) return;

    const defaultDimensions = {
      width: COLUMN_WIDTH,
      height: COLUMN_WIDTH * DEFAULT_ASPECT_RATIO
    };

    try {
      if (typeof image === 'number') {
        const resolvedImage = Image.resolveAssetSource(image);
        if (resolvedImage) {
          setImageDimensions(prev => ({
            ...prev,
            [id]: { width: resolvedImage.width, height: resolvedImage.height }
          }));
          return;
        }
      }

      setImageDimensions(prev => ({
        ...prev,
        [id]: defaultDimensions
      }));

      if (typeof image === 'string' || image?.uri) {
        Image.getSize(
          image?.uri || image,
          (width, height) => {
            setImageDimensions(prev => ({
              ...prev,
              [id]: { width, height }
            }));
          },
          () => {} // Silently fail and keep default dimensions
        );
      }
    } catch {
      setImageDimensions(prev => ({
        ...prev,
        [id]: defaultDimensions
      }));
    }
  }, [imageDimensions]);

  React.useEffect(() => {
    data.forEach(item => {
      if (!imageDimensions[item.id]) {
        getImageDimensions(item.image, item.id);
      }
    });
  }, [data, getImageDimensions]);

  const handleLoadStart = useCallback((id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
  }, []);

  const handleLoadEnd = useCallback((id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const handleError = useCallback((id: string) => {
    setErrorStates(prev => ({ ...prev, [id]: true }));
    setLoadingStates(prev => ({ ...prev, [id]: false }));
  }, []);

  const columns = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [[], []];
    }

    // Initialize columns
    const cols = [[], []] as ProductData[][];
    
    // Distribute items between columns
    data.forEach((item, index) => {
      const columnIndex = index % 2;
      cols[columnIndex].push(item);
    });

    return cols;
  }, [data]);

  const renderItem = useCallback((item: ProductData, index: number) => {
    const dimensions = imageDimensions[item.id];
    const imageHeight = dimensions 
      ? calculateImageHeight(dimensions.width, dimensions.height)
      : COLUMN_WIDTH * DEFAULT_ASPECT_RATIO;
    const isLoading = loadingStates[item.id];
    const hasError = errorStates[item.id];

    return (
      <AnimatedTouchableOpacity
        key={item.id}
        entering={FadeInDown.delay(index * 100)}
        style={styles.itemContainer}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          {isLoading && (
            <View style={[styles.loadingContainer, { height: imageHeight }]}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}
          <Image
            source={item.image}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
            onLoadStart={() => handleLoadStart(item.id)}
            onLoadEnd={() => handleLoadEnd(item.id)}
            onError={() => handleError(item.id)}
            progressiveRenderingEnabled
            fadeDuration={0}
          />
          {hasError && (
            <View style={[styles.errorContainer, { height: imageHeight }]}>
              <View style={styles.errorBox}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </View>
            </View>
          )}
          
          {/* Product details overlay */}
          <View style={styles.overlayContainer}>
            <LinearGradient
              colors={['#000000', '#D9D9D900']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.overlayGradient}
            >
              <View style={styles.brandInfoContainer}>
                <Image 
                  source={item.brandLogo} 
                  style={styles.brandLogo}
                  defaultSource={require('../../../assets/images/avatar-placeholder.jpg')}
                />
                <View style={styles.detailsSection}>
                  <View style={styles.priceSection}>
                    <Text style={styles.priceAmount}>{item.price.split(' ')[0]}</Text>
                    <Text style={styles.currency}>BDT</Text>
                  </View>
                  <View style={styles.nameSection}>
                    <Text style={styles.brandName}>{item.brandName}</Text>
                    <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                      {item.name}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={(e) => handleAddToCart(e, item)}
                >
                  <Ionicons 
                    name={recentlyAdded[item.id] ? "checkmark" : "cart"}
                    size={22} 
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    );
  }, [loadingStates, errorStates, imageDimensions, calculateImageHeight, handleAddToCart, router, recentlyAdded]);

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {columns.map((column, columnIndex) => (
          <View key={columnIndex} style={styles.column}>
            {column.map((item, index) => renderItem(item, index))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: SIDE_PADDING,
    paddingTop: SIDE_PADDING * 0.5,
    gap: COLUMN_GAP,
  },
  column: {
    flex: 1,
    gap: 7,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: 0,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  image: {
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorBox: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  brandInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  detailsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 0,
  },
  priceAmount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  currency: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  brandName: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  productName: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
    flex: 1,
  },
  addToCartButton: {
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonSuccess: {
    backgroundColor: '#000',
  },
  checkmarkContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlayGradient: {
    padding: 6,
    paddingVertical: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
}); 