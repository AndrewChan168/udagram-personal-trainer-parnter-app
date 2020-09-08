import * as uuid from 'uuid'

import * as errors from '../errors/errors'

import { participation } from '../resources/Participation'
import { ParticipationDoc,ParticipationStatus,ParticipationStatusString } from '../models/doc/ParticipationDoc'
import { CreateParticipationJson } from '../models/http/createParticipationJson'
import { queryPersonName, checkPersonValid } from '../businessLogic/person' 

import { checkSectionValid } from '../businessLogic/section'

export async function createParticipation(createParticipationJson:CreateParticipationJson):Promise<ParticipationDoc>{
    const participationId = uuid.v4()

    const personName = await queryPersonName(createParticipationJson.personId)
    
    const participationDoc = {
        participationId,
        personName,
        ...createParticipationJson,
        particiStatus: ParticipationStatus.PENDING
    } as ParticipationDoc

    await participation.createParticipation(participationDoc)

    return participationDoc
}

export async function queryParticipation(participationId:string):Promise<ParticipationDoc>{
    const participationDoc = await participation.getParticipationByParticipationId(participationId)
    if (participationDoc) return participationDoc
    else throw new errors.NoSuchParticipationError(`No such participation was found by participationId: ${participationId}`)
}

export async function queryParticipationsByPerson(personId:string, weekNum:string):Promise<ParticipationDoc[]>{
    const isPersonValid = checkPersonValid(personId)

    if (!isPersonValid) throw new errors.NoSuchPersonError(`No such person was found by personId: ${personId}`)

    const participationDocs = await participation.getParticipationsByPersonIdInWeeksRange(personId,weekNum)
    return participationDocs
}

export async function queryAllParticipations(personId:string):Promise<ParticipationDoc[]>{
    const isPersonValid = await checkPersonValid(personId)

    if (!isPersonValid) throw new errors.NoSuchPersonError(`No such person was found by personId: ${personId}`)

    const participationDocs = await participation.getParticipationsByPersonId(personId)
    return participationDocs
}

export async function queryParticipationsBySection(sectionId:string):Promise<ParticipationDoc[]>{
    const isSectionValid = await checkSectionValid(sectionId)

    if (isSectionValid) return await participation.getParticipationsBySectionId(sectionId)
    else throw new errors.NoSuchSectionError(`No such section was found by sectionId: ${sectionId}`)
}

export async function checkParticiptionValid(participationId:string):Promise<boolean>{
    const participationDoc = await participation.getParticipationByParticipationId(participationId)
    if (participationDoc) return true
    else return false
}

export async function updateParticipationStatus(participationId:string, status:ParticipationStatusString){
    const isParticipationValid = await checkParticiptionValid(participationId)
    if(isParticipationValid){
        await participation.updateParticipationStatus(participationId, status)
    }else throw new errors.NoSuchParticipationError(`No such participation was found by participationId: ${participationId}`)
}