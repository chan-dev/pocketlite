import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Bookmark } from '@models/bookmark.model';
import { RouteOrRedirectLinkContentDirective } from './route-or-redirect-content.directive';
import { RouteOrRedirectComponent } from './router-or-redirect.component';

@Component({
  selector: 'app-test',
  template: `
    <app-router-or-redirect class="default-no-content"></app-router-or-redirect>

    <app-router-or-redirect class="default-with-content">
      <div *appLinkContent>test link</div>
    </app-router-or-redirect>

    <app-router-or-redirect
      class="use-route"
      route="/test"
      externalLink="localhost:4200"
    >
      <div *appLinkContent>test link</div>
    </app-router-or-redirect>

    <app-router-or-redirect
      class="use-redirect"
      route="/test"
      externalLink="localhost:4200"
      [redirect]="true"
    >
      <div *appLinkContent>test link</div>
    </app-router-or-redirect>

    <app-router-or-redirect
      class="link-with-context"
      route="/test"
      externalLink="localhost:4200"
      [redirect]="true"
      [bookmark]="bookmark"
    >
      <div *appLinkContent="let bookmark">
        <img [attr.src]="bookmark.imgUrl" />
        <h3>{{ bookmark.title }}</h3>
      </div>
    </app-router-or-redirect>
  `,
  styles: [],
})
export class TestRouterOrRedirectComponent implements OnInit {
  bookmark: Partial<Bookmark> = {
    id: '1',
    title: 'Test Link',
    image: 'https://placeimg.com/640/480/any',
  };

  constructor() {}

  ngOnInit(): void {}
}

describe('RouterOrRedirectComponent', () => {
  let component: TestRouterOrRedirectComponent;
  let fixture: ComponentFixture<TestRouterOrRedirectComponent>;

  let defaultWithNoContent: RouteOrRedirectComponent;
  let defaultWithContent: RouteOrRedirectComponent;
  let useRoute: RouteOrRedirectComponent;
  let useRedirect: RouteOrRedirectComponent;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [RouterModule, RouterTestingModule],
        declarations: [
          TestRouterOrRedirectComponent,
          RouteOrRedirectComponent,
          RouteOrRedirectLinkContentDirective,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRouterOrRedirectComponent);
    component = fixture.componentInstance;

    defaultWithNoContent = fixture.debugElement.children[0].componentInstance;
    defaultWithContent = fixture.debugElement.children[1].componentInstance;
    useRoute = fixture.debugElement.children[2].componentInstance;
    useRedirect = fixture.debugElement.children[3].componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to link with route point to /', () => {
    const link = fixture.debugElement
      .query(By.css('.default-no-content'))
      .query(By.directive(RouterLinkWithHref));

    expect(link).toBeTruthy();
    expect(link.attributes.href).toBe('/');
  });

  it('should default to link with content and route points to /', () => {
    const link = fixture.debugElement
      .query(By.css('.default-with-content'))
      .query(By.directive(RouterLinkWithHref));

    expect(link.attributes.href).toBe('/');
    expect(link.nativeElement.textContent).toBe('test link');
  });

  it('should use routerLink for <a> tag if "redirect" binding is not specified', () => {
    const link = fixture.debugElement
      .query(By.css('.use-route'))
      .query(By.directive(RouterLinkWithHref));

    expect(link.attributes.href).toBe('/test');
    expect(link.nativeElement.textContent).toBe('test link');
  });

  it('should default "redirect" binding to false', () => {
    expect(useRoute.redirect).toBe(false);
  });

  it('should use href for <a> tag if "redirect" is true', () => {
    const link = fixture.debugElement
      .query(By.css('.use-redirect'))
      .query(By.css('a'));

    expect(useRedirect.redirect).toBe(true);
    expect(link.query(By.directive(RouterLinkWithHref))).toBeNull();

    expect(link.nativeElement.href).toBe('localhost:4200');
    expect(link.nativeElement.textContent).toBe('test link');
    expect(useRoute.redirect).toBe(false);
  });

  it('should use the bound value as the link template context', () => {
    const link = fixture.debugElement
      .query(By.css('.link-with-context'))
      .query(By.css('a'));

    expect(link.query(By.css('h3')).nativeElement.textContent).toContain(
      component.bookmark.title
    );
    expect(
      link.query(By.css('img')).nativeElement.getAttribute('src')
    ).toContain(component.bookmark.image);
    expect(useRoute.redirect).toBe(false);
  });
});
