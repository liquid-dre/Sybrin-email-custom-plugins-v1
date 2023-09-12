import { LocalizationIdentifier } from "./localization-identifiers";
import { RequestStates } from "./request-states";


export class PageRequestResult {
    public StatusCode = RequestStates.Pending;
    public LocalizationIdentifier: LocalizationIdentifier;
    public StatusMessage = "";
    public B64PageData = "";

    public UpdateValues(StatusCode: RequestStates, StatusMessage: string,localizationIdentifier: LocalizationIdentifier, B64PageData: string = undefined) {
        this.StatusCode = StatusCode;
        this.LocalizationIdentifier = localizationIdentifier;
        this.StatusMessage = StatusMessage;
        if (B64PageData)
            this.B64PageData = B64PageData;
    }
}