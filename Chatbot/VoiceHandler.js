import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

let audioPath = '';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    return (
      grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

const startRecording = async () => {
  const granted = await requestPermissions();
  if (!granted) {
    throw new Error('Permission denied');
  }

  audioPath = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/recording.aac`,
    android: `${RNFS.ExternalDirectoryPath}/recording.aac`,
  });

  await audioRecorderPlayer.startRecorder(audioPath);
  return audioPath;
};

const stopRecording = async () => {
  await audioRecorderPlayer.stopRecorder();
  audioRecorderPlayer.removeRecordBackListener();
  return audioPath;
};

const sendAudioToBackend = async () => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: `file://${audioPath}`,
      type: 'audio/aac',
      name: 'recording.aac',
    });

    const response = await fetch(`${global.MyIpAddress}/ask_by_voice`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.answer_audio) {
      await playResponseAudio(data.answer_audio);
    } else {
      throw new Error('Voice backend error');
    }
  } catch (e) {
    throw new Error('Voice upload failed: ' + e.message);
  }
};

const playResponseAudio = async audioUrl => {
  await audioRecorderPlayer.startPlayer(audioUrl);
  audioRecorderPlayer.addPlayBackListener(e => {
    if (e.currentPosition === e.duration) {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }
  });
};

export {startRecording, stopRecording, sendAudioToBackend};