import * as uuid from 'uuid'

import * as errors from '../errors/errors'

import { participation } from '../resources/Participation'
import { ParticipationDoc,ParticipationStatus } from '../models/doc/ParticipationDoc'
import { CreateParticipationJson } from '../models/http/createParticipationJson'
import { queryPersonName, checkPersonValid } from '../businessLogic/person' 

export async function createParticipation(createParticipationJson:CreateParticipationJson):Promise<ParticipationDoc>{
    const participationId = uuid.v4()

    const personName = await queryPersonName(createParticipationJson.personId)
    
    const participationDoc = {
        participationId,
        personName,
        ...createParticipationJson,
        status: ParticipationStatus.PENDING
    } as ParticipationDoc

    await participation.createParticipation(participationDoc)

    return participationDoc
}

export async function queryParticipation(participationId:string):Promise<ParticipationDoc>{
    const participationDoc = await participation.getParticipationByParticipationId(participationId)
    if (participationDoc) return participationDoc
    else throw new errors.NoSuchParticipationError(`No such participation was found by participationId: ${participationId}`)
}

export async function queryParticipations(personId:string, startWeek:string, endWeek:string):Promise<ParticipationDoc[]>{
    const isPersonValid = checkPersonValid(personId)

    if (!isPersonValid) throw new errors.NoSuchPersonError(`No such person was found by personId: ${personId}`)

    const participationDocs = await participation.getParticipationsByPersonIdInWeeksRange(personId, startWeek, endWeek)
    return participationDocs
}

export async function queryAllParticipations(personId:string):Promise<ParticipationDoc[]>{
    const isPersonValid = checkPersonValid(personId)

    if (!isPersonValid) throw new errors.NoSuchPersonError(`No such person was found by personId: ${personId}`)

    const participationDocs = await participation.getParticipationsByPersonId(personId)
    return participationDocs
}