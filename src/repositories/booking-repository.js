const CrudRepostory = require("./crud-repository");
const {Booking}=require('../models');

class BookingRepository extends CrudRepostory{
    constructor(){
        super(Booking)
    }

    async createBooking(data,transaction){
        const response=await Booking.create(data,{transaction});
        return response;
    }

    async getBooking(data,transaction){
        const response=await Booking.findByPk(data,{
            transaction
        });
        return response;
    }

    async updateBooking(id,data,transaction){
        const response=await Booking.update(data,{
            where:{
                id
            }
        },{transaction})

        return response;
    }
}

module.exports=BookingRepository