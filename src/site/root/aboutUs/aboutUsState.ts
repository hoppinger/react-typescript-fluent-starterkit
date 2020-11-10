import { AsyncState, loadingAsyncState, Unit, unloadedAsyncState } from "widgets-for-react"
import { emailRegex, phoneNumberRegex, ValidationResult, Validations, validations } from "../../../shared"
import { Updater } from "../../../widgets-extras"
import { List, Map, OrderedMap } from 'immutable'
import { loadProducts } from "./aboutUsApi"

export type URL = string

export type TeamMemberId = number

export type TeamMember = {
  teamMemberId:TeamMemberId,
  name:string,
  function:string,
  age:number,
  imageURL:URL
}

export type AboutUsState = {
  teamMembers:AsyncState<Array<TeamMember>>
}

export const initialAboutUsState:AboutUsState = ({ 
  teamMembers:loadProducts()
})

export const aboutUsUpdaters = {
  teamMembers:(u:Updater<AsyncState<Array<TeamMember>>>) : Updater<AboutUsState> => s =>
    ({...s, teamMembers:u(s.teamMembers)})
}
