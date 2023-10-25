import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NgbModal, NgbModalOptions, NgbCalendar,
  NgbAlertModule, NgbDatepickerModule, NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { RFIsService } from 'src/app/services/rfis.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../constant/constant';
@Component({
  selector: 'app-rfis',
  templateUrl: './rfis.component.html',
  styleUrls: ['./rfis.component.scss'],
})
export class RFIsComponent implements OnInit {

  RFIsListData: any;

  p = 1;
  private router: Router;
  entrieValues: any = ['5','10', '25', '50', '100']
  importCostCode: any;
  page:any=5;
  tagsData: any;
  costCodeResponse: any;
  rfiTypes: any;
  rfiPriortiy: any;
  datavisble: boolean = false;
  recipientEmails: any;
  recipientFilterEmails: any = [];
  searchFilter: any = "";
  roleslist: any;
  rfi_info: any;
  windowWidth = window.innerWidth + 'px';
  windowHeight = window.outerHeight - (window.outerHeight * .25) + 'px'
  limitDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  fileAttachment: any = [];
  efileAttachment: any = [];
  rfi_attachment_id: any = [];
  To: any = 'To';
  Cc: any = 'Cc';
  Bcc: any = 'Bcc';
  recipientTo: any = [];
  recipientCC: any = [];
  recipientBCC: any = [];
  IMAGE_URL: any = Constant.IMAGE_URL;
  rfi_id: any = "";
  rfid_id: any = "";
  title_show: any = false;
  question_show = false;
  rfi_title: any;
  rfi_statement: any;
  rfi_type_id: any;
  rfi_status: any;
  rfi_plan_page_reference: any;
  rfi_due_date: any;
  due_date: any;
  rfi_priority_id: any;
  rfi_cost_code_id: any = [];
  rfi_recipient_contact_id: any;
  tag_ids: any = [3, 2];
  rfi_response: any = "";
  rfi_response_title: any = "";
  rfi_answers: any = "";
  rfi_title_error: any;
  rfi_statement_error: any;
  rfi_type_error: any;
  rfi_priority_error: any;
  rfi_response_error: any;

  RFICreateFrom: any;
  selectedRole: any = [];

  editFormRFI: any;
  rfi_draft_list: any = [];

  selectedCar: number;
  pid: any;

  updateForm: FormGroup;

  userData: any;

  projectName: any;

  @ViewChild('editRFI') public editRFI: ElementRef;

