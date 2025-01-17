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
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  simulation: undefined;
};

interface SubjectCardProps {
  title: string;
  description: string;
  imagePath?: ImageSourcePropType;
  route?: keyof RootStackParamList;
  comingSoon?: boolean;
}

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
      navigation.navigate(route);
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
          <>
            <Image
              source={imagePath!}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
              style={styles.cardGradient}
            />
          </>
        )}
      </View>
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDescription}>{description}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.backgroundContainer}>
            <Image
              source={require('@/assets/images/background.png')}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={styles.titleContainer}>
              <ThemedText style={styles.heroTitle}>Wan Central Laboratory</ThemedText>
            </View>
            <ThemedText style={styles.heroSubtitle}>
              Welcome to Wan Central Laboratory!
            </ThemedText>
            <ThemedText style={styles.heroDescription}>
              Dive into our interactive virtual labs and explore various scientific and engineering concepts.
            </ThemedText>
          </View>
        </View>
        {/* Content Section with White Background */}
        <View style={styles.contentSection}>
          {/* Subjects Section */}
          <View style={styles.subjectsSection}>
            <ThemedText style={styles.sectionTitle}>Choose a Subject</ThemedText>
            <View style={styles.subjectsGrid}>
              <SubjectCard
                title="Ohm's Law"
                description="Explore the principles of Ohm's Law with our interactive virtual lab."
                imagePath={require('@/assets/images/ohmcard.jpg')}
                route="simulation"
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
                description="Explore mathematical concepts through interactive activities."
                comingSoon={true}
              />
              <SubjectCard
                title="Programming"
                description="Discover the wonders of the code universe with programming laboratory."
                comingSoon={true}
              />
            </View>
          </View>
        </View>
        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <ThemedText style={styles.sectionTitle}>What Students Say</ThemedText>
          <View style={styles.testimonialContainer}>
            <View style={styles.testimonialCard}>
              <ThemedText style={styles.testimonialText}>
                "This virtual lab has been a game-changer for my understanding of physics! Highly recommend it to anyone looking to deepen their knowledge."
              </ThemedText>
            </View>
            <View style={styles.testimonialCard}>
              <ThemedText style={styles.testimonialText}>
                "An amazing resource for students and educators alike. The simulations are interactive and easy to understand."
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },  
  heroSection: {
    height: Platform.select({ ios: 320, android: 320, default: 320}),
    position: 'relative',
    marginTop: Platform.OS === 'android' ? 0 : 0,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  titleContainer: {
    paddingVertical: 8, // Add padding to prevent text clipping
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: Platform.select({ ios: 32, android: 32, default: 32 }),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Warna putih untuk efek glow
    textShadowOffset: { width: 0, height: 0 }, // Offset nol agar glow menyebar merata
    textShadowRadius: 30, // Radius yang lebih besar untuk efek glow
    includeFontPadding: false,
    lineHeight: Platform.select({ ios: 38, android: 34, default: 38 }), // Tambahkan tinggi baris yang sesuai
    paddingTop: Platform.OS === 'android' ? 4 : 0, // Padding tambahan untuk Android
  },
  heroSubtitle: {
    fontSize: Platform.select({ ios: 20, android: 16, default: 20 }),
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Warna putih untuk efek glow
    textShadowOffset: { width: 0, height: 0 }, // Offset nol agar glow menyebar merata
    textShadowRadius: 30, // Radius yang lebih besar untuk efek glow
  },
  heroDescription: {
    fontSize: Platform.select({ ios: 16, android: 14, default: 16 }),
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Warna putih untuk efek glow
    textShadowOffset: { width: 0, height: 0 }, // Offset nol agar glow menyebar merata
    textShadowRadius: 30, // Radius yang lebih besar untuk efek glow
    paddingHorizontal: 20,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subjectsSection: {
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
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
  imageContainer: {
    height: 140,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  testimonialsSection: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  testimonialContainer: {
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
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
  testimonialText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
});

