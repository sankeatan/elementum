import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementumComponent } from './elementum.component';

describe('ElementumComponent', () => {
  let component: ElementumComponent;
  let fixture: ComponentFixture<ElementumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
