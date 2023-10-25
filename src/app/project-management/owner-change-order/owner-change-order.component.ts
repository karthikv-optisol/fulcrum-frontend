import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'src/app/services/toaster.service';
import * as Constant from '../../constant/constant';
import { OwnerChangeOrderService } from 'src/app/services/owner-change-order.services';
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-owner-change-order',
  templateUrl: './owner-change-order.component.html',
  styleUrls: ['./owner-change-order.component.scss'],
  // changeDetection: ChangeDetectionStrategy.Default
})
export class OwnerChangeOrderComponent implements OnInit {

  pid: any;
  cor_status: any = [1];
  pco_status: any = [1, 2];
  co_status: any;
  approved_date: any;
  submitted_date: any;
  PCO: any;
  COA: any;
  COR: any;
  completion_date:any;
  Options: any = [
    { 'id': 1, 'value': 'Print All Change Orders (PCOs/CORs) As List View PDF' },
    { 'id': 2, 'value': 'Print Change Order Request (CORs) As List View PDF' },
    { 'id': 3, 'value': 'Print Potential Change Order Request (PCOs) As List View PDF' }
  ];
  selectOptions: any;
  priority_options: any;
  types_options: any;
  initiator_options: any;
  signator_options: any;
  cost_codes_options: any;
  limitDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  windowWidth = window.innerWidth + 'px';
  windowHeight = window.outerHeight - (window.outerHeight * .25) + 'px';
  IMAGE_URL: any = Constant.IMAGE_URL;
  cid: any;

  file_array: any = [];
  efile_array: any = [];
  attachment_id: any;
  orderForm: FormGroup;
  isValidFormSubmitted = null;


