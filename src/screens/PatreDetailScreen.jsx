import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import moment from 'moment';
import Colors from '../constants/Colors';
import 'moment/min/locales';

const PatreDetailScreen = ({ navigation }) => {
  const profile = navigation.getParam('profile');

  moment.locale('es');
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  // let date = moment(item[0].date).format('');

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
          <Image
            style={{ width: 100, height: 100, borderRadius: 50 }}
            resizMode="center"
            source={{ uri: `https://schoenstatt-fathers.link${profile.photo}` }}
          />
          <View style={{ padding: 15 }}>
            <Text
              style={{
                fontFamily: 'work-sans-semibold',
                fontSize: 18,
                color: Colors.onSurfaceColorPrimary,
              }}
            >
              {profile.fullName}
            </Text>
            <Text
              style={{ color: Colors.onSurfaceColorSecondary, fontFamily: 'work-sans' }}
            >
              {`Last update:${profile.personalInfoUpdatedOn}`}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}> Información del contacto</Text>
        <DefaultItem title="Email" body={profile.email} />
        <DefaultItem title="Teléfono móvil principal" body={profile.phones[0].number} />
        <DefaultItem title="Casa" body={profile.phones[1] != undefined ? profile.phones[1].number : ''} />

        <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}>
          <TouchableComp>
            <View
              style={{
                backgroundColor: Colors.primaryColor,
                borderRadius: 5,
                paddingHorizontal: 10,
                width: '45%',
                height: 50,
                marginHorizontal: 15,
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  fontFamily: 'work-sans-bold',
                  textTransform: 'uppercase',
                  color: Colors.surfaceColorSecondary,
                }}
              >
                Guardar Contacto
              </Text>
            </View>
          </TouchableComp>
        </View>

        <Text style={styles.sectionHeader}> Vivienda actual </Text>
        <DefaultItem title="Filial" body="" />
        <DefaultItem title="Casa" body="" />
        <DefaultItem title="Territorio responsable /  Donde trabaja: " body="" />

        <Text style={styles.sectionHeader}> Informacion Personal</Text>

        <DefaultItem title="Pais de origen" body="" img={profile.country} />

        <DefaultItem title="Territorio de origen" body={profile.homeTerritoryName} />
        <DefaultItem title="Curso" body={profile.courseName} />

        <DefaultItem title="Generación" body={profile.generationName} />
        <DefaultItem
          title="Cumpleaños"
          body={profile.birthDate ? moment.utc(profile.birthDate).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Onomástico"
          body={profile.nameDay ? moment.utc(profile.nameDay).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Bautismo"
          body={profile.baptismDate ? moment.utc(profile.baptismDate).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Admisión al Postulantado"
          body={profile.postulancyDate ? moment.utc(profile.postulancyDate).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Inicio del Noviciado"
          body={profile.novitiateDate ? moment.utc(profile.novitiateDate).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Pertenencia Comunitaria"
          body={
                        profile.communityMembershipDate
                          ? moment.utc(profile.communityMembershipDate).format('Do MMMM YYYY')
                          : null
                    }
        />
        <DefaultItem
          title="Contrato Perpetuo"
          body={
                        profile.perpetualContractDate
                          ? moment.utc(profile.perpetualContractDate).format('Do MMMM YYYY')
                          : null
                    }
        />
        <DefaultItem
          title="Ordenación Diaconal"
          body={profile.deaconDate ? moment.utc(profile.deaconDate).format('Do MMMM YYYY') : null}
        />
        <DefaultItem
          title="Ordenación Sacerdotal"
          body={profile.priestDate ? moment.utc(profile.priestDate).format('Do MMMM YYYY') : null}
        />

        <Text style={styles.sectionHeader}>Viviendas Pasadas</Text>
        <DefaultItem title="Filial" body="" />
        <DefaultItem title="Casa" body="" />
        <DefaultItem title="Territorio responsable /  Donde trabaja: " body="" />
        <DefaultItem title="Fecha de inicio" body="" />
        <DefaultItem title="Fecha de término" body="" />
      </ScrollView>
    </View>
  );
};


const DefaultItem = ({
  title, body, selected, img,
}) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp
      onPress={() => {
        console.log('apretado');
      }}
    >
      <View
        style={{
          padding: 15,
          backgroundColor: Colors.surfaceColorSecondary,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={styles.listItemTitle}>{title}</Text>
          <Text style={styles.listItemBody}>{body}</Text>
        </View>
        {img && (
        <View>
          <Flag id="US" size={0.2} />
        </View>
        )}
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  listItem: {
    backgroundColor: Colors.surfaceColorPrimary,
    paddingVertical: 15,
  },
  listItemTitle: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
  listItemBody: {
    fontFamily: 'work-sans',
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
  },
});

export default PatreDetailScreen;
