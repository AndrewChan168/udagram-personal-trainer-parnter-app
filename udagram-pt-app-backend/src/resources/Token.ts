import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TokenDoc } from '../models/doc/TokenDoc'

class Token{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string,
        private readonly personIdIndex: string,
    ){}

    async getTokensByPersonID(personId:string):Promise<TokenDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.personIdIndex,
            KeyConditionExpression: 'personId=:personId',
            ExpressionAttributeValues: {
                ':personId':personId
            }
        }).promise()
        const items = result.Items
        return items as TokenDoc[]
    }

    async getPersonByToken(token:string):Promise<TokenDoc>{
        const result = await this.docClient.get({
            TableName:this.tableName,
            Key: {token:token}
        }).promise()
        return result.Item as TokenDoc
    }

    async createToken(token:TokenDoc){
        await this.docClient.put({
            TableName:this.tableName,
            Item:token,
        }).promise()
    }
}

export const token:Token = new Token(
    new AWS.DynamoDB.DocumentClient(),
    process.env.TOKENS_TABLE,
    process.env.PERSON_ID_INDEX,
)