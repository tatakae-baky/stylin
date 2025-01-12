import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageSourcePropType,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_INTERVAL = 4000; // 4 seconds between slides
const HORIZONTAL_PADDING = 12; // Reduced padding to allow for wider cards
const CARD_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2); // Card width with equal padding on both sides

interface AdCarouselProps {
  images: ImageSourcePropType[];
  height?: number;
}

export default function AdCarousel({ images, height = 200 }: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout>();
  const [isPaused, setIsPaused] = useState(false);
  const dotScale = useSharedValue(1);

  // Handle automatic sliding
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [currentIndex, isPaused]);

  const startAutoplay = () => {
    stopAutoplay();
    if (!isPaused) {
      autoplayTimeoutRef.current = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        scrollToIndex(nextIndex);
      }, SLIDE_INTERVAL);
    }
  };

  const stopAutoplay = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
    animateDot();
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    stopAutoplay();
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
  };

  const animateDot = () => {
    dotScale.value = withSpring(1.2, {}, () => {
      dotScale.value = withSpring(1);
    });
  };

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  return (
    <View style={[styles.container, { height }]}>
      <TouchableWithoutFeedback
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          decelerationRate={0.9}
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMomentumScrollEnd={handleTouchEnd}
          contentContainerStyle={styles.scrollContent}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.slideContainer}>
              <Image
                source={image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
      </TouchableWithoutFeedback>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && [styles.paginationDotActive, dotStyle],
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  slideContainer: {
    width: CARD_WIDTH,
    marginRight: SCREEN_WIDTH - CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
}); 