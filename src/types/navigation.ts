import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Launch } from './launch';

export type RootStackParamList = {
  LaunchOverview: undefined;
  LaunchDetails: { launch: Launch };
};

export type LaunchDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'LaunchDetails'>;
export type LaunchOverviewScreenProps = NativeStackScreenProps<RootStackParamList, 'LaunchOverview'>; 