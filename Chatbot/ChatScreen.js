import {
  startRecording,
  stopRecording,
  sendAudioToBackend,
} from './VoiceHandler'; // adjust the path as needed
import {PermissionsAndroid, Platform} from 'react-native';

import React, {useState, useRef, useEffect} from 'react';
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
  FlatList,
} from 'react-native';
import {IconButton} from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ChatScreen = ({navigation, route}) => {
  const regNo = route.params?.Reg_No ?? global.REG_NO;
  console.log('Using regNo:', regNo);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ChatHistoryMenu, setChatHistoryMenu] = useState(false);
  const [ChatHistory, setChatHistory] = useState([]);

  console.log(regNo);

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const botSlideAnim = useRef(new Animated.Value(50)).current;

  const scrollViewRef = useRef();

  useEffect(() => {
    const GetChatHistory = async () => {
      try {
        const response = await fetch(`${global.MyIpAddress}/get_chat_history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reg_no: regNo,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        setChatHistory(data.history);
      } catch (error) {
        console.log('Error:', error.message);
      }
    };
    GetChatHistory();
  }, [regNo]);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.courseText, styles.questionText]}>
        Q: {item?.question || 'No Question text'}
      </Text>
      <Text style={[styles.courseText, styles.answerText]}>
        A: {item?.answer || 'No Answer text'}
      </Text>
    </View>
  );

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? SCREEN_WIDTH : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record voice.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    Keyboard.dismiss();

    setMessages(prev => [...prev, {text: input, sender: 'user'}]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${global.MyIpAddress}/get_answer`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          question: input,
          reg_no: regNo,
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
          botSlideAnim.setValue(50);
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
          <IconButton
            icon="menu"
            size={25}
            onPress={() => setChatHistoryMenu(!ChatHistoryMenu)}
          />
          <Text style={styles.headerTitle}>Welcome to ChatBot</Text>
          <IconButton icon="dots-vertical" size={25} onPress={toggleMenu} />
        </View>

        {ChatHistoryMenu && (
          <View style={styles.chatHistoryContainer}>
            <View style={styles.chatHistoryHeader}>
              <Text style={styles.chatHistoryTitle}>Chat History</Text>
              <TouchableOpacity
                onPress={() => setChatHistoryMenu(!ChatHistoryMenu)}
                style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ChatHistory}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={true}
              style={styles.fullHeight}
            />
          </View>
        )}

        {menuVisible && <View style={styles.overlay} />}

        <Animated.View
          style={[styles.sideMenu, {transform: [{translateX: slideAnim}]}]}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('PreviousCourse', {regNo});
            }}>
            <Text style={styles.menuItem}>All Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('FailCourses', {regNo});
            }}>
            <Text style={styles.menuItem}>Fail Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              toggleMenu();
              navigation.navigate('EnrollCourses', {regNo});
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
            returnKeyType="send" // Shows "Send" on the keyboard
            onSubmitEditing={handleSend} // Triggers when Enter is pressed
          />
          <IconButton
            icon="arrow-top-right-thick"
            size={30}
            color="white"
            iconColor="white"
            onPress={handleSend}
          />
          <View>
            <IconButton
              icon={isRecording ? 'microphone-off' : 'microphone'}
              size={28}
              color="white"
              iconColor="white"
              onPress={async () => {
                if (isRecording) {
                  try {
                    await stopRecording();
                    await sendAudioToBackend();
                  } catch (err) {
                    alert(err.message);
                  }
                  setIsRecording(false);
                } else {
                  // ✅ ADDED: Request audio permission before recording
                  const permissionGranted = await requestAudioPermission();
                  if (!permissionGranted) {
                    alert('Microphone permission denied.');
                    return;
                  }
                  try {
                    await startRecording();
                    setIsRecording(true);
                  } catch (err) {
                    alert(err.message);
                  }
                }
              }}
              style={{marginLeft: 12}}
            />
          </View>
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
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E897A',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
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
    margin: 20,
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
    margin: 12,
    fontSize: 17,
    flex: 1,
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chatHistoryContainer: {
    backgroundColor: 'white',
    width: '80%',
    height: '100%',
    position: 'absolute',
    zIndex: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatHistoryTitle: {
    fontSize: 22,
    color: '#1E897A',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  fullHeight: {
    flex: 1,
  },
  itemContainer: {
    padding: 16,
    marginBottom: 5,
    borderRadius: 3,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  courseText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  questionText: {
    fontWeight: 'bold',
    color: '#1E897A',
  },
  answerText: {
    color: '#555',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
