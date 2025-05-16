import { useEffect, useRef, useState } from "react";
import { AnimationConfig, SEQUENTIAL_ANIMATION } from "../types/animations";

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
      cardRef.current?.fadeInRight(SEQUENTIAL_ANIMATION.card.duration);

      // Animate images after a delay
      setTimeout(() => {
        if (hasImages && imageRefs.current) {
          Object.values(imageRefs.current).forEach((ref, index) => {
            setTimeout(() => {
              ref.current?.fadeInRight(SEQUENTIAL_ANIMATION.image.duration);
            }, index * SEQUENTIAL_ANIMATION.image.staggerDelay); // Stagger image animations
          });

          // Animate article button last
          setTimeout(() => {
            if (hasArticleLink) {
              articleButtonRef.current?.fadeInRight(
                SEQUENTIAL_ANIMATION.articleButton.duration
              );
            }
          }, Object.keys(imageRefs.current).length * SEQUENTIAL_ANIMATION.image.staggerDelay + SEQUENTIAL_ANIMATION.articleButton.delay);
        } else if (hasArticleLink) {
          // If no images, animate article button after card
          setTimeout(() => {
            articleButtonRef.current?.fadeInRight(
              SEQUENTIAL_ANIMATION.articleButton.duration
            );
          }, SEQUENTIAL_ANIMATION.card.duration);
        }
      }, SEQUENTIAL_ANIMATION.card.duration);

      setHasAnimated(true);
    }
  }, [
    hasAnimated,
    cardRef,
    imageRefs,
    articleButtonRef,
    hasImages,
    hasArticleLink,
  ]);

  return hasAnimated;
};
