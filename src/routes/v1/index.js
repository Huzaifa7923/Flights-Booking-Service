const router = require('express').Router();

const bookingRoutes=require('./booking-routes')

router.use('/booking',bookingRoutes);

module.exports = router;