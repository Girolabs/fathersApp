import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import i18n from 'i18n-js';
import moment from 'moment';
import Button from './Button';
import Colors from '../constants/Colors';
import 'moment/min/locales';
import { getDateMaskByLocale, getDateFormatByLocale } from '../utils/date-utils';

const styles = StyleSheet.create({
  header: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    backgroundColor: Colors.surfaceColorPrimary,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  card: {
    width: '90%',
    marginLeft: 15,
    marginVertical: 15,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  cardTitle: {
    color: Colors.surfaceColorSecondary,
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
  },
  cardBody: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardBodyText: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans',
    width: '100%',
  },
  cardBodyTextBold: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans-semibold',
    textAlign: 'left',
    width: '100%',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  leaderTextContainer: {
    paddingLeft: 10,
  },
  emptyText: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    paddingHorizontal: 15,
    paddingVertical: 5,
    letterSpacing: 2.5,
    backgroundColor: Colors.surfaceColorPrimary,
  },
});

const GenerationCourses = ({ navigation, courses }) => {
  const dateMask = getDateMaskByLocale(moment.locale());
  return (
    <>
      <Text style={styles.header}>{i18n.t('GENERATION.COURSES')}</Text>
      {courses && courses.length > 0 ? (
        courses.map((course) => {
          return (
            <Button
              key={course.courseId.toString()}
              onPress={() => {
                navigation.navigate('CourseDetail', {
                  courseId: course.courseId,
                });
              }}
            >
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{course.name}</Text>
                </View>
                <View style={styles.cardBody}>
                  <View>
                    <Text style={styles.cardBodyText}>{i18n.t('GENERATION.COURSE_LEADER')}</Text>
                    <View style={styles.innerContainer}>
                      {course.leaderAssignment && course.leaderAssignment.person ? (
                        <>
                          <Image
                            style={styles.img}
                            resizeMode="cover"
                            source={{ uri: `https://schoenstatt-fathers.link${course.leaderAssignment.person.photo}` }}
                          />
                          <View style={styles.leaderTextContainer}>
                            <Text style={styles.cardBodyTextBold}>{course.leaderAssignment.person.fullName}</Text>
                            <Text style={styles.cardBodyText}>
                              {`${
                                course.leaderAssignment.startDate
                                  ? moment.utc(course.leaderAssignment.startDate).format(dateMask)
                                  : ''
                              } - ${
                                course.leaderAssignment.endDate
                                  ? moment.utc(course.leaderAssignment.endDate).format(dateMask)
                                  : ''
                              }`}
                            </Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.cardBodyText}>{i18n.t('GENERATION.NO_COURSE_LEADER')}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Button>
          );
        })
      ) : (
        <Text style={styles.emptyText}>{i18n.t('GENERATION.NO_COURSES')}</Text>
      )}
    </>
  );
};

export default withNavigation(GenerationCourses);
