import { useEffect, useRef, useState } from "react";
import { AnimationConfig, SEQUENTIAL_ANIMATION } from "../types/animations";

const animateImages = (
  imageRefs: React.RefObject<Record<string, React.RefObject<any>>>,
  hasArticleLink: boolean,
  articleButtonRef: React.RefObject<any>
) => {
  if (!imageRefs.current) return;

  Object.values(imageRefs.current).forEach((ref, index) => {
    setTimeout(() => {
      ref.current?.fadeInRight(SEQUENTIAL_ANIMATION.image.duration);
    }, index * SEQUENTIAL_ANIMATION.image.staggerDelay);
  });

  if (hasArticleLink) {
    setTimeout(() => {
      articleButtonRef.current?.fadeInRight(
        SEQUENTIAL_ANIMATION.articleButton.duration
      );
    }, Object.keys(imageRefs.current).length * SEQUENTIAL_ANIMATION.image.staggerDelay + SEQUENTIAL_ANIMATION.articleButton.delay);
  }
};

const animateArticleButton = (articleButtonRef: React.RefObject<any>) => {
  setTimeout(() => {
    articleButtonRef.current?.fadeInRight(
      SEQUENTIAL_ANIMATION.articleButton.duration
    );
  }, SEQUENTIAL_ANIMATION.card.duration);
};

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

      // Animate images and article button after card
      setTimeout(() => {
        if (hasImages) {
          animateImages(imageRefs, hasArticleLink, articleButtonRef);
        } else if (hasArticleLink) {
          animateArticleButton(articleButtonRef);
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
