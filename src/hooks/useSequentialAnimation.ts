import { useEffect, useRef, useState } from 'react';
import * as Animatable from 'react-native-animatable';

type AnimatableView = Animatable.View & {
  fadeInRight: (duration: number) => void;
};

type AnimationConfig ={
  cardRef: React.RefObject<AnimatableView | null>;
  imageRefs: React.RefObject<Record<string, React.RefObject<AnimatableView | null>>>;
  articleButtonRef: React.RefObject<AnimatableView | null>;
  hasImages: boolean;
  hasArticleLink: boolean;
}

export const useSequentialAnimation = ({
  cardRef,
  imageRefs,
  articleButtonRef,
  hasImages,
  hasArticleLink,
}: AnimationConfig) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      // Animate card first
      cardRef.current?.fadeInRight(300);
      
      // Animate images after a delay
      setTimeout(() => {
        if (hasImages && imageRefs.current) {
          Object.values(imageRefs.current).forEach((ref, index) => {
            setTimeout(() => {
              ref.current?.fadeInRight(300);
            }, index * 200); // Stagger image animations
          });

          // Animate article button last
          setTimeout(() => {
            if (hasArticleLink) {
              articleButtonRef.current?.fadeInRight(300);
            }
          }, Object.keys(imageRefs.current).length * 200 + 200);
        } else if (hasArticleLink) {
          // If no images, animate article button after card
          setTimeout(() => {
            articleButtonRef.current?.fadeInRight(300);
          }, 300);
        }
      }, 300);

      setHasAnimated(true);
    }
  }, [hasAnimated, cardRef, imageRefs, articleButtonRef, hasImages, hasArticleLink]);

  return hasAnimated;
}; 