import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MyAccountSettingsService } from 'src/app/services/my-account-settings.service';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { Observable, ReplaySubject } from 'rxjs';
import * as Constant from '../../constant/constant';
@Component({
  selector: 'app-my-e-signature',
  templateUrl: './my-e-signature.component.html',
  styleUrls: ['./my-e-signature.component.scss'],
})
export class MyESignatureComponent implements OnInit {
  modalloading: boolean = false;
  currentlySelectedProjectName: any;
  signName: any;
  radioValue: any;
  commonError: any;
  getValues: any;
  user: any;
  @ViewChild('myDiv') myDiv: ElementRef;
  errorMessage: any;
  checkDeleteFlag: string;
  constructor(private myAccountSettingsService: MyAccountSettingsService) {
    this.user = JSON.parse(localStorage.getItem('users'));
    this.getSignImageDate();
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.loadScript('assets/js/signarea.js');
  }
  filename: any;
  getSignImageDate() {
    this.myAccountSettingsService
      .getSignImageDate(this.user)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            this.commonError = data.body;
          } else {
            this.getValues = data.body;
            if (this.getValues) {
              this.signsetchanges(this.getValues.type);
              this.filename = Constant.BE_URL + this.getValues.filename;
            }

            this.commonError = '';
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }

  showTextPreview(event: any) {
    this.signName = event.target.value;
  }

  clearDrawImage() {
    var clearElement: any = document.getElementById('signArea');
    clearElement.signaturePad().clearCanvas();
  }

  generateDrawImage() {
    let self = this;
    var node: any = document.getElementById('sign-pad');
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        self.saveTextAsSign(dataUrl);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  generateImage() {
    let self = this;
    var node: any = document.getElementById('html-content-holder');
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        self.saveTextAsSign(dataUrl);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  saveTextAsSign(dataUrl: any) {
    var rename = dataUrl.replace('data:image/png;base64,', '');
    this.myAccountSettingsService
      .uploadfile(
        rename,
        this.user.id,
        this.radioValue,
        this.user.primary_contact_id
      )
      .pipe(first())
      .subscribe(
        (data: any) => {
          alert('uploaded successfully');
          this.getValues = data.body;
          if (this.getValues) {
            this.signsetchanges(this.getValues.type);
            this.filename = Constant.BE_URL + this.getValues.filename;
          }
        },
        (err: any) => {
          this.commonError = err;
        }
      );
  }

  public loadScript(url: any) {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  base64Output: string;

  public convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  onFilechange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var fileCheck = event.target.files[0];
    if (fileCheck.type == "image/gif" || fileCheck.type == "image/jpeg" || fileCheck.type == "image/png") {
  
      if (event.target.files[0].size < 40 * 150 && event.target.files[0].size < 100 * 500) { 
        this.convertFile(event.target.files[0]).subscribe((base64) => {
          this.base64Output = base64;
          this.myAccountSettingsService
            .uploadfile(
              this.base64Output,
              this.user.id,
              this.radioValue,
              this.user.primary_contact_id
            )
            .pipe(first())
            .subscribe(
              (data: any) => {
                alert('uploaded successfully');
                this.getValues = data.body;
                if (this.getValues) {
                  this.signsetchanges(this.getValues.type);
                  this.filename = Constant.BE_URL + this.getValues.filename;
                }
              },
              (err: any) => {
                this.commonError = err;
              }
            );
        });
      }else{
        alert("Image size allowed from 150x40 to 500x100");
      }
      
    } else {
      alert("Only gif, jpg, jpeg, png are allowed.");
    }
      
    } else {
      alert(this.errorMessage);
    }
  }

  signsetchanges(radiovalue: any) {
    this.radioValue = radiovalue;
    if (radiovalue == 'type') {
    }
    if (radiovalue == '2') {
      // console.log(this.myDiv.nativeElement.innerHTML);
      // var value: any = document.getElementById('bcPaint');
      // value.bcPaint();
    }
    if (radiovalue == 'image') {
    }
  }

  ValueFromComp1(var1: any) {
    this.currentlySelectedProjectName = var1;
  }
}
