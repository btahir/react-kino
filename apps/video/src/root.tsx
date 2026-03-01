import { Composition } from "remotion";
import { LaunchVideo } from "./video";
import { FPS, WIDTH, HEIGHT, SCENES } from "./theme";

const TOTAL =
  SCENES.INTRO +
  SCENES.TAGLINE +
  SCENES.TEXT_REVEAL +
  SCENES.PARALLAX +
  SCENES.COMPARE +
  SCENES.HORIZONTAL_SCROLL +
  SCENES.PROGRESS +
  SCENES.COUNTER +
  SCENES.GRID +
  SCENES.STATS +
  SCENES.OUTRO -
  10 * SCENES.TRANSITION;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaunchVideo"
      component={LaunchVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
