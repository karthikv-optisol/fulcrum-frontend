import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Constant from '../constant/constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cdn',
  templateUrl: './cdn.component.html',
  styleUrls: ['./cdn.component.scss']
})
export class CdnComponent implements OnInit {
  number: string;
  pid: string;
  url: SafeResourceUrl;
  fileName: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.number = this.route.snapshot.paramMap.get('number');
    // console.log(this.number);
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      this.fileName = params['filename'];
    });
    // console.log(this.pid)
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(''); 
    this.fetchAndStreamFile();
  }

  fetchAndStreamFile(){
    let userid = localStorage.getItem('userid');
    let encodedStr  = btoa('_'+this.number+'/'+userid);
    let modifiedFilename = this.fileName.replace(/\//g, '-'); 
    let filename = encodeURI(modifiedFilename);
    const blobURL = `http://localhost:900/cdn/${encodedStr}/${filename}?projectId=Mw==`;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(blobURL);  
  }

  fetchAndStreamFile_old() {
    const endpoint = Constant.BE_URL+`api/cdn/_${this.number}`; // Replace with your Laravel API URL

    let data = {
      projectId : this.pid
    }
  
    this.http.post<any>(endpoint, data, 
      {
        responseType: 'blob' as 'json',
        observe: 'response'
      }).subscribe((response: any) => {
      // console.log(response);
      const file = new Blob([response.body], { type: 'application/pdf' });
      // const blobURL = 'http://localhost:900/api/common/_20362?projectId=Mw==';
      let userid = localStorage.getItem('userid');
      // let userid = 45432323232;
      let encodedStr  = btoa('_'+this.number+'/'+userid);
      let filename = this.fileName;
      
      const blobURL = `http://localhost:900/cdn/${encodedStr}/${filename}?projectId=Mw==`;
    
      // const blobURL = URL.createObjectURL(file);
      // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(blobURL);  
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(blobURL);  
      // window.open(blobURL, '_blank');
      // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(blobURL).toString();
      // const trustedURL = this.sanitizer.bypassSecurityTrustResourceUrl(blobURL);
      // console.log(trustedURL.toString());
      // const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
      // iframe.src = trustedURL.toString();
    });
  }

}
