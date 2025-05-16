import { ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  background: '#f5f5f5',
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
  },
  favorite: {
    heart: '#FF69B4',
    border: '#FF1493',
  },
  card: {
    background: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
};

export const typography = {
  sizes: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
  },
};

export const elevation = {
  small: 2,
  medium: 4,
  large: 8,
};

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  centered: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: spacing.lg,
  } as ViewStyle,
  card: {
    marginBottom: spacing.md,
    elevation: elevation.medium,
    backgroundColor: colors.card.background,
  } as ViewStyle,
  image: {
    height: 200,
    marginTop: spacing.sm,
  } as ViewStyle,
  text: {
    primary: {
      fontSize: typography.sizes.medium,
      color: colors.text.primary,
    } as TextStyle,
    secondary: {
      fontSize: typography.sizes.small,
      color: colors.text.secondary,
    } as TextStyle,
    tertiary: {
      fontSize: typography.sizes.small,
      color: colors.text.tertiary,
    } as TextStyle,
  },
  button: {
    primary: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: borderRadius.small,
      alignItems: 'center' as const,
    } as ViewStyle,
    text: {
      color: '#FFFFFF',
      fontSize: typography.sizes.medium,
    } as TextStyle,
  },
}; 