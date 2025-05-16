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
    }
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