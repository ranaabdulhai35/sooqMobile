import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {HEIGHT_BASE_RATIO, WIDTH_BASE_RATIO} from '../../Utils/helpers';
import {GeneralStyles} from '../../GeneralStyles/generalStyles';
import {COLORS} from '../../Constants';

const CustomCarousel = ({
  data,
  containerStyle,
  imageStyle,
  wrapperStyle,
  renderItem,
  dots,
  pagingEnabled,
  generalPadding,
  hoverDots,
  infiniteScroll,
  handleLoadMore,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    if (!infiniteScroll || data?.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data?.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [infiniteScroll, activeIndex, data?.length]);

  return (
    <View
      style={[
        generalPadding
          ? {...styles.container, ...GeneralStyles.generalPaddingHomeStack}
          : {...styles.container, paddingLeft: 0},
        wrapperStyle,
      ]}>
      {!renderItem ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ref={flatListRef}
          renderItem={({item}) => (
            <View style={[styles.imageContainer, containerStyle]}>
              <Image source={item} style={[imageStyle]} resizeMode="cover" />
            </View>
          )}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled={pagingEnabled}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          ref={flatListRef}
          renderItem={({item}) => renderItem(item)}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Dots to track the current index */}
      {dots && (
        <View style={styles.dotsContainer}>
          {data?.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? COLORS.Brown : COLORS.LightBrown,
                },
              ]}
            />
          ))}
        </View>
      )}
      {hoverDots && (
        <View style={styles.hoverDotsContainer}>
          {data?.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? COLORS.WHITE : COLORS.BLACK,
                  width: i === activeIndex ? WIDTH_BASE_RATIO(12) : 4,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 0,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },

  dot: {
    height: 4,
    width: 4,
    borderRadius: 2,
    marginHorizontal: 4,
    marginTop: HEIGHT_BASE_RATIO(16),
    borderColor: COLORS.Brown,
    borderWidth: 0.5,
  },
});

export default CustomCarousel;
