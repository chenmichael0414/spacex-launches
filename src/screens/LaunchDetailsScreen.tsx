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
import { useSequentialAnimation } from "../hooks/useSequentialAnimation";
import {
  FAVORITE_ANIMATION,
  AnimatableView,
  AnimatableIconButton,
} from "../types/animations";
import {
  colors,
  spacing,
  elevation,
  borderRadius,
  commonStyles,
} from "../theme";

/**
 * Screen component that displays detailed information about a SpaceX launch
 * including mission details, images, and article link. Features sequential
 * animations and favorite functionality for images.
 *
 * @component
 * @param {LaunchDetailsScreenProps} props - Navigation props containing launch data
 * @returns {React.ReactElement} A scrollable view with launch details and interactive elements
 */
export const LaunchDetailsScreen: React.FC<LaunchDetailsScreenProps> = ({
  route,
}) => {
  const { launch } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const launchDate = new Date(launch.launch_date_local);
  const formattedDate = format(launchDate, "MMMM d, yyyy");
  const favoriteRefs = useRef<
    Record<string, React.RefObject<AnimatableIconButton | null>>
  >({});

  const cardRef = useRef<AnimatableView | null>(null);
  const imageRefs = useRef<
    Record<string, React.RefObject<AnimatableView | null>>
  >({});
  const articleButtonRef = useRef<AnimatableView | null>(null);

  useSequentialAnimation({
    cardRef,
    imageRefs: useRef(imageRefs.current),
    articleButtonRef,
    hasImages: launch.links.flickr_images.length > 0,
    hasArticleLink: !!launch.links.article_link,
  });

  /**
   * Opens the launch article in the device's default browser
   */
  const handleArticlePress = () => {
    if (launch.links.article_link) {
      Linking.openURL(launch.links.article_link);
    }
  };

  /**
   * Toggles the favorite status of an image and triggers the favorite animation
   * @param {string} imageUrl - The URL of the image to toggle favorite status
   */
  const handleFavoritePress = (imageUrl: string) => {
    toggleFavorite(imageUrl);
    const ref = favoriteRefs.current[imageUrl];
    if (ref?.current) {
      ref.current.animate(
        FAVORITE_ANIMATION.keyframes,
        FAVORITE_ANIMATION.duration
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animatable.View
        ref={cardRef}
        useNativeDriver
        style={styles.initialOpacity}
      >
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
      </Animatable.View>

      <View style={styles.imagesContainer}>
        {launch.links.flickr_images.slice(0, 3).map((imageUrl, index) => {
          if (!favoriteRefs.current[imageUrl]) {
            favoriteRefs.current[imageUrl] =
              React.createRef<AnimatableIconButton | null>();
          }
          if (!imageRefs.current[imageUrl]) {
            imageRefs.current[imageUrl] =
              React.createRef<AnimatableView | null>();
          }

          return (
            <Animatable.View
              key={index}
              ref={imageRefs.current[imageUrl]}
              useNativeDriver
              style={[styles.initialOpacity, styles.imageContainer]}
            >
              <Card style={styles.imageCard}>
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
                    style={[
                      styles.favoriteButton,
                      isFavorite(imageUrl) && styles.favoritedButton,
                    ]}
                    iconColor={isFavorite(imageUrl) ? "#FF69B4" : undefined}
                  />
                </Animatable.View>
                {isFavorite(imageUrl) && (
                  <Animatable.View
                    animation="fadeIn"
                    duration={175}
                    useNativeDriver
                    style={styles.favoriteBorder}
                  />
                )}
              </Card>
            </Animatable.View>
          );
        })}
      </View>

      {launch.links.article_link && (
        <Animatable.View
          ref={articleButtonRef}
          useNativeDriver
          style={styles.initialOpacity}
        >
          <TouchableOpacity
            onPress={handleArticlePress}
            style={[
              styles.articleButton,
              launch.links.flickr_images.length === 0 &&
                styles.articleButtonNoImages,
            ]}
          >
            <Text variant="bodyLarge" style={styles.articleButtonText}>
              Read Article
            </Text>
          </TouchableOpacity>
        </Animatable.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Base styles
  container: {
    ...commonStyles.container,
  },
  initialOpacity: {
    opacity: 0,
  },

  // Card styles
  card: {
    margin: spacing.md,
    elevation: elevation.medium,
    backgroundColor: colors.card.background,
  },
  date: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
  },
  rocket: {
    marginTop: spacing.md,
    color: colors.text.primary,
  },

  // Image styles
  imagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  imageContainer: {
    marginBottom: spacing.md,
  },
  imageCard: {
    elevation: elevation.medium,
    borderRadius: borderRadius.medium,
  },
  image: {
    height: 200,
  },

  // Favorite button styles
  favoriteButtonContainer: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
  },
  favoriteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  favoritedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  favoriteBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: colors.favorite.border,
    borderRadius: borderRadius.medium,
    pointerEvents: "none",
  },

  // Article button styles
  articleButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.small,
    alignItems: "center",
  },
  articleButtonNoImages: {
    marginTop: 0,
  },
  articleButtonText: {
    color: colors.card.background,
  },
});
