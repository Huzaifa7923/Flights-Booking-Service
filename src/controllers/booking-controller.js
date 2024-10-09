const Booking = require('../models')
const {SuccessResponse,ErrorResponse} = require('../utils/common')

const {BookingService}=require('../services')

const createBooking=async(req,res)=>{
    try{
        // console.log(req.body.flightId)
        const response=await BookingService.createBooking({
            flightId:req.params.id,
            noOfSeats:req.body.noOfSeats
            // userId bi aayegi
        });
        console.log('response')
        console.log(response)
        SuccessResponse.data=response;

        return res.json(SuccessResponse)

    }catch(err){
        console.log(err)
        ErrorResponse.error=err;
        return res.json(ErrorResponse)
    }
}


module.exports={
    createBooking
}