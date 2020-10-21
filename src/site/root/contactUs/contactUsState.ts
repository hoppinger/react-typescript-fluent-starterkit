import { AsyncState, loadingAsyncState, Unit } from "widgets-for-react"
import { emailRegex, phoneNumberRegex, ValidationResult, Validations, validations } from "../../../shared"
import { Updater } from "../../../widgets-extras"
import { submitContactUs } from "./contactUsApi"

export type ContactUsInput = {
  subject:string
  body:string
  name:string
  email:string
  phoneNumber:string  
}

export type ContactUsState = {
  input:Partial<ContactUsInput>
  validations:Validations<ContactUsInput>
  submission?:AsyncState<Unit>
}

export const initialContactUsState:ContactUsState = ({ input:{}, validations:{} })

export const revalidate:Updater<ContactUsState> = contactUs =>
  ({...contactUs, validations:contactUsValidations(contactUs) })

export const contactUsUpdaters = {
  name:(newValue:string):Updater<ContactUsState> => 
    contactUs => revalidate({ ...contactUs, input:{...contactUs.input, name:newValue } }),
  email:(newValue:string):Updater<ContactUsState> => 
    contactUs => revalidate({ ...contactUs, input:{...contactUs.input, email:newValue } }),
  phoneNumber:(newValue:string):Updater<ContactUsState> => 
    contactUs => revalidate({ ...contactUs, input:{...contactUs.input, phoneNumber:newValue } }),
  subject:(newValue:string):Updater<ContactUsState> => 
    contactUs => revalidate({ ...contactUs, input:{...contactUs.input, subject:newValue } }),
  body:(newValue:string):Updater<ContactUsState> => 
    contactUs => revalidate({ ...contactUs, input:{...contactUs.input, body:newValue } }),
  submission:(newValue:Updater<AsyncState<Unit>>):Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, 
      submission:contactUs.submission ? newValue(contactUs.submission):contactUs.submission }),
  submit:():Updater<ContactUsState> => 
    contactUs => ({ ...contactUs, 
      submission:submitContactUs(contactUs) }),
}

export const contactUsValidations = (contactUs:ContactUsState):Validations<ContactUsInput> => ({
  name: 
    contactUs.input.name == undefined || contactUs.input.name.length < 2 ? validations.tooEarlyToTell
    : validations.valid,
  email:
    contactUs.input.email == undefined ? validations.tooEarlyToTell
    : emailRegex().test(contactUs.input.email) ? validations.valid
    : validations.invalid("the email address appears to be invalid"),
  phoneNumber: 
    contactUs.input.phoneNumber == undefined ? validations.tooEarlyToTell
    : phoneNumberRegex().test(contactUs.input.phoneNumber) ? validations.valid
    : validations.invalid("the phone number appears to be invalid"),
  subject: 
    contactUs.input.subject == undefined ? validations.tooEarlyToTell
    : contactUs.input.subject.length < 2 ? validations.invalid("the subject should not be empty")
    : validations.valid,
  body: 
    contactUs.input.body == undefined ? validations.tooEarlyToTell
    : contactUs.input.body.length < 2 ? validations.invalid("the body should not be empty")
    : validations.valid,
})

export const contactUsIsValid = (contactUs:ContactUsState) : boolean =>
  contactUs.validations.name != undefined && contactUs.validations.name.kind == "valid" &&
  contactUs.validations.email != undefined && contactUs.validations.email.kind == "valid" &&
  contactUs.validations.phoneNumber != undefined && contactUs.validations.phoneNumber.kind == "valid" &&
  contactUs.validations.subject != undefined && contactUs.validations.subject.kind == "valid" &&
  contactUs.validations.body != undefined && contactUs.validations.body.kind == "valid"
  