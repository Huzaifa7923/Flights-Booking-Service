const { BookingRepository } = require("../repositories");
const axios=require('axios')
const {Booking} = require('../models');
const db = require("../models");
const {ServerConfig} = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const {Enums} = require('../utils/common')
const {CANCELLED,BOOKED,INITIATED} = Enums.BOOKING_STATUS


const bookingRepository=new BookingRepository();


const cancelOldBookings=async()=>{
    try{
    const time = new Date( Date.now() - 1000 * 300 ); // time 5 mins ago
    
    const bookings =await bookingRepository.getExpiredBooking(time)

    for(const booking of bookings){
        const transaction=await db.sequelize.transaction();
        try{
            await bookingRepository.updateBooking(booking.id, { status: 'CANCELLED' }, transaction);

            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${booking.flightId}/seats`,{
                seats:Number(booking.noOfSeats),
                dec:0
            });

            await transaction.commit();
        }catch(error){
            await transaction.rollback();
            console.log('cron job error')
            console.log(error);
        }
    }
}catch(err){
    console.log('error in cron job outer')
    console.log(err);
}
}


const createBooking=async(data)=>{
    // console.log('create Booking')

    let bookingResult;
    try{
        const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
        const flightData=flight.data.data;

        if(flightData.totalSeats<data.noOfSeats){
            throw new AppError('Not enough seats available ',StatusCodes.BAD_REQUEST)
        }

        bookingResult=await  db.sequelize.transaction(async function bookingImpl(t){
            
                const totalPrice=data.noOfSeats*flightData.price;
                const bookingPayload={...data,totalCost:totalPrice}

                // console.log(bookingPayload);

                const booking=await bookingRepository.createBooking(bookingPayload,t)
                return booking;
        })
        // if transaction succeeds 
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:Number(data.noOfSeats),
            dec:1
        });

        return bookingResult;

    }catch(err){
        //axios patch request failed
        if(bookingResult){
            await cancelBooking(bookingResult);
        }

        if(err instanceof AppError){
            throw err;
        }else{
            throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

const cancelBooking=async(bookingDetails,transaction=null)=>{
    const t = transaction || await db.sequelize.transaction();
    try{
        await bookingRepository.updateBooking(bookingDetails.id,{status:CANCELLED},t);
        const response=await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,{
            dec:0,
            seats:bookingDetails.noOfSeats
        })
        console.log(response);
        return true;
}catch(err){
    if(!transaction)
        t.rollback();
    console.log(err);
    throw new AppError('error inside cancelBooking',StatusCodes.INTERNAL_SERVER_ERROR);
}
}


const makePayment=async(data)=>{
   
    const {userId,bookingId,totalCost}=data;
    const transaction=await db.sequelize.transaction();
    try{
        const bookingDetails=await bookingRepository.getBooking(bookingId,transaction);

        // console.log(userId)
        // console.log(bookingId)
        // console.log(totalCost)
        if(!bookingDetails){
            throw new AppError('Booking does not exist',StatusCodes.BAD_REQUEST);
        }

        // console.log('xx')
        // console.log(bookingDetails)
        if(bookingDetails.status===CANCELLED){
            throw new AppError('Booking has expired please retry again',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.status===BOOKED){
            throw new AppError('Already booked',StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.userId != userId){
            throw new AppError('User corresponding to the booking does not match',StatusCodes.BAD_REQUEST);
        }

        if(bookingDetails.totalCost!=totalCost){
            throw new AppError('Amount does not match',StatusCodes.BAD_REQUEST);
        }

        const bookingTime=new Date(bookingDetails.createdAt);
        const currentTime=new Date();

        // console.log(bookingTime)
        // console.log(currentTimeTime)

        // booking need to be cancelled and again whole process will restart , in above -> retry only payment 
        if(currentTime-bookingTime>300000){

            await cancelBooking(bookingDetails,transaction);

            // console.log('time fucked')
            // await bookingRepository.updateBooking(bookingId,{
            //     status:CANCELLED
            // },transaction)

            throw new AppError('Booking time expired',StatusCodes.BAD_REQUEST);
        }

        // let successfull

        await bookingRepository.updateBooking(bookingId,{
            status:BOOKED
        },transaction)

        await transaction.commit();

        return true;
    }catch(err){
        console.log(err);
        await transaction.rollback();
        if(err instanceof AppError)
            throw err;
        throw new AppError(err.message,StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

module.exports={
    createBooking,
    makePayment,
    cancelOldBookings
}
