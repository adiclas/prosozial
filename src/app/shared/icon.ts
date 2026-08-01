import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ItshoverIcon } from '../icons/icon.component';
import { ICONS, IconName } from '../icons';

/**
 * Drop-in icon component. Pass a name from the registry and an optional
 * `size` (defaults to 24). The icon animates on hover/focus using the
 * Web Animations API.
 *
 *   <app-icon name="star" [size]="20" />
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [ItshoverIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-itshover-icon [def]="def()" [size]="size()" [strokeWidth]="strokeWidth()" />`,
  styles: [`:host { display: inline-flex; }`],
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number | string>(24);
  readonly strokeWidth = input<number>(1.8);

  readonly def = computed(() => ICONS[this.name()]);
}
