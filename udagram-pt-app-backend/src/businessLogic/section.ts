import * as uuid from 'uuid'

import * as errors from '../errors/errors'

import { SectionDoc,SectionStatus } from '../models/doc/SectionDoc'
import { section } from '../resources/Section'
import { CreateSectionJson } from '../models/http/createSectionJson'
import { queryPersonName,checkPersonValid } from '../businessLogic/person' 

export async function createSection(createSectionJson:CreateSectionJson):Promise<SectionDoc>{
    const sectionId = uuid.v4()
    let trainerName, creatorName

   try{
       trainerName = await queryPersonName(createSectionJson.trainerId)
   }catch(err){
       if (err instanceof errors.NoSuchPersonError) {
           throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${createSectionJson.trainerId}`)
       } else throw err
   }

   try{
        creatorName = await queryPersonName(createSectionJson.creatorId)
    }catch(err){
        if (err instanceof errors.NoSuchPersonError) {
            throw new errors.NoSuchPersonError(`No such person was found by creatorId: ${createSectionJson.creatorId}`)
        } else throw err
    }

    const sectionDoc = {
        sectionId,
        ...createSectionJson,
        status: SectionStatus.PENDING,
        trainerName,
        creatorName
    } as SectionDoc

    await section.createSection(sectionDoc)

    return sectionDoc
}

export async function querySection(sectionId:string):Promise<SectionDoc>{
    const sectionDoc = await section.getSectionBySectionId(sectionId)
    if (sectionDoc) return sectionDoc
    else throw new errors.NoSuchSectionError(`No such section was found by sectionId: ${sectionId}`)
}

/*
export async function querySectionsByTrainerId(trainerId:string, startWeek:string, endWeek:string):Promise<SectionDoc[]>{
    if(checkPersonValid(trainerId)) {
        return await(section.getSectionsByTrainerIdInWeeksRange(trainerId, startWeek, endWeek))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${trainerId}`)
}
*/

export async function querySectionsByTrainerId(trainerId:string, week:string):Promise<SectionDoc[]>{
    if(checkPersonValid(trainerId)) {
        return await(section.getSectionsByTrainerIdInWeeksRange(trainerId, week))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${trainerId}`)
}

export async function queryAllSectionsByTrainerId(trainerId:string):Promise<SectionDoc[]>{
    if(checkPersonValid(trainerId)) {
        return await(section.getSectionsByTrainerId(trainerId))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${trainerId}`)
}

/*
export async function querySectionsByCreatorId(creatorId:string, startWeek:string, endWeek:string):Promise<SectionDoc[]>{
    if(checkPersonValid(creatorId)) {
        return await(section.getSectionsByCreatorIdInWeeksRange(creatorId, startWeek, endWeek))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by creatorId: ${creatorId}`)
}
*/

export async function querySectionsByCreatorId(creatorId:string, week:string):Promise<SectionDoc[]>{
    if(checkPersonValid(creatorId)) {
        return await(section.getSectionsByCreatorIdInWeeksRange(creatorId, week))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by creatorId: ${creatorId}`)
}

export async function queryAllSectionsByCreatorId(creatorId:string):Promise<SectionDoc[]>{
    if(checkPersonValid(creatorId)) {
        return await(section.getSectionsByCreatorId(creatorId))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by creatorId: ${creatorId}`)
}