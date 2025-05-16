import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useFavorites } from "../context/FavoritesContext";
import { format } from "date-fns";
import { LaunchDetailsScreenProps } from "../types/navigation";
import * as Animatable from "react-native-animatable";

type AnimatableIconButton = Animatable.View & {
  pulse: (duration: number) => void;
};

export const LaunchDetailsScreen: React.FC<LaunchDetailsScreenProps> = ({
  route,
}) => {
  const { launch } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const launchDate = new Date(launch.launch_date_local);
  const formattedDate = format(launchDate, "MMMM d, yyyy");
  const favoriteRefs = useRef<Record<string, React.RefObject<AnimatableIconButton | null>>>({});

  const handleArticlePress = () => {
    if (launch.links.article_link) {
      Linking.openURL(launch.links.article_link);
    }
  };

  const handleFavoritePress = (imageUrl: string) => {
    toggleFavorite(imageUrl);
    const ref = favoriteRefs.current[imageUrl];
    if (ref?.current) {
      ref.current.pulse(300);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">{launch.mission_name}</Text>
          <Text variant="titleMedium" style={styles.date}>
            {formattedDate}
          </Text>
          <Text variant="bodyLarge" style={styles.rocket}>
            Rocket: {launch.rocket.rocket_name}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.imagesContainer}>
        {launch.links.flickr_images.slice(0, 3).map((imageUrl, index) => {
          if (!favoriteRefs.current[imageUrl]) {
            favoriteRefs.current[imageUrl] = React.createRef<AnimatableIconButton | null>();
          }
          
          return (
            <Card key={index} style={styles.imageCard}>
              <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
              <Animatable.View 
                ref={favoriteRefs.current[imageUrl]}
                useNativeDriver
                style={styles.favoriteButtonContainer}
              >
                <IconButton
                  icon={isFavorite(imageUrl) ? "heart" : "heart-outline"}
                  size={24}
                  onPress={() => handleFavoritePress(imageUrl)}
                  style={styles.favoriteButton}
                />
              </Animatable.View>
            </Card>
          );
        })}
      </View>

      {launch.links.article_link && (
        <TouchableOpacity
          onPress={handleArticlePress}
          style={[
            styles.articleButton,
            launch.links.flickr_images.length === 0 && styles.articleButtonNoImages
          ]}
        >
          <Text variant="bodyLarge" style={styles.articleButtonText}>Read Article</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  date: {
    marginTop: 8,
    color: "#666",
  },
  rocket: {
    marginTop: 16,
  },
  site: {
    marginTop: 8,
    color: "#666",
  },
  imagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  imageCard: {
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    height: 200,
  },
  favoriteButtonContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  favoriteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  articleButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  articleButtonNoImages: {
    marginTop: 0,
  },
  articleButtonText: {
    color: "white",
  },
});
