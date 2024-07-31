import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacityBase,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import MetaAILogo from '../assets/logo_t.png';
import fontFamily from './fontFamily';

const exampleData = [
  '🧠 AI Trends 2024',
  '🚀 Space Exploration Updates',
  '🎮 Gaming News',
  '📈 Stock Market Insights',
  '🎬 Movie Recommendations',
  '📚 Book Summaries',
  '🍔 Best Recipes',
  '🌍 Global News',
  '🎵 Music Hits',
  '🏅 Sports Highlights',
  '🎨 Art Exhibitions',
  '🧩 Puzzle of the Day',
  '💡 Innovative Ideas',
  '💰 Financial Tips',
  '🏡 Home Decor',
  '👗 Fashion Trends',
  '🚗 Car Reviews',
  '📱 Gadget Reviews',
  '🌱 Gardening Tips',
  '🐶 Pet Care Advice',
];

const EmptyComponent = ({isTyping}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const ItemScroll = ({item}) => {
    return (
      <TouchableOpacity style={styles.touchableItem}>
        <Text style={styles.touchableText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Animated.Image
            source={MetaAILogo}
            style={[
              styles.img,
              {
                transform: [{rotate}],
              },
            ]}
          />
        </View>
        <Text
          style={{
            fontSize: RFValue(22),
            fontFamily: fontFamily.regular,
            alignSelf: 'center',
          }}>
          Ask{' '}
          <Text
            style={{
              fontFamily: fontFamily.medium,
            }}>
            My Gemi{' '}
          </Text>
          Anything.
        </Text>

        {!isTyping && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            centerContent={true}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {exampleData?.slice(0, 7).map((item, index) => {
                  return <ItemScroll item={item} key={index} />;
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 12,
                }}>
                {exampleData?.slice(7, 14).map((item, index) => {
                  return <ItemScroll item={item} key={index} />;
                })}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {exampleData?.slice(14, 21).map((item, index) => {
                  return <ItemScroll item={item} key={index} />;
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    width: RFValue(100),
    height: RFValue(100),
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollContainer: {
    marginTop: 20,
    maxHeight: RFValue(140),
  },
  scrollContent: {
    alignItems: 'center',
  },
  touchableItem: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
  },
  touchableText: {
    fontSize: RFValue(12),
    color: 'white',
    fontFamily: fontFamily.medium,
  },
});

export default EmptyComponent;
