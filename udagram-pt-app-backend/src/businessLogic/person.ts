import * as uuid from 'uuid'

import * as errors from '../errors/errors'

import { person } from '../resources/Person'
import { PersonDoc } from '../models/doc/PersonDoc'

import { token } from '../resources/Token'
import { TokenDoc } from '../models/doc/TokenDoc'

export async function createPerson(emailAddress:string, contactNumber:number, name:string):Promise<PersonDoc>{
    const personId = uuid.v4()
    const personDoc:PersonDoc = {
        personId,
        emailAddress, 
        contactNumber,
        name,
        photoURL: '',
        thumbnailURL: ''
    } as PersonDoc

    await person.createPerson(personDoc)

    return personDoc
}

export async function queryPerson(personId:string):Promise<PersonDoc>{
    const personDoc = await person.getPersonByPersonID(personId)
    if (personDoc) return personDoc
    else throw new errors.NoSuchPersonError(`No such person was found by personId: ${personId}`)
}

export async function checkPersonValid(personId:string):Promise<boolean>{
    const personDoc = await person.getPersonByPersonID(personId)
    if (personDoc) return true
    else return false
}

export async function queryPersonIdByToken(tokenStr:string):Promise<string>{
    const tokenDoc:TokenDoc = await token.getPersonByToken(tokenStr)
    if (tokenDoc) return  tokenDoc.personId
    else throw new errors.NoSuchTokenError(`No such token was found: ${tokenStr}`)
}

export async function queryPersonName(personId:string):Promise<string>{
    const personDoc = queryPerson(personId)
    return (await personDoc).name
}