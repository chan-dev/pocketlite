import {
  OnInit,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Bookmark } from '@models/bookmark.model';
import { RouteOrRedirectLinkContentDirective } from './route-or-redirect-content.directive';

@Component({
  selector: 'app-router-or-redirect',
  templateUrl: './router-or-redirect.component.html',
  styles: [],
})
export class RouteOrRedirectComponent implements OnInit {
  @Input() styleClass: string[];
  @Input() route = '/';
  @Input() ariaLabel: string;
  @Input() externalLinkTarget: string;
  @Input() redirect = false;
  @Input() bookmark: Bookmark;
  @Input() set externalLink(link: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
  @ContentChild(RouteOrRedirectLinkContentDirective, { read: TemplateRef })
  linkContent: TemplateRef<RouteOrRedirectLinkContentDirective> | undefined;

  safeUrl: SafeResourceUrl | undefined;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}
}
