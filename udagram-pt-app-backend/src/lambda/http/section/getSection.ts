import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SectionDoc, SectionStatus } from '../../../models/doc/SectionDoc'
import { querySection } from '../../../businessLogic/section'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getSection event', event);

    const sectionId = event.pathParameters.sectionId;
    console.log(`sectionId: ${sectionId}`);

    try{
        const section:SectionDoc = await querySection(sectionId)
        console.log('get section successfully by sectionId: ', sectionId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...section,
                status:SectionStatus[section.status]
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