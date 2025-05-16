import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Card, ActivityIndicator, Button } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../graphql/queries";
import { Launch } from "../types/launch";
import { format } from "date-fns";
import { LaunchOverviewScreenProps } from "../types/navigation";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

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
  const { loading, error, data, refetch } = useQuery(GET_LAUNCHES, {
    fetchPolicy: "network-only",
    onError: (error) => {
      NetInfo.fetch().then((state: NetInfoState) => {
        if (!state.isConnected) {
          Alert.alert(
            "No Internet Connection",
            "Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Error Loading Data",
            `There was a problem loading the launch data: ${error.message}`,
            [{ text: "OK" }]
          );
        }
      });
    },
  });


  useEffect(() => {
    // Check network status when component mounts
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading launches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Unable to load launches</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          style={styles.retryButton}
        >
          Retry
        </Button>
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
        refreshing={loading}
        onRefresh={refetch}
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
    padding: 20,
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  errorDetail: {
    fontSize: 14,
    color: '#999',
  },
  retryButton: {
    marginTop: 10,
  },
});
