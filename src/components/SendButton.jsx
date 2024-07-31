import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import EventSource from 'react-native-sse';
import {
  addAssistantMessage,
  addMessage,
  createNewChat,
  markMessageAsRead,
  selectChats,
  selectCurrentChatId,
  updateAssitantMessage,
  updateChatSummary,
} from '../redux/reducers/chatSlice';
import {PaperAirplaneIcon} from 'react-native-heroicons/solid';
import uuid from 'react-native-uuid';
import {
  HUGGING_API_KEY,
  HUGGING_API_URL,
  STABLE_DIFFUSION_KEY,
  STABLE_DIFFUSION_URL,
} from '../redux/API';
import axios from 'axios';
const minHeight = Dimensions.get('window').height;
const SendButton = ({
  isTyping,
  setIsTyping,
  setCurrentChatId,
  length,
  setHeightOfMessageBox,
  messages,
}) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChatId = useSelector(selectCurrentChatId);
  const animationValue = useRef(new Animated.Value(0)).current;
  const TextInputRef = useRef(null);

  const handleTextChange = txt => {
    setIsTyping(!!txt);
    setMessage(txt);
  };
  const handleContentSizeChange = event => {
    setHeightOfMessageBox(event.nativeEvent.contentSize.height);
  };
  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isTyping ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isTyping]);

  const sendBtnStyle = {
    opacity: animationValue,
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };
  const fetchResponse = async (mes, selectedChatId) => {
    let id = length + 2;
    dispatch(
      addAssistantMessage({
        chatId: selectedChatId,
        message: {
          content: 'Loading..',
          time: mes.time,
          role: 'assistant',
          id: id,
        },
      }),
    );

    const eventSource = new EventSource(HUGGING_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HUGGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      pollingInterval: 0,
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [...messages, mes],
        max_tokens: 500,
        stream: true,
      }),
    });

    let content = '';
    let responseComplete = false;

    eventSource.addEventListener('message', event => {
      if (event.data !== '[DONE]') {
        const parsedData = JSON.parse(event.data);
        if (parsedData.choices && parsedData.choices.length > 0) {
          const delta = parsedData.choices[0].delta.content;

          if (delta) {
            content += delta;
            dispatch(
              updateAssitantMessage({
                chatId: selectedChatId,
                message: {
                  content,
                  time: new Date().toString(),
                  role: 'assitant',
                  id: id,
                },
                messageId: id,
              }),
            );
          }
        }
      } else {
        responseComplete = true;
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', error => {
      console.log(error);
      dispatch(
        updateAssitantMessage({
          chatId: selectedChatId,
          message: {
            content: 'Oops! Looks like something snapped!🫰🏻',
            time: new Date().toString(),
            role: 'assitant',
            id: id,
          },
          messageId: id,
        }),
      );
      eventSource.close();
    });

    eventSource.addEventListener('close', () => {
      if (!responseComplete) {
        eventSource.close();
      }
    });

    return () => {
      eventSource.removeAllEventListeners();
      eventSource.close();
    };
  };
  const generateImage = async (mes, selectedChatId) => {
    let id = length + 2;
    dispatch(
      addAssistantMessage({
        chatId: selectedChatId,
        message: {
          content: 'Loading..',
          time: mes.time,
          role: 'assitant',
          id: id,
        },
      }),
    );

    try {
      const res = await axios.post(
        STABLE_DIFFUSION_URL,
        {
          key: STABLE_DIFFUSION_KEY,
          prompt: message,
          // negative_prompt: 'low quality',
          width: '512',
          height: '512',
          safety_checkers: false,
          seed: null,
          samples: 1,
          base64: false,
          webhook: null,
          track_id: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      dispatch(
        updateAssitantMessage({
          chatId: selectedChatId,
          message: {
            content: res.data?.output[0],
            imageUri: res.data?.output[0],
            time: new Date().toString(),
            role: 'assitant',
            id: id,
          },
          messageId: id,
        }),
      );
    } catch (error) {
      console.log(error);
      dispatch(
        updateAssitantMessage({
          chatId: selectedChatId,
          message: {
            content: 'Oops! Looks like something snapped!🫰🏻',
            time: new Date().toString(),
            role: 'assitant',
            id: id,
          },
          messageId: id,
        }),
      );
    }
  };

  const identifyImageApi = prompt => {
    const imageRegex = /\b(generate\s*image|imagine)\b/i;
    if (imageRegex.test(prompt)) {
      return true;
    } else {
      return false;
    }
  };

  const addChat = async newId => {
    let selectedChatId = newId ? newId : currentChatId;
    let msgId = length + 1;

    if (length == 0 && message.trim().length > 0) {
      dispatch(
        updateChatSummary({
          chatId: selectedChatId,
          summary: message?.trim().slice(0, 40),
        }),
      );
    }

    dispatch(
      addMessage({
        chatId: selectedChatId,
        message: {
          content: message,
          time: new Date().toString(),
          role: 'user',
          id: msgId,
          isMessageRead: false,
        },
      }),
    );

    setMessage('');
    //Comment if you want not to keyboard dismiss
    TextInputRef.current.blur();
    setIsTyping(false);

    let promptForAssitant = {
      content: message,
      time: new Date().toString(),
      role: 'user',
      id: msgId,
      isMessageRead: false,
    };

    if (!identifyImageApi(message)) {
      fetchResponse(promptForAssitant, selectedChatId);
    } else {
      generateImage(promptForAssitant, selectedChatId);
    }

    dispatch(
      markMessageAsRead({
        chatId: selectedChatId,
        messageId: msgId,
      }),
    );
  };
  return (
    <View
      style={[
        styles.container,
        {
          bottom:
            Platform.OS === 'android'
              ? minHeight * 0.02
              : Math.max(0, minHeight),
        },
      ]}>
      <View style={styles.subContainer}>
        <View
          style={[styles.inputContainer, {width: isTyping ? '87%' : '100%'}]}>
          <TextInput
            editable
            ref={TextInputRef}
            multiline
            value={message}
            style={styles.input}
            placeholder="Message...."
            onChangeText={handleTextChange}
            onContentSizeChange={handleContentSizeChange}
          />
        </View>
        {isTyping && (
          <Animated.View style={[styles.sendButtonContainer, sendBtnStyle]}>
            <TouchableOpacity
              style={styles.sendButtonStyle}
              activeOpacity={0.5}
              onPress={async () => {
                const chatIndex = chats.findIndex(
                  cht => cht.id === currentChatId,
                );
                if (chatIndex === -1) {
                  let newChat = uuid.v4();
                  setCurrentChatId(newChat);
                  await dispatch(
                    createNewChat({
                      chatId: newChat,
                      messages: [],
                      summary: 'New Chat!',
                    }),
                  );
                  addChat(newChat);
                  return;
                }
                addChat();
              }}>
              <PaperAirplaneIcon color="#000" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default SendButton;

const styles = StyleSheet.create({
  container: {
    minHeight: minHeight * 0.06,
    maxHeight: minHeight * 0.4,
    paddingHorizontal: '1%',
    padding: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    width: '98%',
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    maxHeight: minHeight * 0.2,
    backgroundColor: '#232626',
    margin: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '1%',
    borderRadius: 22,
  },
  input: {
    width: '98%',
    padding: 8,
    marginHorizontal: '2%',
    fontSize: RFValue(13),
    color: 'white',
  },
  sendButtonContainer: {
    position: 'absolute',
    right: 0,
    bottom: 6,
    width: '11%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  sendButtonStyle: {
    backgroundColor: '#22c063',
    borderRadius: 42,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
