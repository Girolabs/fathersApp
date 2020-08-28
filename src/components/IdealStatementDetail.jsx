import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from './HeaderButton';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

const IdealStatementDetail = ({ navigation }) => {
  const content = navigation.getParam('content');
  const head = '<head><meta http-equiv="content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style type="text/css"> body {-webkit-user-select:none;-webkit-touch-callout:none; font-family: "Arial"; background-color:#FFFFFF;font-size:16} div { color : black};*{ user-select: none; };</style></head>';
  const body = `<!DOCTYPE html />${head}<body oncopy="return false" onpaste="return false" oncut="return false"><div style="padding-bottom: 30px;font-weight: bold; text-align: center">`
      + `</div>${content}</body></html>`;

  console.log(body);

  return (
    <View style={styles.screen}>
      <WebView originWhitelist={['*']} source={{ html: body }} />
    </View>
  );
};

IdealStatementDetail.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: (
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
});

export default IdealStatementDetail;
