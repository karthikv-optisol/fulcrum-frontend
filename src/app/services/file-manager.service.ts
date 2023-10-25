import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import * as Constant from '../constant/constant';
import { Observable, throwError } from 'rxjs';
import { saveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  private filemanagerurl = Constant.BE_URL + "api/filemanager/modules-file-manager-file-browser";
  private folderuploadurl = Constant.BE_URL + "api/filemanager/modules-file-manager-file-uploader-ajax";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

  };
  private httpOptions_upload = {
    headers: new HttpHeaders({
    }),

  };
  parseduser = JSON.parse(localStorage.getItem('users'));
  projectId = this.parseduser.projectId;
  id = this.parseduser.id;

  user_company_id = this.parseduser.user_company_id;
  primary_contact_id = this.parseduser.primary_contact_id;

  role_id = this.parseduser.role_id;
  currentlySelectedProjectId = this.parseduser.currentlySelectedProjectId;
  currentlySelectedProjectName = this.parseduser.currentlySelectedProjectName;
  currentlySelectedProjectUserCompanyId = this.parseduser.currentlySelectedProjectUserCompanyId;
  currentlyActiveContactId = this.parseduser.currentlyActiveContactId;
  methodCall = 'loadFiles';

  postidList = '';
  getidList = '';
  postisTrash = 'no';
  getisTrash = ''; postdir = '';

  getdir = '';

  userRole = JSON.parse(localStorage.getItem('users'));
  pid: string;


  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {

    this.route.queryParams.subscribe(params => {
      this.pid = params['pid'];
    });
  }

  FolderUpload(folder_path, virtual_file_path: File, folder_id, id, inputclass, drop_text_prefix): Observable<any> {
    const headers = new HttpHeaders();
    let data = {
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      currentlyActiveContactId: this.currentlyActiveContactId,
      method: '',
      virtual_file_path: virtual_file_path,
      folder_id: folder_id,
      id: id,
      class: inputclass,
      drop_text_prefix: drop_text_prefix,
      // projectId: this.projectId,
      projectId: this.pid,
      virtual_file_name: '',
      post_upload_js_callback: '',
      prepend_date_to_filename: '',
      append_date_to_filename: '',
      folder_path: folder_path,
    };


    var formData = new FormData();
    formData.append('virtual_file_path', virtual_file_path);
    formData.append('user_company_id', this.user_company_id);
    formData.append('currentlySelectedProjectId', this.pid);
    formData.append('currentlySelectedProjectName', this.currentlySelectedProjectName);
    formData.append('currentlySelectedProjectUserCompanyId', this.currentlySelectedProjectUserCompanyId);
    formData.append('currentlyActiveContactId', this.currentlyActiveContactId);
    formData.append('method', '');
    formData.append('folder_id', folder_id);
    formData.append('id', id);
    formData.append('class', inputclass);
    // formData.append('projectId', this.projectId);
    formData.append('projectId', this.pid);
    formData.append('virtual_file_name', '');
    formData.append('post_upload_js_callback', '');
    formData.append('prepend_date_to_filename', '');
    formData.append('append_date_to_filename', '');
    formData.append('folder_path', folder_path);

   // return this.httpClient.post<any>(this.folderuploadurl, formData, this.httpOptions_upload);
   return this.httpClient
   .post(this.folderuploadurl, formData, {
     reportProgress: true,
     observe: 'events',
   })
   .pipe(catchError(this.errorMgmt));
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
  EditnodenameFromTree(newValue, elementId, nodeId, nodeType, fileExt, permission): Observable<any> {

    let data = {
      projectId: this.pid,
      user_company_id: this.user_company_id,

      methodCall: 'updateNodeName',

      elementId: elementId,
      nodeId: nodeId,
      nodeType: nodeType,
      getisTrash: this.getisTrash,
      rename_privilege: 'Y',
      fileExt: fileExt,
      newValue: newValue
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  moveItemsToRecycleBin(folders, files, parent_file_manager_folder_id): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,

      methodCall: 'moveItemsToRecycleBin',

      folders: folders,
      files: files,
      parent_file_manager_folder_id: parent_file_manager_folder_id,
      delete_privilege: 'Y',
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  createNewFolder(parent_file_manager_folder_id, newFolderName): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      currentlyActiveContactId: this.currentlyActiveContactId,

      methodCall: 'createNewFolder',
      userRole: this.userRole.userRole,

      folderName: newFolderName,
      parent_file_manager_folder_id: parent_file_manager_folder_id,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  permanentlyDeleteItemsFromRecycleBin(folders, files, parent_file_manager_folder_id): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'permanentlyDeleteItemsFromRecycleBin',
      userRole: this.userRole.userRole,
      folders: folders,
      files: files,
      parent_file_manager_folder_id: parent_file_manager_folder_id,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  restoreItemsFromRecycleBin(folders, files, parent_file_manager_folder_id): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'restoreItemsFromRecycleBin',
      folders: folders,
      files: files,
      parent_file_manager_folder_id: parent_file_manager_folder_id,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  loadDetails(nodeId, nodeType, isTrash, elementId): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'loadDetails',
      userRole: this.userRole.userRole,
      nodeType: nodeType,
      nodeId: nodeId,
      isTrash: isTrash,
      elementId: elementId, currentlySelectedProjectName: this.currentlySelectedProjectName,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  toggleAllPermissionsForRole(elementId, nodeType, checkAll) {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'toggleAllPermissionsForRole',
      userRole: this.userRole.userRole,
      nodeType: nodeType,
      checkAll: checkAll,
      elementId: elementId, currentlySelectedProjectName: this.currentlySelectedProjectName,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }

  toggleFileFolderPermission(elementId, nodeType, isChecked) {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'toggleFileFolderPermission',
      userRole: this.userRole.userRole,
      nodeType: nodeType,
      isChecked: isChecked,
      elementId: elementId, currentlySelectedProjectName: this.currentlySelectedProjectName,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }

  applyPermissionsToFolderContents(file_manager_folder_id) {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'applyPermissionsToFolderContents',
      userRole: this.userRole.userRole,
      file_manager_folder_id: file_manager_folder_id,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      role_id: this.role_id,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  applyPermissionsToFileSiblings(parent_file_manager_folder_id, fileId) {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      primary_contact_id: this.primary_contact_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'applyPermissionsToFileSiblings',
      userRole: this.userRole.userRole,
      parent_file_manager_folder_id: parent_file_manager_folder_id,
      fileId: fileId,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }

  emptyTrash() {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'permanentlyemptytheTrash',


    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );

  }
  getData() {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/users')
      .pipe(
        map((response: []) => response.map(item => item['name']))
      )
  }
  searchPreviewFile(term) {
    let data = {
      projectId: this.pid,
      currentlySelectedProjectId: this.projectId,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      user_company_id: this.user_company_id,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'searchByFilename',
      term: term,
      userRole: this.userRole.userRole,


    };

    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(
          data => { return data; }
        )
      );

  }
  getFileManagersLists(postdir, postisTrash): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id: this.primary_contact_id,
      role_id: this.role_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: this.methodCall,
      postidList: this.postidList,
      getidList: this.getidList,
      postisTrash: (postisTrash != '') ? postisTrash : this.postisTrash,
      getisTrash: this.getisTrash,
      postdir: (postdir != '') ? postdir : this.postdir,
      getdir: this.getdir,
      userRole: this.userRole.userRole
    };
    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions)
      .pipe(
        map(data => { return data; })
      );
  }
  base64ToArrayBuffer(base64: any): ArrayBuffer {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }


  downloadRightClickSelected(folders, file): Observable<Blob> {
    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id: this.primary_contact_id,
      role_id: this.role_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'download',
      postidList: this.postidList,
      getidList: this.getidList,
      postisTrash: 'no',
      getisTrash: this.getisTrash,
      postdir: '',
      getdir: this.getdir,
      file: file,
      isImage: '',
      folders: folders,
      userRole: this.userRole.userRole
    };
    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions).pipe(
      map(res => {
        if ((res['body'] == '2') || (res['body'] == '3') || (res['body'] == '1')) {
          return res['body'];
        }

        else {
          let response = this.base64ToArrayBuffer(res['body']['zippath']);

          let file = new Blob([response], { type: 'application/zip' });

          var fileURL = URL.createObjectURL(file);
          saveAs(fileURL, res['body']['finalArchiveName'])


        }

      })
    );

  }

  downloadPDF(file, isImage): Observable<any> {

    let data = {
      // projectId: this.projectId,
      projectId: this.pid,
      user_company_id: this.user_company_id,
      primary_contact_id: this.primary_contact_id,
      role_id: this.role_id,
      currentlySelectedProjectId: this.pid,
      currentlySelectedProjectName: this.currentlySelectedProjectName,
      currentlySelectedProjectUserCompanyId: this.currentlySelectedProjectUserCompanyId,
      currentlyActiveContactId: this.currentlyActiveContactId,
      methodCall: 'loadPreview',
      postidList: this.postidList,
      getidList: this.getidList,
      postisTrash: 'no',
      getisTrash: this.getisTrash,
      postdir: '',
      getdir: this.getdir,
      file: file,
      isImage: isImage,
      userRole: this.userRole.userRole
    };
    return this.httpClient.post<any>(this.filemanagerurl, data, this.httpOptions).pipe(
      map(res => {
        if ((res['body'] == '2') || (res['body'] == '3') || (res['body'] == '1')) {
          return res['body'];
        }

        else {
          let response = this.base64ToArrayBuffer(res['body']);

          let file = new Blob([response], { type: 'application/pdf' });

          var fileURL = URL.createObjectURL(file);
          return fileURL;
        }


      })
    );
  }
}


