import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../graphql/queries";
import { Launch } from "../types/launch";
import { format } from "date-fns";
import { LaunchOverviewScreenProps } from '../types/navigation';

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

export const LaunchOverviewScreen: React.FC<LaunchOverviewScreenProps> = ({
  navigation,
}) => {
  const { loading, error, data } = useQuery(GET_LAUNCHES);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading launches: {error.message}</Text>
      </View>
    );
  }

  const handleLaunchPress = (launch: Launch) => {
    navigation.navigate("LaunchDetails", { launch });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data.launches}
        keyExtractor={(item) => item.mission_name}
        renderItem={({ item }) => (
          <LaunchCard launch={item} onPress={handleLaunchPress} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
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
