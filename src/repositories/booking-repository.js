const CrudRepostory = require("./crud-repository");
const {Booking}=require('../models')

class BookingRepository extends CrudRepostory{
    constructor(){
        super(Booking)
    }

}

module.exports=BookingRepository