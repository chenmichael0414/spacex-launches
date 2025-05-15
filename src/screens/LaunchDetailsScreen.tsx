import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useFavorites } from "../context/FavoritesContext";
import { Launch } from "../types/launch";
import { format } from "date-fns";

type LaunchDetailsScreenProps ={
  route: {
    params: {
      launch: Launch;
    };
  };
}

export const LaunchDetailsScreen: React.FC<LaunchDetailsScreenProps> = ({
  route,
}) => {
  const { launch } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const launchDate = new Date(launch.launch_date_local);
  const formattedDate = format(launchDate, "MMMM d, yyyy");

  const handleArticlePress = () => {
    if (launch.launch_links.article_link) {
      Linking.openURL(launch.launch_links.article_link);
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
          <Text variant="bodyMedium" style={styles.site}>
            Launch Site: {launch.launch_site.site_name_long}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.imagesContainer}>
        {launch.launch_links.flickr_images.slice(0, 3).map((imageUrl, index) => (
          <Card key={index} style={styles.imageCard}>
            <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
            <IconButton
              icon={isFavorite(imageUrl) ? "heart" : "heart-outline"}
              size={24}
              onPress={() => toggleFavorite(imageUrl)}
              style={styles.favoriteButton}
            />
          </Card>
        ))}
      </View>

      {launch.launch_links.article_link && (
        <TouchableOpacity
          onPress={handleArticlePress}
          style={styles.articleButton}
        >
          <Text variant="bodyLarge">Read Article</Text>
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
  },
  imageCard: {
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    height: 200,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  articleButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
});
