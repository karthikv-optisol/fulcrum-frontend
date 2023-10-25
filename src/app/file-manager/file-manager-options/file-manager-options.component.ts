import { Component, ElementRef, HostListener, ComponentFactoryResolver, OnInit, Renderer2, ViewChild, ViewContainerRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from "jquery";
import { first, map, startWith } from 'rxjs/operators';
import { FileManagerService } from '../../services/file-manager.service';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

export interface User {
  name: string;
  id: number;
}
@Component({
  selector: 'app-file-manager-options',
  templateUrl: './file-manager-options.component.html',
  styleUrls: ['./file-manager-options.component.scss']
})
export class FileManagerOptionsComponent implements OnInit {
  loading: boolean = false;
  displayTrash: boolean = false;
  folder_or_file: boolean = false;
  typefile: boolean = false;
  typefolder: boolean = false;
  root_folder: boolean = false;
  postdir = '';
  folderlist = [];
  alldetails = [];
  subfolderlist = [];
  Foldername = [];
  arrProjectRoles = [];
  arrMatrix = [];
  parentfolder: number;
  isTrash: string = 'no';
  userrole = [];
  isguest: boolean = false;
  isImage: number = 0;
  isDisplayContextMenu: boolean;
  _currentMenuVisible = null;
  showProjectNavBox: boolean = false;
  arrCompletedProjects = [];
  arrOtherProjects = [];
  arrActiveProjects = [];
  currentlySelectedProjectId: any;
  currentlySelectedProjectName: string;
  isShown: boolean = true;
  isShownOther: boolean = true;
  isShownActive: boolean = false;
  isShownFileManager: boolean = true;
  Arraysidemenu = [];
  rightClickMenuItems = [];
  parentElem: any;
  contextMenuSelector: string;
  file_nameformat:string;
  menuEvent: any;
  @ViewChild('contextMenu', { read: ViewContainerRef, static: true }) container;
  @ViewChild('trashDiv') trashDiv: ElementRef;
  pid: string;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  modalRef: any;
  options = ["Sam", "Varun", "Jasmine"];
  progress: number = 0;
  filteredOptions;
  sizeInMB: any;
  uploadcall:any;
  formGroup: FormGroup;
  isShownReports: boolean = true;
  usersdetails = [];
  IsshowActive: boolean = false;
  IsshowCompleted: boolean = false;
  IsshowOther: boolean = false;
  timeout: any = null;
  li_id_number: number;
  titleSubscription: Subscription
  constructor(private formBuilder: FormBuilder, private fb: FormBuilder, public modalService: NgbModal, private httpClient: HttpClient, private route: ActivatedRoute, private componentFactoryResolver: ComponentFactoryResolver, private elementRef: ElementRef, private FileManagerService: FileManagerService, private router: Router, private titleService: Title, private renderer: Renderer2, private commonService: CommonService, private loader: LoaderService) {

    this.titleService.setTitle("File Management - MyFulcrum.com");
    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
      this.currentlySelectedProjectId = atob(params['pid']);
      if (params['currentlySelectedProjectName'] != null) {
        this.currentlySelectedProjectName = atob(params['currentlySelectedProjectName']);
      }
    });
  }

  ngOnInit(): void {

    this.usersdetails = JSON.parse(localStorage.getItem('users'));
    this.userrole = JSON.parse(localStorage.getItem('users'));
    if (this.userrole['userRole'] == 'guest') {
      this.isguest = true;
    }
    if (localStorage.getItem('users')) {
      this.getFileManagers();

    }
    else {
    }
    this.isShownFileManager = false;
    this.titleSubscription = this.commonService.selectedMenuName.subscribe((res: any) => {
      if (res.isSelected) {
        this.currentlySelectedProjectName = res.title;
      }
    })
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
  }

  
  private onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeListing(event.target.value);
      }
    }, 1000);
  }

  private executeListing(value: string) {
    this.filterData(value);
  }
  filterData(enteredData) {
    if (enteredData.length > 2) {
      this.loader.show();
      this.FileManagerService.searchPreviewFile(enteredData)
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            this.options = data['body'];
            this.filteredOptions = data['body'];
            this.filteredOptions = this.options.filter(item => {
              return item['filename'].toLowerCase().indexOf(enteredData.toLowerCase()) > -1
            })
          }
        );
    }

  }

  applyPermissionsToFolderContents(file_manager_folder_id) {
    try {

      var answer = confirm('This will replace permissions on all files and folders within this folder with the permissions here.\n\nAre you sure you want replace permissions?');
      if (answer) {
        this.loader.show();
        this.FileManagerService.applyPermissionsToFolderContents(file_manager_folder_id)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (data['status']) {
                this.messageAlert('Permissions successfully updated', 'successMessage', '', 'none');

              }
            }
          );

      }

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }

  applyPermissionsToFileSiblings(fileId, elementId) {
    try {

      var parent_file_manager_folder_id = $("#" + elementId).parent().attr('id').replace('liFolder_', '');

      var answer = confirm('This will replace permissions on all files located in the same folder as this file.\n\nAre you sure you want replace permissions?');
      if (answer) {
        this.loader.show();
        this.FileManagerService.applyPermissionsToFileSiblings(parent_file_manager_folder_id, fileId)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (data['status']) {
                this.messageAlert('Permissions successfully updated', 'successMessage', '', 'none');
              }
            }
          );
      }

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }


  getOptionText(option) {
    return option.name;
  }
  renameButtonClicked() {
    if ($("#btnRename").hasClass('disabled') == false) {
      if ($(".ui-selected").length == 1) {
        var element = $(".ui-selected");
        this.renameItemRightClickSelected(element);
      } else {
        alert('Please select only one item to rename');
      }
    }
  }
  deleteButtonClicked() {
    if ($("#btnDelete").hasClass('disabled') == false) {
      this.moveItemsToRecycleBin();
    }
  }
  toggleFileSystemDetails() {
    if ($("#btnToggleDetails").val() == "Show Info") {
      $("#btnToggleDetails").val('Hide Info');
      $("#btnMenuShowInfo").html('Hide Info');
      // If there are no details then let's try loading them before we show them.
      var nodeId = $(".ui-selected").parent().attr('id');
      var nodeType = "file";
      if ($(".ui-selected").parent().hasClass('directory')) {
        nodeType = 'folder';
      }
      this.loadDetails(nodeId, nodeType);
    } else {
      $("#btnToggleDetails").val('Show Info');
      $("#btnMenuShowInfo").html('Show Info');
      $("#fileDetails").hide();
    }
  }
  updateNodeNameFromDetails() {

    var elementid = $('.detailsSelectedElement').val();
    var nodetype = $('.nodetypes').val();
    var detailsFileExtention = $('.detailsFileExtention').val();
    this.updateNodeNameFromDetails_properties('', elementid, elementid, nodetype, detailsFileExtention, '');

  }

  toggleAllPermissionsForRole(elementId, nodeType) {
    try {
      var rowId = 'tr_' + elementId;
      var inputCount = $("#" + rowId).find('input').length;
      var checkedCount = $("#" + rowId).find('input').filter(':checked').length;
      var checkAll = 0;
      if (checkedCount < inputCount) {
        checkAll = 1;
      }
      this.loader.show();
      this.FileManagerService.toggleAllPermissionsForRole(elementId, nodeType, checkAll)
        .pipe(first())
        .subscribe(
          data => {
            if (data['status']) {
              this.loader.hide();
              var ary = data['body'].split('_');
              var checkAll = ary[2];
              var rowId = 'tr_' + ary[0] + '_' + ary[1];
              if (checkAll == 1) {
                $("#" + rowId).find('input').prop('checked', 'true');
              } else {
                $("#" + rowId).find('input').prop('checked', 'false');
              }
              this.messageAlert('Permissions successfully updated', 'successMessage', '', 'none');
            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
            }
          }
        );


    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }


  toggleFileFolderPermission(elementId, nodeType) {
    try {

      var isChecked = $("#" + elementId).is(':checked');

      this.loader.show();
      this.FileManagerService.toggleFileFolderPermission(elementId, nodeType, isChecked)
        .pipe(first())
        .subscribe(
          data => {
            if (data['status']) {
              this.loader.hide();

              var json = data['body'];

              var elementId = json.elementId;
              var nodeType = json.nodeType;
              var permissionType = json.permissionType;
              var isChecked = json.isChecked;
              var uniqueId = json.uniqueId;
              var role_id = json.role_id;

              if (nodeType == 'folder') {
                var file_manager_folder_id = uniqueId;
              } else {
                var file_manager_file_id = uniqueId;
              }

              var ary = elementId.split('_');

              var rowId = 'tr_' + uniqueId + '_' + role_id;
              var cellId = 'td_' + elementId;
              var viewId = uniqueId + '_' + role_id + '_view';
              if (permissionType == 'view' && $("#" + elementId).is(':checked') == false) {
                $("#" + rowId).find('input').filter(':checked').attr('checked', 'false');
              } else if ($("#" + rowId).find('input').filter(':checked').length > 0) {
                $("#" + viewId).attr('checked', 'true');
              }

              var messageText = 'Permission to ' + permissionType + ' successfully updated';
              this.messageAlert(messageText, 'successMessage', '', 'none');
            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
            }
          }
        );

    } catch (error) {

      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }



  loadDetails(id, nodeType) {
    try {
      var isTrash = 'no';
      if ($("#" + id).hasClass('trash')) {
        isTrash = 'yes';
      }

      $(".jqueryFileTree li a").removeClass('ui-selected');
      var lastATagClicked = $("#" + id + " > a");
      $(".rightClickMenu").hide();
      $("#" + id + " > a").addClass('ui-selected');
      var elementId = id;
      if (nodeType == 'folder') {
        $("#filePreview").hide();
        var path = $("#" + id).attr('rel');
        id = id.replace('liFolder_', '');
      } else {
        id = id.replace('liFolder_', '');
      }
      if (id != 0 && id != 'fileTreeMenu') {
        this.loader.show();
        this.FileManagerService.loadDetails(id, nodeType, isTrash, elementId)
          .pipe(first())
          .subscribe(
            data => {
              if (data['status']) {
                this.loader.hide();
                $("#fileDetails").show();
                this.arrProjectRoles = data['body']['details']['arrRoles']['role'];
                this.alldetails = data['body']['details'];
                this.arrMatrix = data['body']['details']['arrMatrix'];
                if (data['body']['details']['isRootFolder'] != '1') {
                  $('.other_permissions').show();
                  this.root_folder = true;
                }
                else {
                  $('.other_permissions').hide();
                  this.root_folder = false;
                }
                if (data['body']['details']['isRootFolder'] == '1') {
                  $('.folder_or_filename').show().html(data['body']['details']['company_names']);
                  $('.folder_or_filename_edit').hide();


                }
                else if (data['body']['details']['rename_privilege'] == 'N') {
                  $('.folder_or_filename').show().html(data['body']['details']['nodeName']);
                  $('.folder_or_filename_edit').hide();
                }
                else {
                  $('.folder_or_filename_edit').show();
                  $('.folder_or_filename').hide()
                  $('.detailsFileExtention').val(data['body']['details']['fileExtension']);
                  $('.detailsSelectedElement').val(data['body']['details']['nodeId']);
                  $('#detailsTheNodeName').val(data['body']['details']['nodeName']);
                }
                if (data['body']['details']['nodeType'] != 'folder') {
                  $('.show_if_file').show();
                  $('.show_if_file_value').html(data['body']['details']['size']).show();
                  $('.permission_upload').hide();
                  this.typefile = true; this.typefolder = false;
                  this.folder_or_file = false;
                  $('#heading_nodetype').html('File Permissions');
                }
                else {
                  this.typefolder = true; this.typefile = false;
                  $('.show_if_file').hide();
                  $('.show_if_file_value').hide();
                  $('.permission_upload').show();
                  this.folder_or_file = true;
                  $('#heading_nodetype').html('Folder Permissions');
                }
                $('.nodetypeadd').html(data['body']['details']['type']);
                $('.nodetypes').val(data['body']['details']['nodeType']);
                $('.date_modified').html(data['body']['details']['date_modified']);
                $('.date_created').html(data['body']['details']['date_created']);

              }
              else {
                this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
              }
            }
          );



      } else {
        // Viewing the Root Folders so blank the details and preview
        $("#fileDetails").html('');
        $("#filePreview").html('');
      }

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  moveItemsToRecycleBin() {
    try {

      if ($(".ui-selected").length > 0) {
        var arrMovedFolderListItems = [];
        var arrMovedFileListItems = [];

        // Get the folders that were selected
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('directory') && !$(this).parent().hasClass('trash')) {
            var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');

            arrMovedFolderListItems.push(movedFolderListItem);
          }
        });

        // Loop through the files that were selected and check if their parent folder is already in the folder list.
        var parent_file_manager_folder_id;
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('file') && !$(this).parent().hasClass('trash')) {
            if ($(this).parents().find('[id^="draggingContainer"]').length == 0) {
              parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
              if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
                var movedFileListItem = $(this).parent().attr('id').replace('liFolder_', '');
                arrMovedFileListItems.push(movedFileListItem);
              }
            }
          }
        });

        var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
        var csvMovedFileListItems = arrMovedFileListItems.join(',');
 
        var parent_file_manager_folder_id = $(".ui-selected").first().parents().eq(1).attr('id').replace('liFolder_', '');
        this.loader.show();
        this.FileManagerService.moveItemsToRecycleBin(csvMovedFolderListItems, csvMovedFileListItems, parent_file_manager_folder_id)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (data['status']) {
               
                if (arrMovedFolderListItems.length == 0) //files delete
                {
                  $('#a_liFolder_' + arrMovedFileListItems).remove();

                }
                else {
                  $('.appended_li' + arrMovedFolderListItems).remove();

                }
                this.isTrash = 'no';
                let el: HTMLElement = this.trashDiv.nativeElement;
                el.click();

              }
              else {
                this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
                // logout if user is  inactive for 1 hour, token invalid condition
                if (data['code'] == '5') {
                }

              }
            }
          );
      }

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  newFolderButtonClicked(windowNewFolder1) {
    if ($("#btnFolder").hasClass('disabled') == false) {
      if ($(".ui-selected").length == 1) {
        var element = $(".ui-selected");

        this.newFolderRightClickSelected(element, windowNewFolder1);
      } else {
        alert('Please select only one folder in which to place your new folder.');
      }
    }
  }

  newFolderRightClickSelected(element, windowNewFolder1) {
    var li_id = $(element).parent().attr('id').replace('liFolder_', '');
    var li_path = $(element).parent().attr('rel');
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    if (li_id.indexOf('li_') == 0) {
      // If file was clicked we need to go up from a to li to ul to li
      li_id = $(element).parent().parent().parent().attr('id').replace('liFolder_', '');
      li_path = $(element).parent().parent().parent().attr('rel');
    }

    this.modalRef = this.modalService.open(windowNewFolder1, ngbModalOptions);
    $("#parent_file_manager_folder_id").val(li_id);
    $("#parentFolderName").text(li_path);
    $("#newFolderName").val('');
  }

  createNewFolder(windowNewFolder1) {
    try {

      var valid = true;
      var parent_file_manager_folder_id = $("#parent_file_manager_folder_id").val();
      var newFolderName = $("#newFolderName").val();
      //TODO: Throw in some folder name validation
      this.loader.show();
      this.FileManagerService.createNewFolder(parent_file_manager_folder_id, newFolderName)
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            if (data['status']) {
              this.loader.hide();
              this.modalRef.close(windowNewFolder1);
              this.loadsubfolders(data['body'], 'no');
            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '3') {

               // alert('Folder name already exists.');
              }
              else {
                alert('Invalid Input');
              }

            }
          }
        );

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  restoreItemsFromRecycleBin() {
    try {

      if ($(".ui-selected").length > 0) {
        var arrMovedFolderListItems = [];
        var arrMovedFileListItems = [];

        // Get the folders that were selected
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('directory') && $(this).parent().hasClass('trash')) {
            var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
            arrMovedFolderListItems.push(movedFolderListItem);
          }
        });

        // Loop through the files that were selected and check if their parent folder is already in the folder list.
        var parent_file_manager_folder_id;
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('file') && $(this).parent().hasClass('trash')) {
            parent_file_manager_folder_id = $(this).parent().parent().attr('id').replace('liFolder_', '');
            if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
              var movedFileListItem = $(this).parent().attr('id').replace('liFolder_', '');
              arrMovedFileListItems.push(movedFileListItem);
            }
          }
        });

        var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
        var csvMovedFileListItems = arrMovedFileListItems.join(',');
        var restoredElementParentFolderId = $(".ui-selected").first().parents().eq(1).attr('id').replace('liFolder_', '');

        this.loader.show();
        this.FileManagerService.restoreItemsFromRecycleBin(csvMovedFolderListItems, csvMovedFileListItems, restoredElementParentFolderId)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (data['status']) {
                this.loader.hide();
                if (arrMovedFolderListItems.length == 0) //files delete
                {
                  $('.trashChild.appended_li' + arrMovedFileListItems).remove();

                }
                else {
                  $('.trash.appended_li' + arrMovedFolderListItems).remove();

                }


              }
              else {
                // logout if user is  inactive for 1 hour, token invalid condition
                if (data['code'] == '5') {
                }

              }
            }
          );

      }

    } catch (error) {

      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;

    }
  }
  restoreButtonClicked() {
    if ($("#btnRestore").hasClass('disabled') == false) {
      this.restoreItemsFromRecycleBin();
    }
  }
  permanentlyDeleteItemsFromRecycleBin() {
    try {

      if ($(".ui-selected").length > 0) {
        var arrMovedFolderListItems = [];
        var arrMovedFileListItems = [];

        // Get the folders that were selected
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('directory') && $(this).parent().hasClass('trash')) {
            var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
            arrMovedFolderListItems.push(movedFolderListItem);
          }
        });

        // Loop through the files that were selected and check if their parent folder is already in the folder list.
        var parent_file_manager_folder_id;
        $(".ui-selected").each(function (index) {
          if ($(this).parent().hasClass('file') && $(this).parent().hasClass('trash')) {
            parent_file_manager_folder_id = $(this).parent().parent().attr('id').replace('liFolder_', '');

            if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
              var movedFileListItem = $(this).parent().attr('id').replace('liFolder_', '');
              arrMovedFileListItems.push(movedFileListItem);
            }
          }
        });

        var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
        var csvMovedFileListItems = arrMovedFileListItems.join(',');
        var affectedElementParentFolderId = $(".ui-selected").first().parents().eq(1).attr('id').replace('liFolder_', '');

        this.loader.show();
        this.FileManagerService.permanentlyDeleteItemsFromRecycleBin(csvMovedFolderListItems, csvMovedFileListItems, affectedElementParentFolderId)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (arrMovedFolderListItems.length == 0) //files delete
              {
                $('.trashChild.appended_li' + arrMovedFileListItems).remove();

              }
              else {
                $('.trash.appended_li' + arrMovedFolderListItems).remove();

              }
              if (data['status']) {





              }
              else {
                this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
                // logout if user is  inactive for 1 hour, token invalid condition
                if (data['code'] == '5') {
                }

              }
            }
          );



      }

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  emptyTrash() {
    try {
      this.loader.show();
      this.FileManagerService.emptyTrash()
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            if (data['status']) {

              this.loadsubfolders('-1', 'no');



            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }

            }
          }
        );

    } catch (error) {

      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }


  }

  getLinkRightClickSelected(element) {
    element = this.menuEvent.srcElement;
    var searchOrigin = 'http://45.118.132.111/';
    //document.location.origin;
    if ($(".ui-selected").length > 0) {
      var arrMovedFolderListItems = [];
      var arrMovedFolderListItemsRel = [];
      var arrMovedFileListItems = [];

      // Get the folders that were selected
      $(".expanded").each(function (index) {
        var movedFolderListItem = $(this).attr('id');
        arrMovedFolderListItems.push(movedFolderListItem);
        arrMovedFolderListItemsRel.push($(this).attr('rel'));

      });
      var li_id = $(element).parent().attr('id');

      if (arrMovedFolderListItems.includes(li_id) == false) {
        arrMovedFolderListItems.push(li_id);
        arrMovedFolderListItemsRel.push($(element).parent().attr('rel'));
      } else {

      }
      arrMovedFolderListItems.join(',');
      var project_id = atob(this.pid);

      var getLink = searchOrigin + '/modules-file-manager-file-browser.php?folder=' + arrMovedFolderListItems + "&project_id=" + project_id;

      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(getLink).select();
      document.execCommand("copy");
      $temp.remove();
      if ((arrMovedFolderListItemsRel[arrMovedFolderListItemsRel.length - 1]) && (arrMovedFolderListItemsRel[arrMovedFolderListItemsRel.length - 1].indexOf('/Plans/') >= 0)) {
        var reUrl = '<a href="' + searchOrigin + '/modules-gc-budget-form.php?type=email_bidder">Click here</a>';

        this.messageAlertFM('<b>Warning Message:</b> Link copied can only be accessed by users with registered Fulcrum account. ' + reUrl + ' to share the plans with external users.', 'warningMessage', '', '');

      } else {
        this.messageAlertFM('Link copied. <b>Note:</b> This link can will only work for users with a MyFulcrum account who also have permissions to this location in File Manager.', 'successMessage', '', '');
      }
    }
  }

  is_array(input) {
    var ret = typeof (input) == 'object' && (input instanceof Array);
    return ret;
  }
  split(val) {
    return val.split('|');
  }
  searchPreviewFile(event, ui) {

    var fileId = ui.item.value;
    var fileName = ui.item.label;
    this.viewpdffile(fileId, fileName);

    var itemTitleDesc = this.split(ui.item.label);
    var isArray = this.is_array(itemTitleDesc);
    if (isArray) {
      var itemTitle = itemTitleDesc[1];
      if (itemTitleDesc.length > 1) {
        var itemDesc = itemTitleDesc[0];
      }
    }
    event.preventDefault();
  }
  listItemFocus(event, ui) {
    var itemTitleDesc = this.split(ui.item.label);
    var isArray = this.is_array(itemTitleDesc);
    if (isArray) {
      var itemTitle = itemTitleDesc[1];
    } else {
    }
    return false;
  }
  searchBoxSetup() {
    $("#filenameSearch").autocomplete({
      minLength: 2,
      autoFocus: false,
      select: this.searchPreviewFile,
      focus: this.listItemFocus,
      position: { my: 'right top', at: 'right bottom' },
      source: 'modules-file-manager-file-browser-ajax.php?method=searchByFilename'
    });



    // Create the sub title in the list.
    $("#filenameSearch").data("ui-autocomplete")._renderItem = function (ul, item) {
      var itemTitleDesc = this.split(item.label);
      var desc = '';
      var isArray = this.is_array(itemTitleDesc);
      if (isArray) {
        var itemTitle = itemTitleDesc[1];
        if (itemTitleDesc.length > 1) {
          var itemDesc = itemTitleDesc[0];
          var itemDesc = itemDesc.replace(')', '');
          desc = '<br><span><small>' + itemDesc + '</small></span>';
        }
        var itemContent = '<span><strong>' + itemTitle + '</strong></span>' + desc;
        var html = $('<li></li>')
          .data('item.autocomplete', item)
          .append($('<a></a>').html(itemContent))
          .appendTo(ul);
        return html;
      } else {
        var html = $('<li></li>')
          .data('item.autocomplete', item)
          .append($('<a></a>').html(item.label))
          .appendTo(ul);
        return html;
      }
    };
  }
  messageAlertFM(text, messageStyle, labelStyle, elementId) {
    clearTimeout(window['labelStyleTimeout_' + elementId]);
    clearTimeout(window['messageStyleTimeout_' + elementId]);

    var messageTimeout = 7000;


    $("#messageDiv").removeClass();
    $("#messageDiv").html('');

    $("#messageDiv").addClass(messageStyle);
    $("#messageDiv").html(text);
    $("#messageDiv").fadeIn('slow');

    window['messageStyleTimeout_' + elementId] = setTimeout(function () {
      $("#messageDiv").fadeOut('slow', function () {
        $("#messageDiv").removeClass();
        $("#messageDiv").html('');
      });
    }, messageTimeout);

    if (elementId != '') {
      var classesToRemove = 'infoMessageLabel successMessageLabel warningMessageLabel errorMessageLabel modalMessage';
      $("#" + elementId).removeClass(classesToRemove);
      $("#" + elementId).addClass(labelStyle);

      window['labelStyleTimeout_' + elementId] = setTimeout(function () {
        $("#" + elementId).removeClass(classesToRemove);
      }, messageTimeout);
    }
  }

  messageAlert(text, messageStyle, labelStyle, elementId) {
    clearTimeout(window['labelStyleTimeout_' + elementId]);
    clearTimeout(window['messageStyleTimeout_' + elementId]);

    var messageTimeout = 3000;


    $("#messageDiv").removeClass();
    $("#messageDiv").html('');

    $("#messageDiv").addClass(messageStyle);
    $("#messageDiv").html(text);
    $("#messageDiv").fadeIn('slow');

    window['messageStyleTimeout_' + elementId] = setTimeout(function () {
      $("#messageDiv").fadeOut('slow', function () {
        $("#messageDiv").removeClass();
        $("#messageDiv").html('');
      });
    }, messageTimeout);

    if (elementId != 'none') {
      var classesToRemove = 'infoMessageLabel successMessageLabel warningMessageLabel errorMessageLabel modalMessage';
      $("#" + elementId).removeClass(classesToRemove);
      $("#" + elementId).addClass(labelStyle);

      window['labelStyleTimeout_' + elementId] = setTimeout(function () {
        $("#" + elementId).removeClass(classesToRemove);
      }, messageTimeout);
    }
  }

  renameItemRightClickSelected(element) {
    var li_id = $(element).parent().attr('id');
    $("#" + li_id + "_input").show().focus();
  }
  uploadButtonClicked(fromUploader) {
    if ($("#btnUpload").hasClass('disabled') == false) {
      if ($("#btnUpload").val() == 'Upload') {
        if ($(".treeViewUploader.upload").length) {
          $("#btnUpload").val('Close Upload');
          $(".treeViewUploader.upload").show();
          if (fromUploader == 1) {
            $(".treeViewUploader.upload").find('.qq-upload-drop-area').show();
          }
          var maxX = 0, maxY = 0, tmpX, tmpY, elem;
          $(".treeViewUploader").each(function (i, v) {
            elem = $(this),
              tmpX = elem.offset().left + elem.width(),
              maxX = (tmpX > maxX) ? tmpX : maxX,
              tmpY = elem.offset().top + elem.height(),
              maxY = (tmpY > maxY) ? tmpY : maxY;
          });
          var maxX = maxX;
          var cellRightPosition = $("#tdFileTreeMenu").offset().left + $("#tdFileTreeMenu").width();
          var rightDifference = maxX - cellRightPosition;
          if (rightDifference > 0) {
            var newWidth = $("#tdFileTreeMenu").width() + rightDifference + 30;
            $("#tdFileTreeMenu").width(newWidth);
          }

          $(".jqueryFileTree a").hide();
          $(".jqueryFileTree .file a").show();
          $(".jqueryFileTree .trash a").show();
        } else {
          var messageText = "You do not have permission to upload to any of the displayed folders";

          this.messageAlert(messageText, 'warningMessage', '', 'none');
        }
      } else {
        $("#btnUpload").val('Upload');
        $(".treeViewUploader.upload").hide();
        $(".jqueryFileTree a").show();
      }
    }
  }
  closefileprogress() {
    $('#UL-FileList').html('');
    document.getElementById('uploadProgressWindow').style.display = 'none';
  }
  createUploaders(event, files, folder_id, id, inputclass, drop_text_prefix, escapedVirtualFilePath) {

    this.loader.show();
    $('#UL-FileList').html('');
    $('#uploadProgressWindow').show();
    
    for (let i = 0; i < files.length; i++) {

      if (event.target.files.length > 0) {
        
        const file = files[i];
        const path = file.webkitRelativePath.split('/');
        var folder_path = escapedVirtualFilePath + path.slice(0, path.length - 1).join("/") + "/";
 
        this.sizeInMB = (file['size'] / (1024 * 1024)).toFixed(2);
        if (file['name'].length > 33) {
          this.file_nameformat = file['name'].slice(0, 19) + '...' + file['name'].slice(-13);
      }
      else{
        this.file_nameformat = file['name']
      }
          this["uploadcall"+i]  = this.FileManagerService.FolderUpload(folder_path, file, folder_id, id, inputclass, drop_text_prefix)

          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.Sent:
                $('#uploadProgressWindow').show();
                var textnode = $('#UL-FileList').append('<li id="uploadingprogress' + i + '" class=" qq-upload-success"><span class="qq-upload-file" style="margin-right: 7px;">' + this.file_nameformat+ ' </span> <span style="display: inline-block; width: 15px;height: 15px; vertical-align: text-bottom;margin-right: 7px;background: url(../../assets/images/ajax-loading.gif);" class="qq-upload-spinner" ></span><span class="qq-upload-size' + i + '" style="display: inline;margin-right: 7px;"> </span> <a id="cancelupload'+i+'" class="qq-upload-cancel"  >Cancel</a></li>')
                const cancelupload = document.querySelector('#cancelupload' + i);
                cancelupload.addEventListener('click', (e) => {

                  this.cancelupload( i);//your typescript function
                  
                  });
                break;
              case HttpEventType.ResponseHeader:

                break;
              case HttpEventType.UploadProgress:
                this.progress = Math.round(event.loaded / event.total * 100);

                $('.qq-upload-size' + i).html(' '+this.progress + '% from ' + (file['size'] / (1024 * 1024)).toFixed(2) + ' MB');

                break;
              case HttpEventType.Response:
                $('#uploadingprogress' + i + ' .qq-upload-spinner').hide();
                $('.qq-upload-size' + i).html((file['size'] / (1024 * 1024)).toFixed(2) + ' MB');
                $('#uploadingprogress' + i + ' .qq-upload-cancel').hide();
                $('#uploadingprogress' + i).append('<span style="margin-right: 7px;" class="qq-upload-success-text">Success</span>');

                this.uploadButtonClicked(0);
                setTimeout(() => {
                  this.progress = 0;

                  //this.loadsubfolders(folder_id, 'no');
                }, 1500);
                break;
              default:
              // $('#uploadingprogress'+i+' .qq-upload-cancel').hide();
              // $('#uploadingprogress'+i).append('<span class="qq-upload-failed-text">Failed</span>');
            }
          })

       
        //.pipe(first())
        // .subscribe(
        //   data => {
        //     if (data['status']) {

        //       this.loadsubfolders(folder_id, 'no');
        //     }

        //   }
        // );
      }

    }
    this.loader.hide();
  }
