const { BookingRepository } = require("../repositories");
const axios=require('axios')

const bookingRepository=new BookingRepository();
const {Booking} = require('../models');
const db = require("../models");
const {ServerConfig} = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const createBooking=async(data)=>{
    console.log('create Booking')
    try{

        return db.sequelize.transaction(async function bookingImpl(t){
            const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)

            const flightData=flight.data.data;

            if(flightData.totalSeats<data.noOfSeats){
                throw new AppError('Not enough seats available ',StatusCodes.BAD_REQUEST)
            }else{
                return flightData;
            }
        })

    }catch(err){
        console.log(err);
        if(err instanceof AppError){
            throw err;
        }else{
            throw new AppError('Failed to create booking', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports={
    createBooking
}
