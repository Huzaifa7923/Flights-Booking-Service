const cron = require('node-cron');
const {BookingService}=require('../../services')


function scheduleCrons(){
    cron.schedule('*/30 * * * *',async()=>{
        console.log('cron job running')
       await BookingService.cancelOldBookings()
    })
}

module.exports=scheduleCrons;