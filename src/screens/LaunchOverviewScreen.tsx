import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../graphql/queries";
import { Launch } from "../types/launch";
import { format } from "date-fns";

type LaunchCardProps = {
  launch: Launch;
  onPress: (launch: Launch) => void;
};

const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
  const launchDate = new Date(launch.launch_date_local);
  const formattedDate = format(launchDate, "MMMM d, yyyy");

  return (
    <TouchableOpacity onPress={() => onPress(launch)}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{launch.mission_name}</Text>
          <Text variant="bodyMedium">{formattedDate}</Text>
          <Text variant="bodyMedium">{launch.launch_site.site_name_long}</Text>
        </Card.Content>
        {launch.launch_links.flickr_images[0] && (
          <Card.Cover
            source={{ uri: launch.launch_links.flickr_images[0] }}
            style={styles.image}
          />
        )}
      </Card>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  image: {
    height: 200,
    marginTop: 8,
  },
});
