import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbDate, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { timePicker } from '../../constant/timePicker';
import { MeetingsService } from 'src/app/services/meetings.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {

  public meetingTypes: any = '';

  public meetingLists: any = [];

  public selectedMeetingTypeId: any = '';

  public selectedMeetingListId: any = '';

  openSubmittal = false;

  limitDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  openRFI = false;

  fg: FormGroup;

  openSubmittalData = [];

  isBulkEdit: boolean;

  deleteCommentId: any;

  deleteActionId: any;

  Submittal_Fields: any = [];

  RFI_Fields: any = [];

  discussion_item_id: any;

  rfi_element: any;

  submittal_element: any;

  comment: any = "";

  title: any = "";

  title_description: any = "";

  openRFIData = [];

  meetingTypeForm: FormGroup;

  meetingDetailData: any = '';

  isShowDiscussion: boolean = true;

  loadMeetingDialog: any;

  createMeetingForm: FormGroup;

  timePicker: any = timePicker;

  isShowNewDiscussion: boolean = false;

  isShowAction: boolean = false;

  actionItemForm: any;

  meetingDiscussionViewData: any;

  importMeetingList: any;

  public selectedMeetingTypeName: any = [];

  public selectedMeetingListName: any = [];

  currentlySelectedProjectName: string;

  titleSubscription: Subscription;

  meetingAssigneeListData: any;

  manageMeetingLocationsForm: FormGroup;

  manageMeetingLocationsListData: any = [];

  modalTitle: string = 'Delete Dicussion Item?';

  modalQuestion: string = 'Are you sure that you want to delete the following discussion item ?';

  modalLabel: string = '“checlk”';

  modalContent: string = 'This will permanently delete the action item from this discussion item and any other discussion items it may be associated with in other meetings.';

  renderMeetingPDFDataSending : boolean;
  printMeetingPDFDataSending : boolean;
  deleteDataSending : boolean;

  pid: any;
  newDiscussionData: any;
  newMeetingIdData: any;
  importname: any;
  frmImportItems: FormGroup;
  // dialogshow:boolean = true;
  modalRef: any;
  ImportDiscussionItemsbtn: boolean = false;
  masterSelected = false;
  createmeetinginfo: any;
  toggleAll: boolean = false;
  toggleMain: boolean = false;
  // csvMeetingAttendees: any = [];
  csvMeetingAttendees: number[] = [];
  checkvalues: any;
  // selectedMeetingLocation: string = '8';
  selectedNextMeetingLocation: number;
  selectedMeetingLocation: number;
  showOpenRfi: boolean = false;
  showSubmittals: boolean = false;
  submitted = false;
  doneMeetinginfo = false;
  editmeetingInfo = true;
  showeditMeetingInfo: number[] = [];
  editMeetingInfoForm: FormGroup;
  editMeetinginfoLocations: any;
  editInfoselectedMeeting: number;
  editInfoselectedNextMeeting: number;
  rolesOfProjectContacts: object[] = [];
  searchForUserCompanyContacts: object[] = [];
  selectedContactsList: object[] = [];
  selectedContactsListIds: number[] = [];
  meetingName: string;
  meetingTypeName:string;
  searchByCompany: string;
  searchByFirstName: string;
  searchByLastName: string;
  searchByEmail: string;
  filterMetadata = { count: 0 };
  emailDialogBoxForm: FormGroup;
  emailDataSending: boolean;
  disucssionForm: FormGroup;
  editDicussion: any;
  commentsArray: any = [];
  addcomment: any;
  actionForms: any = [];

  constructor(public modalService: NgbModal, private meetingService: MeetingsService, public router: Router, private loader: LoaderService, private route: ActivatedRoute, private commonService: CommonService, private toaster: ToasterService, private formBuilder: FormBuilder) {
    this.route.queryParams.subscribe((params) => {
      this.pid = params['pid'];
      if (params['meeting_type_id']) {
        this.selectedMeetingTypeId = params['meeting_type_id'];
      }
      if (params['meeting_id']) {
        this.selectedMeetingListId = params['meeting_id'];
      }
    });



    // this.frmImportItems = new FormGroup({
    //   importFrom: new FormControl('', [Validators.required]),
    //   prevmeetingid: new FormControl(),
    //   meetingid: new FormControl('')
    // });

    this.frmImportItems = this.formBuilder.group({
      prevmeetingid: [''],
      importFrom: ['', Validators.required],
      meetingid: ['']
    });
  }

  ngOnInit(): void {
    this.loadMeetingTypes();
    this.importMeetingTypeList();
    this.loadCreateMeetingForm();
    this.loadDiscussionItemForm();
    this.loadEditMeetingInfoForm();
    this.loadDiscussionDropdown();
    this.loadEmailDialogBoxForm();
    // this.newDiscussionItemsData();
    // this.newMeetingIDCreate();
    this.titleSubscription = this.commonService.selectedMenuName.subscribe((res: any) => {
      if (res.isSelected) {
        this.currentlySelectedProjectName = res.title;
      }
    })

    if (this.selectedMeetingTypeId) {
      this.loadMeetingList(this.selectedMeetingTypeId);
    }
    if (this.selectedMeetingListId) {
      this.loadMeetingDetails();
      this.changeMeetingList(this.selectedMeetingListId)
    }

    this.actionItem();

    // this.actionForms = new FormGroup({
    //   actions: new FormArray([])
    // });
  }

  printMeeting(){
    let data = {
      meeting_id : this.selectedMeetingListId,
      meeting_type_id : this.selectedMeetingTypeId,
    }

    this.loader.show();
    this.printMeetingPDFDataSending = true;
    this.meetingService.printMeeting(data).subscribe((response) => {
      this.loader.hide();
      this.printMeetingPDFDataSending = false;
        const file = new Blob([response.body], { type: 'application/pdf' });
        const filename = this.getFilenameFromResponse(response);
        const fileURL = URL.createObjectURL(file);
        const newTab = window.open(fileURL , '_blank');
        setTimeout(() => {
          newTab.document.title = filename;
        }, 20);  
    }, (error) =>  {
      this.loader.hide();
      this.printMeetingPDFDataSending = false;
      this.toaster.showFailToaster('Unable to process!', '')
    });
  }

  

  renderMeetingPDF(){
    let data = {
      meeting_id : this.selectedMeetingListId,
      meeting_type_id : this.selectedMeetingTypeId,
    }
    this.loader.show();

    this.renderMeetingPDFDataSending = true;
    this.meetingService.renderMeetingPDF(data).subscribe((response) => {
      this.loader.hide();
      this.renderMeetingPDFDataSending = false;
      const file = new Blob([response.body], { type: 'application/pdf' });
      const filename = this.getFilenameFromResponse(response).split('/').pop();
      const fileURL = URL.createObjectURL(file);

      this.toaster.showSuccessToaster('PDF Rendered Successfully', '');

      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = filename;
      downloadLink.click();  
    }, (error) =>  {
      this.loader.hide();
      this.renderMeetingPDFDataSending = false;
      this.toaster.showFailToaster('Unable to process!', '')
    })
  }

  private getFilenameFromResponse(response: any): string {
    const contentDisposition = response.headers.get('content-disposition');
   
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    let filename = '';

    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }

    return filename;
  }

  addActions(index: number) {
    // let datapush = this.actionForms.get('actions') as FormArray;
    // datapush[index] = new FormGroup({
    //   task: new FormControl(''),
    //   assignedTo: new FormControl(''),
    //   completed: new FormControl(''),
    //   dueDate: new FormControl(''),
    // });
    if (!this.actionForms[index]) {
      this.actionForms[index] = {
        task: '',
        assignedTo: '',
        completed: '',
        dueDate: ''
      }
    }

  }

  removeActions(index: number) {
    this.actionForms.splice(index, 1);
  }

  // newActions() {
  //   return new FormGroup({
  //     task: new FormControl(''),
  //     assignedTo: new FormControl(''),
  //     completed: new FormControl(''),
  //     dueDate: new FormControl(''),
  //   })
  // }

  discussionMeetingForm() {
    this.disucssionForm = this.formBuilder.group({
      discussions: new FormGroup({
        discussion_item_title: new FormControl('', []),
        discussion_item: new FormControl('', []),
        comments: this.formBuilder.array([]),
        others: this.formBuilder.array([]),
        rfi: this.formBuilder.array([]),
        submittals: this.formBuilder.array([]),
      }),
      commentForm: new FormGroup({
        comment: new FormControl('', [])
      }),
      actionItemForm: new FormGroup({
        task: new FormControl('', [Validators.required]),
        csvContactIds: new FormControl('', []),
        due_date: new FormControl('', []),
        completed: new FormControl('', []),
      })
    })
    // this.disucssionForm = new FormGroup({
    //   meetingPage: new FormArray([this.loadForm()])
    // })
  }

  // meetingPage(){
  //   return this.disucssionForm.get('meetingPage') as FormArray;
  // }

  // addLoadForm() {
  //   this.meetingPage().push(this.loadForm());
  // }

  // removeoLoadForm(empIndex: number) {
  //   this.meetingPage().removeAt(empIndex);
  // }

  // loadForm(){
  //   return new FormGroup({
  //     isOpen: new FormControl(''),
  //     meetingName: new FormControl(''),
  //     description: new FormControl(''),
  //     meetingComment: new FormArray([this.addComment()]),
  //     meetingAction : new FormArray([this.addAction()]),
  //     RFI: new FormArray([this.addAction()]),
  //     Submittals: new FormArray([this.addAction()]),
  //   })
  // }

  // meetingComment(empIndex: number): FormArray {
  //   return this.meetingPage()
  //     .at(empIndex)
  //     .get('meetingComment') as FormArray;
  // }


  // addComment(){
  //   return new FormGroup({
  //     comment: new FormControl('')
  //   })
  // }

  // meetingAction(empIndex: number): FormArray {
  //   return this.meetingPage()
  //     .at(empIndex)
  //     .get('meetingAction') as FormArray;
  // }

  // meetingRFI(empIndex: number): FormArray {
  //   return this.meetingPage()
  //     .at(empIndex)
  //     .get('RFI') as FormArray;
  // }

  // meetingSubmittals(empIndex: number): FormArray {
  //   return this.meetingPage()
  //     .at(empIndex)
  //     .get('Submittals') as FormArray;
  // }

  // addAction(){
  //   return new FormGroup({
  //     task: new FormControl(''),
  //     assignedTo: new FormControl(''),
  //     dueDate: new FormControl(''),
  //     complteDate: new FormControl('')
  //   })
  // }

  // addMeetingAction(empIndex: number) {
  //   this.meetingAction(empIndex).push(this.addAction());
  // }

  // removeMeetingAction(empIndex: number, addAction: number) {
  //   this.meetingAction(empIndex).removeAt(addAction);
  // }

  // addMeetingRFI(empIndex: number) {
  //   this.meetingRFI(empIndex).push(this.addAction());
  // }

  // removeMeetingRFI(empIndex: number, addAction: number) {
  //   this.meetingRFI(empIndex).removeAt(addAction);
  // }

  // addMeetingSubmittals(empIndex: number) {
  //   this.meetingSubmittals(empIndex).push(this.addAction());
  // }

  // removeMeetingSubmittals(empIndex: number, addAction: number) {
  //   this.meetingSubmittals(empIndex).removeAt(addAction);
  // }


  get discussionsArray() {
    return this.disucssionForm.get('discussions') as FormArray;
  }

  editDiscussionForm(data) {
    this.discussion_item_id = data.id;
  }


  updateDiscussionandAction(discussion: any) {
    let commentArray = [];
    let othersArray = [];
    let rfiArray = [];
    let submittalArray = [];
    let actionArray: any = [];
    this.loader.show();
    discussion.DiscussionItemComments.forEach((element, index) => {
      commentArray[index] = element;
    });

    discussion.ActionItems.others && discussion.ActionItems.others.forEach((element, i) => {
      if (element) {
        // othersArray[i] = Object.values(element);
        if (element?.action_item_due_date && element?.action_item_due_date?.year) {
          element.action_item_due_date = this.onDateSelect(element.action_item_due_date)
        }
        if (element?.action_item_completed_timestamp && element?.action_item_completed_timestamp?.year) {
          element.action_item_completed_timestamp = this.onDateSelect(element.action_item_completed_timestamp)
        }
        othersArray[i] = element;
      }
    });
    discussion.ActionItems.rfi  && discussion.ActionItems.rfi.forEach((element, i) => {
      if (element) {
        if (element?.action_item_due_date && element?.action_item_due_date?.year) {
          element.action_item_due_date = this.onDateSelect(element.action_item_due_date)
        }
        if (element?.action_item_completed_timestamp && element?.action_item_completed_timestamp?.year) {
          element.action_item_completed_timestamp = this.onDateSelect(element.action_item_completed_timestamp)
        }
        rfiArray[i] = element;
      }
    });
    discussion.ActionItems.submittal && discussion.ActionItems.submittal.forEach((element, i) => {
      if (element) {
        if (element?.action_item_due_date && element?.action_item_due_date?.year) {
          element.action_item_due_date = this.onDateSelect(element.action_item_due_date)
        }
        if (element?.action_item_completed_timestamp && element?.action_item_completed_timestamp?.year) {
          element.action_item_completed_timestamp = this.onDateSelect(element.action_item_completed_timestamp)
        }
        submittalArray[i] = element;
      }
    });

    if (othersArray.length > 0) {
      othersArray.forEach((element, index) => {
        if (element) {
          actionArray[index] = element;
        }
      })
    }


    if (submittalArray.length > 0) {
      let length = actionArray.length;
      submittalArray.forEach((element) => {
        length++;
        if (element) {
          actionArray[length] = element;
        }
      })

    }

    if (rfiArray.length > 0) {
      let length = actionArray.length;
      rfiArray.forEach((element) => {
        length++;
        if (element) {
          actionArray[length] = element;
        }

      })
    }


    let data = {
      "projectId": this.pid,
      "currentlySelectedProjectName": this.currentlySelectedProjectName,
      edited_discussion_item: {
        "id": this.discussion_item_id,
        "discussion_item_title": discussion.discussion_item_title,
        "discussion_item": discussion.discussion_item,
        "discussion_item_status_id": "1",
        "sort_order": "1",
        "discussion_item_comments": commentArray,
        action_items: actionArray
      }
    }

    this.meetingService.editDiscussionItem(data).subscribe((res) => {
      if (res.status == true) {
        this.toaster.showSuccessToaster('Discussion data updated successfully', "");
        this.loader.hide();
        this.meetingDiscussionView();
      }
    })
  }

  globalShowEditDiscussion() {
    this.isBulkEdit = !this.isBulkEdit;
    let data = this.meetingDiscussionViewData.map((element) => {
      // element.isAccordion = !element.isAccordion;
      element.isEdit = !element.isEdit;
      element.isAction = !element.isAction;
      return element
    })
  }

  editDiscussionsAll() {
    this.isBulkEdit = !this.isBulkEdit;


    let data = this.meetingDiscussionViewData.map((element, i) => {

      element.action_items = [];
      if (element.ActionItems.rfi && element.ActionItems.rfi.length) {

        element.ActionItems.rfi.map((rfi, r) => {

          if (rfi?.action_item_due_date && rfi?.action_item_due_date?.year) {
            rfi.action_item_due_date = this.onDateSelect(rfi.action_item_due_date)
          }
          if (rfi?.action_item_completed_timestamp && rfi?.action_item_completed_timestamp?.year) {
            rfi.action_item_completed_timestamp = this.onDateSelect(rfi.action_item_completed_timestamp)
          }

          element.action_items[r] = rfi;
        })

      }
      if (element.ActionItems.submittal && element.ActionItems.submittal.length) {

        let length = element.action_items.length;

        element.ActionItems.submittal.map((submittal, s) => {
          length++;
          if (submittal?.action_item_due_date && submittal?.action_item_due_date?.year) {
            submittal.action_item_due_date = this.onDateSelect(submittal.action_item_due_date)
          }
          if (submittal?.action_item_completed_timestamp && submittal?.action_item_completed_timestamp?.year) {
            submittal.action_item_completed_timestamp = this.onDateSelect(submittal.action_item_completed_timestamp)
          }

          element.action_items[length] = submittal
        })

      }
      if (element.ActionItems.others && element.ActionItems.others.length > 0) {

        let length = element.action_items.length++;

        element.ActionItems.others.map((others, o) => {
          length++;
          if (others?.action_item_due_date && others?.action_item_due_date?.year) {
            others.action_item_due_date = this.onDateSelect(others.action_item_due_date)
          }
          if (others?.action_item_completed_timestamp && others?.action_item_completed_timestamp?.year) {
            others.action_item_completed_timestamp = this.onDateSelect(others.action_item_completed_timestamp)
          }

          element.action_items[length] = others;
        })

      }
      element.sort_order = i;
      element.discussion_item_comments = element.DiscussionItemComments;
      return element;
    });


    let resdata = {
      projectId: this.pid,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      collection_of_edited_discussion_items: data
    }
    this.loader.show();
    this.meetingService.editAllDiscussionItems(resdata).subscribe((res) => {
      if (res.status == true) {
        this.loader.hide();
        this.toaster.showSuccessToaster("Discussion items are updated successfully", "");
        this.meetingDiscussionView();
      }
    })

  }

  deleteDiscussionItem(MasterCodeList,data) {
   
    this.discussion_item_id = data.id
    
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);
  }

  deleteActionItem(MasterCodeList, id: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);
    this.deleteActionId = id;
  }

  deleteComments(MasterCodeList, id: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);

    this.deleteCommentId = id;

  }

  formSubmit(data) {
    this.isBulkEdit = !this.isBulkEdit;
    this.loader.show();
    if (data == "comments") {
      let data = {
        projectId: this.pid,
        comment_id: this.deleteCommentId
      }

      this.meetingService.deleteDiscussionItemComment(data).subscribe((res) => {
        if (res.status == true) {
          this.loader.hide();
          this.meetingDiscussionView();
          this.toaster.showSuccessToaster('Discussion comment deleted successfully', '');
        }
        else {
          this.loader.hide();
          this.toaster.showFailToaster(res.message, '');
        }
      })

    }
    else if(data == "discussions")
    {
      let resdata = {
        projectId: this.pid,
        discussionItemId: this.discussion_item_id
      }
      this.meetingService.deleteDiscussionItem(resdata).subscribe((res) => {
        if (res.status == true) {
          this.loader.hide();
          this.meetingDiscussionView();
          this.toaster.showSuccessToaster('Discussion Item deleted successfully', '');
        }
        else {
          this.loader.hide();
          this.toaster.showFailToaster(res.message, '');
        }
      });
    }
    else {
      let data = {
        projectId: this.pid,
        actionItemId: this.deleteActionId
      }
      this.loader.show();
      this.meetingService.deleteActionItem(data).subscribe((res) => {
        if (res.status == true) {
          this.toaster.showSuccessToaster('Discussion action item deleted successfully', "");
          this.loader.hide();
          this.meetingDiscussionView();
        }
      })
    }

  }

  sample() {
    
  }

  othersAssignee(data) {
   
  }

  editComments(data, event) {
    data.discussion_item_comment = event.target.value;
  }

  editActions(data, event) {
    data.action_item = event.target.value;
  }

  createDiscussionItem() {

    if (this.title && this.title_description) {
      let data: any = {
        "meeting_id": this.selectedMeetingListId,
        "projectId": this.pid,
        "discussion_item": this.title_description,
        "discussion_item_title": this.title,
      }
      if (this.RFI_Fields) {
        data.rfi_element = this.RFI_Fields.toString();
      }
      if (this.Submittal_Fields) {
        data.submittal_element = this.Submittal_Fields.toString();
      }

      this.meetingService.createDiscussionItem(data).subscribe((result) => {
        if (result.status == true) {
          this.toaster.showSuccessToaster(result.body.Message, '');
          this.isShowNewDiscussion = false
          this.title = "";
          this.title_description = "";
          this.RFI_Fields = [];
          this.Submittal_Fields = [];
          this.openRFI = false;
          this.openSubmittal = false;
          this.meetingDiscussionView();

        }
      },
        ((error: any) => {
          this.toaster.showFailToaster('Dicussion item not Created', '');
          this.isShowNewDiscussion = false
          this.title = "";
          this.title_description = "";
          this.RFI_Fields = [];
          this.Submittal_Fields = [];
          this.openRFI = false;
          this.openSubmittal = false;
        })
      )
    }
    else {
      this.toaster.showFailToaster('Please enter the title and title description fields', '');
    }
  }



  actionItem() {
    this.actionItemForm = new FormGroup({
      task: new FormControl('', [Validators.required]),
      csvContactIds: new FormControl('', []),
      due_date: new FormControl('', []),
      completed: new FormControl('', []),
    })
  }

  get task() {
    return this.actionItemForm.get('task');
  }

  getDiscussion(data) {
    this.discussion_item_id = data.id;
  }

  actionItemSubmit(index: number) {

    // return;
    let due_date: any = this.actionForms[index].dueDate;
    let completed: any = this.actionForms[index].completed;

    this.loader.show();
    if (due_date) {
      due_date = due_date.year + "-" + due_date.month + "-" + due_date.day
    }
    if (completed) {
      completed = completed.year + "-" + completed.month + "-" + completed.day
    }
    let userdata = JSON.parse(localStorage.getItem("users"));
    let data = {
      projectId: this.pid,
      action_item: this.actionForms[index].task,
      csvContactIds: this.actionForms[index].assignedTo,
      action_item_due_date: due_date,
      action_item_completed_timestamp: completed,
      discussion_item_id: this.discussion_item_id,
      currentlySelectedProjectName: userdata['currentlySelectedProjectName']
    }

    this.meetingService.createActionItem(data).subscribe((res) => {
      if (res.status == true) {
        this.loader.hide();
        this.toaster.showSuccessToaster('Action item created successfully', '');
        this.changeMeetingList(this.selectedMeetingListId);
      }
    })
  }


  updateComment(data: any, event: any) {
    let flag = event.target.checked == true ? "Y" : "N";
    data.is_visible_flag = flag;
  }


  saveComment(id: any, value: any) {

    this.comment = value
    let data = {
      "discussion_item_comment": this.comment,
      "discussion_item_id": id,
      "projectId": this.pid
    }
    this.loader.show();
    this.meetingService.createActionComment(data).subscribe((res) => {
      if (res.status == true) {
        this.loader.hide();
        this.toaster.showSuccessToaster('Discussion item comment saved successfully', '');
        this.comment = "";
        this.changeMeetingList(this.selectedMeetingListId);
      }
    })
  }




  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  loadCreateMeetingForm() {
    this.createMeetingForm = new FormGroup({
      meetingType: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      nextStartDate: new FormControl('', [Validators.required]),
      nextStartTime: new FormControl('', [Validators.required]),
      nextEndDate: new FormControl('', [Validators.required]),
      nextEndTime: new FormControl('', [Validators.required]),
      nextLocation: new FormControl('', [Validators.required]),
      list_name: new FormControl([])
    })
  }

  loadEditMeetingInfoForm() {
    this.editMeetingInfoForm = new FormGroup({
      editMeetingInfo_meetingType: new FormControl('', [Validators.required]),
      editMeetingInfo_startDate: new FormControl('', [Validators.required]),
      editMeetingInfo_startTime: new FormControl('', [Validators.required]),
      editMeetingInfo_endDate: new FormControl('', [Validators.required]),
      editMeetingInfo_endTime: new FormControl('', [Validators.required]),
      editMeetingInfo_location: new FormControl('', [Validators.required]),
      editMeetingInfo_nextStartDate: new FormControl('', [Validators.required]),
      editMeetingInfo_nextStartTime: new FormControl('', [Validators.required]),
      editMeetingInfo_nextEndDate: new FormControl('', [Validators.required]),
      editMeetingInfo_nextEndTime: new FormControl('', [Validators.required]),
      editMeetingInfo_nextLocation: new FormControl('', [Validators.required]),
      editMeetingInfo_list_name: new FormControl([])
    })
  }

  loadEmailDialogBoxForm() {
    this.emailDialogBoxForm = new FormGroup({
      emailDialogBoxForm_comments: new FormControl('')
    })
  }


  loadDiscussionItemForm() {
    // this.createDiscussionItem = new FormGroup({
    //   discussion_item_title: new FormControl('', [Validators.required]),
    //   discussion_item_discription: new FormControl('', [Validators.required]),
    //   discussion_item_openrfi: new FormControl('', [Validators.required]),
    //   discussion_item_opensubmittaks: new FormControl('', [Validators.required])
    // })
  }

  checkLoadNewDialog(MasterCodeList) {
    if (this.selectedMeetingTypeId) {
      this.loadCreateMeetingDialog(true, MasterCodeList);
    } else {
      this.loadNewDialog(MasterCodeList)
      this.loadManageMeetingLocationsList('');
    }
  }

  loadCreateMeetingDialog(isShowDialog, MasterCodeList) {
    this.loader.show();
    const inputData = {
      meeting_type_id: this.selectedMeetingTypeId
    }
    this.meetingService.loadCreateMeetingDialog(inputData)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.loadMeetingDialog = data.body;

          this.loadMeetingDialog.meetingattendee.map((attendee: any) => {
            if (attendee.isChecked == true) {
              this.csvMeetingAttendees.push(attendee.id);
            }
          });
          

          this.manageMeetingLocationsListData = this.loadMeetingDialog.meetinglocation;
          

          this.selectedMeetingLocation = this.loadMeetingDialog.meeting.meeting_location;
          this.selectedNextMeetingLocation = this.loadMeetingDialog.meeting.next_meeting_location;


          //meeting location get // Set the selected meeting location based on the meeting_location value and id equality
          const matchingLocations = this.loadMeetingDialog.meetinglocation.filter(
            (location) => location.id == this.selectedMeetingLocation
          );

          
          if (matchingLocations) {
            this.selectedMeetingLocation = matchingLocations[0].id;
          } else {
            this.selectedMeetingLocation = null; // Set a default value if no matching location is found
          }
          

          //Next meeting location get
          const matchingNextLocations = this.loadMeetingDialog.meetinglocation.filter(
            (location) => location.id == this.selectedNextMeetingLocation
          );

         
          if (matchingNextLocations) {
            this.selectedNextMeetingLocation = matchingNextLocations[0].id;
          } else {
            this.selectedNextMeetingLocation = null; // Set a default value if no matching location is found
          }
          


          this.splitDate(this.loadMeetingDialog?.meeting?.meeting_start_date, 'startDate');
          this.splitDate(this.loadMeetingDialog?.meeting?.meeting_end_date, 'endDate');
          this.splitDate(this.loadMeetingDialog?.meeting?.next_meeting_start_date, 'nextStartDate');
          this.splitDate(this.loadMeetingDialog?.meeting?.next_meeting_end_date, 'nextEndDate');
          this.createMeetingForm.patchValue({
            startTime: this.loadMeetingDialog?.meeting?.meeting_start_time ? this.loadMeetingDialog?.meeting?.meeting_start_time : '',
            endTime: this.loadMeetingDialog?.meeting?.meeting_end_time ? this.loadMeetingDialog?.meeting?.meeting_end_time : '',
            nextStartTime: this.loadMeetingDialog?.meeting?.next_meeting_start_time ? this.loadMeetingDialog?.meeting?.next_meeting_start_time : '',
            nextEndTime: this.loadMeetingDialog?.meeting?.next_meeting_end_time ? this.loadMeetingDialog?.meeting?.next_meeting_end_time : '',
          })
          if (isShowDialog) {
            this.loadNewDialog(MasterCodeList);
          }
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  checkUncheckAll(event: any) {
   
    this.loadMeetingDialog.meetingattendee.forEach((c: any) => c.isChecked = event.target.checked)

    let checked = event.target.checked;
    if (checked) {
      this.loadMeetingDialog?.meetingattendee?.map((attendee: any) => {
        if (!this.csvMeetingAttendees.includes(attendee.id)) {
          this.csvMeetingAttendees.push(attendee.id);
        }
      });
    } else {
      this.csvMeetingAttendees = [];
    }

    
  }

  //Edit Meeting info
  checkUncheckEditMeeting(event: any) {
    
    this.meetingDetailData.EligibleAttendees.forEach((c: any) => c.isChecked = event.target.checked)

    let checked = event.target.checked;
    if (checked) {
      this.meetingDetailData?.EligibleAttendees?.map((attendee: any) => {
        if (!this.showeditMeetingInfo.includes(attendee.id)) {
          this.showeditMeetingInfo.push(attendee.id);
        }
      });
    } else {
      this.showeditMeetingInfo = [];
    }

    
  }

  convertDateToString(dateObj: { year: number, month: number, day: number }): string {
    const year = dateObj.year.toString();
    const month = dateObj.month < 10 ? '0' + dateObj.month : dateObj.month.toString();
    const day = dateObj.day < 10 ? '0' + dateObj.day : dateObj.day.toString();
    return `${year}-${month}-${day}`;
  }
  /*New Meeting*/
  createMeeting() {
    this.validateForm();
    this.createMeetingForm.markAllAsTouched();
    if (this.createMeetingForm.valid) {
      this.validateForm();
    }
    //list_name

    let meetingdata = {
      "projectId": this.pid,
      "meeting_type_id": this.selectedMeetingTypeId,
      "meeting_location_id": this.createMeetingForm.get('location').value,
      "meeting_start_date": this.convertDateToString(this.createMeetingForm.get('startDate').value),
      "meeting_start_time": this.createMeetingForm.get('startTime').value,
      "meeting_end_date": this.convertDateToString(this.createMeetingForm.get('endDate').value),
      "meeting_end_time": this.createMeetingForm.get('endTime').value,
      "next_meeting_location_id": this.createMeetingForm.get('nextLocation').value,
      "next_meeting_start_date": this.convertDateToString(this.createMeetingForm.get('nextStartDate').value),
      "next_meeting_start_time": this.createMeetingForm.get('nextStartTime').value,
      "next_meeting_end_date": this.convertDateToString(this.createMeetingForm.get('nextEndDate').value),
      "next_meeting_end_time": this.createMeetingForm.get('nextEndTime').value,
      "Attendees": this.csvMeetingAttendees.toString(),
      "currentlyActiveContactId": localStorage.getItem('currentlySelectedProjectId')
    }

    this.meetingService.newMeetingDataSend(meetingdata).subscribe((res) => {
      
      if (res.status == true) {
        this.toaster.showSuccessToaster('Meeting Created Successfully', '');
        this.createMeetingForm.reset();
        this.modalService.dismissAll('Meeting Created Successfully');

        this.selectedMeetingTypeId = res.body.meeting_type_id;
        this.selectedMeetingListId = res.body.created_meeting_id;
        // this.loadMeetingList(this.selectedMeetingListId);
        this.changeMeetingType(this.selectedMeetingListId, false);
        this.changeMeetingList(this.selectedMeetingListId);
      } else {
        this.toaster.showFailToaster(res.body, '');
      }
    });

    // this.loader.show();
    //   this.meetingService.newMeetingDataSend(meetingdata).subscribe(response => {
    //     this.loader.hide();
    //     this.createmeetinginfo = response.body.Message;

    //   });
  }


  checkedAttendees(e: any) {
    let checked = e.target.checked;
    let value = parseInt(e.target.value);
    let index = this.csvMeetingAttendees.indexOf(value);
    if (checked == true) {
      if (index == -1) {
        // this.csvMeetingAttendees.push(value);
        if (!this.csvMeetingAttendees.includes(value)) {
          this.csvMeetingAttendees.push(value);
        }
        
      }
    } else if (checked == false) {
      if (index > -1) {
        this.csvMeetingAttendees.splice(index, 1);
       
      }
    }
  }

  checkedEditMeeting(e: any) {
    let checked = e.target.checked;
    let value = parseInt(e.target.value);
    let index = this.showeditMeetingInfo.indexOf(value);
    if (checked == true) {
      if (index == -1) {
        if (!this.showeditMeetingInfo.includes(value)) {
          this.showeditMeetingInfo.push(value);
        }
        
      }
    } else if (checked == false) {
      if (index > -1) {
        this.showeditMeetingInfo.splice(index, 1);
        
      }
    }
   

  }


  validateForm() {
    const meeting_start_date = this.dateFormat(this.createMeetingForm.get('startDate').value);
    const meeting_start_time = this.createMeetingForm.get('startTime').value;
    const meeting_end_date = this.dateFormat(this.createMeetingForm.get('endDate').value);
    const meeting_end_time = this.createMeetingForm.get('endTime').value;
    const next_meeting_start_date = this.dateFormat(this.createMeetingForm.get('nextStartDate').value);
    const next_meeting_start_time = this.createMeetingForm.get('nextStartTime').value;
    const next_meeting_end_date = this.dateFormat(this.createMeetingForm.get('nextEndDate').value);
    const next_meeting_end_time = this.createMeetingForm.get('nextEndTime').value;

    // if (meeting_start_date == '' || meeting_start_time == '') {
    //   this.toaster.showFailToaster('Start Time is required.', '');
    //   return 1;
    // } else if (meeting_end_date == '' || meeting_end_time == '') {
    //   this.toaster.showFailToaster('End Time is required.', '');
    //   return 1;
    // } else if (next_meeting_start_date == '' || next_meeting_start_time == '') {
    //   this.toaster.showFailToaster('Next Meeting Start Time is required.', '');
    //   return 1;
    // } else if (next_meeting_end_date == '' || next_meeting_end_time == '') {
    //   this.toaster.showFailToaster('Next Meeting End Time is required.', '');
    //   return 1;
    // } else

    // if (meeting_start_date > meeting_end_date) {
    //   this.toaster.showFailToaster('End Time is less than Start Time.', '');
    //   return 1;
    // } else if (next_meeting_start_date > next_meeting_end_date) {
    //   this.toaster.showFailToaster('Next Meeting End Time is less than Next Meeting Start Time.', '');
    //   return 1;
    // } else if (meeting_start_date == meeting_end_date) {
    //   this.toaster.showFailToaster('End Time is same as Start Time.', '');
    //   return 1;
    // } else if (next_meeting_start_date == next_meeting_end_date) {
    //   this.toaster.showFailToaster('Next Meeting End Time is same as Next Meeting Start Time.', '');
    //   return 1;
    //   // } else if (next_meeting_start_date < next_meeting_end_date) {
    //   //   this.toaster.showFailToaster('Next Meeting Start Time is less than End Time.', '');
    //   //   return 1;
    // } else if (next_meeting_start_date < meeting_start_date) {
    //   this.toaster.showFailToaster('Next Meeting Start Time is less than Start Time.', '');
    //   return 1;
    // } else {
    //   return 0;
    // }

    if ((meeting_start_date === meeting_end_date && meeting_start_time > meeting_end_time) || meeting_start_date > meeting_end_date) {
      this.toaster.showFailToaster('End Time is less than Start Time.', '');
    } else if (meeting_start_date === meeting_end_date && meeting_start_time === meeting_end_time) {
      this.toaster.showFailToaster('End Time is same as Start Time.', '');
    } else if ((next_meeting_start_date === next_meeting_end_date && next_meeting_start_time > next_meeting_end_time) || next_meeting_start_date > next_meeting_end_date) {
      this.toaster.showFailToaster('Next Meeting End Time is less than Next Meeting Start Time.', '');
    } else if (next_meeting_start_date === next_meeting_end_date && next_meeting_start_time === next_meeting_end_time) {
      this.toaster.showFailToaster('Next Meeting End Time is same as Next Meeting Start Time.', '');
    } else if (next_meeting_start_date < meeting_end_date) {
      this.toaster.showFailToaster('Next Meeting Start Time is less than End Time.', '');
    } else if (next_meeting_start_date < meeting_start_date) {
      this.toaster.showFailToaster('Next Meeting Start Time is less than Start Time.', '');
    }
  }

  editInfovalidateForm() {
    const edit_meeting_start_date = this.dateFormat(this.editMeetingInfoForm.get('editMeetingInfo_startDate').value);
    const edit_meeting_start_time = this.editMeetingInfoForm.get('editMeetingInfo_startTime').value;
    const edit_meeting_end_date = this.dateFormat(this.editMeetingInfoForm.get('editMeetingInfo_endDate').value);
    const edit_meeting_end_time = this.editMeetingInfoForm.get('editMeetingInfo_endTime').value;
    const edit_next_meeting_start_date = this.dateFormat(this.editMeetingInfoForm.get('editMeetingInfo_nextStartDate').value);
    const edit_next_meeting_start_time = this.editMeetingInfoForm.get('editMeetingInfo_nextStartTime').value;
    const edit_next_meeting_end_date = this.dateFormat(this.editMeetingInfoForm.get('editMeetingInfo_nextEndDate').value);
    const edit_next_meeting_end_time = this.editMeetingInfoForm.get('editMeetingInfo_nextEndTime').value;

    if ((edit_meeting_start_date === edit_meeting_end_date && edit_meeting_start_time > edit_meeting_end_time) || edit_meeting_start_date > edit_meeting_end_date) {
      this.toaster.showFailToaster('End Time is less than Start Time.', '');
    } else if (edit_meeting_start_date === edit_meeting_end_date && edit_meeting_start_time === edit_meeting_end_time) {
      this.toaster.showFailToaster('End Time is same as Start Time.', '');
    } else if ((edit_next_meeting_start_date === edit_next_meeting_end_date && edit_next_meeting_start_time > edit_next_meeting_end_time) || edit_next_meeting_start_date > edit_next_meeting_end_date) {
      this.toaster.showFailToaster('Next Meeting End Time is less than Next Meeting Start Time.', '');
    } else if (edit_next_meeting_start_date === edit_next_meeting_end_date && edit_next_meeting_start_time === edit_next_meeting_end_time) {
      this.toaster.showFailToaster('Next Meeting End Time is same as Next Meeting Start Time.', '');
    } else if (edit_next_meeting_start_date < edit_meeting_end_date) {
      this.toaster.showFailToaster('Next Meeting Start Time is less than End Time.', '');
    } else if (edit_next_meeting_start_date < edit_meeting_start_date) {
      this.toaster.showFailToaster('Next Meeting Start Time is less than Start Time.', '');
    }
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    return finalDate;
  }

  splitDate(value, control) {
    if (value) {
      const date = value.split('-');
      this.createMeetingForm.get(control).setValue({
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      });
    } else {
      this.createMeetingForm.get(control).setValue({
        year: '',
        month: '',
        day: ''
      });
    }
  }

  splitDateEditInfo(value, control) {
    if (value) {
      const date = value.split('-');
      this.editMeetingInfoForm.get(control).setValue({
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      });
    } else {
      this.editMeetingInfoForm.get(control).setValue({
        year: '',
        month: '',
        day: ''
      });
    }
  }

  dateSplit(dateValue) {
    dateValue = this.dateFormat(dateValue)
    let date: any;
    if (dateValue.split('-')) {
      date = dateValue.split('-');
      const data = {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      }
    } else {
      date = dateValue.split('/');
      const data = {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10)
      }
    }
    return date;
  }

  loadNewDialog(MasterCodeList) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1',
    };
    this.modalService.open(MasterCodeList, ngbModalOptions);
  }

  loadManageDialog(MasterCodeList) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-pagenew',
    };
    this.loadMeetingTypeForm();
    this.modalService.open(MasterCodeList, ngbModalOptions);
  }

  loadMeetingTypes() {
    this.loader.show();
    this.meetingService.loadMeetingTypes()
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.meetingTypes = data.body;
          
          if(this.selectedMeetingTypeId !== ''){
            let meetingTypeName = this.meetingTypes.find(({id}) => id == this.selectedMeetingTypeId)
            this.meetingTypeName  = meetingTypeName?.name;
            this.selectedMeetingTypeId = (typeof this.selectedMeetingTypeId == 'number') ?  this.selectedMeetingTypeId.toString() : Number(this.selectedMeetingTypeId)
          }
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  loadMeetingList(data: any) {
    if (data) {
      this.loader.show();
      const inputData = {
        meeting_type_id: data
      }
      this.meetingService.loadMeetingList(inputData)
        .subscribe((data) => {
          this.loader.hide();
          if (data.status) {
            this.meetingLists = data.body ? data.body : [];
            
            if(this.selectedMeetingListId !== ''){
              let meetingName = this.meetingLists.find(({ id }) => id == this.selectedMeetingListId)
              this.meetingName = meetingName?.name;
            }
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition this.loadMeetingList(this.selectedMeetingTypeId);
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        });
    }
  }

  changeMeetingType(data, isLoadDialog) {
    // this.meetingLists = [];
    // this.selectedMeetingListId = '';
    // this.meetingDetailData = '';
    // this.meetingDiscussionViewData = '';

    //close edit meeting UI if it is open
    this.cancelMeetingInfoData()

    this.csvMeetingAttendees = [];
    if (data) {
      this.selectedMeetingTypeName = this.meetingTypes.filter((res: any) => res.id == data);
      this.selectedMeetingTypeName = Object.assign({}, ...this.selectedMeetingTypeName);

      let meetingTypeName = this.meetingTypes.find(({id}) => id == data)
      this.meetingTypeName  = meetingTypeName?.name;

      if (isLoadDialog) {
        this.loadCreateMeetingDialog(false, '');
      } else {
        this.loadMeetingList(this.selectedMeetingTypeId);
      }
      
    } else {
      this.loadManageMeetingLocationsList('')
      this.selectedMeetingTypeId = '';
      this.selectedMeetingTypeName = [];
    }
    let url: any = {
      pid: this.pid
    }
    if (this.selectedMeetingTypeId) {
      url.meeting_type_id = this.selectedMeetingTypeId;
    }
    this.router.navigate(['/project-management/Meetings'],
      { queryParams: url });
  }

  changeMeetingList(data) {
    this.meetingDetailData = '';
    this.meetingDiscussionViewData = '';
    this.showeditMeetingInfo = [];
    this.ImportDiscussionItemsbtn = false;

    //close edit meeting UI if it is open
    this.cancelMeetingInfoData()
    
    if (data) {
      this.selectedMeetingListName = this.meetingLists.filter((res: any) => res.id == data);
      this.selectedMeetingListName = Object.assign({}, ...this.selectedMeetingListName);

      let meetingName = this.meetingLists.find(({ id }) => id === data)
      this.meetingName = meetingName?.name;

      this.loadMeetingDetails();
      this.meetingDiscussionView();
      this.meetingAssigneeList();
    } else {
      this.selectedMeetingListName = [];
      this.meetingName = '';
    }
    ///

    const datas = {
      "projectId": this.pid,
      "meeting_id": data
    }
    this.meetingService.meetingID(datas).subscribe(response => {
      this.newMeetingIdData = response.body;
      if (this.newMeetingIdData.allTypesDiscussionItemCount === 0) {
        
        this.ImportDiscussionItemsbtn = false;
      } else {
        this.ImportDiscussionItemsbtn = true;
      }
    });

    let url: any = {
      pid: this.pid
    }
    if (this.selectedMeetingTypeId) {
      url.meeting_type_id = this.selectedMeetingTypeId;
    }
    if (data) {
      url.meeting_id = data;
    }
    this.router.navigate(['/project-management/Meetings'],
      { queryParams: url });

  }

  loadMeetingTypeForm() {
    this.meetingTypeForm = new FormGroup({
      meeting_name: new FormControl('', [Validators.required]),
    });
  }

  checkAddMeetingType(type: string, selectedValue) {
    let inputData: any;
    if (type === 'form') {
      this.meetingTypeForm.markAllAsTouched();
      if (this.meetingTypeForm.valid) {
        inputData = {
          "projectId": this.pid,
          "meeting_name": this.meetingTypeForm.get('meeting_name').value,
          "scenarioName": "createMeetingType"
        }
        this.addMeetingType(inputData, type);
      }
    } else {
      inputData = {
        "projectId": this.pid,
        "meeting_name": selectedValue.meeting_type,
        "meeting_type_template_id": selectedValue.id,
        "scenarioName": "createMeetingTypeFromMeetingTypeTemplate",
      }
      this.addMeetingType(inputData, type);
    }
  }

  addMeetingType(inputData, type) {
    this.loader.show();
    this.meetingService.createMeetingType(inputData)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          if (type === 'form') {
            this.toaster.showSuccessToaster('Meeting Type Created Successfully', '');
            this.meetingTypeForm.reset();
          } else {
            this.toaster.showSuccessToaster(data.message, '');
          }
          this.loadMeetingTypes();
          this.importMeetingTypeList();
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  deleteMeetingType(inputData: any) {
    const data = {
      scenarioName: inputData.name,
      uniqueId: inputData.id
    }
    this.loader.show();
    this.meetingService.deleteMeetingType(data)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.loadMeetingTypes();
          this.importMeetingTypeList();
          this.toaster.showSuccessToaster('Meeting Type Deleted Successfully', '');
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  loadMeetingDetails() {
    const data = {
      meeting_type_id: this.selectedMeetingTypeId,
      meeting_id: this.selectedMeetingListId
    }
    this.loader.show();
    this.meetingService.getMeetingDetails(data).subscribe(data => {
      this.loader.hide();
      if (data.status) {
        this.meetingDetailData = data.body?.Meeting ? data.body?.Meeting : '';
        

        this.meetingDetailData.EligibleAttendees.map((attendee: any) => {
          if (attendee.isChecked == true) {
            this.showeditMeetingInfo.push(attendee.id);
          }
        });


        this.editMeetinginfoLocations = this.meetingDetailData.meetinglocation;
        

        this.editInfoselectedMeeting = this.meetingDetailData.location_id;
        this.editInfoselectedNextMeeting = this.meetingDetailData.next_location_id;


        //meeting location get
        const editInfomatchingLocations = this.meetingDetailData.meetinglocation.filter(
          (location) => location.id == this.editInfoselectedMeeting
        );

       
        if (editInfomatchingLocations) {
          this.editInfoselectedMeeting = editInfomatchingLocations[0].id;
        } else {
          this.editInfoselectedMeeting = null;
        }
        

        //Next meeting location get
        const editInfomatchingNext = this.meetingDetailData.meetinglocation.filter(
          (location) => location.id == this.editInfoselectedNextMeeting
        );

        
        if (editInfomatchingNext.length>0) {
          this.editInfoselectedNextMeeting = editInfomatchingNext[0].id;
        } else {
          this.editInfoselectedNextMeeting = null;
        }
       


        this.splitDateEditInfo(this.meetingDetailData?.start_date, 'editMeetingInfo_startDate');
        this.splitDateEditInfo(this.meetingDetailData?.end_date, 'editMeetingInfo_endDate');
        this.splitDateEditInfo(this.meetingDetailData?.nextmeeting_start_date, 'editMeetingInfo_nextStartDate');
        this.splitDateEditInfo(this.meetingDetailData?.nextmeeting_end_date, 'editMeetingInfo_nextEndDate');
        this.editMeetingInfoForm.patchValue({
          editMeetingInfo_startTime: this.meetingDetailData?.start_time ? this.meetingDetailData?.start_time : '',
          editMeetingInfo_endTime: this.meetingDetailData?.end_time ? this.meetingDetailData?.end_time : '',
          editMeetingInfo_nextStartTime: this.meetingDetailData?.nextmeeting_start_time ? this.meetingDetailData?.nextmeeting_start_time : '',
          editMeetingInfo_nextEndTime: this.meetingDetailData?.nextmeeting_end_time ? this.meetingDetailData?.nextmeeting_end_time : '',
        })
      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });
    this.meetingDiscussionView();

  }

  meetingDiscussionView() {
    const data = {
      meeting_type_id: this.selectedMeetingTypeId,
      meeting_id: this.selectedMeetingListId,
      showAll: true
    }
    this.loader.show();
    this.meetingService.meetingDiscussionView(data).subscribe(data => {
      this.loader.hide();
      if (data.status) {
        this.meetingDiscussionViewData = data.body.discussionItems ? data.body.discussionItems : [];

        this.meetingDiscussionViewData.forEach(element => {
          element.isAction = false;
          element.isAccordion = true;
          element.isEdit = false;
          if (element.ActionItems?.others) {
            // && element.ActionItems?.others.length >= 2
            element.ActionItems.others.forEach(element1 => {
              // element1.assigned_ids = element1.assigned_id.split(",");
              element1.assigned_ids = element1.assigned_id.map(Number);
            });
          }
          if (element.ActionItems?.rfi) {
            // && element.ActionItems?.others.length >= 2
            element.ActionItems.rfi.forEach(element1 => {
              // element1.assigned_ids = element1.assigned_id.split(",");
              element1.assigned_ids = element1.assigned_id.map(Number);
            });
          }
          if (element.ActionItems?.submittal) {
            // && element.ActionItems?.others.length >= 2
            element.ActionItems.submittal.forEach(element1 => {
              // element1.assigned_ids = element1.assigned_id.split(",");
              element1.assigned_ids = element1.assigned_id.map(Number);
            });
          }

          // elementelement.ActionItems?.others.map(Number)
        });

        this.discussionMeetingForm();
      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }

    });
  }



  dateFormat(value) {
    return moment(value).format('L');
  }

  importMeetingTypeList() {
    this.meetingService.importMeetingTypeList().subscribe(data => {
      this.loader.hide();
      if (data.status) {
        this.importMeetingList = data.body;
      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });
  }

  importMeetingADD(meetingImport, type: string) {
    this.checkAddMeetingType(type, meetingImport);
  }

  clearMeetingInfo(option: any) {
    if (option == "1") {
      this.createMeetingForm.controls.startDate.reset();
      this.createMeetingForm.controls.startTime.reset();
      this.createMeetingForm.controls.endDate.reset();
      this.createMeetingForm.controls.endTime.reset();
    } else {
      this.createMeetingForm.controls.nextStartDate.reset();
      this.createMeetingForm.controls.nextStartTime.reset();
      this.createMeetingForm.controls.nextEndDate.reset();
      this.createMeetingForm.controls.nextEndTime.reset();
    }
  }

  meetingAssigneeList() {
    const data = {
      meeting_type_id: this.selectedMeetingTypeId,
      meeting_id: this.selectedMeetingListId
    }
    this.meetingService.meetingAssigneeList(data).subscribe(data => {
      this.loader.hide();
      if (data.status) {
        this.meetingAssigneeListData = data.body;
      } else {
        // logout if user is  inactive for 1 hour, token invalid condition
        if (data['code'] == '5') {
          localStorage.clear();
          this.router.navigate(['/login-form']);
        }
      }
    });
  }

  loadManageMeetingLocationsList(manageMeetingLocations) {
    this.loader.show();
    this.meetingService.manageMeetingLocationsList()
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.manageMeetingLocationsListData = data.body;
          this.loadManageMeetingLocationsForm();
          if (manageMeetingLocations) {
            this.loadManageDialog(manageMeetingLocations)
          }
        } else {
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data['code'] == '5') {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }

  loadManageMeetingLocationsForm() {
    this.manageMeetingLocationsForm = new FormGroup({
      meeting_location: new FormControl('', [Validators.required]),
    });
  }

  addManageMeetingLocations() {
    this.manageMeetingLocationsForm.markAllAsTouched();
    if (this.manageMeetingLocationsForm.valid) {
      this.loader.show();
      this.meetingService.manageMeetingLocationsCreate(this.manageMeetingLocationsForm.value)
        .subscribe((data) => {
          this.loader.hide();
          if (data.status) {
            this.manageMeetingLocationsForm.reset();
            this.manageMeetingLocationsListData = data.body;
            this.toaster.showSuccessToaster(data.message, "");
          } else {
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
              localStorage.clear();
              this.router.navigate(['/login-form']);
            }
          }
        });
    }
  }

  deleteManageMeetingLocation(inputData: any) {
    const data = {
      location_id: inputData.id
    }
    this.loader.show();
    this.meetingService.manageMeetingLocationsDelete(data)
      .subscribe((data) => {
        this.loader.hide();
        if (data.status) {
          this.manageMeetingLocationsListData = data.body;
          this.toaster.showSuccessToaster(data.message, '');
        } else {
          if (data.code == 3) {
            this.toaster.showFailToaster('This Location cannot be deleted', "");
          }
          // logout if user is  inactive for 1 hour, token invalid condition
          if (data.code == 5) {
            localStorage.clear();
            this.router.navigate(['/login-form']);
          }
        }
      });
  }


  //Import Discussion Items popup
  importdiscussionList(discussionItemsImport, selectedMeetingListId) {
    const data = {
      "projectId": this.pid,
      "meeting_id": selectedMeetingListId
    }
    this.loader.show();
    this.meetingService.meetingID(data).subscribe(response => {
      this.loader.hide();
      this.newMeetingIdData = response.body;
      if (this.newMeetingIdData && this.newMeetingIdData.previous_meeting_id) {
        this.frmImportItems.get('prevmeetingid').setValue(this.newMeetingIdData.previous_meeting_id);
      }
    });
    this.NewdiscussionDialog(discussionItemsImport);
  }

  NewdiscussionDialog(discussionItemsImport) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1 newdiscussion-dialouge',
      centered: true
    };
    this.modalRef = this.modalService.open(discussionItemsImport, ngbModalOptions);
  }
  //
  importdiscussionPrevData() {
    let data = {
      "importType": this.frmImportItems.get('importFrom').value,
      "prev_meetingid": this.frmImportItems.get('prevmeetingid').value,
      "meeting_id": this.selectedMeetingListId
    }
    this.loader.show();
    this.meetingService.newDiscussionItems(data).subscribe(data => {
      this.loader.hide();
      this.newDiscussionData = data.body.Message;
      if (this.newDiscussionData === "Imported Successfully") {
        this.meetingDiscussionView();
        this.modalRef.close();
      } else {
        this.modalRef.open();
      }
    });
  }

  //new discussion item
  openRfis(e: any) {
    let checked = e.target.checked;
    if (checked == true) {
      this.showOpenRfi = true;
    } else if (checked == false) {
      this.showOpenRfi = false;
    }
  }
  openSubmittals(e: any) {
    let checked = e.target.checked;
    if (checked == true) {
      this.showSubmittals = true;
    } else if (checked == false) {
      this.showSubmittals = false;
    }
  }
  //Edit Meeting Information
  editMeetingInfoData() {
    this.doneMeetinginfo = true;
    this.editmeetingInfo = false;
  }
  doneMeetingInfoData() {
    this.editInfovalidateForm();
    this.editMeetingInfoForm.markAllAsTouched();
    if (this.editMeetingInfoForm.valid) {
      this.editInfovalidateForm();
      this.doneMeetinginfo = false;
      this.editmeetingInfo = true;
    }
    let data = {
      "projectId": this.pid,
      "meeting_type_id": this.selectedMeetingTypeId,
      "meeting_id": this.selectedMeetingListId,
      "location": this.editMeetingInfoForm.get('editMeetingInfo_location').value,
      "start_date": this.convertDateToString(this.editMeetingInfoForm.get('editMeetingInfo_startDate').value),
      "start_time": this.editMeetingInfoForm.get('editMeetingInfo_startTime').value,
      "end_date": this.convertDateToString(this.editMeetingInfoForm.get('editMeetingInfo_endDate').value),
      "end_time": this.editMeetingInfoForm.get('editMeetingInfo_endTime').value,
      "next_location": this.editMeetingInfoForm.get('editMeetingInfo_nextLocation').value,
      "next_meeting_start_date": this.convertDateToString(this.editMeetingInfoForm.get('editMeetingInfo_nextStartDate').value),
      "next_meeting_start_time": this.editMeetingInfoForm.get('editMeetingInfo_nextStartTime').value,
      "next_meeting_end_date": this.convertDateToString(this.editMeetingInfoForm.get('editMeetingInfo_nextEndDate').value),
      "next_meeting_end_time": this.editMeetingInfoForm.get('editMeetingInfo_nextEndTime').value,
      "Attendees": this.showeditMeetingInfo.toString()
    }
    this.loader.show();
    this.meetingService.editMeetingdatasend(data).subscribe(res => {
      this.loader.hide();
      if (res.status == true) {
        this.toaster.showSuccessToaster(res.body.message, '');
        // this.editMeetingInfoForm.reset();
        this.modalService.dismissAll('Meeting Created Successfully');
        this.doneMeetinginfo = false;
        this.editmeetingInfo = true;
        this.loadMeetingDetails();
      } else {
        this.toaster.showFailToaster(res.body, '');
      }
    });

  }
  cancelMeetingInfoData() {
    this.doneMeetinginfo = false;
    this.editmeetingInfo = true;
  }
  //New Discussion Item
  // get f(): { [key: string]: AbstractControl } {
  //   // return this.createDiscussionItem.controls;
  // }
  saveNewDiscussionItem() {
    // this.submitted = true;
    // if (this.createDiscussionItem.invalid) {
    //   return;
    // }
  }

  //Email 
  EmailMeetingDialog(EmailMeetingReport: any) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1 email-meeting-dialog',
    };
    this.modalRef = this.modalService.open(EmailMeetingReport, ngbModalOptions);
  }
  loadEmailMeetingPdfDialog(EmailMeetingReport: any) {
    this.selectedContactsList = [];
    this.selectedContactsListIds = [];
    this.getAllRolesOfProjectContacts();
    this.searchForUserCompanyContactsByCompanyTextOrContactText();
    this.EmailMeetingDialog(EmailMeetingReport);

  }

  getAllRolesOfProjectContacts() {
    this.loader.show();
    this.meetingService.getAllRolesOfProjectContacts().subscribe((response => {
      this.loader.hide();
      if (response.status) {
        this.rolesOfProjectContacts = response.body;
      }
    }))
  }

  refreshSearchList() {
    this.searchForUserCompanyContactsByCompanyTextOrContactText();
  }

  searchForUserCompanyContactsByCompanyTextOrContactText() {
    this.loader.show();
    this.meetingService.searchForUserCompanyContactsByCompanyTextOrContactText().subscribe((response => {
      this.loader.hide();
      if (response.status) {
        this.searchForUserCompanyContacts = response.body;
      }
    }))
  }

  addMeetingAttendeesToList() {
    if (!this.selectedMeetingListId) {
      return;
    }
    this.loader.show();
    this.meetingService.addMeetingAttendeesToList(this.selectedMeetingListId).subscribe((response) => {
      this.loader.hide();
      if (response.status) {
        let contacts = response.body || []
        for (let contact of contacts) {
          var contact_id = contact.contact_id;
          var company_name = contact.company_name;
          var fullName = contact.fullName;
          var first_name = contact.first_name;
          var last_name = contact.last_name;
          var email = contact.email;

          this.addItemToSelectedList(contact_id, company_name, first_name, last_name, email);
        }
      }
    })
  }

  addProjectContactsToList() {
    if (!this.selectedMeetingTypeId) {
      return;
    }
    this.loader.show();
    this.meetingService.addProjectContactsToList(this.selectedMeetingTypeId).subscribe((response) => {
      this.loader.hide();
      let contacts = response.body || []
      for (let contact of contacts) {
        var contact_id = contact.contact_id;
        var company_name = contact.company_name;
        var fullName = contact.fullName;
        var first_name = contact.first_name;
        var last_name = contact.last_name;
        var email = contact.email;

        this.addItemToSelectedList(contact_id, company_name, first_name, last_name, email);
      }
    })
  }

  getContactForRole(roleId: number) {
    this.loader.show();
    this.meetingService.getContactForRole(roleId).subscribe((response) => {
      this.loader.hide();
      if (response.status) {
        let contacts = response.body || []
        for (let contact of contacts) {
          var contact_id = contact.contact_id;
          var company_name = contact.company_name;
          var fullName = contact.fullName;
          var first_name = contact.first_name;
          var last_name = contact.last_name;
          var email = contact.email;

          this.addItemToSelectedList(contact_id, company_name, first_name, last_name, email);
        }
      }
    })
  }

  addToSelectedRecepientList(contact) {
    let { id: contact_id, company: company_name, first_name, last_name, email } = contact;

    this.addItemToSelectedList(contact_id, company_name, first_name, last_name, email);
  }

  addItemToSelectedList(contact_id: number, company_name: string, first_name: string, last_name: string, email: string, is_archive = null) {
    let name = '';
    if ((first_name != '') && (last_name != '')) {
      name = first_name + ' ' + last_name;
    } else if (first_name != '') {
      name = first_name;
    } else if (last_name != '') {
      name = last_name;
    } else {
      name = '';
    }

    let contactDetails = {
      contact_id,
      company_name,
      name,
      email
    }

    if (!this.selectedContactsListIds.includes(contact_id)) {
      this.selectedContactsListIds.push(contact_id);
      this.selectedContactsList.push(contactDetails);
    }

  }

  resetAllSearch() {
    this.searchByCompany = ''
    this.searchByFirstName = ''
    this.searchByLastName = ''
    this.searchByEmail = ''
  }
  removeSelectedContactFromList(contact_id: number) {
    const index = this.selectedContactsListIds.indexOf(contact_id);
    this.selectedContactsListIds.splice(index, 1);

    this.selectedContactsList = this.selectedContactsList.filter((item: any) => item.contact_id !== contact_id)
  }


  sendEmailToSelectedRecipients() {
    if (!this.selectedContactsListIds || this.selectedContactsListIds.length === 0) {
      this.toaster.showFailToaster('Select atleast one recipient', 'Selected Recipient');
      return;
    }
    this.emailDataSending = true;
    let data = {
      meeting_id: this.selectedMeetingListId,
      meeting_type_id: this.selectedMeetingTypeId,
      EmailMessageText: this.emailDialogBoxForm.controls.emailDialogBoxForm_comments.value,
      recipientContactIds: this.selectedContactsListIds
    }

    this.loader.show();

    this.meetingService.sendEmailToSelectedRecipients(data).subscribe((response) => {
      if (response.status == true) {
        this.toaster.showSuccessToaster(response.body.message, '');
        this.loader.hide();
        this.modalRef.close();
        this.emailDialogBoxForm.reset()
      } else {
        this.toaster.showFailToaster(response.body, '')
      }
      this.emailDataSending = false;
      this.loader.hide();
    }, (err : Error) => {
      this.toaster.showFailToaster('Unable to process!', '')
      this.loader.hide();
      this.emailDataSending = false;
    })

  }

  //Meeting permission
  MeetingPermissionDialog(MeetingPermission) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1 email-meeting-dialog',
    };
    this.modalRef = this.modalService.open(MeetingPermission, ngbModalOptions);
  }
  loadMeetingPermissionDialog(MeetingPermission) {
    this.MeetingPermissionDialog(MeetingPermission);
  }
  //EditInfo delete meeting
  EditInfodeleteDialog(editinfoclosedialog) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1 editinfo-delete',
    };
    this.modalRef = this.modalService.open(editinfoclosedialog, ngbModalOptions);
  }
  EditInfo__deleteMeeting(editinfoclosedialog) {
    this.EditInfodeleteDialog(editinfoclosedialog);
  }

  //EditInfo attendees help
  EditInfoAttendeesDialog(editinfoattendeesdialog) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'dashboardlist-page1 editinfo-delete',
    };
    this.modalRef = this.modalService.open(editinfoattendeesdialog, ngbModalOptions);
  }
  EditInfoattendeesMeeting(editinfoattendeesdialog) {
    this.EditInfoAttendeesDialog(editinfoattendeesdialog);
  }

  //open rfi check
  openRFICheck(e: any) {
    if (e.target.checked == true) {
      this.openRFI = true;
    }
    else {
      this.openRFI = false;
    }
  }

  //open submittal check
  openSubmittalCheck(e: any) {
    if (e.target.checked == true) {
      this.openSubmittal = true;
    }
    else {
      this.openSubmittal = false;
    }
  }


  toggleOpenRFI(event: any) {
    if (event.target.checked == true) {
      const newList = this.RFI_Fields.map((x) => x.id);
      this.RFI_Fields = [...newList];
      // this.onChange([...newList]);
    }
    else {
      const newList = [];
      this.RFI_Fields = newList;
    }
  }

  toggleOpenSubmittal(event: any) {
    if (event.target.checked == true) {
      const newList = this.Submittal_Fields.map((x) => x.id);
      this.Submittal_Fields = [...newList];
      // this.onChange([...newList]);
    }
    else {
      const newList = [];
      this.Submittal_Fields = newList;
    }
  }

  loadDiscussionDropdown() {
    this.meetingService.loadDiscussionDropdown().subscribe((data: any) => {
      if (data.status == true) {
        if (data.body.open_Submittals) {
          this.openSubmittalData = data.body.open_Submittals;
        }
        if (data.body.open_rfi) {
          this.openRFIData = data.body.open_rfi;
        }
      }
    });
  }

  selectRFI(e: any) {
    this.rfi_element = e.target.value;
  }

  selectSubmittal(e: any) {
    this.submittal_element = e.target.value;
  }


  refreshMeetingDetails() {
    this.changeMeetingList(this.selectedMeetingListId);
  }

  deleteMeetingRecord(){
    let data = {
      meeting_id : this.selectedMeetingListId,
    }
    this.deleteDataSending = true;
    this.loader.show();

    this.meetingService.deleteMeetingRecord(data).subscribe(res => {
      if(res.status){
        this.loader.hide();
        this.modalRef.close();
        this.toaster.showSuccessToaster(res.body.message, '');
        this.resetPage();
      }else{
        this.toaster.showFailToaster('Unable to delete the meeting record', '');
      }
      this.deleteDataSending = false;
    })
  }

  resetPage(){
    this.meetingDetailData = null;  
    this.selectedMeetingListId = ''
    this.meetingLists = [];
    this.loadMeetingList(this.selectedMeetingTypeId);
  }
}
