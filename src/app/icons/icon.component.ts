import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { ALL_TARGET, AnimProperty, IconDef, SELF_TARGET } from './icon.types';

/**
 * Properties whose keyframe values require a CSS unit appended.
 * `rotate`/`rotateX`/`rotateY` need `deg`; `translateX`/`translateY` need `px`.
 * Everything else (scale, opacity, pathLength, strokeDashoffset, …) is unitless.
 */
const PROPS_NEEDING_UNIT: Record<string, string> = {
  rotate: 'deg',
  rotateX: 'deg',
  rotateY: 'deg',
  translateX: 'px',
  translateY: 'px',
};

function withUnit(prop: AnimProperty, values: number[]): (number | string)[] {
  const unit = PROPS_NEEDING_UNIT[prop];
  return unit ? values.map((v) => `${v}${unit}`) : values;
}

/**
 * Renders an itshover-style animated SVG icon.
 *
 * Hover/focus on the host triggers `hoverIn`; leaving triggers `hoverOut`.
 * Uses the Web Animations API so no extra runtime deps are needed.
 */
@Component({
  selector: 'app-itshover-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      [attr.viewBox]="def.viewBox ?? '0 0 24 24'"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="icon-svg"
      (mouseenter)="play('in')"
      (mouseleave)="play('out')"
      (focus)="play('in')"
      (blur)="play('out')"
      tabindex="0"
    >
      @for (p of def.parts; track p.id) {
        <path
          #part
          [attr.data-id]="p.id"
          [attr.class]="p.cssClass || null"
          [attr.d]="p.d"
          [attr.fill]="p.fill ? 'currentColor' : 'none'"
          [style.transform-origin]="p.transformOrigin || null"
        />
      }
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      line-height: 0;
      color: inherit;
      cursor: pointer;
    }
    :host(:focus) { outline: none; }
    :host(:focus-visible) .icon-svg {
      outline: 2px solid rgba(0, 127, 65, 0.4);
      outline-offset: 2px;
      border-radius: 4px;
    }
    .icon-svg { display: block; transition: color 200ms ease; overflow: visible; }
    .icon-svg path { transform-box: fill-box; }
  `],
})
export class ItshoverIcon implements AfterViewInit, OnDestroy {
  @Input({ required: true }) def!: IconDef;
  @Input() size: number | string = 24;
  @Input() strokeWidth: number = 1.8;

  @ViewChildren('part') parts!: QueryList<ElementRef<SVGElement>>;

  private active: Animation[] = [];
  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    this.parts.forEach((ref) => {
      ref.nativeElement.style.transformBox = 'fill-box';
    });
  }

  ngOnDestroy(): void {
    this.cancelAll();
  }

  play(phase: 'in' | 'out'): void {
    this.cancelAll();
    if (!this.def) return;
    const steps = phase === 'in' ? this.def.hoverIn : this.def.hoverOut;
    for (const step of steps) {
      const els = this.resolve(step.target);
      const keyframes = { [step.property]: withUnit(step.property, step.values) } as any;
      for (const el of els) {
        try {
          const anim = el.animate(keyframes, {
            duration: step.duration,
            easing: step.ease ?? 'ease',
            delay: step.delay ?? 0,
            fill: 'none',
            iterations: step.repeat ?? 1,
          });
          this.active.push(anim);
        } catch {
          // ignore unsupported property on this element
        }
      }
    }
  }

  private resolve(target: string): SVGElement[] {
    const root = this.host.nativeElement;
    if (target === SELF_TARGET) {
      const svg = root.querySelector('svg.icon-svg') as SVGElement | null;
      return svg ? [svg] : [];
    }
    if (target === ALL_TARGET) {
      return Array.from(root.querySelectorAll('svg.icon-svg path')) as SVGElement[];
    }
    return Array.from(root.querySelectorAll(`[data-id="${target}"]`)) as SVGElement[];
  }

  private cancelAll(): void {
    for (const a of this.active) {
      try { a.cancel(); } catch { /* noop */ }
    }
    this.active = [];
  }
}
