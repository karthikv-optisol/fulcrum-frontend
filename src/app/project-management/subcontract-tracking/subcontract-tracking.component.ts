import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { SubcontractTrackingService } from 'src/app/services/subcontract-tracking.service';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../constant/constant';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-subcontract-tracking',
  templateUrl: './subcontract-tracking.component.html',
  styleUrls: ['./subcontract-tracking.component.scss']
})
export class SubcontractTrackingComponent implements OnInit {

  pid: any;
  trackingData: any;
  tableheader: any;
  tablecount: any;
  selectHeader: any;
  fileAttachment: any = [];
  car_insurance: any;
  city_license: any;
  general_insurance: any;
  worker_license: any;
  divnumber: any;
  costcode: any;
  costcode_description: any;
  business_insurance_date: any;
  gl_insurance_date: any;
  wc_insurance_date: any;
  auto_insurance_date: any;
  worker_file_id: any;
  general_insurance_file_id: any;
  car_insurance_file_id: any;
  city_license_file_id: any;
  URL = Constant.IMAGE_URL;
  subcontract_id: any;
  template_id: any;
  gen_con: any;
  gen_con_data: any;
  subcontract_mailed_date: any;
  tracksData: any;
  prelimsData: any;
  notesData: any
  additionDocs: any;
  documents: any;
  subcontract_note: any;
  windowWidth = window.innerWidth - (window.innerWidth * .2) + 'px';
  supplier: any;
  amount: any;
  release_date: any = '';
  receive_date: any = '';
  prelims_id: any;
  add_files_id: any;
  pre_files: any;
  pre_files_data: any;
  gc_budget_id: any;
  formSubmitted: boolean;
  additional_doc_id: any;
  userEmail: any;
  userProject: any;

  @ViewChild("subcontractTracking") subcontractTracking: ElementRef;

