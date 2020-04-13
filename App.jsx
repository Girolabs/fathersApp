import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback } from "react-native";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";
import PatresNavigator from "./src/navigator/PatresNavigator";

export default function App() {
    const [fontsLoaded] = useFonts({
        "work-sans": require("./assets/fonts/WorkSans-Regular.ttf"),
        "work-sans-semibold": require("./assets/fonts/WorkSans-SemiBold.ttf"),
    });

    const [lang, setLang] = useState(Localization.locale);
    i18n.translations = {
        es: { welcome: "Bienvenido", spanish: "español", english: "ingles" },
        en: { welcome: "Welcome", spanish: "spanish", english: "english" },
    };
    useEffect(() => {
        i18n.locale = lang;
    }, [lang]);

    console.log(Localization.locale);

    i18n.locale = lang;
    i18n.fallbacks = true;
    console.log(i18n);

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return <PatresNavigator />;
    }

    /*  return (
    <View style={styles.container}>
      <Text>
        {i18n.t('welcome')}
        </Text>
        <TouchableNativeFeedback onPress = {
          () => {
            setLang('es')
            
          }
        }>
          <View>
            <Text>
              {i18n.t('spanish')}
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress = {
          () => {
            setLang('en')
          }
        }>
          <View>
            <Text>
              {i18n.t('english')}
            </Text>
          </View>
        </TouchableNativeFeedback>
    </View>
  ); */
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
