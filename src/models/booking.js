'use strict';
const {
  Model
} = require('sequelize');

const {Enums}=require('../utils/common')

const {INITIATED,BOOKED, CANCELLED, PENDING}=Enums.BOOKING_STATUS

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    flightId: {
      allowNull:false,
      type:DataTypes.INTEGER
    },
    userId:{
      allowNull:false,
      type:DataTypes.INTEGER
    },
    status: {
      allowNull:false,
      type:DataTypes.ENUM,
      values:[INITIATED,BOOKED,CANCELLED,PENDING],
      defaultValue:INITIATED
    },
    noOfSeats:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:1
    },
    totalCost: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};