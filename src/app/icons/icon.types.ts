export type AnimProperty =
  | 'translateX'
  | 'translateY'
  | 'scale'
  | 'rotate'
  | 'rotateX'
  | 'rotateY'
  | 'opacity'
  | 'scaleX'
  | 'scaleY'
  | 'pathLength'
  | 'strokeDashoffset'
  | 'strokeDasharray';

export type Ease = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';

/** Special target that animates the SVG root itself (e.g. scale bounce). */
export const SELF_TARGET = '__self__';

/** A target that matches every part. */
export const ALL_TARGET = '__all__';

/**
 * One animation step: a single keyframe sequence on a single sub-element.
 * The element to animate is matched by the `target` id, or one of the
 * wildcard constants above.
 */
export interface AnimStep {
  /** Id of the sub-element, `SELF_TARGET`, or `ALL_TARGET`. */
  target: string;
  /** Property to animate. */
  property: AnimProperty;
  /** Keyframe values (e.g. `[0, 4, 0]` for bounce). */
  values: number[];
  /** Duration in ms. */
  duration: number;
  /** CSS easing. */
  ease?: Ease;
  /** Delay in ms. Used to chain sequential animations. */
  delay?: number;
  /** Number of times to repeat. Defaults to 1; use `Infinity` for loops. */
  repeat?: number;
}

export interface IconPart {
  /** Unique id used by `AnimStep.target`. */
  id: string;
  /** Optional shared CSS class for styling. */
  cssClass?: string;
  /** SVG path `d` attribute. */
  d: string;
  /** Override `transform-origin` for this element. */
  transformOrigin?: string;
  /** Fill with currentColor instead of stroke. */
  fill?: boolean;
}

export interface IconDef {
  viewBox?: string;
  parts: IconPart[];
  hoverIn: AnimStep[];
  hoverOut: AnimStep[];
}
