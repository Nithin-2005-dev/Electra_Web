import { Resource } from '../../../models/resources.model';
import {ConnectDb} from '../../database/dbConfig'
import { NextResponse } from 'next/server'
export async function POST(req) {
    await ConnectDb();
    try{
        const reqBody=await req.json();
        if(!reqBody){
            return NextResponse.json({
                message:'something went wrong!',
                status:500,
            })
        }
        const {driveUrl,semester,subject,category,name}=reqBody
        if(driveUrl=='' || semester=='' || category=='' || subject=='' || name==''){
            return NextResponse.json({
                message:'enter all mandetory fields!!',
                status:402,
            })
        }
        console.log(driveUrl)
        const response=await Resource.create({driveUrl,semester,subject,category,name})
        if(!response){
            return NextResponse.json({
                message:'your file failed to upload into db!please try again!',
                status:402,
            })
        }else{
            return NextResponse.json({
                message:'file upload to dataBase sucessfully!!',
                status:201,
            })
        }
    }catch(err){
        return NextResponse.json({
            message:'something went wrong!'+err,
            status:500,
        })
    }
}