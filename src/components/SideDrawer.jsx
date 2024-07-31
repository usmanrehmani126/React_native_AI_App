import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import fontFamily from './fontFamily';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import {TrashIcon} from 'react-native-heroicons/solid';
import {useDispatch} from 'react-redux';
import {
  clearAllChats,
  createNewChat,
  deleteChat,
} from '../redux/reducers/chatSlice';
import uuid from 'react-native-uuid';
const SideDrawer = ({
  setCurrentChatId,
  chats,
  onPressHide,
  currentChatId,
  visible,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const clearChatsFunction = async () => {
    dispatch(clearAllChats());
  };
  const addANewChat = async () => {
    dispatch(
      createNewChat({
        chatId: uuid.v4(),
        messages: [],
        summary: 'New Chat',
      }),
    );
  };
  const onDeleteChat = async id => {
    dispatch(deleteChat({chatId: id}));
  };
  return (
    <Modal
      style={styles.bottomModalView}
      isVisible={visible}
      backdropColor="black"
      backdropOpacity={0.5}
      onBackdropPress={onPressHide}
      onBackButtonPress={onPressHide}>
      <View style={styles.modalContainer}>
        <View style={{width: '100%', height: '100%'}}>
          <View style={styles.header}>
            <View style={styles.flexRow}>
              <Image
                source={require('../assets/logo_t.png')}
                style={styles.logo}
              />
              <Text style={{fontFamily: fontFamily.bold}}>All Chats.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.newChat} onPress={addANewChat}>
            <Text
              style={{fontFamily: fontFamily.medium, fontSize: RFValue(10)}}>
              + Add new chat
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fontFamily.semiBold,
              fontSize: RFValue(16),
              margin: 2,
            }}>
            Recent
          </Text>

          <View style={{height: '60%'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={[...chats].reverse()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.chatBtn,
                      {
                        backgroundColor:
                          currentChatId === item.id ? '#041e49' : '#131314',
                        margin: 2,
                      },
                    ]}
                    onPress={() => {
                      onPressHide();
                      setCurrentChatId(item.id);
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: 'white',
                        fontFamily: fontFamily.medium,
                        fontSize: RFValue(11),
                      }}>
                      {item.summary.substring(0, 35) + '...'}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.trashIconStyle}
                      onPress={() => onDeleteChat(item.id)}>
                      <TrashIcon color={'#ef4444'} size={RFValue(14)} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
              key={item => item.id}
              keyExtractor={item => item.id}
              contentContainerStyle={{
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}
            />
          </View>

          <View>
            <TouchableOpacity
              style={[styles.proAndClearStyle, {flexDirection: 'row'}]}
              onPress={clearChatsFunction}>
              <Text
                style={{
                  fontFamily: fontFamily.light,
                }}>
                Clear
              </Text>
              <Image
                source={require('../assets/remove.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={true}
              style={[styles.proAndClearStyle, {flexDirection: 'row'}]}>
              <Text
                style={{
                  fontFamily: fontFamily.light,
                }}>
                Upgrade to Pro
              </Text>
              {/* <SunnyFilled width={50} height={100}  /> */}

              <Image
                source={require('../assets/crown.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: fontFamily.light,
                fontSize: 10,
                alignSelf: 'center',
                opacity: 0.6,
              }}>
              Developed & Design by 💖 - Usman
            </Text>
            <TouchableOpacity
              style={styles.footer1}
              activeOpacity={0.6}
              onPress={() => navigation.navigate('DeveloperScreen')}>
              <Text
                style={{
                  fontFamily: fontFamily.light,
                  fontSize: 13,
                  alignSelf: 'center',
                }}>
                Contact Developer.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'flex-end',
    width: '80%',
    margin: 8,
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 30,
    width: 30,
  },
  flexRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    padding: 15,
    borderColor: 'white',
  },
  newChat: {
    backgroundColor: '#272a2c',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
  },
  proAndClearStyle: {
    backgroundColor: '#272a2c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: '60%',
    margin: 10,
    alignSelf: 'center',
    padding: 4,
    gap: 6,
  },
  trashIconStyle: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: 'white',
  },
});
