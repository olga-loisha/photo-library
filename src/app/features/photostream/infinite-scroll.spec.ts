import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScroll } from './infinite-scroll';

@Component({
  imports: [InfiniteScroll],
  template: `<div appInfiniteScroll (scrolled)="scrolledCount = scrolledCount + 1"></div>`,
})
class HostComponent {
  scrolledCount = 0;
}

describe('InfiniteScroll', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('div') as HTMLElement;
    await fixture.whenStable();
  });

  function mockScroll(scrollTop: number, clientHeight: number, scrollHeight: number): void {
    Object.defineProperty(element, 'scrollTop', { value: scrollTop, configurable: true });
    Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
    Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
  }

  it('should create the host', () => {
    expect(host).toBeTruthy();
  });

  it('emits scrolled once the bottom is within the threshold', () => {
    mockScroll(850, 100, 1000);

    element.dispatchEvent(new Event('scroll'));

    expect(host.scrolledCount).toBe(1);
  });

  it('does not emit while the bottom is still far away', () => {
    mockScroll(400, 100, 1000);

    element.dispatchEvent(new Event('scroll'));

    expect(host.scrolledCount).toBe(0);
  });
});
