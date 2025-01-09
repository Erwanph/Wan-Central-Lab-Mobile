import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation, NavigationProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Define the navigation route types
type RootStackParamList = {
  simulation: undefined; // Add other routes here as needed
  // Example:
  // physics: undefined;
};

// Type definitions for SubjectCard props
interface SubjectCardProps {
  title: string;
  description: string;
  imagePath?: ImageSourcePropType;
  route?: keyof RootStackParamList; // Ensure the route matches the valid navigation routes
  comingSoon?: boolean;
}

// SubjectCard component
const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  description,
  imagePath,
  route,
  comingSoon = false,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    if (route) {
      navigation.navigate(route); // Use keyof RootStackParamList to type-check
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {comingSoon ? (
          <View style={styles.comingSoonContainer}>
            <ThemedText style={styles.comingSoonText}>Coming Soon</ThemedText>
          </View>
        ) : (
          <Image
            source={imagePath!}
            style={styles.cardImage}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

// HomeScreen component
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image
          source={require('@/assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.heroContent}>
          <ThemedText style={styles.heroTitle}>Wan Central Laboratory</ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Welcome to Wan Central Laboratory!{'\n'}
            Dive into our interactive virtual labs and explore various scientific and engineering concepts.
          </ThemedText>
        </View>
      </View>

      {/* Subjects Section */}
      <View style={styles.subjectsSection}>
        <ThemedText style={styles.sectionTitle}>Choose a Subject</ThemedText>
        <View style={styles.subjectsGrid}>
          <SubjectCard
            title="Ohm's Law"
            description="Explore the principles of Ohm's Law with our interactive virtual lab."
            imagePath={require('@/assets/images/ohmcard.jpg')}
            route="simulation" // Matches the navigation type
          />
          <SubjectCard
            title="Physics"
            description="Experiment with basic physics concepts and simulations."
            comingSoon={true}
          />
          <SubjectCard
            title="Chemistry"
            description="Explore the world of chemistry with virtual experiments."
            comingSoon={true}
          />
          <SubjectCard
            title="Biology"
            description="Dive into the study of life with engaging virtual biology experiments."
            comingSoon={true}
          />
          <SubjectCard
            title="Mathematics"
            description="Explore mathematical concepts through interactive activities and tools."
            comingSoon={true}
          />
          <SubjectCard
            title="Programming"
            description="Discover the wonders of the code universe with programming laboratory."
            comingSoon={true}
          />
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.testimonialsSection}>
        <ThemedText style={styles.sectionTitle}>Testimonials</ThemedText>
        <View style={styles.testimonialContainer}>
          <ThemedText style={styles.testimonialText}>
            "This virtual lab has been a game-changer for my understanding of physics! Highly recommend it to anyone looking to deepen their knowledge."
          </ThemedText>
          <ThemedText style={styles.testimonialText}>
            "An amazing resource for students and educators alike. The simulations are interactive and easy to understand."
          </ThemedText>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: Platform.select({ ios: 300, android: 250, default: 300 }),
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroTitle: {
    fontSize: Platform.select({ ios: 32, android: 28, default: 32 }),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: Platform.select({ ios: 18, android: 16, default: 18 }),
    textAlign: 'center',
  },
  subjectsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 60) / 2,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
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
  imageContainer: {
    height: 160,
    backgroundColor: '#e0e0e0',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  testimonialsSection: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  testimonialContainer: {
    gap: 16,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
});
