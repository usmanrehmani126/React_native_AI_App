import {Dimensions, View} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import MessageBubbleUI from './MessageBubbleUI';
import useKeyboardOffsetHeight from '../helpers/useKeyboardOffsetHeight';
import getMessageHeightOffset from '../helpers/getMessageHeightOffset';
import EmptyComponent from './EmptyComponent';

const Chat = ({isTyping, messages, heightOfMessageBox}) => {
  const windowHeight = Dimensions.get('window').height;
  const keyboardHeight = useKeyboardOffsetHeight();
  const renderMessageBubble = ({item}) => {
    return <MessageBubbleUI message={item} />;
  };
  return (
    <View
      style={{
        height:
          windowHeight * 0.76 -
          keyboardHeight * 0.95 -
          getMessageHeightOffset(heightOfMessageBox, windowHeight),
      }}>
      {messages?.length == 0 ? (
        <>
          <EmptyComponent isTyping={isTyping} />
        </>
      ) : (
        <FlashList
          indicatorStyle="white"
          data={[...messages].reverse()}
          inverted
          estimatedItemSize={40}
          renderItem={renderMessageBubble}
        />
      )}
    </View>
  );
};

export default Chat;