  constructor(private route: ActivatedRoute, private SubContractService: SubcontractTrackingService, private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });

    let decode = JSON.parse(localStorage.getItem("users"));

    this.userEmail = decode.email;
    this.userProject = decode.currentlySelectedProjectName;

    console.log("decode", decode.email);
  }

  headers: any = ['code', 'name', 'company', 'amount', 'Mailed', 'GenCon']
  headers2: any = ['Target', 'Executed', 'SNDBCK Executed', 'CSLB LIC', 'CSLS EXP', 'GL INS', 'GL INS EXP', 'WC INS', 'WC INS EXP', 'Auto INS', 'Auto INS EXP', 'BUS LIC', 'BUS LIC EXP', 'NTCE'
  ];
  dropdown: any = ['code', 'name', 'company', 'amount', 'Mailed', 'GenCon'];

  ngOnInit(): void {
    document.title = "Subcontract Tracking";

    this.trackingList();
    this.trackingHeaders();
  }

  trackingList() {
    let data = {
      projectId: this.pid
    }

    this.SubContractService.subContractTrackList(data).subscribe((res) => {
      if (res.status == true) {
        // console.log("response",res);
        this.trackingData = res.body;

      }
    })
  }

  trackingHeaders() {
    // subContractTrackheaders
    let data = {
      projectId: this.pid
    }

    this.SubContractService.subContractTrackheaders(data).subscribe((res) => {
      if (res.status == true) {
        // console.log("response",res);
        // console.log("response",res.body)
        this.tableheader = res.body.original.data;
        this.tablecount = res.body.original.count;
      }
    })
  }

  handleChanges(trackdata: any) {
    // console.log("license",this.subcontract_mailed_date);
    let data: any = {
      projectId: this.pid,
      subcontract_id: trackdata.subcontract_id
    }

    if (trackdata.subcontract_mailed_date) {
      if (trackdata.subcontract_mailed_date.year) {

        trackdata.subcontract_mailed_date = trackdata.subcontract_mailed_date.year + "-" + trackdata.subcontract_mailed_date.month + "-" + trackdata.subcontract_mailed_date.day
      }
      data.subcontract_mailed_date = trackdata.subcontract_mailed_date;
    }

    if (this.gen_con) {
      data.gen_con = this.gen_con;
      data.signed_id = trackdata.signed_subcontract_file_manager_file_id
    }

    // license_expiry

    if (trackdata.license_expiry) {
      if (trackdata.license_expiry.year) {

        trackdata.license_expiry = trackdata.license_expiry.year + "-" + trackdata.license_expiry.month + "-" + trackdata.license_expiry.day
      }
      data.license_expiry = trackdata.license_expiry;
      data.company_id = trackdata.vendor_contact_company_id
    }

    if (trackdata.license_number) {
      data.license_number = trackdata.license_number;
      data.company_id = trackdata.vendor_contact_company_id
    }

    // subcontract_execution_date
    if (trackdata.subcontract_execution_date) {
      if (trackdata.subcontract_execution_date.year) {

        trackdata.subcontract_execution_date = trackdata.subcontract_execution_date.year + "-" + trackdata.subcontract_execution_date.month + "-" + trackdata.subcontract_execution_date.day
      }
      console.log("trackdata.subcontract_execution_date", trackdata.subcontract_execution_date)
      data.subcontract_execution_date = trackdata.subcontract_execution_date;
    }

    // subcontract_target_execution_date
    if (trackdata.subcontract_target_execution_date) {
      if (trackdata.subcontract_target_execution_date.year) {

        trackdata.subcontract_target_execution_date = trackdata.subcontract_target_execution_date.year + "-" + trackdata.subcontract_target_execution_date.month + "-" + trackdata.subcontract_target_execution_date.day
      }
      data.subcontract_target_execution_date = trackdata.subcontract_target_execution_date;
    }

    this.loader.show();

    this.SubContractService.subContractUpdate(data).subscribe((res) => {
      if (res.status == true) {
        this.trackingList();
        this.modalService.dismissAll('data updated');
        this.toaster.showSuccessToaster(res.body.original.Message, '');
        this.loader.hide();
      }
    })


  }

  handleInsurance() {

    this.loader.show();
    if (this.business_insurance_date && this.business_insurance_date.year) {
      this.business_insurance_date = this.dateChange(this.business_insurance_date)
    }
    if (this.gl_insurance_date && this.gl_insurance_date.year) {
      this.gl_insurance_date = this.dateChange(this.gl_insurance_date)
    }
    if (this.wc_insurance_date && this.wc_insurance_date.year) {
      this.wc_insurance_date = this.dateChange(this.wc_insurance_date)
    }
    if (this.auto_insurance_date && this.auto_insurance_date.year) {
      this.auto_insurance_date = this.dateChange(this.auto_insurance_date)
    }
    let data: any = {
      projectId: this.pid,
      subcontract_id: this.subcontract_id,
      business_insurance_date: this.dateFormat(this.business_insurance_date, "/"),
      auto_insurance_date: this.dateFormat(this.auto_insurance_date, "/"),
      wc_insurance_date: this.dateFormat(this.wc_insurance_date, "/"),
      gl_insurance_date: this.dateFormat(this.gl_insurance_date, "/")
    }

    if (this.general_insurance_file_id) {
      data.general_insurance_file_id = this.general_insurance_file_id;
    }

    if (this.worker_file_id) {
      data.worker_file_id = this.worker_file_id;
    }

    if (this.car_insurance_file_id) {
      data.car_insurance_file_id = this.car_insurance_file_id
    }

    if (this.city_license_file_id) {
      data.city_license_file_id = this.city_license_file_id;
    }

    this.SubContractService.subContractUpdate(data).subscribe((res) => {
      if (res.status == true) {
        console.log("data");
        this.trackingList();
        this.modalService.dismissAll('data updated');
        this.loader.hide();
      }
    })
  }


  dateChange(date: any) {
    return date.month + "/" + date.day + "/" + date.year
  }

  dateFormat(date, format) {
    let data = date.split(format);
    data = data[2] + "/" + data[0] + "/" + data[1];
    return data;
    // return date.split(format).reverse().join("/");
  }

  loadDialog(editDialog, trackdata) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    // this.rfi_title = 'testing';

    this.tracksData = trackdata;


    this.loader.show();
    let data = {
      subcontract_id: trackdata.subcontract_id,
      projectId: this.pid
    }

    this.SubContractService.subContractDocument(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.original.status == "ok") {
          console.log("res.body.original.data;", res.body.original.data);
          if (res.body.original.data && res.body.original.data.car_insurance) {
            this.car_insurance = res.body.original.data.car_insurance[0];
          }
          else {
            this.car_insurance = [];
          }
          if (res.body.original.data && res.body.original.data.worker_license) {
            this.worker_license = res.body.original.data.worker_license[0];
          }
          else {
            this.worker_license = [];
          }
          if (res.body.original.data && res.body.original.data.general_insurance) {
            this.general_insurance = res.body.original.data.general_insurance[0];
          }
          else {
            this.general_insurance = [];
          }
          if (res.body.original.data && res.body.original.data.city_license) {
            this.city_license = res.body.original.data.city_license[0];
          }
          else {
            this.city_license = [];
          }
          if (res.body.original.data && res.body.original.data.signed_id) {
            this.gen_con_data = res.body.original.data.signed_id[0];
          }
          else {
            this.gen_con_data = [];
          }

        }
        if (res.body.original.status == "error") {
          this.car_insurance = [];
          this.worker_license = [];
          this.city_license = [];
          this.general_insurance = [];
          this.gen_con_data = [];
        }
        this.loader.hide();
        this.modalService.open(editDialog, ngbModalOptions);
        this.costcode = trackdata.costcode.cost_code
        this.divnumber = trackdata.costcode.division_number
        this.costcode_description = trackdata.costcode.cost_code_description
        this.gl_insurance_date = this.dateFormat(trackdata.general_insurance_date_expiry, "-");
        this.wc_insurance_date = this.dateFormat(trackdata.worker_date_expiry, "-");
        this.auto_insurance_date = this.dateFormat(trackdata.car_insurance_date_expiry, "-");
        this.business_insurance_date = this.dateFormat(trackdata.city_license_date_expiry, "-");
        this.subcontract_id = trackdata.subcontract_id
      }

    })


  }

  exportExcel() {
    let data: any = {
      projectId: this.pid,
      headers: this.selectHeader
    }
    this.loader.show();
    if (!this.selectHeader) {
      this.toaster.showFailToaster("Please atleast select three headers options for export excel", "")
      this.loader.hide();
      return;
    }

    if (this.selectHeader.length > 16) {
      this.toaster.showFailToaster("Please select the less than or equal to 15 columns", "")
      this.loader.hide();
      return;
    }

    this.SubContractService.exportSubcontractExcel(data).subscribe((res) => {
      if (res.status == true) {
        this.loader.hide();
        window.open(res.data,'self')
      }
    })
  }


  exportPDF() {

    let data: any = {
      projectId: this.pid,
      headers: this.selectHeader
    }
    this.loader.show();
    if (!this.selectHeader) {
      this.toaster.showFailToaster("Please atleast select three headers options for export pdf", "")
      this.loader.hide();
      return;
    }

    if (this.selectHeader.length > 16) {
      this.toaster.showFailToaster("Please select the less than or equal to 15 columns", "")
      this.loader.hide();
      return;
    }

    this.SubContractService.exportSubcontractPDF(data).subscribe((res) => {
      if (res.status == true) {
        console.log("res", this.URL + res.data);
        this.loader.hide();
        window.open(this.URL + res.data)
      }
    })
  }

  loadSubContractTemplate(editDialog, trackdata) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    this.subcontract_id = trackdata.subcontract_id;

    this.gc_budget_id = trackdata.gc_budget_id

    this.tracksData = trackdata;


    this.loader.show();

    let template_id = [];

    if (trackdata.resignDate && trackdata.resignDate.length > 0) {
      trackdata.resignDate.map((element, index) => {
        // console.log("element",element.id);
        template_id.push(element.id);
      })
    }

    this.template_id = template_id;

    this.modalService.open(editDialog, ngbModalOptions);
    this.costcode = trackdata.costcode.cost_code
    this.divnumber = trackdata.costcode.division_number
    this.costcode_description = trackdata.costcode.cost_code_description
    this.getPrelimsNotes();

  }

  loadPrelimsDialog(prelimsbox, data: any = '') {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.formSubmitted = false;
    if (data) {
      this.supplier = data.supplier;
      this.amount = data.amount;
      this.receive_date = data.received_date;
      this.release_date = data.released_date;
      this.prelims_id = data.id;
      this.add_files_id = data.additional_doc_id;
      this.pre_files = data.attachment_file_manager_file_id;
      if (data.virtual) {
        this.pre_files_data = data.virtual[0];
      }
      else {
        this.pre_files_data = [];
      }

      this.modalService.open(prelimsbox, ngbModalOptions);
    }
    else {
      this.modalService.open(prelimsbox, ngbModalOptions);
      this.supplier = '';
      this.amount = '';
      this.receive_date = '';
      this.release_date = '';
      this.pre_files_data = [];
    }
  }

  deleteDialogBox(deleteBox, data) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    console.log("data", data);

    if (!data.additional_doc_id) {
      this.additional_doc_id = data.id
    }
    if (data.additional_doc_id) {
      this.additional_doc_id = data.additional_doc_id
    }

    this.modalService.open(deleteBox, ngbModalOptions);
  }

  deleteSubmit() {
    let data = {
      projectId: this.pid,
      sad_id: this.additional_doc_id
    }

    this.SubContractService.deleteAdditionalDocs(data).subscribe((res) => {
      if (res.status == true) {
        // this.modalService.dismissAll('Prelims created successfully');
        this.toaster.showSuccessToaster(res.body.original.Message, '')
        this.getPrelimsNotes();
      }
      this.formSubmitted = true;
      this.loader.hide();
    })


  }
  //create pre elims data
  createPrelims() {

    this.loader.show();
    if (this.release_date && this.release_date.year) {
      this.release_date = this.dateChange(this.release_date)

      this.release_date = this.dateFormat(this.release_date, "/")
    }
    if (this.receive_date && this.receive_date.year) {
      this.receive_date = this.dateChange(this.receive_date)

      this.receive_date = this.dateFormat(this.receive_date, "/")
    }


    if (!this.supplier || !this.amount || !this.receive_date || !this.release_date || !this.pre_files) {

      if (!this.supplier) {
        this.toaster.showFailToaster('Please fill the supplier details', '')
      }
      if (!this.amount) {
        this.toaster.showFailToaster('Please fill the amount details', '')
      }
      if (!this.receive_date) {
        this.toaster.showFailToaster('Please fill the receive date details', '')
      }
      if (!this.pre_files) {
        this.toaster.showFailToaster('Please fill the pre files', '')
      }

      return;
    }

    let data: any = {
      "subcontract_id": this.subcontract_id,
      "projectId": this.pid,
      "gc_budget_id": this.gc_budget_id,
      "supplier": this.supplier,
      "amount": this.amount,
      "release_date": this.release_date,
      "receive_date": this.receive_date,
      "pre_files": this.pre_files
    }

    if (this.prelims_id || this.add_files_id) {
      data.prelims_id = this.prelims_id;
      data.files_id = this.add_files_id;

      this.SubContractService.updateSubcontractPrelims(data).subscribe((res) => {
        if (res.status == true) {
          console.log("tested", res);
          this.getPrelimsNotes();
          // this.modalService.dismissAll('Prelims created successfully');
          this.toaster.showSuccessToaster(res.body.original.Message, '')
          this.loader.hide();
        }

      })
    }
    else {

      this.SubContractService.createSubcontractPrelims(data).subscribe((res) => {
        if (res.status == true) {
          this.getPrelimsNotes();
          this.supplier = "";
          this.amount = "";
          this.release_date = "";
          this.receive_date = "";
          this.pre_files = "";
          // this.modalService.dismissAll('Prelims created successfully');
          this.toaster.showSuccessToaster(res.body.original.Message, '')
          this.loader.hide();
        }

      })

    }


  }
  //notify dialog box
  notifydialog(notify, data) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    this.tracksData = data;
    this.subcontract_id = data.subcontract_id;
    this.modalService.open(notify, ngbModalOptions);
  }
  //notice send
  noticeSend(trackdata) {
    let data = {
      projectId: this.pid,
      subcontract_id: this.subcontract_id,
    }

    this.loader.show();
    this.SubContractService.subcontractNotify(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster(res.message, "");
      }
      this.loader.hide();
    })
  }
  //send back modal box
  sendBackModal(notify, data) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    console.log("data", data);

    this.subcontract_id = data.subcontract_id;

    this.gc_budget_id = data.gc_budget_id;

    this.modalService.open(notify, ngbModalOptions);
  }
  //send back notify
  sendBackNotify() {
    let data = {
      projectId: this.pid,
      subcontract_id: this.subcontract_id,
      gc_budget_id: this.gc_budget_id,
      mailFlag: true
    }

    this.loader.show();
    this.SubContractService.subcontractSendBack(data).subscribe((res) => {
      if (res.body.original.status == true) {
        this.toaster.showSuccessToaster(res.body.original.message, "");
        window.open(res.body.original.data);
        this.trackingList()
      }
      this.loader.hide();
    })
  }
  //modal close
  modalClose() {
    if (!this.supplier || !this.amount || !this.receive_date || !this.release_date || !this.pre_files) {
      console.log("not closed");
      return "modal.dismiss('Cross click')";
    }
    console.log("closed");
    return "modal.dismiss('Cross click')";
  }
  //get prelims notes
  getPrelimsNotes() {
    this.loader.show();
    let data: any = {
      subcontract_id: this.subcontract_id,
      projectId: this.pid
    }

    if (this.template_id && this.template_id.length > 0) {
      data.template_id = this.template_id;
    }

    this.SubContractService.subContractPreItems(data).subscribe((res) => {
      console.log("res", res)
      if (res.status == true) {
        if (res.body.original && res.body.original.status == "ok") {
          // console.log("prelims",res.body.original.data.prelims);
          console.log("documents", res.body.original.data.documents);
          this.prelimsData = res.body.original.data.prelims;
          this.notesData = res.body.original.data.notes;
          console.log("add_docs", res.body.original.data.add_docs);
          this.additionDocs = res.body.original.data.add_docs;
          this.documents = res.body.original.data.documents;
        }
        this.loader.hide();

      }

    })
  }
  //create subcontract note 
  createNote() {

    if (!this.subcontract_note) {
      this.toaster.showFailToaster('Please fill the subcontract note', '')

      return;
    }

    let data = {
      "subcontract_id": this.subcontract_id,
      "projectId": this.pid,
      "subcontract_note": this.subcontract_note
    }

    this.SubContractService.createSubcontractNotes(data).subscribe((res) => {
      if (res.status == true) {
        this.subcontract_note = "";
        this.getPrelimsNotes();
        this.toaster.showSuccessToaster(res.body.original.Message, '')
      }
    })
  }
  //file upload
  fileUpload(event: any, id: any) {
    this.loader.show();
    let formData = new FormData();
    formData.append("projectId", this.pid);
    formData.append("cloud_vendor", "Fulcrum");
    formData.append("directly_deleted_flag", "N");
    formData.append("deleted_flag", "N");
    formData.append("version_number", "1");
    formData.append("methodCall","subcontract documents");
    let files = event.target.files;
    let filesArray: any = [];

    formData.append("files[]", files[0]);

    this.SubContractService.subContractAttachment(formData).subscribe((res) => {
      console.log("data", res);
      if (res.status == true) {
        if (res.body.original.status == true) {
          if (id == 'car_insurance_file_id') {
            this.car_insurance_file_id = res.body.original.data[0].file_manager_file_id;
            this.car_insurance = res.body.original.data[0]
          }
          if (id == 'worker_file_id') {
            this.worker_file_id = res.body.original.data[0].file_manager_file_id;
            this.worker_license = res.body.original.data[0]
          }
          if (id == 'city_license_file_id') {
            this.city_license_file_id = res.body.original.data[0].file_manager_file_id;
            this.city_license = res.body.original.data[0]
          }
          if (id == 'general_insurance_file_id') {
            this.general_insurance_file_id = res.body.original.data[0].file_manager_file_id;
            this.general_insurance = res.body.original.data[0]
          }
          if (id == 'gen_con') {
            console.log('gen_con',res.body.original.data[0]);
            this.gen_con = res.body.original.data[0].file_manager_file_id;
            this.gen_con_data = res.body.original.data[0]
          }
          if (id == 'pre_files') {
            this.pre_files = res.body.original.data[0].file_manager_file_id;
            this.pre_files_data = res.body.original.data[0]
          }

          if (id == 'additional_docs') {
            this.additionDocs = res.body.original.data[0];
            this.additionalDocs(res.body.original.data[0].file_manager_file_id);
          }

          if (id == 'documents')
          {
              this.documents = res.body.original.data;
          }
          console.log(id, res.body.original.data[0].id);
          // this.fileAttachment.push(res.body.original.data);
          this.toaster.showSuccessToaster(res.body.original.Message, '')
        }
        if (res.body.original.status == "error") {
          // this.toaster.showFailToaster(res.body.original.Message, '')
          this.toaster.showFailToaster('File type not match, please upload the pdf', '')
          console.log("tested file not match");
        }
        this.loader.hide();
      }
    });
  }
  //additional docs
  additionalDocs(file_id) {
    this.loader.show();
    let data = {
      "subcontract_id": this.subcontract_id,
      "projectId": this.pid,
      "gc_budget_id": this.gc_budget_id,
      "additiona_docs": file_id,
      "type": 1
    }

    this.SubContractService.additionalSubcontractDocs(data).subscribe((res) => {
      if (res.status == true) {
        this.getPrelimsNotes();
        this.toaster.showSuccessToaster(res.body.original.Message, '');
      }
      this.loader.hide();
    })

  }

}


