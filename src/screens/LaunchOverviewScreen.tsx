import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ViewToken,
} from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../graphql/queries";
import { Launch } from "../types/launch";
import { LaunchOverviewScreenProps } from "../types/navigation";
import * as Animatable from "react-native-animatable";
import { useNetworkError } from "../hooks/useNetworkError";
import { VIEWABILITY_CONFIG } from "../constants/animations";
import { LaunchCard } from "../components/LaunchCard";

type AnimatableView = Animatable.View & {
  fadeInRight: (duration: number) => void;
};

export const LaunchOverviewScreen: React.FC<LaunchOverviewScreenProps> = ({
  navigation,
}) => {
  const [animatedFlags, setAnimatedFlags] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, React.RefObject<AnimatableView | null>>>({});
  const viewabilityTracker = useRef<Record<string, boolean>>({});
  const { handleError } = useNetworkError();

  const { loading, error, data, refetch } = useQuery(GET_LAUNCHES, {
    fetchPolicy: "network-only",
    onError: handleError,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.forEach(({ item, isViewable }) => {
        const missionName = item.mission_name;

        if (isViewable && !viewabilityTracker.current[missionName]) {
          viewabilityTracker.current[missionName] = true;
          const ref = cardRefs.current[missionName];
          if (ref?.current?.fadeInRight) {
            ref.current.fadeInRight(300);
          }
        }
      });
    }
  ).current;

  const viewabilityConfig = useRef(VIEWABILITY_CONFIG).current;

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

  const launches = [...data.launchesPast].sort(
    (a, b) =>
      new Date(b.launch_date_local).getTime() -
      new Date(a.launch_date_local).getTime()
  );

  launches.forEach((launch) => {
    if (!cardRefs.current[launch.mission_name]) {
      cardRefs.current[launch.mission_name] =
        React.createRef<AnimatableView | null>();
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={launches}
        keyExtractor={(item) => item.mission_name}
        renderItem={({ item }) => (
          <LaunchCard
            launch={item}
            onPress={handleLaunchPress}
            cardRef={cardRefs.current[item.mission_name]}
          />
        )}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={refetch}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
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
    color: "#999",
  },
  retryButton: {
    marginTop: 10,
  },
});
