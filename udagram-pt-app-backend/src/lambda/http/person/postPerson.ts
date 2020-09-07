import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { PersonDoc } from '../../../models/doc/PersonDoc'
import { createPerson } from '../../../businessLogic/person'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling postPerson event', event);

    const parseBody = JSON.parse(event.body)
    console.log('parsed http body:', parseBody)

    try{
        const personDoc:PersonDoc = await createPerson(parseBody.emailAddress, parseBody.contactNumber, parseBody.name)
        console.log('post person successfully')
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...personDoc
            })
        }
    }catch(err){
        console.log('error on postPerson event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }    
}