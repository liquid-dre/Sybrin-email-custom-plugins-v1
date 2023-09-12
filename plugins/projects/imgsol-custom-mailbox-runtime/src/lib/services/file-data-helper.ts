import { Injectable } from "@angular/core";
import {
    DocumentHelperService,
    IPage,
    PageRequest,
    PageSide,
    WorkitemPageService
} from "@sybrin/plugin-client";
import { from, of } from "rxjs";
import { delay, filter, map, mergeMap, retryWhen, take } from "rxjs/operators";
import { PageRequestResult } from "../enums/page-request-result";
import { RequestStates } from "../enums/request-states";
import { LocalizationIdentifier } from "../enums/localization-identifiers";


@Injectable({ providedIn: "root" })
export class FileDataHelper {
    constructor(private workitemPageService: WorkitemPageService, private documentHelperService: DocumentHelperService) { }

    private pageRequests: PageRequest[] = [];

    GetPageData(
        pageRequestResult: PageRequestResult,
        docDefID: string,
        page: IPage,
        pdfWrap: boolean,
        pageSide: PageSide = PageSide.Front,
        allPagesSent: boolean = true
    ) {
        if (!docDefID) {
            pageRequestResult.UpdateValues(
                RequestStates.Error,
                "No document definition ID provided.",
                LocalizationIdentifier.NoDocumentDefID
            );
            return of(pageRequestResult);
        }
        if (!page) {
            pageRequestResult.UpdateValues(RequestStates.Error, "No page provided.", LocalizationIdentifier.NoPageData);
            return of(pageRequestResult);
        }

        let pid = `${page.ID}_${PageSide.Front}_${pdfWrap}`;
        if (pageSide === PageSide.Back) {
            pid = `${page.ID}_${PageSide.Back}_${pdfWrap}`;
        }
        return this.workitemPageService.getWorkitemPageById(pid).pipe(
            map((result) => {
                if (
                    pageRequestResult.StatusCode !== RequestStates.Requesting &&
                    (!result || !result.pageData)
                ) {
                    if (allPagesSent || this.pageRequests.length === 19) {
                        this.buildPageRequests(docDefID, page, pdfWrap, pageSide);
                        this.requestPageData(pageRequestResult);
                    } else {
                        this.buildPageRequests(docDefID, page, pdfWrap, pageSide);
                    }
                } else if (
                    pageRequestResult.StatusCode === RequestStates.Requesting &&
                    (!result || !result.pageData)
                ) {
                    pageRequestResult.UpdateValues(
                        RequestStates.Error,
                        "Failed to retrieve page data.",
                        LocalizationIdentifier.FailedToLoadData
                    );
                } else
                    pageRequestResult.UpdateValues(
                        RequestStates.Complete,
                        "Page data found",
                        LocalizationIdentifier.PageDataFound,
                        result.pageData
                    );
                return pageRequestResult;
            }),
            filter(p => !!p.B64PageData),
            mergeMap(res => {
                return from(this.documentHelperService.base64ToString(res.B64PageData, page.FileName, pageSide, page.PageNo, null)).pipe(
                    map(base64 => {
                        res.B64PageData = base64;
                        return res;
                    })
                )
            }),
            retryWhen((errors) => errors.pipe(delay(1000), take(3)))
        );
    }

    private requestPageData(
        pageRequestResult: PageRequestResult
    ) {
        pageRequestResult.UpdateValues(
            RequestStates.Requesting,
            "No page data found in store requesting the data from the server...",
            LocalizationIdentifier.RequestingFromServer,
            undefined
        );

        const pageRequests = this.pageRequests;
        this.pageRequests = [];
        this.workitemPageService.requestWorkitemPages(pageRequests);
        //This is to force the retry
        throw "No page data found in store requesting the data from the server...";
    }

    private buildPageRequests(
        docDefID: string,
        page: IPage,
        pdfWrap: boolean,
        pageSide: PageSide = PageSide.Front
    ) {
        var pageRequest: PageRequest = {
            DocDefID: docDefID,
            DocumentPage: page,
            CropOptions: null,
            PDFWrap: pdfWrap,
            PageSide: pageSide
        };

        this.pageRequests.push(pageRequest);
    }
}
