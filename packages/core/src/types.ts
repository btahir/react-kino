/** Easing function signature: takes t in [0,1], returns value in [0,1] */
export type EasingFn = (t: number) => number;

/** Configuration for a pinned scene */
export interface SceneConfig {
  /** scroll distance this scene spans in pixels */
  duration: number;
  /** offset from top of the spacer element */
  offsetTop: number;
}

/** Progress data emitted by the scroll tracker */
export interface ProgressData {
  /** raw scroll Y position */
  scrollY: number;
  /** viewport height */
  viewportHeight: number;
  /** total document scroll height */
  scrollHeight: number;
  /** page-level progress 0->1 */
  progress: number;
}

/** Subscriber callback for scroll updates */
export type ScrollSubscriber = (data: ProgressData) => void;