cancelupload(li_id)
{

  this.li_id_number = li_id;
  $('#uploadingprogress' +li_id).remove();
  // abort api call
  this["uploadcall"+li_id] .unsubscribe();
}

  configureUserInterface(cms) {
    $(".elementItemName").bind('keyup', function (e) {
      if (e.keyCode == 13) {
        // TODO allow enter key to trigger blur once and save any changes.
        //  This didn't work.  It was getting repeated.  $(this).parent().focus();
      }

    });

    // If any item selected is a trash item then we need to select all trash items
    var allAreRestorable = false;
    if ($(".trash.delete").length > 0 && ($(".trash.delete").length == $(".trashChild").length)) {
      allAreRestorable = true;
    } else {
      if ($(".trashChild").children().hasClass('ui-selected')) {
        var messageText = 'You can only restore items from trash if you have access to restore all items in the trash';

        this.messageAlert(messageText, 'warningMessage', '', 'none');
      }
    }

    // if ( $(".trash:not(.trashRoot)").children().hasClass('ui-selected')) {
    // 	$(".ui-selected").removeClass('ui-selected');
    // 	if ( $(".trash.delete").length > 0) {
    // 		$(".trash.delete").find('a').addClass('ui-selected');
    // 	}
    // }


    // Start other selected item checking
    if ($(".ui-selected").length > 1) {

      $("#btnToggleDetails").addClass('disabled');
      $("#filePreview").html('');
      $("#fileDetails").html('');
      $("#btnFolder").addClass('disabled');
      $("#btnRename").addClass('disabled');
      $("#btnUpload").addClass('disabled');
      $("#btnToggleDetails").addClass('disabled');

      var canDeleteAll = true;
      // Loop through all selected to check permissions for all
      $(".ui-selected").parent().each(function (index) {

        if ($(this).hasClass("delete") == false) {
          canDeleteAll = false;
        }

        if (canDeleteAll == false) {
          return false;
        }
      });

      if (canDeleteAll == true) {
        $("#btnDelete").removeClass('disabled');
      } else {
        $("#btnDelete").addClass('disabled');
      }

    } else if ($(".ui-selected").length == 1) {

      $("#btnToggleDetails").removeClass('disabled');

      // Configure New Folder permission and Some Upload
      // NOTE: New Folder is tied to the "upload" permission
      if ($(".ui-selected").parent().hasClass('upload')) {

        $("#btnFolder").removeClass('disabled');
        $("#btnUpload").removeClass('disabled');
        $("#btnToggleDetails").removeClass('disabled');
        // #btnUpload is controled below - Not dependent on how many items selected


      } else {

        // Hide New Folder options button
        $("#btnFolder").addClass('disabled');
        $("#btnUpload").addClass('disabled');
        $("#btnToggleDetails").addClass('disabled');

        // Hide New Folder options right click menu
        if ($("#rightClickMenu .new").length) {
          $("#rightClickMenu .new").addClass('hidden');
        }

        // Hide Upload options right click menu
        if ($("#rightClickMenu .upload").length) {
          $("#rightClickMenu .upload").addClass('hidden');
        }
      }

      // Configure Rename permission
      if ($(".ui-selected").parent().hasClass('rename')) {
        $("#btnRename").removeClass('disabled');
      } else {
        $("#btnRename").addClass('disabled');

        // Hide Rename options right click menu
        if ($("#rightClickMenu .edit").length) {
          $("#rightClickMenu .edit").addClass('hidden');
        }
      }

      // Configure Delete permission
      if ($(".ui-selected").parent().hasClass('delete')) {
        $("#btnDelete").removeClass('disabled');
      } else {
        // Hide Delete function options
        $("#btnDelete").addClass('disabled');
        if ($("#rightClickMenu .delete").length) {
          $("#rightClickMenu .delete").addClass('hidden');
        }
      }

    }
    var canRestoreAll = true;
    // Loop through all selected to check permissions for all
    $(".ui-selected").parent().each(function (index) {

      if ($(this).hasClass('delete') == false || $(this).hasClass('trash') == false) {
        canRestoreAll = false;
      }

      if (canRestoreAll == false) {
        return false;
      }
    });
   
    if (canRestoreAll == true && allAreRestorable == true) {
      $("#btnRestore").show();
      if ($("#rightClickMenu .restore").length) {
      }
    } else {
      $("#btnRestore").hide();
      if ($("#rightClickMenu .restore").length) {
        $("#rightClickMenu .restore").addClass('hidden');
      }
    }

    if ($('#' + cms).parent().hasClass('delete') && ($('#' + cms).parent().hasClass('trash'))) {

      $("#rightClickMenu .restore").removeClass('hidden');
    }
  }
  uploadRightClickSelected(element) {
    var li_id = $(element).parent().attr('id');
    if (document.all && document.querySelector && !document.addEventListener) {
      this.uploadButtonClicked(0);
    } else {
      $("#" + li_id).find('.treeViewUploader').first().show();
      $("#" + li_id).find('.qq-upload-button > input').first().focus().click();
    }
  }
  onListClick(event) {
    this.menuEvent = event;
    this.contextMenuSelector = event.srcElement;

    $(".jqueryFileTree li a").removeClass('ui-selected');
    $('#' + event.srcElement.id).addClass('ui-selected');
    this.initContextMenu(this.contextMenuSelector);

    if ($('#' + event.srcElement.id).parent().hasClass('trash')) {
      $("#rightClickMenu .emptyTrash").removeClass('hidden');
      $("#rightClickMenu .details").addClass('hidden');
      $("#rightClickMenu .deletePermanent").addClass('hidden');
      if ($('#' + event.srcElement.id).parent().hasClass('delete')) {
        $("#rightClickMenu .restore").removeClass('hidden');
        $("#rightClickMenu .deletePermanent").removeClass('hidden');
        $("#rightClickMenu .emptyTrash").addClass('hidden');
        $("#rightClickMenu .delete").addClass('hidden');
      }
    }
    else {

      if ($('#' + event.srcElement.id).parent().hasClass('projectRoot') || $('#' + event.srcElement.id).parent().hasClass('companyRoot')) {

        $("#rightClickMenu .emptyTrash").addClass('hidden');
        $("#rightClickMenu .deletePermanent").addClass('hidden');
        $("#rightClickMenu .new").removeClass('hidden');
        $("#rightClickMenu .upload").removeClass('hidden');
        $("#rightClickMenu .details").removeClass('hidden');
        $("#rightClickMenu .emptyTrash").addClass('hidden');

      }
      else {
        $("#rightClickMenu .new").removeClass('hidden');
        $("#rightClickMenu .upload").removeClass('hidden');
        $("#rightClickMenu .details").removeClass('hidden');
        $("#rightClickMenu .emptyTrash").addClass('hidden');
        $("#rightClickMenu li.restore.separator").addClass('hidden');
        $("#rightClickMenu .deletePermanent").addClass('hidden');
        if ($('#' + event.srcElement.id).parent().hasClass('delete')) {
          $("#rightClickMenu .delete").removeClass('hidden');
        }
        if ($('#' + event.srcElement.id).parent().hasClass('rename')) {
          $("#rightClickMenu .edit").removeClass('hidden');
        }
      }

    }
    if ($('#' + event.srcElement.id).parent().attr("class").indexOf('zip') > 0) {
      $("#rightClickMenu .zip").removeClass('hidden');
    }
    else {
      $("#rightClickMenu .zip").addClass('hidden');
    }
    this.configureUserInterface(event.srcElement.id);
  }
  initContextMenu(cms) {

    if (cms && this.menuEvent) {
      this.menuEvent.preventDefault();
      this.menuEvent.stopPropagation();
      this.createContextMenu(this.menuEvent.clientX, this.menuEvent.clientY);
      cms.addEventListener('click', e => {

        this.closeCurrentlyOpenedMenu();
      });
    }
  }

  createContextMenu(x, y) {
    this.closeCurrentlyOpenedMenu();
    this.isDisplayContextMenu = true;
    if (this.isDisplayContextMenu && this.elementRef.nativeElement) {

      const contextMenuDiv = this.elementRef.nativeElement.querySelector('.contextMenu');

      if (contextMenuDiv) {



        $(".rightClickMenu").show();
        this._currentMenuVisible = contextMenuDiv;
        contextMenuDiv.style.position = "fixed";
        contextMenuDiv.style.left = x + "px";
        contextMenuDiv.style.top = y + "px";
      }
    }
  }
  closeCurrentlyOpenedMenu() {
    if (this._currentMenuVisible !== null) {
      $(".rightClickMenu").hide();

      $(this).addClass('ui-selected');
      this.closeContextMenu(this._currentMenuVisible);
    }
  }
  /* close context menu on left click */
  @HostListener('document:click')
  documentClick(e): void {

    $(".rightClickMenu").hide();
    this.isDisplayContextMenu = false;

  }

  /* close context menu on "ESC" key keypress */
  @HostListener('window:onkeyup')
  escKeyClick(): void {
    $(".rightClickMenu").hide();
    this.isDisplayContextMenu = false;
  }
  closeContextMenu(menu) {
    $(".rightClickMenu").hide();
    menu.style.left = '0px';
    menu.style.top = '0px';
    this._currentMenuVisible = null;
  }

  downloadRightClickSelected() {
    var arrMovedFolderListItems = [];
    var arrMovedFileListItems = [];
    var isTrash = 'no';
    var trashRel = '';
    var isFolderTrash = 1;
    // Get the folders that were selected
    $(".ui-selected").each(function (index) {
      if ($(this).parent().hasClass('directory')) {
        isTrash = 'no';
        trashRel = $(this).parent().attr('rel');
        isFolderTrash = 1;
        if (trashRel != '/Trash/') {
          isFolderTrash = 0;
        }
        if (isFolderTrash == 0) {
          isTrash = 'yes';
        }
        var movedFolderListItem = $(this).parent().attr('id').replace('liFolder_', '');
        arrMovedFolderListItems.push(movedFolderListItem);
      }
    });

    // Loop through the files that were selected and check if their parent folder is already in the folder list.
    var parent_file_manager_folder_id;
    $(".ui-selected").each(function (index) {
      if ($(this).parent().hasClass('file')) {
        isTrash = 'no';
        trashRel = $(this).parent().attr('rel');
        isFolderTrash = 1;
        if (trashRel != '/Trash/') {
          isFolderTrash = trashRel.indexOf('/Trash/');
        }
        if (isFolderTrash == 0) {
          isTrash = 'yes';
        }
        parent_file_manager_folder_id = $(this).parent().parent().parent().attr('id').replace('liFolder_', '');
        if ($.inArray(parent_file_manager_folder_id, arrMovedFolderListItems) < 0) {
          var movedFileListItem = $(this).parent().attr('id').replace('li_', '');
          arrMovedFileListItems.push(movedFileListItem);
        }
      }
    });

    //var parent_file_manager_folder_id = $(".ui-selected").first().parent().parent().parent().attr('id').replace('liFolder_', '');

    var csvMovedFolderListItems = arrMovedFolderListItems.join(',');
    var csvMovedFileListItems = arrMovedFileListItems.join(',');
    this.loader.show();
    this.FileManagerService.downloadRightClickSelected(csvMovedFolderListItems, csvMovedFileListItems)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
        });

  }

  viewpdffile(file, isImage) {

    $(".ui-selected").removeClass('ui-selected');
    $("#a_liFolder_" + file).addClass('ui-selected');
    this.loader.show();
    this.FileManagerService.downloadPDF(file, isImage)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data == '2') {
            $('#fileerrormessage').html('<span style="color:red;">Filepath does not exist in cloud backend file system.</span>');

          }
          else if (data == '3') {
            $('#fileerrormessage').html('<span style="color:red;">The ability to preview files  is not yet available.</span>');

          }
          else if (data == '1') {
            $('#fileerrormessage').html('<span style="color:red;">You don\'t have permission to access this file , please contact admin or project manager.</span>');

          }
          else {
            $("#filePreview").html('<iframe id="iframeFilePreview" src="' + data + '" style="border:0;" width="98%" height="300%"></iframe>');
           
            var minHeight = $(window).height() - $("#filePreview").offset().top;
            $("#filePreview").height('900px'); //To make the file preview space larger
            $("#filePreview").width('1000px');
            if ($("#filePreview img").length) {
              $("#filePreview").height('100%');
              $("#filePreview").width('100%');
            }
          }





        });
  }

  loadsubfolders(postdir, istrashvar) {
    this.loader.show();
    $(".ui-selected").removeClass('ui-selected');
    $("#a_liFolder_" + postdir).addClass('ui-selected');
    this.configureUserInterface(postdir);

    if (($("#liFolder_" + postdir).attr('rel') != '/Trash/') && ($("#liFolder_" + postdir).attr('rel') != undefined)) {
      var isFolderTrash = $("#liFolder_" + postdir).attr('rel').indexOf('/Trash/');
      if (isFolderTrash == 0) {
        this.isTrash = 'yes';
      }
      else {
        this.isTrash = istrashvar;
      }

    }
    else {
      this.isTrash = istrashvar;
    }
    if (($('#liFolder_' + postdir).hasClass('collapsed'))) {
      $("#liFolder_" + postdir).addClass('wait');
      $("#filePreview").html('');
      $('#fileerrormessage').html('');
      $("#filePreview").show();
      this.FileManagerService.getFileManagersLists(postdir, this.isTrash)
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            $("#liFolder_" + postdir).removeClass('wait');
            if (data['status']) {

              if (data['body'] != '') {
                if (data['body']['subfolders'] !== undefined) {
                  if ((data['body']['subfolders'].length)) {

                    for (let subfolderlist of data['body']['subfolders']) {

                      if (subfolderlist.escapedActiveVirtualFolder !== undefined) {

                        // if (document.getElementById("liFolder_" + subfolderlist.folder_id) === null) { hided for issue regarding,subfolders shows undefined null property addeventlistner

                        var node = document.createElement("li");                 // Create a <li> node
                        var nodea = document.createElement("a");
                        var divnode = document.createElement("div");
                        divnode.setAttribute('class', "div_unique" + subfolderlist.folder_id);

                        node.setAttribute('id', "liFolder_" + subfolderlist.folder_id);
                        node.setAttribute('class', subfolderlist.permissionClassList + " directory collapsed appended_li" + subfolderlist.folder_id);
                        node.setAttribute('rel', subfolderlist.escapedFullVirtualFilePath);
                        nodea.setAttribute('id', "a_liFolder_" + subfolderlist.folder_id);
                        nodea.setAttribute('rel', subfolderlist.folder_id);
                        var textnode = document.createTextNode(subfolderlist.escapedActiveVirtualFolder);

                        nodea.appendChild(textnode);        // Create a text node


                        node.appendChild(nodea);
                        var inputnode = document.createElement("INPUT");
                        inputnode.setAttribute("type", "text");
                        inputnode.setAttribute('id', "liFolder_" + subfolderlist.folder_id + '_input');
                        inputnode.setAttribute('class', "elementItemName");
                        inputnode.setAttribute('rel', subfolderlist.escapedActiveVirtualFolder);
                        inputnode.setAttribute('value', subfolderlist.escapedActiveVirtualFolder);
                        inputnode.setAttribute('style', "display:none;");
                        node.appendChild(inputnode);

                        node.appendChild(divnode);
                        node.addEventListener("click", (event: Event) => {

                          if ((<HTMLInputElement>event.target).tagName != 'INPUT') {
                            this.loadsubfolders(subfolderlist.folder_id, 'no');
                          }

                          event.stopPropagation();

                        });
                        inputnode.addEventListener('blur', (event: Event) => {
                          event.stopPropagation();
                          this.updateNodeNameFromTree(event, "liFolder_" + subfolderlist.folder_id, subfolderlist.folder_id, 'folder', subfolderlist.file_ext, subfolderlist.permissionClassList);

                        });
                        $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');

                      }
                      else {

                        var node = document.createElement("li");                 // Create a <li> node
                        var nodea = document.createElement("a");
                        var divnode = document.createElement("div");
                        divnode.setAttribute('class', "div_unique" + subfolderlist.folder_id);

                        $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');
                        $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');
                        node.setAttribute('id', "liFolder_" + subfolderlist.folder_id);
                        node.setAttribute('class', subfolderlist.permissionClassList + " collapsed file ext_" + subfolderlist.ext + "  appended_li" + subfolderlist.folder_id);
                        var textnode = document.createTextNode(subfolderlist.escapedVirtualFileName);
                        nodea.setAttribute('id', "a_liFolder_" + subfolderlist.folder_id);
                        nodea.setAttribute('class', "ellipsis_file_content");
                        nodea.setAttribute('data-toggle', 'tooltip');
                        nodea.setAttribute('data-original-title', subfolderlist.folder_id);
                        nodea.setAttribute('data-title', subfolderlist.folder_id);

                        nodea.appendChild(textnode);

                        node.appendChild(nodea);
                        var inputnode = document.createElement("INPUT");
                        inputnode.setAttribute("type", "text");
                        inputnode.setAttribute('id', "liFolder_" + subfolderlist.folder_id + '_input');
                        inputnode.setAttribute('class', "elementItemName");
                        inputnode.setAttribute('rel', subfolderlist.escapedVirtualFileName);
                        inputnode.setAttribute('value', subfolderlist.escapedVirtualFileNameWithoutExtention);
                        inputnode.setAttribute('style', "display:none;");
                        node.appendChild(inputnode);
                        node.appendChild(divnode);
                        inputnode.addEventListener('blur', (event: Event) => {
                          event.stopPropagation();
                          this.updateNodeNameFromTree(event, "liFolder_" + subfolderlist.folder_id, subfolderlist.folder_id, 'file', subfolderlist.file_ext, subfolderlist.permissionClassList);

                        });

                        if (subfolderlist.ext == 'jpg' || subfolderlist.ext == 'png' || subfolderlist.ext == 'gif' || subfolderlist.ext == 'tif' || subfolderlist.ext == 'jpeg') {
                          this.isImage = 1;
                        }

                        node.addEventListener("click", (event: Event) => {

                          if ((<HTMLInputElement>event.target).tagName != 'INPUT') {
                            this.viewpdffile(subfolderlist.folder_id, this.isImage);
                          }

                          event.stopPropagation();

                        });


                      }


                      if (document.getElementById("liFolder_" + postdir) !== null) {
                        if (node !== undefined) {

                          document.getElementById("liFolder_" + postdir).appendChild(node);
                        }
                      }
                      if (subfolderlist.escapedActiveVirtualFolder !== undefined) {
                        //append uploader div
                        $('.div_unique' + subfolderlist.folder_id).
                          append('<div id="uploader_' + subfolderlist.folder_id + '" class="treeViewUploader ' + subfolderlist.permissionClassList + ' uploaderInitialized" drop_text_prefix="' + subfolderlist.escapedActiveVirtualFolder + '" folder_id="' + subfolderlist.folder_id + '" virtual_file_path="' + subfolderlist.escapedVirtualFilePath + '" file_name="" action="" allowed_extensions="" style="height:23px"><div class="qq-uploader"><div class="qq-upload-drop-area" style="display: none;"><img src="assets/images/icons/file-upload.png" width="15" height="17" alt="">' + subfolderlist.escapedActiveVirtualFolder + ' Drop Here</div><div class="qq-upload-button" style="position: relative; overflow: hidden; direction: ltr;"><img src="assets/images/icons/file-upload.png" width="15" height="17" alt="">' + subfolderlist.escapedActiveVirtualFolder + ' Drop or Click Files<input multiple="multiple" type="file" name="file" #folderInput webkitdirectory id="input_field_upload' + subfolderlist.folder_id + '" style="position: absolute; right: 0px; top: 0px; font-family: Arial; font-size: 118px; margin: 0px; padding: 0px; cursor: pointer; opacity: 0;"></div></div></div>');

                        const selectElement = document.getElementById('input_field_upload' + subfolderlist.folder_id);

                        selectElement.addEventListener('change', (event: Event) => {

                          this.createUploaders(event, (<HTMLInputElement>document.getElementById('input_field_upload' + subfolderlist.folder_id)).files, subfolderlist.folder_id, 'uploader_' + subfolderlist.folder_id, 'treeViewUploader upload', subfolderlist.escapedActiveVirtualFolder, subfolderlist.escapedVirtualFilePath);

                        });
                      }

                    }
                  }

                }
                else {
                  //trash folders & files

                  if ((data['body']['trash'].length)) {
                    for (let subfolderlist of data['body']['trash']) {
                      if (subfolderlist.escapedActiveVirtualFolder !== undefined) {

                        if (document.getElementById("liFolder_" + subfolderlist.folder_id) === null) {

                          var node = document.createElement("li");                 // Create a <li> node
                          var nodea = document.createElement("a");
                          node.setAttribute('id', "liFolder_" + subfolderlist.folder_id);
                          node.setAttribute('rel', subfolderlist.escapedFullVirtualFilePath);
                          node.setAttribute('class', subfolderlist.permissionClassList + " directory collapsed trash appended_li" + subfolderlist.folder_id);
                          nodea.setAttribute('id', "a_liFolder_" + subfolderlist.folder_id);
                          var textnode = document.createTextNode(subfolderlist.escapedActiveVirtualFolder);

                          nodea.appendChild(textnode);        // Create a text node

                          node.appendChild(nodea);
                          node.addEventListener("click", (event: Event) => {
                            if ((<HTMLInputElement>event.target).tagName != 'INPUT') {
                              this.loadsubfolders(subfolderlist.folder_id, 'yes');
                            }
                            event.stopPropagation();

                          });
                          $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');

                        }
                      }
                      else {
                        var node = document.createElement("li");                 // Create a <li> node
                        var nodea = document.createElement("a");

                        $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');
                        $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded');
                        node.setAttribute('id', "liFolder_" + subfolderlist.folder_id);
                        nodea.setAttribute('id', "a_liFolder_" + subfolderlist.folder_id);
                        node.setAttribute('class', subfolderlist.permissionClassList + " collapsed file ext_" + subfolderlist.ext + "  appended_li" + subfolderlist.folder_id);
                        var textnode = document.createTextNode(subfolderlist.escapedVirtualFileName);

                        nodea.appendChild(textnode);        // Create a text node

                        node.appendChild(nodea);

                        if (subfolderlist.ext == 'jpg' || subfolderlist.ext == 'png' || subfolderlist.ext == 'gif' || subfolderlist.ext == 'tif' || subfolderlist.ext == 'jpeg') {
                          this.isImage = 1;
                        }

                        node.addEventListener("click", (event: Event) => {
                          this.viewpdffile(subfolderlist.folder_id, this.isImage);
                          event.stopPropagation();

                        });

                      }
                      if (document.getElementById("liFolder_" + postdir) !== null) {
                        if (node !== undefined) {

                          document.getElementById("liFolder_" + postdir).appendChild(node);
                        }
                      }
                    }


                  }

                }
              } else { $('#liFolder_' + postdir).removeClass('collapsed').addClass('expanded'); }
            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }
            }
          }
        );
    }
    else {
      this.loader.hide();
      $("#filePreview").html('');
      $('#fileerrormessage').html('');
      $('#liFolder_' + postdir).find('li').remove();
      $('#liFolder_' + postdir).removeClass('expanded').addClass('collapsed');
    }
  }
  updateNodeNameFromTree(event, elementId, nodeId, nodeType, fileExt, permission) {

    try {

      var oldValue = $("#" + elementId + " > a").text();
      var newValue = $("#" + elementId + "_input").val();

      var oldValueNoExtension = oldValue.substring(0, oldValue.lastIndexOf('.'));

      if ($.trim(oldValueNoExtension) != $.trim(newValue)) {




        this.loader.show();
        this.FileManagerService.EditnodenameFromTree(newValue, elementId, nodeId, nodeType, fileExt, permission)
          .pipe(first())
          .subscribe(
            data => {
              this.loader.hide();
              if (data['status']) {
                $('#a_liFolder_' + nodeId).html(data['body']['newname']);


              }
              else {
                this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
                // logout if user is  inactive for 1 hour, token invalid condition
                if (data['code'] == '5') {
                }

              }
            }
          );
      }

      $("#" + elementId + "_input").hide();

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }

  updateNodeNameFromDetails_properties(event, elementId, nodeId, nodeType, fileExt, permission) {

    try {

      var newValue = $("#detailsTheNodeName").val();
      this.loader.show();
      this.FileManagerService.EditnodenameFromTree(newValue, elementId, nodeId, nodeType, fileExt, permission)
        .pipe(first())
        .subscribe(
          data => {
            this.loader.hide();
            if (data['status']) {
              $('#detailsTheNodeName').html(data['body']['newname']);
              $('#a_liFolder_' + nodeId).html(data['body']['newname']);
              $('#liFolder_' + nodeId + '_input').val(data['body']['newname']);
            }
            else {
              this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
              // logout if user is  inactive for 1 hour, token invalid condition
              if (data['code'] == '5') {
              }

            }
          }
        );


      $("#" + elementId + "_input").hide();

    } catch (error) {


      var errorMessage = error.message;
      alert('Exception Thrown: ' + errorMessage);
      return;


    }
  }
  showsubmenu(param) {
    if (param == 'completed') {
      this.isShown = !this.isShown;
    }
    else if (param == 'other') {
      this.isShownOther = !this.isShownOther;
    }
    else if (param == 'active') {
      this.isShownActive = !this.isShownActive;
    }
    else if (param == 'file_manager') {
      this.isShownFileManager = !this.isShownFileManager;
    } else if (param == 'reports') {
      this.isShownReports = !this.isShownReports;
    }


  }
  file_manager() {
    this.router.navigate(['/modules-file-manager-file-browser'],
      {
        queryParams: {
          pid: this.pid
        }
      });

  }
  punchlist() {
    this.router.navigate(['/project-management/punch_list'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }
  dashboard() {
    this.router.navigate(['/dashboard'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }
  reportslist() {
    this.router.navigate(['/modules-report-form'],
      {
        queryParams: {
          pid: this.pid
        }
      });
  }
  getFileManagers(): void {
    this.loader.show();
    this.FileManagerService.getFileManagersLists(this.postdir, this.isTrash)
      .pipe(first())
      .subscribe(
        data => {
          this.loader.hide();
          if (data['status']) {

            this.folderlist = data['body']['folders'];
            this.displayTrash = data['body']['trash']['displayTrash'];
          }
          else {
            this.messageAlertFM(data['body']['error'], 'warningMessage', '', '');
            // logout if user is  inactive for 1 hour, token invalid condition
            if (data['code'] == '5') {
            }

          }
        }
      );
  }
}




