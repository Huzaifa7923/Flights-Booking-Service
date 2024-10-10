const Booking = require('../models')
const {SuccessResponse,ErrorResponse} = require('../utils/common')

const {BookingService}=require('../services');
const { StatusCodes } = require('http-status-codes');

const createBooking=async(req,res)=>{
    try{
        // console.log(req.body.flightId)
        const response=await BookingService.createBooking({
            flightId:req.params.id,
            noOfSeats:req.body.noOfSeats,
            userId: req.body.userId
        });
        // console.log('response')
        // console.log(response)
        SuccessResponse.data=response;

        return res.status(StatusCodes.CREATED).json(SuccessResponse)

    }catch(err){
        // console.log(err)
        ErrorResponse.error=err;
        return res.status(err.statusCode).json(ErrorResponse)
    }
}


const makePayment=async(req,res)=>{
    try{
        // console.log('make payment');
        const response=await BookingService.makePayment({
            userId:req.body.userId,
            bookingId:req.body.bookingId,
            totalCost:req.body.totalCost
        })
        SuccessResponse.data=response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse)

    }catch(err){
        console.log(err);
        ErrorResponse.error=err;
        return res.status(err.statusCode).json(ErrorResponse)
    }
}



module.exports={
    createBooking,
    makePayment
}