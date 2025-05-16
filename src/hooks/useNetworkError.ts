import { useEffect } from "react";
import { Alert } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { ApolloError } from "@apollo/client";

/**
 * Options for the useNetworkError hook
 * @interface UseNetworkErrorOptions
 * @property {function} [onError] - Optional callback function to handle errors
 */
type UseNetworkErrorOptions = {
  onError?: (error: ApolloError) => void;
};

/**
 * Hook that provides network error handling functionality
 * Monitors network connectivity and displays appropriate alerts
 * 
 * @param {UseNetworkErrorOptions} [options] - Optional configuration
 * @returns {Object} Object containing error handling function
 * @returns {function} handleError - Function to handle Apollo errors
 * 
 * @example
 * ```tsx
 * const { handleError } = useNetworkError({
 *   onError: (error) => console.error(error)
 * });
 * ```
 */
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

  /**
   * Handles Apollo errors by checking network connectivity
   * and displaying appropriate error messages
   * 
   * @param {ApolloError} error - The Apollo error to handle
   */
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
