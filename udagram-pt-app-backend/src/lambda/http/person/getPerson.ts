import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { PersonDoc } from '../../../models/doc/PersonDoc'
import { queryPerson } from '../../../businessLogic/person'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getPerson event', event);

    const personId = event.pathParameters.personId;
    console.log(`personId: ${personId}`);

    try{
        const person:PersonDoc = await queryPerson(personId)
        console.log('get person successfully by personId: ', personId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                person
            })
        }
    }catch(err){
        console.log('error on getPerson event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }    
}