import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuStartupsComponent } from './menu-startups.component';

describe('MenuStartupsComponent', () => {
  let component: MenuStartupsComponent;
  let fixture: ComponentFixture<MenuStartupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuStartupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuStartupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
