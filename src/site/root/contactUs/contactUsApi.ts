import { AsyncState, HttpResult, loadingAsyncState, Unit } from "widgets-for-react";
import { ContactUsState } from "./contactUsState";

export const submitContactUs = (contactUsState:ContactUsState) : AsyncState<Unit> =>
  loadingAsyncState(() => 
    new Promise((res,rej) => setTimeout(() => res({ kind:"result", value:{}, status:200 }), 250)))