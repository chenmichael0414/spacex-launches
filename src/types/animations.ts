import * as Animatable from "react-native-animatable";

export type AnimatableView = Animatable.View & {
  fadeInRight: (duration: number) => void;
};

export type AnimatableIconButton = Animatable.View & {
  pulse: (duration: number) => void;
};

export type AnimationConfig = {
  cardRef: React.RefObject<AnimatableView | null>;
  imageRefs: React.RefObject<
    Record<string, React.RefObject<AnimatableView | null>>
  >;
  articleButtonRef: React.RefObject<AnimatableView | null>;
  hasImages: boolean;
  hasArticleLink: boolean;
};

export const FAVORITE_ANIMATION = {
  keyframes: {
    0: {
      scaleX: 1,
      scaleY: 1,
    },
    0.3: {
      scaleX: 1.25,
      scaleY: 1.25,
    },
    0.6: {
      scaleX: 0.9,
      scaleY: 0.9,
    },
    1: {
      scaleX: 1,
      scaleY: 1,
    },
  },
  duration: 400,
};

export const SEQUENTIAL_ANIMATION = {
  card: {
    duration: 300,
    delay: 0,
  },
  image: {
    duration: 300,
    staggerDelay: 200,
  },
  articleButton: {
    duration: 300,
    delay: 200,
  },
};

export const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 100,
};
