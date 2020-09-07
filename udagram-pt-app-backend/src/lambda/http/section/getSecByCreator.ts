import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SectionDoc } from '../../../models/doc/SectionDoc'
import { querySectionsByCreatorId } from '../../../businessLogic/section'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getSection event', event);

    const creatorId = event.pathParameters.creatorId;
    console.log(`creatorId: ${creatorId}`);

    const week = event.pathParameters.week;
    console.log(`weekNum: ${week}`);

    try{
        const sections:SectionDoc[] = await querySectionsByCreatorId(creatorId, week);
        console.log('get section successfully by creatorId: ', creatorId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...sections
            })
        }
    }catch(err){
        console.log('error on getSection event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }   
}