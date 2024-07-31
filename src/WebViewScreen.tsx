import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {WebView} from 'react-native-webview';
import fontFamily from './components/fontFamily';
import {ChevronLeftIcon} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';

const WebViewScreen = () => {
  const [loading, setLoading] = useState(true);
  const onLoad = () => {
    setLoading(false);
  };
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 8,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={RFValue(20)} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: 16,
            color: 'black',
          }}>
          Developer Details
        </Text>
        <View />
      </View>

      {loading && (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator color={'black'} size={'large'} />
        </View>
      )}
      <WebView
        source={{uri: 'https://usmandotdev.netlify.app/'}}
        onLoad={onLoad}
        style={{flex: 1}}
        javaScriptEnabled={true}
        style={{flex: 1}}
      />
    </>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
