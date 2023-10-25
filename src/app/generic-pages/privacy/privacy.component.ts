import { Component, OnInit,HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  currentTab: any = '1';
  mainsec2: number;
  mainsec3: number;
  public sections = 11;
  constructor( private router: Router,private titleService: Title) {

    this.titleService.setTitle("Privacy Policy");
   }

  ngOnInit(): void {
   
  }
  ngAfterViewInit():void{
    let sec2 = document.getElementById("2").offsetTop;
    let sec3 = document.getElementById("3").offsetTop;
    this.mainsec2= sec2;
    this.mainsec3= sec3;
  }
  changeTab(tabname: string) {
   this.currentTab = tabname;
    window.location.hash = '';
      window.location.hash = tabname;
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event:any) {
    //this.currentTab = 5;
    // let element = document.getElementsByClassName('.section')[0].clientHeight;
    //let homeOffset = document.getElementById("section_2").offsetTop;
    //let conOffset = document.getElementById("3").offsetTop;
    // if (window.pageYOffset >= this.mainsec2 && window.pageYOffset < this.mainsec3) {
    //   this.currentTab = 2;
    // } 
    if (window.scrollY/11  >= 0 &&  window.scrollY/11 < 36) {
      this.currentTab = 1;
    } 
    else if (window.scrollY/11  >= 36 &&  window.scrollY/11 < 109) {
      this.currentTab = 2;
    } 
    else if (window.scrollY/11  >= 109 &&  window.scrollY/11 < 145) {
      this.currentTab = 3;
    } 
    else if (window.scrollY/11  >= 145 &&  window.scrollY/11 < 172) {
      this.currentTab = 4;
    } 
    else if (window.scrollY/11  >= 172 &&  window.scrollY/11 < 200) {
      this.currentTab = 5;
    } 
    else if (window.scrollY/11  >= 200 &&  window.scrollY/11 < 218) {
      this.currentTab = 6;
    } 
    else if (window.scrollY/11  >= 218 &&  window.scrollY/11 < 236) {
      this.currentTab = 7;
    } 

    else if (window.scrollY/11  >= 236 &&  window.scrollY/11 < 262) {
      this.currentTab = 8;
    } 

    else if (window.scrollY/11  >= 262 &&  window.scrollY/11 < 272) {
      this.currentTab = 9;
    } 
    else if (window.scrollY/11  >= 272 &&  window.scrollY/11 < 274) {
      this.currentTab = 10;
    } 
    else if (window.scrollY/11  >= 274 &&  window.scrollY/11 < 283) {
      this.currentTab = 11;
    } 
     
   
  }
}
