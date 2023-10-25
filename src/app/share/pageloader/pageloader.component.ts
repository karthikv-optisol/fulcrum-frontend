import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-pageloader',
  templateUrl: './pageloader.component.html',
  styleUrls: ['./pageloader.component.scss']
})
export class PageloaderComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  loaderSubscription: Subscription;
  constructor(private pageLoader:LoaderService) { }

  ngOnInit(): void {
    this.loaderSubscription = this.pageLoader.isLoading$.subscribe(res => {
      this.isLoading = res;
    })
  }

  ngOnDestroy() {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }

}
