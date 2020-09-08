import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SectionDoc,SectionStatus } from '../../../models/doc/SectionDoc'
import { querySectionsByCreaterId } from '../../../businessLogic/section'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getSection event', event);

    const createrId = event.pathParameters.createrId;
    console.log(`createrId: ${createrId}`);

    const weekNum = event.pathParameters.week;
    console.log(`weekNum: ${weekNum}`);

    try{
        const sectionDocs:SectionDoc[] = await querySectionsByCreaterId(createrId, weekNum);
        const sections = [...sectionDocs].map((section)=>{
            return {
                ...section,
                secStatus:SectionStatus[section.secStatus]
            }
        })
        console.log('get section successfully by createrId: ', createrId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                sections
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