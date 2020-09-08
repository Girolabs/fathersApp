import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  innerText: {
    fontFamily: 15,
    fontFamily: 'work-sans',
  },
});

const Reminders = ({}) => {
  <FlatList
    data={item}
    renderItem={({ item }) => (
      <View style={styles.reminderListItem}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome5 name="birthday-cake" size={24} color={Colors.primaryColor} />
          {item.entityCountry != null ? (
            <Flag id={item.entityCountry} size={0.1} />
          ) : (
            <Ionicons name="ios-flag" size={23} color={Colors.onSurfaceColorSecondary} />
          )}
          <View style={{ marginLeft: 15 }}>
            {/* {item.isImportant ? (
                            <Text style={styles.innerText}>{date}</Text>
                        ):(
                            <Text style={styles.innerText}>{item.text}</Text>
                        )} */}
            <Button
              onPress={() => {
                navigation.navigate('PatreDetail', { fatherId: item.entityObject.personId });
              }}
            ></Button>
          </View>
          )
        </View>
      </View>
    )}
  />;
};

export default Reminders;
