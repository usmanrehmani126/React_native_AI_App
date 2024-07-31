import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Bars3BottomLeftIcon} from 'react-native-heroicons/solid';
import {RFValue} from 'react-native-responsive-fontsize';
import fontFamily from './fontFamily';
import SideDrawer from './SideDrawer';
import {useDispatch} from 'react-redux';
import {clearChat} from '../redux/reducers/chatSlice';
const CustomHeader = ({currentChatId, chats, setCurrentChatId}) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const onClearChats = async () => {
    dispatch(clearChat({chatId: currentChatId}));
  };
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Bars3BottomLeftIcon color={'white'} size={RFValue(24)} />
        </TouchableOpacity>

        <View style={styles.flexRow}>
          <Image source={require('../assets/logo_t.png')} style={styles.logo} />
          <View>
            <Text style={{fontFamily: fontFamily.light, color: 'white'}}>
              My AI Gemi 👻.
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                color: 'white',
                fontSize: 12,
              }}>
              with Llama 3 Support 👌.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onClearChats}>
          <Text style={{fontFamily: fontFamily.bold, color: 'white'}}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      {visible && (
        <SideDrawer
          setCurrentChatId={id => setCurrentChatId(id)}
          chats={chats}
          onPressHide={() => setVisible(false)}
          visible={visible}
          currentChatId={currentChatId}
        />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(20,25,46,1)',
    borderBottomColor: 'rgba(62,62,63,1)',
    borderBottomWidth: 0.18,
  },
  subContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logo: {
    height: 38,
    width: 38,
    borderRadius: 40,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
