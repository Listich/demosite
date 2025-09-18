import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupsLayoutComponent } from './startups-layout.component';

describe('StartupsLayoutComponent', () => {
  let component: StartupsLayoutComponent;
  let fixture: ComponentFixture<StartupsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartupsLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
