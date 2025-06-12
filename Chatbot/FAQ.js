import React, {useState, useEffect} from 'react';
import {Text, View, Alert, FlatList, StyleSheet} from 'react-native';

const FAQs = () => {
  const [FAQ, getFAQ] = useState([]);
  const numColumns = 2; // Static value, adjust if dynamic

  useEffect(() => {
    GetFrequentBaseQuestions();
  }, []);

  const GetFrequentBaseQuestions = async () => {
    const reg_no = global.REG_NO;
    try {
      let response = await fetch(`${global.MyIpAddress}/getFAQ`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reg_no,
        }),
      });
      const data = await response.json();

      if (data.faqs) {
        getFAQ(data.faqs);
        console.log(data.faqs);
      } else {
        Alert.alert('No FAQs found');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error Occurred', error.message || error.toString());
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.questionText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Frequently Asked Questions</Text>
      <FlatList
        key={`flatlist-${numColumns}`}
        data={FAQ}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.noData}>No FAQs available.</Text>
        }
      />
    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    margin: 20,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#1E897A',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: '#1E897A',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  questionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
