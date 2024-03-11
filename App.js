import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { WebView } from 'react-native-webview';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [uri, setUri] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords);
          },
          error => {
            setErrorMsg(error.message);
          }
        );
      } else {
        setErrorMsg('Camera permission not granted');
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanning) {
      setScanning(false); // Stop scanning to prevent multiple scans

      // Assuming the QR code directly encodes the URL
      // Directly set the scanned data as the URI for the WebView
      setUri(data);
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Render the WebView to display `service1.html` if `uri` state is set
  if (uri) {
    return <WebView source={{ uri }} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
      >
        {/* Your camera content here */}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
