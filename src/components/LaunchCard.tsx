import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text, Card } from "react-native-paper";
import { format } from "date-fns";
import * as Animatable from "react-native-animatable";
import { Launch } from "../types/launch";

type AnimatableView = Animatable.View & {
  fadeInRight: (duration: number) => void;
};

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
      <Animatable.View ref={cardRef} useNativeDriver style={styles.initialOpacity}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">{launch.mission_name}</Text>
            <Text variant="bodyMedium">{formattedDate}</Text>
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
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    height: 200,
    marginTop: 8,
  },
}); 