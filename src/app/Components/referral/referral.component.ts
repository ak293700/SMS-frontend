import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['../../../styles/main-color-background.css',
    '../../../styles/button.css',
    './referral.component.css',
  ]
})
export class ReferralComponent implements OnDestroy
{

  rails: { label: string, link: string }[] = [];
  backButtonLink: string = '..';
  showBackButton: boolean = true;

  subscription: any[] = [];

  constructor(private activatedRoute: ActivatedRoute)
  {
    this.subscription.push(this.activatedRoute.data.subscribe((data: any) => {
      this.rails = data.rails;
      if (data.backButton !== undefined)
      {
        if (data.backButton.link !== undefined)
          this.backButtonLink = data.backButton.link;
        if (data.backButton.show !== undefined)
          this.showBackButton = data.backButton.show ?? true;
      }
    }));
  }

  ngOnDestroy(): void
  {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
