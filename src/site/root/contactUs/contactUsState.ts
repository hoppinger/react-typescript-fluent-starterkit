import { AsyncState, loadingAsyncState, Unit } from "widgets-for-react"
import { emailRegex, phoneNumberRegex, ValidationResult, validations } from "../../../shared"
import { Updater } from "../../../widgets-extras"
import { submitContactUs } from "./contactUsApi"

export type ContactUsState = {
  subject?:string
  body?:string
  name?:string
  email?:string
  phoneNumber?:string
  submission?:AsyncState<Unit>
}

export const initialContactUsState:ContactUsState = ({})

export const contactUsUpdaters = {
  name:(newValue:string):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, name:newValue }),
  email:(newValue:string):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, email:newValue }),
  phoneNumber:(newValue:string):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, phoneNumber:newValue }),
  subject:(newValue:string):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, subject:newValue }),
  body:(newValue:string):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, body:newValue }),
  submission:(newValue:Updater<AsyncState<Unit>>):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, 
      submission:contactUs.submission ? newValue(contactUs.submission):contactUs.submission }),
  submit:():Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, 
      submission:submitContactUs(contactUs) }),
}

export const contactUsValidators = {
  name:(contactUs:ContactUsState):ValidationResult => 
    contactUs.name == undefined || contactUs.name.length < 2 ? validations.tooEarlyToTell
    : validations.valid,
  email:(contactUs:ContactUsState):ValidationResult => 
    contactUs.email == undefined ? validations.tooEarlyToTell
    : emailRegex.test(contactUs.email) ? validations.valid
    : validations.invalid("the email address appears to be invalid"),
  phoneNumber:(contactUs:ContactUsState):ValidationResult => 
    contactUs.phoneNumber == undefined ? validations.tooEarlyToTell
    : phoneNumberRegex.test(contactUs.phoneNumber) ? validations.valid
    : validations.invalid("the phone number appears to be invalid"),
  subject:(contactUs:ContactUsState):ValidationResult => 
    contactUs.subject == undefined ? validations.tooEarlyToTell
    : contactUs.subject.length < 2 ? validations.invalid("the subject should not be empty")
    : validations.valid,
  body:(contactUs:ContactUsState):ValidationResult => 
    contactUs.body == undefined ? validations.tooEarlyToTell
    : contactUs.body.length < 2 ? validations.invalid("the body should not be empty")
    : validations.valid,
}
