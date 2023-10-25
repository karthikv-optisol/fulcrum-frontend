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
  status: any = [1];
  PCO: any;
  COA: any;
  COR: any;
  Options: any = ['Print All Change Orders (PCOs/CORs) As List View PDF',
    'Print Change Order Request (CORs) As List View PDF',
    'Print Potential Change Order Request (PCOs) As List View PDF'];
  priority_options: any;
  types_options: any;
  initiator_options: any;
  signator_options: any;
  cost_codes_options: any;
  limitDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  windowWidth = window.innerWidth + 'px';
  windowHeight = window.outerHeight - (window.outerHeight * .25) + 'px';
  IMAGE_URL: any = Constant.IMAGE_URL;

  co_title: any;
  co_plan_page_reference: any;
  co_statement: any;
  co_delay_days: any;
  change_order_status_id: any;
  change_order_priority_id: any;
  co_initiator_id: any;
  co_recipient_id: any;
  co_signator_id: any;
  co_order_number: any;
  co_file_manager_file_id: any;
  co_description: any;
  co_completion_date: any;
  co_cost_code_id: any;
  file_array: any = [];
  efile_array: any = [];
  attachment_id: any;
  orderForm: FormGroup;

  cost_code_form1: any = [{
    'cost_code': '',
    'descr': '',
    'sub': '',
    'ref': '',
    'cost_in': ''
  }]
  cost_code_form2: any = [{
    'cost_code': '',
    'descr': '',
    'sub': '',
    'OR': '',
    'cost_in': ''
  }]


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
      co_title: this.fb.control('',Validators.required),
      co_plan_page_reference: this.fb.control('',Validators.required),
      co_statement: this.fb.control('',Validators.required),
      co_delay_days: this.fb.control('',Validators.required),
      change_order_type_id: this.fb.control(null,Validators.required),
      change_order_status_id: this.fb.control(null,Validators.required),
      change_order_priority_id: this.fb.control(null,Validators.required),
      co_initiator_id: this.fb.control(null,Validators.required),
      co_recipient_id: this.fb.control(null,Validators.required),
      co_signator_id: this.fb.control(null,Validators.required),
      co_order_number: this.fb.control('',Validators.required),
      co_file_manager_file_id: this.fb.control('',Validators.required),
      co_description: this.fb.control('',Validators.required),
      co_completion_date: this.fb.control('',Validators.required),
      co_sub_total: this.fb.control('',Validators.required),
      co_total: this.fb.control('',Validators.required),
      costcode: this.fb.array([this.initCostCode1()]),
      other_code: this.fb.array([this.initCostCode2()])
    })
  }


  initCostCode1() {
    return this.fb.group({
      cost_code: this.fb.control('',[]),
      desc: this.fb.control('',[]),
      sub: this.fb.control('',[]),
      ref: this.fb.control('',[]),
      total: this.fb.control('',[])
    });
  }

  initCostCode2() {
    return this.fb.group({
      cost_code: this.fb.control('',[]),
      desc: this.fb.control('',[]),
      sub: this.fb.control('',[]),
      ref: this.fb.control('',[]),
      total: this.fb.control('',[]),
    });
  }

  get costcode(): FormArray
  {
    return this.orderForm.controls.costcode as FormArray;
  }

  get other_code(): FormArray
  {
    return this.orderForm.controls.other_code as FormArray;
  }

  addForm1() {

    console.log("addform1", this.cost_code_form1);

    const control = <FormArray>this.orderForm.controls['costcode'];
    control.push(this.initCostCode1());

    // let array = {
    //   'cost_code': '',
    //   'descr': '',
    //   'sub': '',
    //   'ref': '',
    //   'cost_in': ''
    // };
    // this.cost_code_form1.push(array);
    // console.log("addform1",this.cost_code_form1);
  }


  delForm1(i: any) {
    const control = <FormArray>this.orderForm.controls['costcode'];
    control.removeAt(i);
    // console.log("delForm1",this.cost_code_form1);
    // this.cost_code_form1.pop(i);
    // console.log("delForm1",this.cost_code_form1);

  }

  addForm2() {

    const control = <FormArray>this.orderForm.controls['other_code'];
    control.push(this.initCostCode2());
    // other_code
    // let array = {
    //   'cost_code': '',
    //   'descr': '',
    //   'sub': '',
    //   'ref': '',
    //   'cost_in': ''
    // };

    // console.log("addform2", this.cost_code_form2);

    // this.cost_code_form2.push(array);
  }

  delForm2(i: any) {
    const control = <FormArray>this.orderForm.controls['other_code'];
    control.removeAt(i);

    // console.log("delForm2", this.cost_code_form2);
    // this.cost_code_form2.pop(i);
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
      this.status = [1, 3];
    }
    else {
      this.status = [1];
    }
    this.getCOR();
  }
  getCOR() {
    let data = {
      projectId: this.pid,
      status: this.status
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
      status: this.status
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
    this.modalService.open(newCOR, ngbModalOptions);
  }

  subTotal()
  {
    let sub_total:any = 0;

    console.log("tested1",this.orderForm.value);

     this.orderForm.value.costcode.map((val,k)=>{
          sub_total = parseFloat(sub_total)+parseFloat(val.total)
     })

     console.log("tested2",sub_total);
  }

  get change_order_type_id()
  {
    return this.orderForm.get('change_order_type_id');
  }

 

  handleSubmit(event: any) {
    console.log("tested", this.orderForm.value);
    let forms = this.orderForm.value;

    let data = {
      projectId: this.pid,
      contracting_entity_id: 4,
      co_type_prefix: "",
      co_delay_days: forms.co_delay_days,
      co_gentotal: "0.00",
      co_buildtotal: "0.00",
      co_insuranceper: 0,
      co_insurancetotal: "0.00",
      co_total: forms.co_total,
      change_order_type_id: forms.change_order_type_id,
      change_order_status_id: 1,
      change_order_priority_id: forms.change_order_priority_id,
      co_file_manager_file_id: forms.co_file_manager_file_id,
      co_cost_code_id: forms.co_cost_code_id,
      co_recipient_contact_id: forms.co_recipient_id,
      co_initiator_contact_id: forms.co_initiator_id,
      co_signator_contact_id: forms.co_signator_id,
      co_title: forms.co_title,
      co_plan_page_reference: forms.co_plan_page_reference,
      co_statement: forms.co_completion_date,
      co_revised_project_completion_date: forms.co_completion_date,
      costcodes: forms.costcode,
      other_code: forms.other_code
    }

    this.OwnerService.createCOR(data).subscribe((res) => {
      console.log("Res", res);
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
      let files = event.target.files;
      let filesArray: any = [];

      for (let i = 0; i < files.length; i++) {
        formData.append("files[" + [i] + "]", files[i]);
      }

      this.OwnerService.getCORAttachments(formData).subscribe((data) => {
        console.log("data", data);
        if (data.status == true) {
          this.file_array = data.body.original.data
          data.body.original && data.body.original.data.map((element: any) => {
            this.attachment_id.push(element.id);
          })
          this.loader.hide();
        }
      });
    }
    return;
  }
}