  constructor(private route: ActivatedRoute, private loader: LoaderService, public modalService: NgbModal,
    private toaster: ToasterService,
    private RFIsService: RFIsService) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }

  ngOnInit(): void {
    this.RFIsList();
    this.emailListRecipient();
    this.formEditRFI();
    this.getDraftRFI();

    this.userData = JSON.parse(localStorage.getItem("users"));

    console.log("userData.currentlySelectedProjectName", this.userData.currentlySelectedProjectName);
    this.projectName = this.userData.currentlySelectedProjectName;


  }

  getDraftRFI() {
    let data = {
      projectId: this.pid
    }

    this.RFIsService.RfiDraftList(data).subscribe((res: any) => {
      console.log("data", data);
      if (res.status == true) {
        this.rfi_draft_list = res.body;
      }
    })

  }

  formEditRFI() {
    this.editFormRFI = new FormGroup({
      rfi_statement: new FormControl("testing", [Validators.required])
    })
  }

  OnChangeReceipts(pTO, pCC, pBCC, plineItem: any, event: any) {

    let emailTo: any = this.recipientTo;
    let emailCC: any = this.recipientTo;
    let emailBcc: any = this.recipientTo;
    let checked = event.target.checked;
    let recipientArray: any = this.recipientEmails;
    if (pTO == true) {
      plineItem.cc = false;
      plineItem.bcc = false;
      let index = emailTo.indexOf(plineItem.email)
      if (this.recipientEmails.length > 0) {

        if (checked == true) {
          recipientArray = this.recipientEmails.map((element: any) => {
            if (element.id == plineItem.id) {
              element.to = checked;
              if (element.to == true) {
                if (index == -1) {
                  emailTo.push(element);
                }
                else {
                  emailTo.splice(index, 1);
                }

              }

            }
            return element;
          });
        }
        else {
          emailTo.splice(index, 1);
        }
        this.recipientTo = emailTo;
        // console.log("recipientArrayTo", recipientArray)
        this.recipientEmails = recipientArray;
      }

    }
    else if (pCC == true) {
      console.log("cc checked", plineItem.id);
      plineItem.to = false;
      plineItem.bcc = false;
      let index = emailCC.indexOf(plineItem.email)
      if (this.recipientEmails.length > 0) {
        if (checked == true) {
          recipientArray = this.recipientEmails.map((element: any) => {
            if (element.id == plineItem.id) {
              element.cc = checked;
              if (element.cc == true) {
                if (index == -1) {
                  emailCC.push(element);
                }
                else {
                  emailCC.splice(index, 1);
                }

              }
            }
            return element;

          });
        }
        else {
          emailCC.splice(index, 1);
        }
        this.recipientTo = emailCC;
        // console.log("recipientArrayCC", recipientArray)
        this.recipientEmails = recipientArray;
      }
    }
    else if (pBCC == true) {
      plineItem.cc = false;
      plineItem.to = false;

      let index = emailBcc.indexOf(plineItem.email)
      if (this.recipientEmails.length > 0) {

        if (checked == true) {
          recipientArray = this.recipientEmails.map((element: any) => {
            if (element.id == plineItem.id) {
              element.bcc = checked;
              if (element.bcc == true) {
                if (index == -1) {
                  emailBcc.push(element);
                }
                else {
                  emailBcc.splice(index, 1);
                }

              }
            }
            return element;

          });
        }
        else {
          emailBcc.splice(index, 1);
        }
        this.recipientTo = emailBcc;
        // console.log("recipientArrayBcc", recipientArray)
        this.recipientEmails = recipientArray;
      }
    }
  }

  loadNewRFIsDialog(newRFI) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(newRFI, ngbModalOptions);
    this.emptyModels();
    // this.rfi_title = 'testing';
  }

  RFIsList() {
    this.loader.show();
    this.RFIsService.importRfiList().subscribe(response => {
      this.loader.hide();
      this.RFIsListData = response.body.data;
      // console.log('test', this.RFIsListData)
      if (this.RFIsListData == "") {
        this.datavisble = true;
      } else {
        this.datavisble = false;
      }
    })
  }
  loadRecieptDialog(MasterCodeLists) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'reciept-pagenew',
    };
    this.modalService.open(MasterCodeLists, ngbModalOptions);
  }
  dateFormat(value) {
    return moment(value).format('L');
  }

  importCostCodeList(newRFI) {

    this.loader.show();
    this.RFIsService.CostCodeService().subscribe((data) => {
      this.loader.hide();
      console.log(data, 'Testing');
      if (data.status) {
        this.costCodeResponse = data.body;
        this.rfiTypes = this.costCodeResponse.Rfi_types;
        this.rfiPriortiy = this.costCodeResponse.Rfi_Priority;
        this.importCostCode = this.costCodeResponse?.cost_code_references;
        this.tagsData = this.costCodeResponse?.tags;
        this.loadNewRFIsDialog(newRFI);
      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });
  }

  showTitle() {
    this.title_show = !this.title_show;
  }

  showStatement() {
    this.question_show = !this.question_show;
  }

  editDraftOpen(newRFI, event) {
    let rfi_data = {
      "projectId": this.pid,
      "RFID_id": event.target.value
    }
    this.rfid_id = event.target.value;
    // console.log("rfi_data", data);
    this.loader.show();
    this.RFIsService.CostCodeService().subscribe((data) => {
      if (data.status) {
        this.costCodeResponse = data.body;
        this.rfiTypes = this.costCodeResponse.Rfi_types;
        this.rfiPriortiy = this.costCodeResponse.Rfi_Priority;
        this.importCostCode = this.costCodeResponse?.cost_code_references;
        this.tagsData = this.costCodeResponse?.tags;

        this.RFIsService.getRFIDraftInfo(rfi_data).subscribe((res) => {
          if (res.status == true) {
            setTimeout(() => {
              this.loadNewRFIsDialog(newRFI);
              this.rfi_info = res.body;
              this.rfi_title = res.body.rfi_title;
              this.rfi_statement = res.body.question;
              this.rfi_priority_id = res.body.request_for_information_priority_id;
              this.rfi_type_id = res.body.request_for_information_type_id;
              this.rfi_plan_page_reference = res.body.rfi_plan_page_reference
              if (res.body.tag_ids) {
                let tag_ids = res.body.tag_ids.split(",");
                this.tag_ids = tag_ids.map(Number)
              }
              this.rfi_cost_code_id = [res.body.rfi_cost_code_id];
              this.efileAttachment = res.body.attachments;
              this.recipientTo = res.body.recipients;
              this.due_date = res.body.rfi_due_date;
              this.rfi_due_date = res.body.rfi_due_date;
              this.loader.hide();
            }, 4000);
          }
        })



      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });

  }


  statusUpdate(status) {
    this.rfi_status = status;
  }

  editRFIOpen(editRFI, data: any) {

    let rfi_data = {
      "projectId": this.pid,
      "RFI_id": data.id
    }
    this.rfi_id = data.id;
    // console.log("rfi_data", data);
    let tagdata = [];
    this.loader.show();
    this.RFIsService.CostCodeService().subscribe((data) => {
      if (data.status) {
        this.costCodeResponse = data.body;
        this.rfiTypes = this.costCodeResponse.Rfi_types;
        this.rfiPriortiy = this.costCodeResponse.Rfi_Priority;
        this.importCostCode = this.costCodeResponse?.cost_code_references;
        this.tagsData = this.costCodeResponse?.tags;
        this.RFIsService.getRFIInfo(rfi_data).subscribe((res) => {
          if (res.status == true) {


            setTimeout(() => {
              this.loadNewRFIsDialog(editRFI);
              this.rfi_info = res.body;
              this.rfi_title = res.body.rfi_title;
              this.rfi_statement = res.body.question;
              tagdata = res.body.tag_ids.split(",");
              this.tag_ids = res.body.tag_ids.split(",").map(Number);
              // this.tag_ids = [9,8];
              this.due_date = res.body.rfi_due_date;
              this.rfi_due_date = res.body.rfi_due_date;
              this.rfi_priority_id = res.body.request_for_information_priority_id;
              this.recipientTo = res.body.notifications;

              console.log("notifications", res.body.notifications);
              this.efileAttachment = res.body.attachments;
              this.rfi_status = res.body.request_for_information_status_id
              this.rfi_response = "";
              this.loader.hide();
            }, 4000);

          }
        })

      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });
  }

  ngSelectCheck(tags) {
    console.log("this.conde", tags);

    this.tag_ids = tags;
  }

  updateRFISubmitWithoutMail(event: any, email: boolean) {
    event.preventDefault();
    if (!this.rfi_title || !this.rfi_statement || !this.rfi_priority_id || !this.rfi_response) {
      if (!this.rfi_title) {
        this.rfi_title_error = 'Please fill the rfi title';
      }
      if (!this.rfi_statement) {
        this.rfi_statement_error = 'Please fill the rfi statement';
      }

      if (!this.rfi_priority_id) {
        this.rfi_priority_error = 'Please select the rfi priority';
      }

      if (!this.rfi_response.length) {
        this.rfi_response_error = "Please enter the answer";
      }

      return;
    }



    if (this.due_date) {
      let date = this.due_date;

      if (date.year) {
        let due_Date = date.year + "-" + date.month + "-" + date.day;
        this.rfi_due_date = due_Date;
        console.log("due condition", due_Date);
      }
    }

    let data: any = {
      "rfi_id": this.rfi_id,
      "projectId": this.pid,
      "rfi_title": this.rfi_title,
      "rfi_statement": this.rfi_statement,
      "rfi_type_id": this.rfi_type_id,
      "rfi_due_date": this.rfi_due_date,
      "rfi_priority_id": this.rfi_priority_id,
      "rfi_cost_code_id": this.rfi_cost_code_id[0],
      "rfi_recipient": this.recipientTo,
    }

    if (email) {
      data.sendemail = true;
    }
    else {
      data.sendemail = false;
    }

    if (this.rfi_status) {
      data.request_for_information_status_id = this.rfi_status;
    }
    if (this.rfi_response) {
      data.rfi_response = this.rfi_response;
    }

    if (this.rfi_response_title) {
      data.rfi_response_title = this.rfi_response_title;
    }

    if (this.rfi_attachment_id.length > 0) {
      data.rfi_attachment_id = this.rfi_attachment_id;
    }


    if (this.tag_ids.length) {
      data.tag_ids = this.tag_ids.join();
    }


    this.RFIsService.updateRFI(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Request for information updated successfully.', '');
        this.modalService.dismissAll('RFI updated Successfully');
        this.emptyModels();
      }
      else {
        console.log("", res);
        this.toaster.showFailToaster('Please fill the required fields', '');
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI creation', '');
      }
    );

  }

  updateRFIDraftSubmitWithoutMail(event: any) {
    event.preventDefault();
    if (!this.rfi_title || !this.rfi_statement || !this.rfi_type_id || !this.rfi_priority_id) {
      if (!this.rfi_title) {
        this.rfi_title_error = 'Please fill the rfi title';
      }
      if (!this.rfi_statement) {
        this.rfi_statement_error = 'Please fill the rfi statement';
      }
      if (!this.rfi_type_id) {
        this.rfi_type_error = 'Please select the rfi type';
      }
      if (!this.rfi_priority_id) {
        this.rfi_priority_error = 'Please select the rfi priority';
      }
      return;
    }

    if (this.rfi_due_date) {
      let date = this.rfi_due_date;
      if (date.year) {
        let due_Date = date.year + "-" + date.month + "-" + date.day;
        this.rfi_due_date = due_Date;
      }
    }

    let data: any = {
      "projectId": this.pid,
      "rfi_title": this.rfi_title,
      "rfi_statement": this.rfi_statement,
      "rfi_type_id": this.rfi_type_id,
      "rfi_plan_page_reference": this.rfi_plan_page_reference,
      "rfi_due_date": this.rfi_due_date,
      "rfi_priority_id": this.rfi_priority_id,
      "rfi_cost_code_id": this.rfi_cost_code_id[0],
      "rfi_recipient": this.recipientTo,
      "request_for_information_id": this.rfid_id
    }

    if (this.rfi_response) {
      data.rfi_response = this.rfi_response;
    }

    if (this.rfi_attachment_id.length > 0) {
      data.rfi_attachment_id = this.rfi_attachment_id;
    }


    if (this.tag_ids.length) {
      data.tag_ids = this.tag_ids.join();
    }


    this.RFIsService.updateRFIDraft(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Request for information draft updated successfully.', '');
        this.modalService.dismissAll('RFI draft updated Successfully');
        this.emptyModels();
        this.rfid_id = '';
      }
      else {
        console.log("", res);
        this.toaster.showFailToaster('Please fill the required fields', '');
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI creation', '');
      }
    );
  }

  deleteDraft(data) {
    let resdata = {
      projectId: this.pid,
      request_for_information_draft_id: this.rfid_id
    }

    this.RFIsService.deleteRFIDraft(resdata).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Request for information draft deleted successfully.', '');
        this.modalService.dismissAll('RFI draft deleted Successfully');
        this.emptyModels();
        this.rfid_id = '';
        this.getDraftRFI();
      }
      else {
        console.log("", res);
        this.toaster.showFailToaster('Please fill the required fields', '');
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI Deletion', '');
      }
    );


  }

  emptyModels() {
    this.rfi_title = "";
    this.rfi_statement = "";
    this.rfi_type_id = "";
    this.rfi_plan_page_reference = "";
    this.rfi_due_date = "";
    this.rfi_priority_id = "";
    this.rfi_cost_code_id = "";
    this.rfi_recipient_contact_id = "";
    this.tag_ids = [];
    this.rfi_attachment_id = [];
    this.rfi_response = "";
    this.fileAttachment = [];
    this.efileAttachment = [];
    this.RFIsList();
  }

  ngAfterViewInit(): void {
    console.log("testing modal");
    if (this.editRFI.nativeElement) {
      this.rfi_title = 'testing';
      console.log("testing modal");
    }
  }
  importCostCodeFunction(costdata) {
    // this.importCostCode = [];
    // const keysData = Object.keys(costdata);
    // keysData && keysData.forEach((keyValue) => {
    //   costdata[keyValue].forEach((data) => {
    //     data.dataType = keyValue;
    //     this.importCostCode.push(data);
    //   });
    // });

    // console.log("newDAta", this.importCostCode);
  }

  deleteResponse(data) {
    this.loader.show();
    let resdata = {
      projectId: this.pid,
      request_for_information_id: data.request_for_information_id,
      rfi_response_id: data.id
    }

    let answers = this.rfi_info.answers.filter((element) => element.id != data.id);

    this.RFIsService.deleteResponse(resdata).subscribe((res) => {
      if (res.status == true) {
        this.rfi_info.answers = answers;
        this.loader.hide();
        this.toaster.showSuccessToaster("Request for information answers deleted successfully.", "")
      }
    }, (error: any) => {
      this.toaster.showFailToaster(error, '');
    })
  }

  searchRFI(event) {
    let value = event.target.value.toLowerCase();

    if (value.length > 3) {
      let data = this.RFIsListData.filter((element) =>
        element.rfi_title.toLowerCase().includes(value)
      );
      this.RFIsListData = data;
    }
    else if (value.length == 0) {
      this.RFIsList();
    }


  }

  createRFISubmitWithoutMail(event: any) {
    event.preventDefault();
    if (!this.rfi_title || !this.rfi_statement || !this.rfi_type_id || !this.rfi_priority_id) {
      if (!this.rfi_title) {
        this.rfi_title_error = 'Please fill the rfi title';
      }
      if (!this.rfi_statement) {
        this.rfi_statement_error = 'Please fill the rfi statement';
      }
      if (!this.rfi_type_id) {
        this.rfi_type_error = 'Please select the rfi type';
      }
      if (!this.rfi_priority_id) {
        this.rfi_priority_error = 'Please select the rfi priority';
      }
      return;
    }

    if (this.rfi_due_date) {
      let date = this.rfi_due_date;
      if (date.year) {
        let due_Date = date.year + "-" + date.month + "-" + date.day;
        this.rfi_due_date = due_Date;
      }
    }

    let data: any = {
      "projectId": this.pid,
      "rfi_title": this.rfi_title,
      "rfi_statement": this.rfi_statement,
      "rfi_type_id": this.rfi_type_id,
      "rfi_plan_page_reference": this.rfi_plan_page_reference,
      "rfi_due_date": this.rfi_due_date,
      "rfi_priority_id": this.rfi_priority_id,
      "rfi_cost_code_id": this.rfi_cost_code_id[0],
      "rfi_recipient": this.recipientTo,
      "sendemail": false
    }

    if (this.rfi_response) {
      data.rfi_response = this.rfi_response;
    }

    if (this.rfi_attachment_id.length > 0) {
      data.rfi_attachment_id = this.rfi_attachment_id;
    }


    if (this.tag_ids.length) {
      data.tag_ids = this.tag_ids.join();
    }


    this.RFIsService.createRFI(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Request for information created successfully.', '');
        this.modalService.dismissAll('RFI Created Successfully');
        this.rfid_id = '';
        this.emptyModels();
      }
      else {
        console.log("", res);
        this.toaster.showFailToaster('Please fill the required fields', '');
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI creation', '');
      }
    );

  }



  fileUpload(event: any) {
    this.loader.show();
    let formData = new FormData();
    formData.append("projectId", this.pid);
    formData.append("cloud_vendor", "Fulcrum");
    formData.append("directly_deleted_flag", "N");
    formData.append("deleted_flag", "N");
    formData.append("version_number", "1");
    formData.append("methodCall", "RFI Attachments");
    let files = event.target.files;
    let filesArray: any = [];

    for (let i = 0; i < files.length; i++) {
      formData.append("files[" + [i] + "]", files[i]);
    }

    this.RFIsService.uploadRFIAttachments(formData).subscribe((data) => {
      console.log("data", data);
      if (data.status == true) {

        // if(this.rfi_id)
        // {
        //     this.editRFIOpen('#editRFI',this.rfi_info);
        // }
        // else
        // {
        this.fileAttachment = data.body.original.data
        data.body.original && data.body.original.data.map((element: any) => {
          this.rfi_attachment_id.push(element.file_manager_file_id);
        })
        this.loader.hide();
        // }

      }
    });
  }

  rfiAttachmentUpdate(data: any, event: any) {
    let rfi_data = {
      "rfi_attachment_id": data.file_manager_file_id,
      "rfi_id": data.request_for_information_id,
      "is_added": event.target.checked,
      "projectId": this.pid
    }

    this.RFIsService.rfiAttachmentUpdate(rfi_data).subscribe((res) => {
      if (res.status) {

      }
    })
  }

  // rfidAttachmentDelete
  rfidAttachmentDelete(data: any)
  {

    console.log("data",data);
    let rfi_data = {
      "rfi_attachment_id": data.file_manager_file_id,
      "rfid_id": data.request_for_information_id,
      "projectId": this.pid
    }

    this.RFIsService.rfidAttachmentDelete(rfi_data).subscribe((res) => {
      if (res.status) {
          this.efileAttachment.removeAt(data.file_manager_file_id)
      }
    })
  }
  rfiAttachmentDelete(data: any) {
    let rfi_data = {
      "rfi_attachment_id": data.file_manager_file_id,
      "rfi_id": data.request_for_information_id,
      "projectId": this.pid
    }

    this.RFIsService.rfiAttachmentDelete(rfi_data).subscribe((res) => {
      if (res.status) {
        this.efileAttachment.removeAt(data.file_manager_file_id)
      }
    })
  }

  createRFISubmitWithMail(event: any) {
    event.preventDefault();

    if (!this.rfi_title || !this.rfi_statement || !this.rfi_type_id || !this.rfi_priority_id) {
      if (!this.rfi_title) {
        this.rfi_title_error = 'Please fill the rfi title';
      }
      if (!this.rfi_statement) {
        this.rfi_statement_error = 'Please fill the rfi statement';
      }
      if (!this.rfi_type_id) {
        this.rfi_type_error = 'Please select the rfi type';
      }
      if (!this.rfi_priority_id) {
        this.rfi_priority_error = 'Please select the rfi priority';
      }
      return;
    }


    if (this.rfi_due_date) {
      let date = this.rfi_due_date;
      if (date.year) {
        let due_Date = date.year + "-" + date.month + "-" + date.day;
        this.rfi_due_date = due_Date;
      }

    }

    let data: any = {
      "projectId": this.pid,
      "rfi_title": this.rfi_title,
      "rfi_statement": this.rfi_statement,
      "rfi_type_id": this.rfi_type_id,
      "rfi_plan_page_reference": this.rfi_plan_page_reference,
      "rfi_due_date": this.rfi_due_date,
      "rfi_priority_id": this.rfi_priority_id,
      "rfi_cost_code_id": this.rfi_cost_code_id[0],
      "rfi_recipient": this.recipientTo,
      "sendemail": true
    }

    if (this.rfi_response) {
      data.rfi_response = this.rfi_response;
    }

    if (this.rfi_attachment_id.length > 0) {
      data.rfi_attachment_id = this.rfi_attachment_id;
    }

    if (this.tag_ids.length) {
      data.tag_ids = this.tag_ids.join();
    }

    this.RFIsService.createRFI(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('RFI created successfully and notifications send to user', '');
        this.modalService.dismissAll('RFI Created Successfully')
        this.rfid_id = '';
        this.emptyModels();
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI creation', '');
      }
    );

  }
  createRFISubmitDraft(event: any) {
    event.preventDefault();

    if (!this.rfi_title || !this.rfi_statement || !this.rfi_type_id || !this.rfi_priority_id) {
      if (!this.rfi_title) {
        this.rfi_title_error = 'Please fill the rfi title';
      }
      if (!this.rfi_statement) {
        this.rfi_statement_error = 'Please fill the rfi statement';
      }
      if (!this.rfi_type_id) {
        this.rfi_type_error = 'Please select the rfi type';
      }
      if (!this.rfi_priority_id) {
        this.rfi_priority_error = 'Please select the rfi priority';
      }
      return;
    }



    if (this.rfi_due_date) {
      let date = this.rfi_due_date;
      let due_Date = date.year + "-" + date.month + "-" + date.day;
      this.rfi_due_date = due_Date;
    }


    let data: any = {
      "projectId": this.pid,
      "rfi_title": this.rfi_title,
      "rfi_statement": this.rfi_statement,
      "rfi_type_id": this.rfi_type_id,
      "rfi_plan_page_reference": this.rfi_plan_page_reference,
      "rfi_due_date": this.rfi_due_date,
      "rfi_priority_id": this.rfi_priority_id,
      "rfi_cost_code_id": this.rfi_cost_code_id[0],
      "rfi_recipient": this.recipientTo
    }

    if (this.rfi_response) {
      data.rfi_response = this.rfi_response;
    }

    if (this.rfi_attachment_id.length > 0) {
      data.rfi_attachment_id = this.rfi_attachment_id;
    }


    if (this.tag_ids.length) {
      data.tag_ids = this.tag_ids.join();
    }

    this.RFIsService.createDraftRFI(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Request for information draft created successfully.', '');
        this.modalService.dismissAll('RFI Created Successfully');
        this.rfid_id = '';
        this.emptyModels();
      }
    },
      (error: any) => {
        this.toaster.showFailToaster('Issue with RFI creation', '');
      }
    );

  }

  FilterRecipients() {
    // console.log("this",this.selectedRole);
    let filters = this.recipientEmails.filter((item: any) => {
      if (this.selectedRole.indexOf(item.roles) > -1) {
        return item;
      }
    })
    this.recipientFilterEmails = filters;
  }

  resetDropdown() {
    this.selectedRole = [];
    this.searchFilter = "";
    this.recipientFilterEmails = [];
  }

  filterSearch(event: any) {

    let search = event.target.value.toLowerCase();

    if (search.length > 3) {

      let filters = this.recipientEmails.filter((item: any) =>
        item.email.toLowerCase().includes(search)
      )
      console.log("filters", filters);
      this.recipientFilterEmails = filters;

    }
    else if (search.length == 0) {
      this.recipientFilterEmails = [];
      this.emailListRecipient();
    }

  }


  emailListRecipient() {
    this.loader.show();
    this.RFIsService.recipientEmailList().subscribe(response => {
      this.loader.hide();
      this.roleslist = response.body.role_filter;
      this.recipientEmails = response.body.recipient_emails;
      // console.log("email", this.recipientEmails);
    })
  }

  viewRender() {
    let data = {
      projectId: this.pid,
      RFI_id: this.rfi_id
    }

    this.loader.show();

    this.RFIsService.rfiRenderPDF(data).subscribe((res) => {
      if (res.status == true) {
        this.loader.hide();
        window.open(Constant.BE_URL + "RFIs/" + res.body.rfi_title + "-" + res.body.rfi_sequence_number + ".pdf")
      }
    })
  }


}
