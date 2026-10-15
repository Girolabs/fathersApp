import React from 'react';
import { Text } from 'react-native';

// Regional-indicator emoji built from an ISO 3166-1 alpha-2 code.
const toEmoji = (isoCode) =>
  String(isoCode || '')
    .toUpperCase()
    .replace(/[A-Z]/g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

const CountryFlag = ({ isoCode, size = 20 }) => <Text style={{ fontSize: size }}>{toEmoji(isoCode)}</Text>;

export default CountryFlag;
