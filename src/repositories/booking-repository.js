const CrudRepostory = require("./crud-repository");
const {Booking}=require('../models');
const { Transaction } = require("sequelize");

class BookingRepository extends CrudRepostory{
    constructor(){
        super(Booking)
    }

    async createBooking(data,transaction){
        const response=await Booking.create(data,{transaction});
        return response;
    }

}

module.exports=BookingRepository