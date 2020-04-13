import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PatreDetail from "./PatreDetailScreen";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <Text>HomeScreen</Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("PatreDetail");
                }}
            >
                <View>
                    <Text>Ir a detalle</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

HomeScreen.navigationOptions = (navigationData) => {
    return {
        headerTitle: "",
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName="md-menu"
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default HomeScreen;
