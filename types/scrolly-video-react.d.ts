declare module "scrolly-video/dist/ScrollyVideo.cjs.jsx" {
  import type { ComponentType } from "react";

  type ScrollyVideoProps = {
    src: string;
    transitionSpeed?: number;
    frameThreshold?: number;
    cover?: boolean;
    sticky?: boolean;
    full?: boolean;
    trackScroll?: boolean;
    lockScroll?: boolean;
    useWebCodecs?: boolean;
    videoPercentage?: number;
    onReady?: () => void;
    onChange?: () => void;
    debug?: boolean;
  };

  const ScrollyVideo: ComponentType<ScrollyVideoProps>;

  export default ScrollyVideo;
}
