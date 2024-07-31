import {ImageBackground} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from './components/CustomHeader';
import SendButton from './components/SendButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeCurrentChatId,
  selectChats,
  selectCurrentChatId,
} from './redux/reducers/chatSlice';
import Chat from './components/Chat';

const MetaAI = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [heightOfMessageBox, setHeightOfMessageBox] = useState(0);
  const dispatch = useDispatch();
  const currentChatId = useSelector(selectCurrentChatId);
  const chats = useSelector(selectChats);

  const setCurrentChatId = id => {
    dispatch(changeCurrentChatId({chatId: id}));
  };
  return (
    <ImageBackground
      blurRadius={30}
      source={require('./assets/w_bg.png')}
      style={{flex: 1}}>
      <CustomHeader
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={id => setCurrentChatId(id)}
      />
      <Chat
        isTyping={isTyping}
        heightOfMessageBox={heightOfMessageBox}
        messages={chats?.find(chat => chat.id == currentChatId)?.messages || []}
      />

      <SendButton
        isTyping={isTyping}
        setHeightOfMessageBox={setHeightOfMessageBox}
        heightOfMessageBox={heightOfMessageBox}
        setIsTyping={setIsTyping}
        currentChatId={currentChatId}
        setCurrentChatId={id => setCurrentChatId(id)}
        length={
          chats?.find(chat => chat.id == currentChatId)?.messages?.length ||
          [].length
        }
        messages={chats?.find(chat => chat.id == currentChatId)?.messages || []}
      />
    </ImageBackground>
  );
};

export default MetaAI;
