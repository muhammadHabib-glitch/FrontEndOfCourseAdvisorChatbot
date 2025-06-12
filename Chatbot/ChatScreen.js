import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {IconButton} from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ChatScreen = ({navigation}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const botSlideAnim = useRef(new Animated.Value(50)).current;

  const scrollViewRef = useRef();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -SCREEN_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    Keyboard.dismiss(); // Dismiss keyboard on send

    const reg_no = global.REG_NO;

    // Add user message
    setMessages(prev => [...prev, {text: input, sender: 'user'}]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${global.MyIpAddress}/get_answer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          question: input,
          reg_no,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await res.json();

      setTimeout(() => {
        Animated.timing(botSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setMessages(prev => [...prev, {text: data.answer, sender: 'bot'}]);
          botSlideAnim.setValue(50); // reset for next bot message
        });

        setIsTyping(false);
      }, 500);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {text: `Error: ${error.message}`, sender: 'bot'},
      ]);
      setIsTyping(false);
    }
  };

  const handleScreenTap = () => {
    if (menuVisible) {
      toggleMenu();
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="menu" size={30} onPress={toggleMenu} />
          <Text style={styles.headerTitle}>Welcome to ChatBot</Text>
        </View>

        {menuVisible && <View style={styles.overlay} />}

        <Animated.View
          style={[styles.sideMenu, {transform: [{translateX: slideAnim}]}]}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('PreviousCourse');
            }}>
            <Text style={styles.menuItem}>All Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('FailCourses');
            }}>
            <Text style={styles.menuItem}>Fail Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('EnrollCourses');
            }}>
            <Text style={styles.menuItem}>Enroll Courses</Text>
          </TouchableOpacity>
        </Animated.View>

        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{paddingVertical: 8}}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }>
          {messages.map((msg, i) => {
            const isUser = msg.sender === 'user';
            const isLast = i === messages.length - 1;
            const isBot = msg.sender === 'bot';

            if (isBot && isLast) {
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.message,
                    styles.botMsg,
                    {transform: [{translateY: botSlideAnim}]},
                  ]}>
                  <Text style={styles.botText}>{msg.text}</Text>
                </Animated.View>
              );
            }

            return (
              <View
                key={i}
                style={[
                  styles.message,
                  isUser ? styles.userMsg : styles.botMsg,
                ]}>
                <Text style={isUser ? styles.userText : styles.botText}>
                  {msg.text}
                </Text>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.message, styles.botMsg]}>
              <ActivityIndicator size="small" color="#333" />
              <Text style={styles.botText}>Bot is typing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Anything..."
            placeholderTextColor="white"
            value={input}
            onChangeText={setInput}
          />
          <IconButton
            icon="magnify"
            size={30}
            color="white"
            onPress={handleSend}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1E897A',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: 'white',
    zIndex: 10,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    backgroundColor: '#1E897A',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  menuItem: {
    fontSize: 18,
    color: '#1E897A',
    marginVertical: 10,
    fontWeight: 'bold',
    margin: 12,
  },
  chatBox: {
    flex: 1,
    paddingHorizontal: 16,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 22,
    marginVertical: 4,
  },
  userMsg: {
    backgroundColor: '#1E897A',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botMsg: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userText: {
    color: 'white',
    fontSize: 16,
  },
  botText: {
    color: '#333',
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E897A',
    borderRadius: 35,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});
