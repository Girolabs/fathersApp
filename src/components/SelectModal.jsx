import React from 'react';
import ModalSelector from 'react-native-modal-selector'
import { Ionicons } from 'expo-vector-icons';
import { TextInput,StyleSheet, View} from 'react-native';
import Colors from '../constants/Colors';
const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.surfaceColorSecondary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 7,
      },


})
const SelectModal = (props)=>{
    return(
        <ModalSelector
            name={props.name}
            data={props.data}
            initValue={props.initValue}
            onChange={props.onChange}
            keyExtractor= {item => item.value}
            optionTextStyle={{flex:1,color:'#000' ,fontSize: 18,}}
            optionContainerStyle={{backgroundColor:Colors.surfaceColorSecondary}}
            optionStyle={{borderBottomColor:Colors.surfaceColorSecondary,paddingVertical:12}}
            cancelStyle={{borderBottomColor:Colors.surfaceColorSecondary,paddingVertical:12}}
            cancelContainerStyle={{backgroundColor:Colors.surfaceColorSecondary}}
            cancelTextStyle={{color:'red'}}
            selectedItemTextStyle={{color :'blue',fontStyle:'italic'}}
            cancelText='Cancel'
            onModalClose={props.onModalClose}
            disabled={props.disabled}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                    style={{color:'#000'}}
                    editable={false}
                    placeholder="Select an item..."
                    value={props.value}
                    />
                    {props.arrowDropDown && <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                </View>
            </ModalSelector>
    )
}
export default SelectModal;