  constructor(private route: ActivatedRoute, private OwnerService: OwnerChangeOrderService, private loader: LoaderService, public modalService: NgbModal, private toaster: ToasterService, private ref: ChangeDetectorRef, private fb: FormBuilder) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
    });
  }

  ngOnInit(): void {

    document.title = 'Change Orders - MyFulcrum.com'

    this.getCOR();
    this.getCOROptions();

    this.orderForm = this.fb.group({
      co_title: this.fb.control('', Validators.required),
      co_plan_page_reference: this.fb.control(''),
      co_statement: this.fb.control(''),
      co_delay_days: this.fb.control(''),
      change_order_type_id: this.fb.control(null, Validators.required),
      change_order_status_id: this.fb.control(null),
      change_order_priority_id: this.fb.control(null),
      co_initiator_id: this.fb.control(null),
      co_recipient_id: this.fb.control(null, Validators.required),
      co_signator_id: this.fb.control(null),
      co_custom_sequence_number: this.fb.control(''),
      co_file_manager_file_id: this.fb.control([]),
      co_description: this.fb.control(''),
      co_completion_date: this.fb.control(''),
      co_sub_total: this.fb.control(''),
      co_total: this.fb.control(''),
      co_approved_date: this.fb.control(''),
      co_submitted_date: this.fb.control(''),
      costcode: this.fb.array([this.initCostCode1()]),
      other_code: this.fb.array([this.initCostCode2()])
    })
  }


  initCostCode1() {
    return this.fb.group({
      cost_code: this.fb.control('9', Validators.required),
      desc: this.fb.control('', Validators.required),
      sub: this.fb.control(''),
      ref: this.fb.control(''),
      total: this.fb.control(''),
      cc_id: this.fb.control('')
    });
  }

  initCostCode2() {
    return this.fb.group({
      cost_code: this.fb.control('3'),
      desc: this.fb.control(''),
      percentage: this.fb.control(''),
      ref: this.fb.control(''),
      total: this.fb.control(''),
      cc_id: this.fb.control('')
    });
  }


  get change_order_type_id() {
    return this.orderForm.get('change_order_type_id');
  }

  get co_sub_total() {
    return this.orderForm.get('co_sub_total');
  }

  get co_title() {
    return this.orderForm.get('co_title');
  }

  get co_recipient_id() {
    return this.orderForm.get('co_recipient_id');
  }

  get change_order_status_id() {
    return this.orderForm.get('change_order_status_id');
  }


  get costcode(): FormArray {
    return this.orderForm.controls.costcode as FormArray;
  }



  get cost_code() {
    return this.orderForm.controls.costcode.value.cost_code;
  }

  get desc() {
    return this.orderForm.controls.costcode.value.desc;
  }

  get other_code(): FormArray {
    return this.orderForm.controls.other_code as FormArray;
  }

  addForm1() {
    const control = <FormArray>this.orderForm.controls['costcode'];
    control.push(this.initCostCode1());
  }


  delForm1(i: any, data: any) {
    const control = <FormArray>this.orderForm.controls['costcode'];
    control.removeAt(i);

    let id = data.value.cc_id;

    if (id) {
      let costdata = {
        projectId: this.pid,
        cc_id: id,
        type: 1
      }
      this.OwnerService.ChangeCostCodeRemove(costdata).subscribe((res) => {
        if (res.status == true) {

        }
      });
    }


    this.subTotal();
  }

  addForm2() {
    const control = <FormArray>this.orderForm.controls['other_code'];
    control.push(this.initCostCode2());
  }

  delForm2(i: any, data: any) {
    const control = <FormArray>this.orderForm.controls['other_code'];
    control.removeAt(i);

    let id = data.value.cc_id;

    if (id) {
      let otherdata = {
        projectId: this.pid,
        cc_id: id,
        type: 2
      }

      this.OwnerService.ChangeCostCodeRemove(otherdata).subscribe((res) => {
        if (res.status == true) {

        }
      });
    }


    this.subTotal();
  }

  validateNo(e): boolean {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }



  form1change(data) {
    console.log("data", data);
  }

  form2change(data) {
    console.log("data2", data);
  }

  changeStatus(event: any) {
    let eve = event.target.checked;
    if (eve) {
      this.cor_status = [1, 3];
      this.pco_status = [1, 2, 3];
    }
    else {
      this.cor_status = [1];
      this.pco_status = [1, 2];
    }
    this.getCOR();
  }
  getCOR() {
    let data = {
      projectId: this.pid,
      cor_status: this.cor_status,
      pco_status: this.pco_status
    }
    this.loader.show();
    this.OwnerService.getCORdata(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.PCO) {
          this.PCO = res.body.PCO;
        }
        if (res.body.ACO) {
          this.COA = res.body.ACO;
        }
        if (res.body.COR) {
          this.COR = res.body.COR;
        }
        this.loader.hide();
      }
    })
  }

  getCOROptions() {
    let data = {
      projectId: this.pid,
      cor_status: this.cor_status,
      pco_status: this.pco_status
    }
    this.loader.show();
    this.OwnerService.getCOROptions(data).subscribe((res) => {
      if (res.status == true) {
        if (res.body.types) {
          this.types_options = res.body.types
        }
        if (res.body.priority) {
          this.priority_options = res.body.priority
        }
        if (res.body.cost_codes) {
          this.cost_codes_options = res.body.cost_codes
        }
        if (res.body.initiator) {
          this.initiator_options = res.body.initiator
        }
        if (res.body.signator) {
          this.signator_options = res.body.signator
        }
      }
    })
  }

  createCOR(newCOR) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    this.orderForm.controls.co_title.setValue('');
    this.orderForm.controls.change_order_type_id.setValue(null);
    this.orderForm.controls.co_plan_page_reference.setValue(null);
    this.orderForm.controls.co_description.setValue('');
    this.orderForm.controls.change_order_status_id.setValue(null);
    this.orderForm.controls.change_order_priority_id.setValue(null);
    this.orderForm.controls.co_initiator_id.setValue(null);
    this.orderForm.controls.co_recipient_id.setValue(null);
    this.orderForm.controls.co_signator_id.setValue(null);
    this.orderForm.controls.co_custom_sequence_number.setValue('');
    this.orderForm.controls.co_delay_days.setValue('');
    this.orderForm.controls.co_custom_sequence_number.setValue('');
    this.orderForm.controls.co_total.setValue('');
    this.orderForm.controls.co_sub_total.setValue('');
    this.orderForm.controls.co_completion_date.setValue('')

    this.orderForm.controls.costcode.patchValue(['']);
    this.orderForm.controls.other_code.patchValue(['']);
    const control1 = <FormArray>this.orderForm.controls['costcode'];
    control1.clear();
    this.addForm1();
    const control2 = <FormArray>this.orderForm.controls['other_code'];
    control2.clear();
    this.addForm2();
    this.co_status = "";
    this.cid = "";
    this.efile_array = [];
    this.file_array = [];

    this.modalService.open(newCOR, ngbModalOptions);
  }

  editCOR(newCOR, data) {

    this.cid = data.id;

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };

    let resdata = {
      cid: data.id,
      projectId: this.pid
    }


    this.loader.show()

    this.co_status = data.change_order_status_id;
    this.orderForm.controls.co_title.setValue(data.co_title);
    this.orderForm.controls.co_plan_page_reference.setValue(data.co_plan_page_reference);
    this.orderForm.controls.co_description.setValue(data.co_statement);
    this.orderForm.controls.change_order_type_id.setValue(data.change_order_type_id);
    this.orderForm.controls.change_order_priority_id.setValue(data.change_order_priority_id);
    this.orderForm.controls.co_initiator_id.setValue(data.co_initiator_id);
    this.orderForm.controls.co_recipient_id.setValue(data.co_recipient_id);
    this.orderForm.controls.co_custom_sequence_number.setValue(data.co_custom_sequence_number);
    this.orderForm.controls.co_signator_id.setValue(data.co_signator_contact_id);
    this.orderForm.controls.co_recipient_id.setValue(data.co_recipient_contact_id);
    this.orderForm.controls.co_initiator_id.setValue(data.co_initiator_contact_id);
    this.orderForm.controls.co_delay_days.setValue(data.co_delay_days);
    this.orderForm.controls.co_custom_sequence_number.setValue(data.co_custom_sequence_number);
    this.orderForm.controls.co_total.setValue(data.co_total);
    this.orderForm.controls.co_sub_total.setValue(data.co_subtotal);
    this.orderForm.controls.co_completion_date.setValue(data.co_revised_project_completion_date)
    
    this.orderForm.controls.change_order_status_id.setValue(data.change_order_status_id);
    this.orderForm.controls.co_approved_date.setValue(data.co_approved_date);
    this.orderForm.controls.co_submitted_date.setValue(data.co_submitted_date);
    
    this.submitted_date = data.co_submitted_date;
    this.approved_date = data.co_approved_date;
    this.completion_date = data.co_revised_project_completion_date
    if (data.co_attachments) {
      this.efile_array = data.co_attachments;
    }

    if (data.co_breaks && data.co_breaks.length > 0) {
      let costcode: any = [];
      const control1: any = <FormArray>this.orderForm.controls['costcode'];
      control1.clear();
      data.co_breaks.forEach((element: any, i: number) => {
        if (data.co_breaks.length >= i) {
          costcode = this.fb.group({
            cost_code: this.fb.control(parseInt(element.cost_code_reference_id)),
            desc: this.fb.control(element.description),
            sub: this.fb.control(element.Sub),
            ref: this.fb.control(element.reference),
            total: this.fb.control(element.cost),
            cc_id: this.fb.control(element.id)
          })
          control1.push(costcode);
        }

      });
    }
    else {
      const control1: any = <FormArray>this.orderForm.controls['costcode'];
      control1.clear();
      this.addForm1();
    }

    if (data.other_code && data.other_code.length > 0) {
      let othercode: any = [];
      const control2: any = <FormArray>this.orderForm.controls['other_code'];
      control2.clear();
      data.other_code.forEach((element: any, i: number) => {
        if (data.co_breaks.length >= i) {
          othercode = this.fb.group({
            cost_code: this.fb.control(parseInt(element.cost_code)),
            desc: this.fb.control(element.content),
            percentage: this.fb.control(element.percentage),
            total: this.fb.control(element.cost),
            cc_id: this.fb.control(element.id)
          })
          control2.push(othercode);
        }
      });
    }
    else {
      const control2: any = <FormArray>this.orderForm.controls['other_code'];
      control2.clear();
      this.addForm2();
    }

    this.modalService.open(newCOR, ngbModalOptions);

    this.loader.hide();


  }



  subTotal() {
    let sub_total: any = 0;

    this.orderForm.value.costcode.map((val, k) => {
      sub_total = parseFloat(sub_total) + parseFloat(val.total)
    })
    if (sub_total) {
      this.orderForm.controls.co_sub_total.setValue(sub_total.toFixed(2));
    }
    else {
      this.orderForm.controls.co_sub_total.setValue(sub_total);
    }

    let other_array = this.orderForm.value.other_code;
    const control = <FormArray>this.orderForm.controls['other_code'];
    let othercode: any = [];

    let overTotal: any = 0;
    if (other_array.length > 0) {

      control.clear();

      other_array.forEach((element: any, index) => {

        let subTotal = parseFloat(sub_total) * (element.percentage / 100);

        overTotal = overTotal + subTotal;

        othercode = this.fb.group({
          cost_code: this.fb.control(parseInt(element.cost_code)),
          desc: this.fb.control(element.desc),
          percentage: this.fb.control(element.percentage),
          total: this.fb.control(subTotal),
          cc_id: this.fb.control(element.id)
        })
        control.push(othercode);

      });




      let sumTotal: any = parseFloat(this.orderForm.value.co_sub_total) + parseFloat(overTotal)

      console.log("sum", sumTotal);

      this.orderForm.controls.co_total.setValue(sumTotal);

    }

  }

  overTotal(index: any = '') {

    let other_array: any = this.orderForm.value.other_code;

    if (index || other_array[index].percentage) {
      this.costAmount(index, false);
    }

    let co_total: any = this.orderForm.controls.co_sub_total.value;

    this.orderForm.value.other_code.map((val, k) => {
      co_total = parseFloat(co_total) + parseFloat(val.total)
    })

    if (co_total) {
      this.orderForm.controls.co_total.setValue(co_total.toFixed(2));
    }

  }

  costAmount(i, call: boolean = true) {

    let other_array = this.orderForm.value.other_code;

    let value: any = other_array[i].percentage / 100;


    let cost_subtotal: any = this.orderForm.controls.co_sub_total.value;

    other_array[i].total = parseFloat(cost_subtotal) * parseFloat(value)

    const control = <FormArray>this.orderForm.controls['other_code'];

    // control.push(this.initCostCode1());
    let othercode = this.fb.group({
      cost_code: this.fb.control(parseInt(other_array[i].cost_code)),
      desc: this.fb.control(other_array[i].desc),
      percentage: this.fb.control(other_array[i].percentage),
      total: this.fb.control(other_array[i].total.toFixed(2)),
      cc_id: this.fb.control(other_array[i].id)
    })
    control.removeAt(i);
    control.push(othercode);

    if (call) {
      this.overTotal(i);
    }

  }

  handleSubmit(event: any) {

    this.isValidFormSubmitted = false;

    let forms = this.orderForm.value;

    console.log("forms", this.orderForm);

    if (!forms.co_title) {
      return;
    }

    this.isValidFormSubmitted = true;

    this.loader.show();

    let data: any = {
      projectId: this.pid,
      contracting_entity_id: 4,
      co_type_prefix: "",
      co_delay_days: forms.co_delay_days,
      co_gentotal: "0.00",
      co_buildtotal: "0.00",
      co_insuranceper: 0,
      co_insurancetotal: "0.00",
      co_total: forms.co_total,
      co_sub_total: forms.co_sub_total,
      change_order_type_id: forms.change_order_type_id,
      change_order_status_id: 1,
      change_order_priority_id: forms.change_order_priority_id,
      co_file_manager_file_id: this.attachment_id,
      co_custom_sequence_number: forms.co_custom_sequence_number,
      co_cost_code_id: forms.co_cost_code_id,
      co_recipient_contact_id: forms.co_recipient_id,
      co_initiator_contact_id: forms.co_initiator_id,
      co_signator_contact_id: forms.co_signator_id,
      co_title: forms.co_title,
      co_plan_page_reference: forms.co_plan_page_reference,
      co_statement: forms.co_description,
      co_revised_project_completion_date: this.dateFormat(forms.co_completion_date),
      costcode: forms.costcode,
      other_code: forms.other_code,
      co_approved_date: this.dateFormat(forms.co_approved_date),
      co_submitted_date: this.dateFormat(forms.co_submitted_date)
    }


    if (this.cid) {

      data.cid = this.cid;
      data.change_order_status_id = forms.change_order_status_id;
      this.OwnerService.updateCOR(data).subscribe((res) => {
        if (res.status == true) {
          if (res.body.original.status == true) {
            this.toaster.showSuccessToaster(res.body.original.Message, '')
            this.modalService.dismissAll('Data created successfully');
            this.file_array = [];
            this.getCOR();
          }
        }
      })
    }
    else {
      this.OwnerService.createCOR(data).subscribe((res) => {
        if (res.status == true) {
          if (res.body.original.status == true) {
            this.toaster.showSuccessToaster(res.body.original.Message, '')
            this.modalService.dismissAll('Data updated successfully');
            this.file_array = [];
            this.getCOR();
          }
        }
      })
    }

  }

  removeAttachment(i) {
    this.file_array.splice(i, 1);
  }

  dateChange(date: any) {
    return date.month + "/" + date.day + "/" + date.year
  }

  dateFormat(date) {

    date = date.year + "-" + date.month + "-" + date.day;
    return date;
    // return date.split(format).reverse().join("/");
  }

  CORrenderPDF() {

    this.loader.show();

    let data: any = {
      projectId: this.pid
    }
    if (this.selectOptions == 3) {
      data.status = this.pco_status;
      data.type = 1;
    }
    if (this.selectOptions == 2) {
      data.status = this.cor_status;
      data.type = 2;
    }
    if (this.selectOptions == 1) {
      data.status = [1, 2, 3];
      data.type = 3;
    }


    this.OwnerService.renderPDF(data).subscribe((res) => {
      this.loader.hide();
      if (res.status == true) {
        window.open(res.data, '_blank')
      }

    })
  }

  viewPdf() {
    let data = {
      projectId: this.pid,
      cid: this.cid
    }

    this.loader.show();

    this.OwnerService.viewPDF(data).subscribe((res) => {
      this.loader.hide();
      if (res.status == true) {
        window.open(res.data, '_blank')
        this.loader.hide();
      }

    })
  }

  fileUpload(event: any) {

    if (event) {
      this.loader.show();
      let formData = new FormData();
      formData.append("projectId", this.pid);
      formData.append("cloud_vendor", "Fulcrum");
      formData.append("directly_deleted_flag", "N");
      formData.append("deleted_flag", "N");
      formData.append("version_number", "1");
      formData.append("methodCall","chanage_order_attachments");
      let files = event.target.files;

      let filesArray: any = [];

      for (let i = 0; i < files.length; i++) {
        formData.append("files[" + [i] + "]", files[i]);
      }

      this.OwnerService.setCORAttachments(formData).subscribe((data) => {
        if (data.status == true) {
          this.file_array = data.body.original.data
          let id: any = [];
          data.body.original && data.body.original.data.map((element: any) => {
            id.push(element.file_manager_file_id);
          })
          this.attachment_id = id;
          this.loader.hide();
        }
      });
    }
    return;
  }

  removeCORfiles(file) {
    let data = {
      projectId: this.pid,
      file_id: file.co_attachment_file_manager_file_id,
      cc_id: file.change_order_id
    }


    let efile_array = this.efile_array.filter((value) => value.co_attachment_file_manager_file_id != file.co_attachment_file_manager_file_id)

    console.log("efile_array", efile_array);

    this.efile_array = efile_array;

    this.OwnerService.CORAttachmentsRemove(data).subscribe((res) => {
      if (res.status == true) {

      }
    })
  }

}
