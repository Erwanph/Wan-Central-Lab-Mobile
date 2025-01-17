import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';

const CustomSplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-animation.gif')} // Path ke GIF kamu
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Warna latar belakang splash screen
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default CustomSplashScreen;
