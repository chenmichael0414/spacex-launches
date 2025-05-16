import { useEffect } from "react";
import { Alert } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { ApolloError } from "@apollo/client";

type UseNetworkErrorOptions = {
  onError?: (error: ApolloError) => void;
};

export const useNetworkError = ({ onError }: UseNetworkErrorOptions = {}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (!state.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleError = (error: ApolloError) => {
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
          `There was a problem loading the data: ${error.message}`,
          [{ text: "OK" }]
        );
      }
    });

    onError?.(error);
  };

  return { handleError };
};
