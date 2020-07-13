import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const style = StyleSheet.create({

})

class LivingSituations extends Component {
    compoentDidMount() {
        const { navigation } = this.props
        const livingSituation =  navigation.getParam('livingSituation');
        this.setState({
            livingSituation:livingSituation
        })

        
    }
    handleEndDate = () => {
        console.log()
    }
    render() {
        return ( 
            
        )
    }
}

export default LivingSituations;
