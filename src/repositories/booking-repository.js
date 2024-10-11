const CrudRepostory = require("./crud-repository");
const {Booking}=require('../models');
const {Op} = require("sequelize")

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

    async getExpiredBooking(timeStamp){
        console.log('expired called')
        const response=await Booking.findAll({
            where:{
                [Op.and]:[
                    {
                        status:'INITIATED'
                    },
                    {
                        createdAt:{
                            [Op.lt]:timeStamp
                        }
                    }
                ]
            }
        })

        return response;
    }

    async updateBooking(id,data,transaction=null){
        const response=await Booking.update(data,{
            where:{
                id
            },
            transaction
        })

        return response;
    }
}

module.exports=BookingRepository