import {Alert, Animated, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FONTS} from './components/Fonts';
import fontFamily from './components/fontFamily';
import {useNavigation} from '@react-navigation/native';

const SplashScreen: FC = () => {
  const navigation = useNavigation();
  const [isStop, setIsStop] = useState(false);
  const scale = new Animated.Value(1);
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Main');
    }, 4000);
  }, []);
  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3, //Scale up
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, //Scale down
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (!isStop) {
      breathingAnimation.start();
    }

    return () => {
      breathingAnimation.stop();
    };
  }, [isStop]);
  return (
    <View style={styles.container}>
      <View style={styles.ImageContainer}>
        <Animated.Image
          source={require('./assets/logo_t.png')}
          style={{
            width: '60%',
            height: '25%',
            resizeMode: 'contain',
            transform: [{scale}],
          }}
        />
        <Text style={{fontFamily: fontFamily.medium}}>
          Your Llama 3 Modal AI App is Here 👌.
        </Text>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontFamily: fontFamily.semiBold}}>
            Create your daily content with AI Power.
          </Text>
          <Text style={{fontFamily: fontFamily.medium}}>Just by one Click</Text>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  ImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'Poppins-Medium.ttf',
    fontSize: 20,
  },
});
