import { Component, Input, OnInit, Renderer2, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { BindingService, EntityDefinition, IDataVariable, IPageBase64, ObjectState, PageRequest, PageSide, PluginEventExecutionRequest, PluginEventsService, VariableService, Workitem, WorkitemPageService } from '@sybrin/plugin-client';
import { Observable } from 'rxjs';
import { distinctUntilChanged, first, map, tap, filter, concatAll } from 'rxjs/operators';
import { ImgsolCustomMailboxProperties } from 'imgsol-custom-mailbox-common';
import { DomSanitizer, SafeResourceUrl, BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { resolve } from 'url';
import { createElement } from '@angular/core/src/view/element';
import { PageService } from '../services/get-page-data.service';
// import { read } from 'fs';
// import { error } from 'console';


interface Email {
  sender: string; subject: string;
  body: string; folder: string;
  recipients: string; cc: string;
  date: string; isFavorite: boolean;
  id: string;
}

@Component({
  selector: 'imgsol-custom-mailbox-mailbox-main-page',
  templateUrl: './mailbox-main-page.component.html',
  styleUrls: ['./mailbox-main-page.component.css']
})

export class MailboxMainPageComponent implements OnInit {

  @Input() public properties: ImgsolCustomMailboxProperties;
  inboxActive: boolean = true;
  sentActive: boolean = false; outboxActive: boolean = false;
  trashActive: boolean = false; showReplySection: boolean = false;
  attachmentPage: boolean = false;
  default: boolean = false; selectedEmail: Workitem | null = null;

  workItems$: Observable<{
    variable: IDataVariable;
    workitems: Workitem[]; entityDefinition: EntityDefinition
  }>;

  addressBookVar$: Observable<{
    variable: IDataVariable;
    workitems: Workitem[]; entityDefinition: EntityDefinition
  }>;

  allWorkItems$: Observable<{
    variable: IDataVariable;
    workitems: Workitem[]; entityDefinition: EntityDefinition
  }>;

  uploadedFiles: File[] = [];
  fileURLs: string[] = [];
  recipient: string = '';
  sender: string = '';
  subject: string = '';
  cc: string = '';
  body: string = '';
  attachment: File | null = null;
  searchQuery: string = '';
  isSidebarExpanded = true;
  isSearchDropdownOpen = false; allEmails: Email[] = [];
  showComposeModal = false;
  testuploadedFiles: File[] = [];
  isDragging: boolean = false;
  private initialX: number = 0; private initialY: number = 0;
  private offsetX: number = 0; private offsetY: number = 0;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  public attachments: File[] = []; public testfileURLs: string[] = [];
  showDocumentPreviewModal = false;
  selectedPreviewType: 'pdf' | 'doc' | 'csv' | 'txt' | 'docx' | 'image' | null = null;
  selectedPreviewURL: SafeResourceUrl | null = null;
  isDocumentPreviewDragging: boolean = false;
  private documentPreviewLongPressTimer: ReturnType<typeof
    setTimeout> | null = null;
  // Added to track long press timer
  documentPreviewIsCursorInside: boolean = false;

  // Added to track if cursor is inside the document preview modal
  private documentPreviewInitialX = 0;
  private documentPreviewInitialY = 0;
  private documentPreviewOffsetX = 0;
  private documentPreviewOffsetY = 0;

  selectedPreviewContent: string | null = null;

  selectedFolder: string = 'Inbox';

  showReplyModal: boolean = false;
  showForwardModal: boolean = false;
  replySubject: string = '';
  replyRecipient: string = '';
  replyBody: string = '';
  replyAttachment: File | null = null;
  replyAttachments: File[] = [];
  pageRequests: any;
  isReply: boolean = false;
  attachments$: any;

  testemails: Email[] = [
    {
      sender: 'abc@gx.com',
      subject: 'Hello from Angular',
      body: 'This is an example email...',
      folder: 'Inbox',
      recipients: 'abe@hgmail.co.dr',
      cc: 'c@ccmail.cc.com',
      date: 'Date',
      isFavorite: false,
      id: 'EMAIL_ID_0001'
    }];



  testfilteredEmails: Email[] = [];
  //  testselectedEmail: Email | null = null;
  testselectedEmail: any;
  testSelectedEmailID: string | null = null;
  emailTrail: Workitem[] = [];
  addressBookID$: Observable<{ variable: IDataVariable; workitems: Workitem[]; entityDefinition: EntityDefinition; }>;
  boduHtmlElement: HTMLElement;
  bodyHtmlElement: HTMLElement;
  emailSent: boolean = false;
  filteredSuggestions: string[] = [];
  suggestions: string[] = ['tawandagutsa@outlook.com', 'tgutsa@imgsol.co.zw', 'adingiswayo@imgsol.co.zw'];
  selectedAttachment: any;
  vworkItems: Workitem[];
  messageContent: string;
  isHtml: boolean;
  openedEmails: { [key: string]: boolean } = {};
  workitems: any[] = []

  clickCountMap: Map<any, number> = new Map();
  responseMessageBody: string = '';
  emailTrailMatchesSubject: boolean;
  hasTrail: number;
  showAddressBook: boolean = false;
  composeTo: boolean = false;
  composeCC: boolean = false;
  replyTo: boolean = false;
  private mouseX = 0;
  private mouseY = 0;


  constructor(private bindingService: BindingService, private variableService: VariableService, private workItemPageService: WorkitemPageService,
    private sanitizer: DomSanitizer, private el: ElementRef, private renderer: Renderer2, private pageService: PageService, private eventService: PluginEventsService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {

    // this.allEmails = this.testemails;

    this.addressBookVar$ = this.bindingService.get(this.properties.addressBookBindingConfig);
    this.addressBookVar$.subscribe((v) => {
      console.log("V: ", v);
    })

    // Call the showEmailsByFolder function to display inbox emails on initialization
    this.showEmailsByFolder('Inbox', new Event('Init'));


  }

  @Input() documentUrl: string;

  isDocumentSupported(): boolean {
    return this.isPdfDocument() || this.isWordDocument();
  }

  isWordDocument(): boolean {
    return this.documentUrl.endsWith('.doc') || this.documentUrl.endsWith('.docx');
  }

  isPdfDocument(): boolean {
    return this.documentUrl.endsWith('.pdf');
  }

  toggleFavorite() {
    if (this.testselectedEmail) {
      this.testselectedEmail.isFavorite = !this.testselectedEmail.isFavorite;
      if (this.testselectedEmail.isFavorite) {
        this.testselectedEmail.folder = 'Important';
      } else {
        this.testselectedEmail.folder = 'Inbox';
      }
    }
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  toggleSearchDropdown() {
    this.isSearchDropdownOpen = !this.isSearchDropdownOpen;
  }

  hideSearchDropdown() {
    this.isSearchDropdownOpen = false;
  }

  increaseClickCount(email: any): void {
    const folderId = email.properties.FolderID;
    const folder = email.properties.Folder;

    if (folderId !== '99' && folder === 'Inbox') { // Check if unread
      const updatedEmail = { ...email };
      updatedEmail.properties.FolderID = '99'; // Mark as read

      const updates = [{
        ID: updatedEmail.ID,
        properties: { ...updatedEmail.properties },
        State: ObjectState.Modified
      }];

      // Assuming you have a variable service to update and save work items
      const variableId = this.properties.dataBindingConfig.variableId;
      this.variableService.updateVariableWorkitems(variableId, updates)
        .then(() => {
          this.variableService.saveVariableData(variableId, this.properties.instanceInfo)
            .then(() => {
              // Print success messages or perform any other actions
              console.log('Work item updated and saved successfully.');
            })
            .catch(error => {
              console.error('Error saving work item:', error);
            });
        })
        .catch(error => {
          console.error('Error updating work item:', error);
        });
    }
  }



  async showEmailDetails(workItem: Workitem) {
    this.isReply = false;
    this.hasTrail = 0;
    let variableID = this.properties.dataBindingConfig.variableId;

    await this.variableService.setVariableCurrentItem(variableID, workItem.ID);

    this.testSelectedEmailID = workItem.ID;
    this.emailTrail = this.getEmailTrail(workItem);
    this.testselectedEmail = workItem;
    const body = this.testselectedEmail.properties.MessageBody;
    const htmlElement = this.createHtmlElement(body);
    const tempcontainer = document.createElement("div");
    tempcontainer.innerHTML = body;

    const isHtml = /^<html|<!doctype/i.test(body);
    console.log("IsHtml: ", isHtml);

    this.messageContent = body;
    this.isHtml = isHtml || /^<div|<meta/i.test(body);

    console.log('Test Selected Email: ', this.testselectedEmail);

    const currentSubject = workItem.properties.Subject.includes(": ") ? workItem.properties.Subject.split(": ")[1] : workItem.properties.Subject;
    console.log('Current Subject: ', currentSubject);
    const allWorkItems = await this.allWorkItems$.pipe(first()).toPromise();
    console.log("All Items: ", allWorkItems);

    // Check if the email is in the inbox
    const isInInbox = workItem.properties.Folder === "Inbox";

    // Handle inbox emails differently
    if (isInInbox) {
      // Handle inbox email logic here, e.g., marking it as the starting point of a thread
      this.emailTrail = [workItem];
      this.hasTrail = 1;
    } else {
      // Handle replies similar to the existing logic
      const filteredEmails = this.getEmailsBySubject(allWorkItems.workitems, currentSubject);
      this.hasTrail = filteredEmails.length;
      console.log('Filtered Emails By Subject: ', filteredEmails);

      if (workItem.properties['Sensitivity'] === 'Reply') {
        this.isReply = true;
        const currentIndex = filteredEmails.findIndex((item) => item.properties.MessageBody === workItem.properties.MessageBody);
        this.responseMessageBody = this.generateEmailTrailHTML(filteredEmails, currentIndex);
        console.log("Response Message Body: ", this.responseMessageBody);
      }
    }
  }


  // Helper function to get emails with the same subject
  getEmailsBySubject(workitems: Workitem[], currentSubject: string): Workitem[] {

    const emailsBySubject = workitems.filter((value) => {
      const subject = value.properties.Subject.includes(": ")
        ? value.properties.Subject.split(": ")[1].trim() // Trim white spaces
        : value.properties.Subject.trim(); // Trim white spaces
      currentSubject = currentSubject.trim();
      console.log('Subject: ', subject, " Current Subject: ", currentSubject, "State: ", subject === currentSubject);
      return subject === currentSubject;
    })
    // .sort((a, b) => b.properties.IndNo - a.properties.IndNo);
    console.log("Emails by Subject: ", emailsBySubject)
    return emailsBySubject
  }

  // Helper function to generate email trail HTML
  generateEmailTrailHTML(filteredEmails: Workitem[], currentIndex: number): string {
    if (filteredEmails.length === 0) {
      return ''; // Return an empty string if there are no matching emails
    }

    return filteredEmails.slice(currentIndex + 1).map((item) => `
      <br>
      <p><strong>From: </strong>${item.properties.From}</p>
      <p><strong>Subject: </strong>${item.properties.Subject}</p>
      <p><strong>Date: </strong>${item.properties.ProcessDate}</p>
      <p><strong>Body: </strong><br>${item.properties.MessageBody}</p>
      <hr style="border: 0;  height: 1px; background-image: linear-gradient(to right, #ff0101, #ffe600, #00e1ff, #d505ff);">
    `).join('');
  }


  clickInboxPreviewButton() {
    this.eventService.executePluginEventRequest(new PluginEventExecutionRequest({
      ...this.properties.inboxPreviewButton,
      pluginID: this.properties.id
    }
    ));
  }

  //address book
  filterSuggestions() {
    if (this.recipient) {
      this.filteredSuggestions = this.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(this.recipient.toLowerCase())
      );
    } else {
      this.filteredSuggestions = [];
    }
  }

  private createHtmlElement(htmlString: string): HTMLElement {
    const div = this.renderer.createElement('div')
    div.innerHTML = htmlString;
    return div as HTMLElement
  }

  openAddressBook(folder: string) {
    this.selectedFolder = folder;
    console.log("Clicked preview button");
    this.eventService.executePluginEventRequest(new PluginEventExecutionRequest({
      ...this.properties.addressBook,
      pluginID: this.properties.id
    }
    ));
  }



  clickPreviewButton() {
    console.log("Clicked preview button");
    this.eventService.executePluginEventRequest(new PluginEventExecutionRequest({
      ...this.properties.previewButton,
      pluginID: this.properties.id
    }
    ));
  }


  showEmailsByFolder(folder: string, event: Event) {
    event.preventDefault();
    this.hideSearchDropdown();

    this.selectedFolder = folder;
    console.log("Selected Folder:", folder);
    console.log("Search Query:", this.searchQuery);

    // Fetch all work items without filtering
    this.allWorkItems$ = this.bindingService.get(this.properties.dataBindingConfig).pipe(
      tap(response => {
        console.log("All Work Items:", response);
      })
    );

    console.log("AllWorkItems$ in showEmailsByFolder: ", this.allWorkItems$);

    // Subscribe to allWorkItems$ if needed
    this.allWorkItems$.subscribe(emails => {
      this.allEmails = emails.workitems.map(workitem => {
        return {
          sender: workitem.properties.From,
          subject: workitem.properties.Subject,
          body: workitem.properties.MessageBody,
          folder: workitem.properties.Folder,
          recipients: workitem.properties.To,
          cc: workitem.properties.CC,
          date: workitem.properties.Date,
          isFavorite: false,
          id: workitem.ID
        };
      });

    });

    this.workItems$ = this.bindingService.get(this.properties.dataBindingConfig).pipe(
      tap(response => {
        console.log("Emails", response);
      }),
      map(response => {
        const filteredWorkItems = response.workitems.filter(workitem => {
          const isInFolder = workitem.properties.Folder === folder;

          if (this.searchQuery === '') {
            return isInFolder;
          } else {
            const searchMatches = workitem.properties.Subject.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              workitem.properties.From.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              workitem.properties.MessageBody.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              workitem.properties.To.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              workitem.properties.CC.toLowerCase().includes(this.searchQuery.toLowerCase());

            console.log(`Search Query Matches for ID ${workitem.ID}:`, searchMatches);

            return isInFolder && searchMatches;
          }
        });

        console.log("Filtered Work Items:", filteredWorkItems);

        return {
          ...response,
          workitems: filteredWorkItems
        };
      })
    );

    console.log("WorkItems$ in showemailsbyfolder: ", this.workItems$);

    this.workItems$.subscribe(emails => {
      this.testfilteredEmails = emails.workitems.map(workitem => {
        return {
          sender: workitem.properties.From,
          subject: workitem.properties.Subject,
          body: workitem.properties.MessageBody,
          folder: workitem.properties.Folder,
          recipients: workitem.properties.To,
          cc: workitem.properties.CC,
          date: workitem.properties.Date,
          isFavorite: false,
          id: workitem.ID
        };
      });

      console.log("Testfilteredemails after subscribe: ", this.testfilteredEmails);
    });
  }


  searchEmails() {
    this.showEmailsByFolder('All', new Event('search'));
  }


  async toggleComposeModal() {
    this.showReplyModal = this.showForwardModal = false;
    this.testSelectedEmailID = null;
    this.showComposeModal = !this.showComposeModal;

    const variableID = this.properties.dataBindingConfig.variableId;
    if (this.showComposeModal === true) {
      this.vworkItems = await this.variableService.createNewWorkItemsForVariable({
        createCount: 1,
        variableId: variableID
      });

      console.log("Vworkites: ", this.vworkItems);

      if (this.vworkItems.length > 0) {
        await this.variableService.setVariableCurrentItem(variableID, this.vworkItems[0].ID);
      }
    }
  }

  closeComposeModal() {
    this.showComposeModal = false;
    this.attachments = [];
    this.recipient = this.subject = this.cc = this.sender = this.body = ''
  }


  async onAttachmentUpload(event: any) {

    console.log('File input change event triggered.');
    const files = event.target.files;
    const variableID = this.properties.dataBindingConfig.variableId;
    console.log('Creating new work items for variable: ', variableID);

    if (this.vworkItems && this.vworkItems.length > 0) {
      await this.variableService.setVariableCurrentItem(variableID, this.vworkItems[0].ID);
      if (files && files.length > 0) {

        for (const file of files) {
          let page = await this.workItemPageService.addPageFromFile(this.vworkItems[0].ID, file, (event) => {
            console.log('This is the event', event);
          });
          this.vworkItems[0].Pages.push(page);
        }

        console.log('Updated vworkitem[0] with new pages: ', this.vworkItems[0]);
        console.log('Updating current item in variable service ');

        await this.variableService.updateVariableWorkitems(variableID, [this.vworkItems[0]]);
        console.log('File upload and work item update complete ');
      }
    } else { console.log("vworkitems is empty") }

    console.log("After If statement:", this.vworkItems[0]);
  }

  async getPageData(file: File, workItem: Workitem) {
    if (workItem.Pages) {
      for (const page of workItem.Pages) {
        if (page.PageClass != 9) {
          let wordDocument = this.pageService.GetPageData(page, this.vworkItems[0].properties.DocDefID, false, PageSide.Front);
        }
        else {
          if (page.MultiSide === 1) {
            (page as any).getData(PageSide.Back, false, undefined)
          }
        }
      }
    }
    console.log('Reading file as base64: ', file.name);

    const base64Data = await this.readFileAsBase64(file);
    console.log('Base64 data for file: ', file.name, ':', base64Data);
    return {
      FileName: file.name,
      base64: base64Data
    };
  }

  async readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files: FileList = inputElement.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // this.attachments.push(file);
          await this.workItemPageService.addPageFromFile(this.vworkItems[0].ID, file, (event) => {
            console.log("This is the event", event)
          })
          const fileURL = URL.createObjectURL(file);
          this.fileURLs.push(fileURL);
        }
      }
    }
    console.log("Vworkites: ", this.vworkItems);
  }

  removeAttachment(index: number) {
    this.vworkItems[0].Pages.splice(index, 1);
  }

  clearAttachments() {
    this.attachments = [];
    this.fileURLs.forEach(url => URL.revokeObjectURL(url));
    this.fileURLs = [];
  }

  getAttachmentNames(): string {
    return this.attachments.map(file => file.name).join('; ')
  }

  getFileURLs(): string[] {
    return this.fileURLs;
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files: FileList | null = event.dataTransfer && event.dataTransfer.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.attachments.push(file);
      }
    }
  }

  onDragStart(event: DragEvent, file: File): void {
    event.dataTransfer && event.dataTransfer.setData('text/plan', file.name);
  }

  createEmailElement(email: Email): HTMLElement {
    const emailDiv = document.createElement("div");
    emailDiv.className = "email";
    emailDiv.innerHTML = `
      <div style="background-color: #f1f1f1; padding: 10px; margin-bottom: 10px;">    
      <p><strong>From: </strong> ${email.sender}</p>        
      <p><strong>Subject: </strong>${email.subject}</p>        
      </div>
    `;

    return emailDiv;

  }




  async sendEmail() {
    try {
      const variableId = this.properties.dataBindingConfig.variableId;
      const workItem = this.vworkItems[0];
      this.bodyHtmlElement = null;

      if (this.isReply) {
        const body = this.testselectedEmail.properties.MessageBody;

        // Create the response message body
        const responseMessageBody = `
          Replying ${this.replySubject ? this.replySubject : ''}
          <br>
          ${this.body}
          <br>
          Attachments:
          ${this.attachments
            .map(
              (attachment) =>
                `<a href="${URL.createObjectURL(attachment)}" target="_blank">${attachment.name}</a>`
            )
            .join("<br>")}
        `;

        // Construct the email body by combining the original and response message bodies
        const emailBody = `
          ${body}
          <div>
            <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, #ff0101,#ffe600,#00e1ff,#d505ff);">
            <div style="background-color: #f1f1f1; padding: 10px; margin-bottom: 10px;">
              <p><strong>From: </strong> ${this.testselectedEmail.properties.From}</p>
              <p><strong>Subject: </strong>${this.replySubject ? this.replySubject : ''}</p>
              <p><strong>Date: </strong> ${new Date()}</p>
              <br>
              ${responseMessageBody}
            </div>
          </div>
        `;

        // Set the email message body
        workItem.properties['MessageBody'] = emailBody;
        workItem.properties['Sensitivity'] = 'Reply';
        console.log('Response Message Body (HTML): ', emailBody);
        console.log('Reply? ', workItem.properties['Sensitivity']);
      }

      workItem.properties['AccountID'] = '9e97becb-f5a6-4c16-9005-650d3232d70e';
      // workItem.properties['AccountID'] = '9e97becb-f5a6-4c16-9005-650d3232d70e';
      workItem.properties['FolderID'] = '1';
      workItem.properties['Folder'] = 'OutBox';
      workItem.properties['EmailType'] = '0';
      workItem.properties['To'] = this.replyRecipient ? this.replyRecipient : this.recipient;
      workItem.properties['ReplyTo'] = 'NULL';
      workItem.properties['CC'] = this.cc || ' ';
      workItem.properties['Subject'] = this.replySubject ? this.replySubject : this.subject;
      workItem.properties['From'] = 'adingiswayo@imgsol.co.zw';
      workItem.properties['MessageBody'] = this.bodyHtmlElement ? this.bodyHtmlElement.innerHTML : this.body;

      // workItem.properties['MessageBody'] = this.body;
      workItem.properties['Importance'] = 'Normal';
      // workItem.properties['Sensitivity'] = 'Normal';
      workItem.properties['Priority'] = 'Normal';

      console.log("att...", this.attachments)

      const updates = [{
        properties: { ...workItem.properties },
        State: ObjectState.Created,
        ID: workItem.ID
      }];

      console.log('Updates :', updates);

      await this.variableService.updateVariableWorkitems(variableId, updates);
      await this.variableService.saveVariableData(variableId, this.properties.instanceInfo);

      this.emailSent = true;
      console.log("Email Sent: ", this.emailSent)
      this.reset();
    }
    catch (error) {
      console.error('Error sending email: ', error);
    }
  }


  openDocumentPreview(file: File) {
    const fileExtension = (file.name.split('.').pop() || '').toLowerCase();
    this.selectedPreviewType = this.getPreviewType(fileExtension);

    if (this.selectedPreviewType === 'pdf') {
      // For PDF, DOC, and DOCX files, use Google Docs Viewer to preview the document
      this.selectedPreviewURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    } else if (this.selectedPreviewType === 'doc') {
      const officeWebViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(URL.createObjectURL(file))}`;
      this.selectedPreviewURL = this.sanitizer.bypassSecurityTrustResourceUrl(officeWebViewerUrl);
    }
    else if (this.selectedPreviewType === 'csv' || this.selectedPreviewType === 'txt') {
      // For CSV and TXT files, read and display the text content
      this.readTextFile(file);
    } else {
      // For other file types (e.g., images), display the file directly
      this.selectedPreviewURL = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    }
    this.showDocumentPreviewModal = true;
  }

  async createBlobURL(file: File): Promise<void> {
    try {
      const fileContent = await this.getFileContent(file);
      const blob = new Blob([fileContent], { type: file.type });
      const blobUrl = URL.createObjectURL(blob);
      this.selectedPreviewURL = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    } catch (error) {
      console.error('Error creating Blob URL:', error.message);
      // Handle error if necessary
    }
  }

  getFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    })
  }


  private generateOfficeWebViewerURL(fileURL: string): string {
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileURL)}`;
  }

  private async uploadFileToServer(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      const data = await response.json();
      const fileURL: string = data.fileURL;
      console.log('File uploaded successfully. File URL:', fileURL);
      return fileURL;
    } catch (error) {
      console.error('Error uploading file:', error.message);
      throw error;
    }
  }

  private readTextFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.selectedPreviewContent = reader.result as string || null;
    };
    reader.readAsText(file);
  }

  closeEmailPreview() {
    this.showDocumentPreviewModal = false;
    this.selectedPreviewURL = '';
    this.testSelectedEmailID = null;
    this.selectedPreviewType = null;
    // this.reset();
  }

  // Helper method to determine the type of preview based on file extension

  private getPreviewType(fileExtension: string): 'pdf' | 'doc' | 'docx' | 'csv' | 'txt' | 'image' | null {
    if (fileExtension === 'pdf') {
      return 'pdf';
    } else if (['doc', 'docx'].includes(fileExtension)) {
      return 'doc';
    } else if (fileExtension === 'csv') {
      return 'csv';
    } else if (fileExtension === 'txt') {
      return 'txt'
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      return 'image'
    } else if (fileExtension === 'doc') {
      return 'doc';
    } else if (fileExtension === 'docx') {
      return 'docx';
    } else {
      return null;
    }
  }

  bringComposeModalToFront(): void {
    // const composeModal = document.querySelector('.email-compose-modal') as HTMLElement;
    // const previewModal = document.querySelector('.document-preview-modal') as HTMLElement;
    // if (composeModal && previewModal) {
    //   composeModal.style.zIndex = '1';
    //   previewModal.style.zIndex = '2';
    // } else {
    //   composeModal.style.zIndex = '2';
    //   previewModal.style.zIndex = '1';
    // }
  }

  bringPreviewModalToFront(): void {
    // const composeModal = document.querySelector('.email-compose-modal') as HTMLElement;
    // const previewModal = document.querySelector('.document-preview-modal') as HTMLElement;
    // const replyModal = document.querySelector('.email-reply-modal') as HTMLElement;
    // const forwardModal = document.querySelector('.email-forward-modal') as HTMLElement;
    // const emailDetails = document.querySelector('.email-details-modal') as HTMLElement;
    // composeModal.style.zIndex = '2';
    // previewModal.style.zIndex = '3';
    // replyModal.style.zIndex = '2';
    // emailDetails.style.zIndex = '1'
    // forwardModal.style.zIndex = '2';

  }

  bringReplyModalToFront(): void {
    console.log("Replied");
  }

  bringForwardModalToFront(): void {
    // const forwardModal = document.querySelector('.email-forward-modal') as HTMLElement;
    // const previewModal = document.querySelector('.document-preview-modal') as HTMLElement;
    // const emailDetails = document.querySelector('.email-details-modal') as HTMLElement;
    // forwardModal.style.zIndex = '3';
    // previewModal.style.zIndex = '2';
    // emailDetails.style.zIndex = '1'
    console.log("Forwarded");
  }

  toCompose() {
    this.setComposeFlags(true, false, false);
    console.log("To Compose: ", this.composeTo);
  }

  ccCompose() {
    this.setComposeFlags(false, true, false);
    console.log("CC: ", this.composeCC);
  }

  toReply() {
    this.setComposeFlags(false, false, true);
    console.log("To Reply: ", this.composeTo);
  }

  setComposeFlags(to, cc, reply) {
    this.composeTo = to;
    this.composeCC = cc;
    this.replyTo = reply;
  }

  onItemClick(event: any) {
    const recipientField = this.composeTo ? 'recipient' : (this.composeCC ? 'cc' : 'replyRecipient');
    const currentValue = this[recipientField];

    if (!currentValue) {
      this[recipientField] = event;
    } else {
      this[recipientField] += '; ' + event;
    }

    console.log(`Added '${event}' to ${recipientField}: `, this[recipientField]);
  }

  onEmailInputClick(hrIdentifier: string, event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.showAddressBook = true;

    requestAnimationFrame(() => {
      const addressBookModal = this.el.nativeElement.querySelector('.address-book');
      const hrElement = this.el.nativeElement.querySelector(`#${hrIdentifier}`);

      if (hrElement) {
        const topPosition = hrElement.getBoundingClientRect().bottom + window.scrollY;
        const leftPosition = this.mouseX;

        // Set the position using CSS
        this.renderer.setStyle(addressBookModal, 'top', `${topPosition}px`);
        this.renderer.setStyle(addressBookModal, 'left', `${leftPosition}px`);
      }
    });
  }


  closeAddressBook() {
    this.showAddressBook = false;
    //  const addressElement = document.getElementById('addressbook');
    //  addressElement.classList.add('address-book-hide');
  }

  bringEmailDetailsToFront(): void {
    const replyModal = document.querySelector('.email-reply-modal') as HTMLElement;
    const previewModal = document.querySelector('.document-preview-modal') as HTMLElement;
    const emailDetails = document.querySelector('.email-details-modal') as HTMLElement;
    const forwardModal = document.querySelector('.email-forward-modal') as HTMLElement;

    if (replyModal && previewModal && emailDetails && forwardModal) {
      replyModal.style.zIndex = '1';
      previewModal.style.zIndex = '2';
      emailDetails.style.zIndex = '3';
      forwardModal.style.zIndex = '1';
    }
  }

  async openReplyModal() {
    this.isReply = true;
    const variableID = this.properties.dataBindingConfig.variableId;
    if (this.isReply === true) {
      this.vworkItems = await this.variableService.createNewWorkItemsForVariable({
        createCount: 1,
        variableId: variableID
      });

      console.log("Vworkites: ", this.vworkItems);

      if (this.vworkItems.length > 0) {
        await this.variableService.setVariableCurrentItem(variableID, this.vworkItems[0].ID);
      }
    }
    this.showReplyModal = !this.showReplyModal;
    this.replySubject = `Re: ${this.testselectedEmail && this.testselectedEmail.properties.Subject || ''}`;
    this.replyRecipient = this.testselectedEmail && this.testselectedEmail.properties.From || '';
    this.replyBody = `{{${this.testselectedEmail && this.testselectedEmail.properties.ID}}}\n\n`;
    this.replyAttachments = [];
  }

  async openForwardModal() {
    this.isReply = true;
    const variableID = this.properties.dataBindingConfig.variableId;
    if (this.isReply === true) {
      this.vworkItems = await this.variableService.createNewWorkItemsForVariable({
        createCount: 1,
        variableId: variableID
      });

      console.log("Vworkites: ", this.vworkItems);

      if (this.vworkItems.length > 0) {
        await this.variableService.setVariableCurrentItem(variableID, this.vworkItems[0].ID);
      }
    }
    this.showForwardModal = !this.showForwardModal;
    this.replySubject = `Fw: ${this.testselectedEmail && this.testselectedEmail.properties.Subject || ''}`;
    this.replyBody = `{{${this.testselectedEmail && this.testselectedEmail.properties.ID}}}\n\n`;
    this.replyAttachments = [];
  }

  closeForwardModal() {
    this.showForwardModal = false;
    this.replyRecipient = '';
    this.replySubject = '';
    this.replyBody = '';
    this.attachments = [];
    this.replyAttachments = [];
  }

  closeReplyModal() {
    this.showReplyModal = false;
    this.replyRecipient = '';
    this.replySubject = '';
    this.replyBody = '';
    this.attachments = [];
    this.replyAttachments = [];
    console.log("Show Reply: ", this.showReplyModal);
  }

  onFileChangeReply(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files: FileList = inputElement.files;
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.replyAttachments.push(file);
        }
      }
    }
  }

  removeReplyAttachment(index: number) {
    this.replyAttachments.splice(index, 1);
  }

  clearReplyAttachments() {
    this.replyAttachments = [];
  }

  getReplyAttachmentNames(): string {
    return this.replyAttachments.map(file => file.name).join('; ');
  }

  getEmailTrail(workItem: Workitem): Workitem[] {
    const trail: Workitem[] = [];
    let currentWorkItem = workItem;

    while (currentWorkItem.ID) {
      trail.unshift(currentWorkItem);

      // Find the parent email with the same subject and matching 'To' and 'From'.
      const parentWorkItem = this.findParentEmail(currentWorkItem, trail);

      if (parentWorkItem && parentWorkItem.ID !== currentWorkItem.ID) {
        currentWorkItem = parentWorkItem;
      } else {
        break;
      }
    }

    return trail;
  }

  findParentEmail(currentWorkItem: Workitem, trail: Workitem[]): Workitem | undefined {
    const currentTo = currentWorkItem.properties.To;
    const currentSubject = currentWorkItem.properties.Subject;

    // Find the parent email with the same subject and matching 'To' and 'From'.
    return trail.find((item) => {
      return item.properties.Subject === currentSubject && item.properties.From === currentTo;
    });
  }

  // getEmailTrail(workItem: Workitem): Workitem[] {
  //   const trail: Workitem[] = [];
  //   let currentWorkItem = workItem;
  //   while (currentWorkItem.ID) {
  //     trail.unshift(currentWorkItem);
  //     const parentWorkItem = this.getEmailById(currentWorkItem.ID);
  //     if (parentWorkItem && parentWorkItem.ID !== currentWorkItem.ID) {
  //       currentWorkItem = parentWorkItem;
  //     } else {
  //       break
  //     }
  //   }
  //   return trail;
  // }


  getEmailById(workItemID: string): Workitem | null {
    let foundWorkItem: Workitem | null = null;
    this.workItems$.subscribe(({ workitems }) => {
      foundWorkItem = workitems.find((workItem) => workItem.ID === workItemID) || null;
    });
    return foundWorkItem
  }

  showReply() {
    this.uploadedFiles = [];
    this.attachmentPage = this.showComposeModal = false;
    this.showReplySection = !this.showReplySection;;
  }


  // Handle File aSelection
  handleFileSelection(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.attachment = fileInput.files[0];
      console.log('Selected File: ', this.attachment);
    }
    else {
      this.attachment = null;
    }
  }

  reset() {
    this.recipient = '';
    this.sender = '';
    this.subject = '';
    this.cc = '';
    this.body = '';
    this.attachments = [];

    setTimeout(() => {
      this.emailSent = false;
    }, 3000);
    this.attachmentPage = this.showReplySection = this.showComposeModal = this.showForwardModal = false;
    this.closeReplyModal();
    this.closeForwardModal();
    this.closeEmailPreview();
    console.log("Compose after send: ", this.showComposeModal);

    this.eventService.executePluginEventRequest(new PluginEventExecutionRequest({
      ...this.properties.sendButton,
      pluginID: this.properties.id
    }
    ));

  }



  getData() {

    const variableId = this.properties.dataBindingConfig.variableId;

    this.addressBookID$ = this.bindingService.get(this.properties.dataBindingConfig)
      .pipe(
        tap(response => {
          console.log("Address Book", response);
        }))
  }

  async uploadAttachment(attachment: File): Promise<string> {
    throw new Error('Method not implemented.');
  }

  selectEmail(selectedEmail: Workitem): void {
    this.selectedEmail = selectedEmail;
    this.showComposeModal = this.showReplySection = false;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragLeave();
    if (event.dataTransfer) {
      this.handleFiles(event.dataTransfer.files)
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragEnter();
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragLeave();
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.handleFiles(target.files);
  }

  openFile(file: any): string {
    const blob = new Blob([file], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    console.log("openFile");
    return url
  }

  handleFiles(files: FileList | null): void {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      this.uploadedFiles.push(files[i]);
      const fileURL = URL.createObjectURL(files[i]);
      this.fileURLs.push(fileURL);
      console.log("Files....", this.uploadedFiles)
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private dragEnter(): void {
    const dragDropArea = document.getElementById('dragDropArea');
    if (dragDropArea) {
      dragDropArea.classList.add('dragover');
    }
  }

  private dragLeave(): void {
    const dragDropArea = document.getElementById('dragDropArea');
    if (dragDropArea) {
      dragDropArea.classList.remove('dragover');
    }
  }

}