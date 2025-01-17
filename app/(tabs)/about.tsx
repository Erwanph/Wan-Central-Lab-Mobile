import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Technology = {
  title: string;
  description: string;
  logo: any;
};

const technologies: Technology[] = [
  {
    title: 'React Native',
    description: 'Build native mobile apps using React',
    logo: require('@/assets/images/react-logo.png'),
  },
  {
    title: 'TypeScript',
    description: 'Typed JavaScript for better development',
    logo: require('@/assets/images/typescript.png'),
  },
  {
    title: 'Expo',
    description: 'Framework for universal React applications',
    logo: require('@/assets/images/expo.png'),
  },
  {
    title: 'MongoDB',
    description: 'NoSQL database for modern applications',
    logo: require('@/assets/images/mongodb.png'),
  },
  {
    title: 'Node.js',
    description: "JavaScript runtime built on Chrome's V8 engine",
    logo: require('@/assets/images/nodejs.png'),
  },
];

const TechCard: React.FC<{ tech: Technology }> = ({ tech }) => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.logoContainer}>
        <Image source={tech.logo} style={styles.techLogo} resizeMode="contain" />
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.techTitle}>{tech.title}</ThemedText>
        <ThemedText style={styles.techDescription}>{tech.description}</ThemedText>
      </View>
    </ThemedView>
  );
};

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        bounces={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.content}>
          <ThemedText style={styles.mainTitle}>About This App</ThemedText>
          
          <View style={styles.section}>
            <ThemedText style={styles.description}>
              Wan Central Laboratory is a virtual learning platform designed to provide interactive and engaging virtual labs for various scientific and engineering subjects. The goal is to facilitate hands-on learning through accessible, user-friendly simulations that help users understand complex concepts in a practical way.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Technologies Used</ThemedText>
            <View style={styles.techGrid}>
              {technologies.map((tech, index) => (
                <TechCard key={index} tech={tech} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // For 2 cards per row with padding

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    paddingTop: Platform.select({ ios: 20, android: 50 }),
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  card: {
    width: cardWidth - 8, // Slightly smaller to ensure spacing
    height: 140, // Fixed height for uniformity
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  techLogo: {
    width: 40,
    height: 40,
  },
  cardContent: {
    alignItems: 'center',
  },
  techTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
  techDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AboutScreen;