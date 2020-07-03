# Fathers App

Schoenstatt fathers social app.

## Installation


Have NodeJS and npm installed then 

```bash
npm install
```

## Usage
Create a app.json file in root directory with the following content

```json

{
  "expo": {
    "name": "patres-app",
    "slug": "patres-app",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": "com.schoenstatt.fathersApp",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "WRITE_EXTERNAL_STORAGE",
        "WRITE_CONTACTS",
        "CAMERA_ROLL",
        "READ_CONTACTS"
      ]
    },
    "ios": {
      "supportsTablet": true
    },
    "extra": {
      "secretKey": "",
      "user": "",
      "password": ""
    },
    "description": ""
  }
}


```

You need to provide a secretKey
