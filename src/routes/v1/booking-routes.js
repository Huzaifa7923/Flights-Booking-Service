const express = require('express');

const {BookingController} = require('../../controllers')

const router = express.Router();

router.post('/payments', BookingController.makePayment);
router.post('/:id', BookingController.createBooking);




module.exports = router;