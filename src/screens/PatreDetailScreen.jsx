import React from "react";
import { View, Text, StyleSheet, Image, SectionList } from "react-native";
import Colors from '../constants/Colors';

const PatreDetailScreen = ({ navigation }) => {
    const profile = navigation.getParam('profile');
    console.log(profile)
    const DATA= [
        {
            title:'Información del contacto',
            data: [
                {
                    subtitle: 'Email',
                    body:profile.email,
                },
                {
                    subtitle: 'Teléfono móvil principal',
                    body:profile.phones[0].number,
                },
                {
                    subtitle: 'Casa',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
            ]
        }
    ]
    const DATA2 = [
        {
            title:'Vivienda actual',
            data: [
                {
                    subtitle: 'Filial',
                    body:'',
                },
                {
                    subtitle: 'Casa',
                    body:profile.phones[0].number,
                },
                {
                    subtitle: 'Territorio responsable /  Donde trabaja: ',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
            ]
        } 
    ]

    const DATA3 = [
        {
            title:'Informacion Personal',
            data: [
                {
                    subtitle: 'Pais de origen',
                    body:''
                },
                {
                    subtitle: 'Territorio de origen',
                    body:profile.phones[0].number,
                },
                {
                    subtitle: 'Curso',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },

                {
                    subtitle: 'Generación',
                    body:profile.email,
                },
                {
                    subtitle: 'Cumpleaños ',
                    body:profile.phones[0].number,
                },
                {
                    subtitle: 'Onomástico',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Bautismo',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Admisión al Postulantado',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Inicio del Noviciado',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Pertenencia Comunitaria',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Contrato Perpetuo',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Ordenación Diaconal',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
                {
                    subtitle: 'Ordenación Sacerdotal',
                    body:profile.phones[1] != undefined ? profile.phones[1].number: '',
                },
            ]
        } 
    ]

    return (
        <View style={styles.screen}>
            <View style={{ flexDirection: 'row',alignItems:'center'}}>
                <Image style={{ width:100, height: 100, borderRadius:50  }} resizMode='center' source={{uri:`https://schoenstatt-fathers.link${profile.photo}`}} />
                <View style={{ padding:15}}>
                    <Text style={{fontFamily:'work-sans-semibold',fontSize:18,color:Colors.onSurfaceColorPrimary}}>{profile.fullName}</Text>
                    <Text style={{ color: Colors.onSurfaceColorSecondary, fontFamily: 'work-sans'}}>{`Last update:${profile.personalInfoUpdatedOn}`}</Text>
                </View>
            </View>
            <SectionList
                sections = {DATA}
                renderItem={({item})=>
                <View 
                    style={{ paddingVertical:15, backgroundColor: Colors.surfaceColorSecondary}}>
                    <Text >{item.subtitle}</Text>
                    <Text>{item.body}</Text>
                </View>
                    }
                renderSectionHeader={({section:{title}})=> (
                    <Text style={{ fontFamily:'work-sans',color:Colors.onSurfaceColorPrimary, fontSize:11}}>{title}</Text>
                )}
            
            />

             <SectionList
                sections = {DATA2}
                renderItem={({item})=>
                <View 
                    style={{ paddingVertical:15, backgroundColor: Colors.surfaceColorSecondary}}>
                    <Text >{item.subtitle}</Text>
                    <Text>{item.body}</Text>
                </View>
                    }
                renderSectionHeader={({section:{title}})=> (
                    <Text style={{ fontFamily:'work-sans',color:Colors.onSurfaceColorPrimary, fontSize:11}}>{title}</Text>
                )}
            
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex:1,
        padding:15,
        backgroundColor: Colors.surfaceColorPrimary
    },
});

export default PatreDetailScreen;
