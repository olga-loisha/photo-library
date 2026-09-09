import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

const SCROLL_THRESHOLD_PX = 50;

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly scrolled = output<void>();

  @HostListener('scroll')
  protected onScroll(): void {
    const el = this.elementRef.nativeElement;
    const scrollPosition = el.scrollTop + el.clientHeight;

    if (scrollPosition >= el.scrollHeight - SCROLL_THRESHOLD_PX) {
      this.scrolled.emit();
    }
  }
}
