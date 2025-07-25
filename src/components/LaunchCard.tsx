/**
 * Unit Tests for LaunchCard:
 * 
 * 1. Rendering Tests:
 *    - Should render mission name correctly
 *    - Should format and display date correctly
 *    - Should display image when available
 *    - Should not display image when not available
 * 
 * 2. Interaction Tests:
 *    - Should call onPress with correct launch data
 *    - Should handle press events correctly
 * 
 * 3. Animation Tests:
 *    - Should initialize with opacity 0
 *    - Should animate in when ref is triggered
 * 
 * 4. Style Tests:
 *    - Should apply correct styles to all elements
 *    - Should handle long mission names gracefully
 */

import React from "react";
import { TouchableOpacity, StyleSheet, ImageStyle } from "react-native";
import { Text, Card } from "react-native-paper";
import { format } from "date-fns";
import * as Animatable from "react-native-animatable";
import { Launch } from "../types/launch";
import { AnimatableView } from "../types/animations";
import { commonStyles, colors, spacing, elevation } from "../theme";

type LaunchCardProps = {
  launch: Launch;
  onPress: (launch: Launch) => void;
  cardRef: React.RefObject<AnimatableView | null>;
};

export const LaunchCard: React.FC<LaunchCardProps> = ({
  launch,
  onPress,
  cardRef,
}) => {
  const launchDate = new Date(launch.launch_date_local);
  const formattedDate = format(launchDate, "MMMM d, yyyy");

  return (
    <TouchableOpacity onPress={() => onPress(launch)}>
      <Animatable.View
        ref={cardRef}
        useNativeDriver
        style={styles.initialOpacity}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {launch.mission_name}
            </Text>
            <Text variant="bodyMedium" style={styles.date}>
              {formattedDate}
            </Text>
          </Card.Content>
          {launch.links.flickr_images[0] && (
            <Card.Cover
              source={{ uri: launch.links.flickr_images[0] }}
              style={styles.image}
            />
          )}
        </Card>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  initialOpacity: {
    opacity: 0,
  },
  card: {
    ...commonStyles.card,
  },
  title: {
    ...commonStyles.text.primary,
  },
  date: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  image: {
    height: 200,
    marginTop: spacing.sm,
  } as ImageStyle,
});
