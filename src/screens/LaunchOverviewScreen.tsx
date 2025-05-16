import React, { useEffect, useRef, useState } from "react";
import { View, FlatList, StyleSheet, ViewToken } from "react-native";
import { Text, ActivityIndicator, Button } from "react-native-paper";
import { useQuery } from "@apollo/client";
import { GET_LAUNCHES } from "../graphql/queries";
import { Launch } from "../types/launch";
import { LaunchOverviewScreenProps } from "../types/navigation";
import * as Animatable from "react-native-animatable";
import { useNetworkError } from "../hooks/useNetworkError";
import { VIEWABILITY_CONFIG, AnimatableView } from "../types/animations";
import { LaunchCard } from "../components/LaunchCard";
import { commonStyles, colors, spacing, typography } from "../theme";

/**
 * Loading state component displayed while fetching launch data
 * @returns {React.ReactElement} A centered view with loading indicator
 */
const LoadingState = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" />
    <Text style={styles.loadingText}>Loading launches...</Text>
  </View>
);

/**
 * Error state component displayed when launch data fetch fails
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that occurred
 * @param {() => void} props.onRetry - Function to retry the data fetch
 * @returns {React.ReactElement} A centered view with error message and retry button
 */
const ErrorState = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) => (
  <View style={styles.centered}>
    <Text style={styles.errorText}>Unable to load launches</Text>
    <Text style={styles.errorDetail}>{error.message}</Text>
    <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
      Retry
    </Button>
  </View>
);

/**
 * Main screen component that displays a list of SpaceX launches
 * Features scroll-aware animations and pull-to-refresh functionality
 *
 * @component
 * @param {LaunchOverviewScreenProps} props - Navigation props
 * @returns {React.ReactElement} A list of launch cards with animations
 */
export const LaunchOverviewScreen: React.FC<LaunchOverviewScreenProps> = ({
  navigation,
}) => {
  const [animatedFlags, setAnimatedFlags] = useState<Record<string, boolean>>(
    {}
  );
  const cardRefs = useRef<
    Record<string, React.RefObject<AnimatableView | null>>
  >({});
  const viewabilityTracker = useRef<Record<string, boolean>>({});
  const { handleError } = useNetworkError();

  const { loading, error, data, refetch } = useQuery(GET_LAUNCHES, {
    fetchPolicy: "network-only",
    onError: handleError,
  });

  /**
   * Handles viewable items changes in the FlatList
   * Triggers fade-in animation when a card becomes visible
   */
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  /**
   * Navigates to the launch details screen
   * @param {Launch} launch - The launch data to display
   */
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
    ...commonStyles.container,
  },
  centered: {
    ...commonStyles.centered,
  },
  list: {
    padding: spacing.md,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.medium,
  },
  errorText: {
    fontSize: typography.sizes.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  errorDetail: {
    fontSize: typography.sizes.small,
    color: colors.text.tertiary,
  },
  retryButton: {
    marginTop: spacing.sm,
  },
});
