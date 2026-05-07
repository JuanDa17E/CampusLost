import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Objetos } from './objetos';

describe('Objetos', () => {
  let component: Objetos;
  let fixture: ComponentFixture<Objetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Objetos],
    }).compileComponents();

    fixture = TestBed.createComponent(Objetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
