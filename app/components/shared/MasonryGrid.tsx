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
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSaved } from '../../context/SavedContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const SPACING = 12;
const COLUMN_WIDTH = (SCREEN_WIDTH - (SPACING * 3)) / NUM_COLUMNS;

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

export default function MasonryGrid({ data }: MasonryGridProps) {
  const router = useRouter();
  const { state: savedState, dispatch: savedDispatch } = useSaved();
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: string]: boolean }>({});
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});

  const getImageDimensions = useCallback(async (image: any, id: string) => {
    try {
      Image.getSize(Image.resolveAssetSource(image).uri, 
        (width, height) => {
          setImageDimensions(prev => ({
            ...prev,
            [id]: { width, height }
          }));
        },
        (error) => {
          console.error('Error getting image dimensions:', error);
          setImageDimensions(prev => ({
            ...prev,
            [id]: { width: COLUMN_WIDTH, height: COLUMN_WIDTH }
          }));
        }
      );
    } catch (error) {
      console.error('Error processing image:', error);
      setImageDimensions(prev => ({
        ...prev,
        [id]: { width: COLUMN_WIDTH, height: COLUMN_WIDTH }
      }));
    }
  }, []);

  React.useEffect(() => {
    data.forEach(item => {
      if (!imageDimensions[item.id]) {
        getImageDimensions(item.image, item.id);
      }
    });
  }, [data]);

  const calculateImageHeight = (originalWidth: number, originalHeight: number) => {
    const scaleFactor = COLUMN_WIDTH / originalWidth;
    return originalHeight * scaleFactor;
  };

  const columns = useMemo(() => {
    const cols: ProductData[][] = Array(NUM_COLUMNS).fill([]).map(() => []);
    let colHeights = Array(NUM_COLUMNS).fill(0);

    data.forEach((item) => {
      const dimensions = imageDimensions[item.id];
      const imageHeight = dimensions 
        ? calculateImageHeight(dimensions.width, dimensions.height)
        : COLUMN_WIDTH;

      // Find the shortest column
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestColIndex].push(item);
      colHeights[shortestColIndex] += imageHeight + 80; // Add some space for text content
    });

    return cols;
  }, [data, imageDimensions]);

  const handleSave = useCallback((item: ProductData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    savedDispatch({
      type: 'TOGGLE_SAVE',
      payload: {
        id: item.id,
        name: item.name,
        brand: item.brandName,
        price: parseFloat(item.price.replace(' BDT', '')),
        image: item.image,
        brandLogo: item.brandLogo
      }
    });
  }, [savedDispatch]);

  const renderItem = useCallback((item: ProductData, index: number) => {
    const dimensions = imageDimensions[item.id];
    const imageHeight = dimensions 
      ? calculateImageHeight(dimensions.width, dimensions.height)
      : COLUMN_WIDTH;
    const isLoading = loadingStates[item.id];
    const hasError = errorStates[item.id];
    const isSaved = savedState.items[item.id] !== undefined;

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
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
          <Image
            source={item.image}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
            onLoadStart={() => handleLoadStart(item.id)}
            onLoadEnd={() => handleLoadEnd(item.id)}
            onError={() => handleError(item.id)}
          />
          {hasError && (
            <View style={[styles.errorContainer, { height: imageHeight }]}>
              <View style={styles.errorBox} />
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.brandInfoContainer}>
            <View style={styles.brandSection}>
              <Image source={item.brandLogo} style={styles.brandLogo} />
              <View style={styles.priceAndBrandContainer}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.brandName}>{item.brandName}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => handleSave(item)}
            >
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color="#000" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    );
  }, [loadingStates, errorStates, imageDimensions, savedState.items]);

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
    paddingHorizontal: SPACING,
    paddingTop: SPACING * 0.5,
    gap: SPACING,
  },
  column: {
    flex: 1,
    gap: SPACING,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: SPACING,
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
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  detailsContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000',
  },
  brandInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  priceAndBrandContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 12,
    color: '#666',
  },
  saveButton: {
    padding: 4,
  },
}); 