import { Directive, Injectable, OnDestroy } from '@angular/core';
import { IPage, PageSide } from '@sybrin/plugin-client';
import { Observable, Subject, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { FileDataHelper } from './file-data-helper';
import { PageRequestResult } from '../enums/page-request-result';
import { RequestStates } from '../enums/request-states';
import { LocalizationIdentifier } from '../enums/localization-identifiers';

@Injectable({ providedIn: "root" })
export class PageService {
    destroy$ = new Subject<boolean>();
    pageRequestResult: { [key: string]: PageRequestResult } = {};

    constructor(private fileDataHelper: FileDataHelper) { }

    // ngOnDestroy(): void {
    //     this.Destroy();
    // }

    public GetPageData(
        page: IPage,
        docDefID: string,
        pdfWrap: boolean = false,
        pageSide: PageSide = PageSide.Front,
        allPagesSent: boolean = true,
        pageData?: string,
    ): Observable<void | PageRequestResult> {
        let pageID = page.ID;
        if (page.MultiSide === 1) {
            pageID += `_${pageSide}`;
        }
        this.pageRequestResult[pageID] = new PageRequestResult();
        this.pageRequestResult[pageID].UpdateValues(RequestStates.InProgress, 'Loading page data...', LocalizationIdentifier.LoadingData);
        if (pageData) {
            this.pageRequestResult[pageID].StatusCode = RequestStates.Complete;
            this.pageRequestResult[pageID].B64PageData = pageData;
            return of(this.pageRequestResult[pageID]);
        } else {
            return this.fileDataHelper.GetPageData(this.pageRequestResult[pageID], docDefID, page, pdfWrap, pageSide, allPagesSent).pipe(
                map((result) => {
                    this.pageRequestResult[pageID] = result;
                    if (this.pageRequestResult[pageID].StatusCode === RequestStates.Requesting)
                        throw new Error(this.pageRequestResult[pageID].StatusMessage);
                }),
                // takeUntil(this.destroy$)
            );
        }
    }

    // public Destroy() {
    //     this.destroy$.next(true);
    //     this.destroy$.complete();
    // }
}
