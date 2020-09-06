import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { PersonDoc } from '../models/doc/PersonDoc'

class Person{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string,
    ){}

    async getPersonByPersonID(personId:string): Promise<PersonDoc>{
        const result = await this.docClient.get({
            TableName: this.tableName,
            Key: {
                personId: personId
            }
        }).promise()

        return result.Item as PersonDoc;
    }

    async createPerson(person:PersonDoc){
        await this.docClient.put({
            TableName: this.tableName,
            Item:person
        }).promise()
    }
}

export const person:Person = new Person(
    new AWS.DynamoDB.DocumentClient(),
    process.env.PERSONS_TABLE
)