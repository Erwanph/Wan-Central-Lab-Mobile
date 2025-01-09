import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Technology = {
  title: string;
  description: string;
  logo: any; // Adjust based on your asset handling
};

const technologies: Technology[] = [
  {
    title: 'React Native',
    description: 'A framework for building native apps using React.',
    logo: require('@/assets/images/react-logo.png'),
  },
  {
    title: 'TypeScript',
    description: 'A typed superset of JavaScript that provides static typing for more robust code.',
    logo: require('@/assets/images/typescript.png'), // Ensure proper SVG handling
  },
  {
    title: 'Expo',
    description: 'A framework and platform for universal React applications.',
    logo: require('@/assets/images/expo.png'), // Ensure proper SVG handling
  },
];

const TechCard: React.FC<{ tech: Technology }> = ({ tech }) => {
  const animatedValue = new Animated.Value(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
        <ThemedView style={styles.card} onTouchEnd={flipCard}>
          <Image source={tech.logo} style={styles.techLogo} resizeMode="contain" />
        </ThemedView>
      </Animated.View>
      <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
        <ThemedView style={[styles.card, styles.cardBackContent]} onTouchEnd={flipCard}>
          <ThemedText style={styles.techTitle}>{tech.title}</ThemedText>
          <ThemedText style={styles.techDescription}>{tech.description}</ThemedText>
        </ThemedView>
      </Animated.View>
    </View>
  );
};

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.title}>About This App</ThemedText>
          <ThemedText style={styles.description}>
            Wan Central Laboratory is a virtual learning platform designed to provide interactive and engaging virtual labs for various scientific and engineering subjects. The goal is to facilitate hands-on learning through accessible, user-friendly simulations that help users understand complex concepts in a practical way.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.subtitle}>Technologies Used</ThemedText>
          <View style={styles.techGrid}>
            {technologies.map((tech, index) => (
              <TechCard key={index} tech={tech} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: cardWidth,
    height: cardWidth,
    marginBottom: 16,
  },
  cardFace: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardBackContent: {
    backgroundColor: '#1a365d',
  },
  techLogo: {
    width: 64,
    height: 64,
  },
  techTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  techDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
});

export default AboutScreen;