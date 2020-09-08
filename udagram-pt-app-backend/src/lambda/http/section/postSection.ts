import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { SectionDoc,SectionStatus } from '../../../models/doc/SectionDoc'
import { createSection } from '../../../businessLogic/section'
import { CreateSectionJson } from '../../../models/http/createSectionJson'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling postSection event', event);

    const parseBody = JSON.parse(event.body)
    console.log('parsed http body:', parseBody)

    const createSectionJson = {
        weekNum:parseBody.weekNum,
        trainerId:parseBody.trainerId,
        createrId:parseBody.createrId,
        startDateTime:parseBody.startDateTime,
        endDateTime:parseBody.endDateTime,
        place:parseBody.place
    } as CreateSectionJson

    try{
        const sectionDoc:SectionDoc = await createSection(createSectionJson)
        console.log('post section successfully')
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...sectionDoc,
                secStatus:SectionStatus[sectionDoc.secStatus]
            })
        }
    }catch(err){
        console.log('error on postSection event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}