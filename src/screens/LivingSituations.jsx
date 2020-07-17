import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Picker } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import axios from '../../axios-instance';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from 'expo-vector-icons';

const styles = StyleSheet.create({
    title:{
        fontFamily: 'work-sans-semibold',
        fontSize: 24,
        color: Colors.primaryColor,
        marginVertical: 40
    },
    screen: {
        backgroundColor: Colors.surfaceColorPrimary,
        height:'100%',
        paddingHorizontal:10
    },
    label:{
        fontFamily: 'work-sans-semibold',
        fontSize: 18,
        color: Colors.primaryColor,
        
    },
    pickerInnerContainer:{
        backgroundColor:Colors.primaryColor
    }
});

const LivingSituationsFormScreen = ({ navigation }) => {
  const [livingSituation, setLivingSituation] = useState({});
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    const livingSituation = navigation.getParam('livingSituation');
    if(!!livingSituation) {
        setIsCreate(true);
    } 


    setLivingSituation(livingSituation);
  }, []);

const loadTerritory= () => {
}

  return (
      <>
    <NavigationEvents
      onDidFocus={() => {
        console.log('onDidFocus');
      }}
    />
    <SafeAreaView style={styles.screen}>
        {isCreate ? 
        <Text style={styles.title}>{i18n.t('LIVING_SITUATION.EDIT_TITLE')}</Text>:
        <Text style={styles.title}>{i18n.t('LIVING_SITUATION.CREATE_TITLE')}</Text>
    }
        <View >
            <Text style={styles.label}>{i18n.t('LIVING_SITUATION.RESPONSIBLE_TERRITORY')}</Text>
            <RNPickerSelect 
            style={{inputAndroid: {
                backgroundColor: Colors.surfaceColorSecondary,
              },
              iconContainer: {
                top: 10,
                right: 15,
              },
            }}
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
            Icon ={() =>{
                return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />
            }}
        />
            </View>


            <View >
            <Text style={styles.label}>{i18n.t('LIVING_SITUATION.STATUS')}</Text>
            <RNPickerSelect 
            style={{inputAndroid: {
                backgroundColor: Colors.surfaceColorSecondary,
              },
              iconContainer: {
                top: 10,
                right: 15,
              },
            }}
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
            Icon ={() =>{
                return <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />
            }}
        />
            </View>
            
            

            
    
    </SafeAreaView>
    </>
  );
};



export default LivingSituationsFormScreen;
