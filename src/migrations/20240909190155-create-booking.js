'use strict';
/** @type {import('sequelize-cli').Migration} */

const {Enums}=require('../utils/common/index')
const {INITIATED,BOOKED, CANCELLED, PENDING}=Enums.BOOKING_STATUS

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      status: {
        allowNull:false,
        type:Sequelize.ENUM,
        values:[INITIATED,BOOKED,CANCELLED,PENDING],
        defaultValue:INITIATED

      },
      noOfSeats:{
        type:Sequelize.INTEGER,
        defaultValue:1,
        allowNull:false,
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};