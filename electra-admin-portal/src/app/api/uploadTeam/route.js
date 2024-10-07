import { Team } from '../../../models/team.model';
import { ConnectDb } from '../../database/dbConfig'
import { NextResponse } from 'next/server'
export async function POST(req){
    await ConnectDb();
    try{
        const reqBody=await req.json();
        if(!reqBody){
            return NextResponse.json({
                message:'something went wrong!!',
                status:402,
            })
        }
        const {name,year,position,publicId,insta,fb,linkdin,category}=reqBody;
        if(name=='' || year=='' || position==''){
            return NextResponse.json({
                message:'enter mandatory fields',
                status:402,
            })
        }
        const result=await Team.create({name,year,position,insta,publicId,fb,linkdin,category});
        console.log(result)
        if(!result){
            return NextResponse.json({
                message:'failed to update in dataBase!! please try again',
                status:500,
            })
        }else{
            return NextResponse.json({
                message:'sucefully updated to database!!',
                status:201,
            })
        }
    }catch(err){
        return NextResponse.json({
            message:'spmething went wrong!!',
            status:500,
        })
    }
}