import { AsyncState, HttpResult, loadingAsyncState, Unit } from "widgets-for-react";
import { AboutUsState, TeamMember, TeamMemberId } from "./aboutUsState";
import { List, Map, OrderedMap } from "immutable";
import { canSafelyCast, listFromOption, TypeCastingValidator } from "../../../widgets-extras";

const mockBrokenTeamMembers:Array<any> = [
  {
    teamMemberId:-1,
    name:"Broken team member without function",
    age:-1,
    imageURL:"images/gilletteFusionRazor.jpg"
  }
]

const mockTeamMembers:Array<TeamMember> = [
  {
    teamMemberId:1,
    name:"Gerard Pastwa",
    function: "CEO",
    age:38,
    imageURL:"images/gilletteFusionRazor.jpg"
  },
  {
    teamMemberId:2,
    name:"Marijn Bom",
    function: "Founding father",
    age:42,
    imageURL:"images/gilletteBlades.jpg"
  },
  {
    teamMemberId:3,
    name:"Alice Lauretta",
    function: "Project manager",
    age:24,
    imageURL:"images/iron.jpg"
  },
  {
    teamMemberId:4,
    name:"Thomas Santoli",
    function:"Very smart developer",
    age:25,
    imageURL:"images/legoATAT.jpg"
  },
  {
    teamMemberId:5,
    name:"Judith Engberts",
    function:"Human resources manager",
    age:26,
    imageURL:"images/mixer.jpg"
  },
  {
    teamMemberId:6,
    name:"Maarten van Rossum",
    function:"Finance First Guy",
    age:29,
    imageURL:"images/modelingClay.jpg"
  },
]

const getRawTeamMembers = () : Promise<Array<any>> =>
  new Promise((res,rej) => setTimeout(() => res(
    [
      ...mockBrokenTeamMembers,
      ...mockTeamMembers
    ].map((tm,i) => ({...tm, teamMemberId:i })))))


const formatTeamMembers = (products:List<TeamMember>) : Array<TeamMember> =>
  products.toArray()

const teamMemberValidator:TypeCastingValidator<TeamMember, keyof TeamMember> = 
  {
    name:{ kind:"string" },
    function:{ kind:"string" },
    imageURL:{ kind:"string" },
    teamMemberId:{ kind:"number" },
    age:{ kind:"number", customValidationLogic:(age:number) => age >= 0 && age <= 150 }
  }

export const loadProducts = () : AsyncState<Array<TeamMember>> =>
  loadingAsyncState(() => 
    new Promise((res,rej) => setTimeout(() => {
      getRawTeamMembers().then(raw => 
        res({ kind:"result", value:
          formatTeamMembers(
            List(raw)
              .map(v => canSafelyCast<TeamMember>(teamMemberValidator, v))
              .flatMap(listFromOption)), 
          status:200 })
      )
    }, 250)))
