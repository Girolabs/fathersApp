import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import countries from 'i18n-iso-countries';
import moment from 'moment';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import Buttom from './Button';
import { getDateFormatByLocale } from '../utils/date-utils';

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
    textAlign: 'left',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  container: {
    padding: 15,
    backgroundColor: Colors.surfaceColorSecondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: Colors.surfaceColorPrimary,
    paddingVertical: 15,
  },
  listItemLeft: {
    maxWidth: '85%',
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
  listItemBodyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primaryColor,
    color: Colors.surfaceColorSecondary,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 12,
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

const DefaultItem = ({ title, titleNoI18n, body, selected, img, country_code, lang, date, id, show, icon, badge }) => {
  let formatedDate;

  if (date) {
    moment.locale(lang);
    const dateFormat = getDateFormatByLocale(lang);
    formatedDate = moment.utc(date).format(dateFormat);
  }

  return (
    <>
      {show && (
        <>
          {(body || date || country_code) && (
            <Buttom onPress={() => (selected ? selected() : null)}>
              <View style={styles.container}>
                <View style={styles.listItemLeft}>
                  {title && <Text style={styles.listItemTitle}>{i18n.t(title)}</Text>}
                  {titleNoI18n && <Text style={styles.listItemTitle}>{titleNoI18n}</Text>}
                  <View style={styles.listItemBodyContainer}>
                    <View>
                      {country_code && <Text style={styles.listItemBody}>{countries.getName(country_code, lang)}</Text>}
                      {date && <Text style={styles.listItemBody}>{formatedDate}</Text>}

                      {body && <Text style={styles.listItemBody}>{body}</Text>}
                    </View>
                    {badge && (
                      <View>
                        <Text style={styles.badge}>{badge}</Text>
                      </View>
                    )}
                  </View>
                </View>
                {img && (
                  <View>
                    <Flag id={img} size={0.2} />
                  </View>
                )}
                {icon && icon}
              </View>
            </Buttom>
          )}
        </>
      )}
    </>
  );
};

export default DefaultItem;
