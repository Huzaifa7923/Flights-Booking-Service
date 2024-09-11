const { StatusCodes } = require('http-status-codes');
const AppError= require('../utils/errors/app-error') 

class CrudRepostory{
    constructor(model){
        this.model=model
    }


    async create(data){
        const resp = await this.model.create(data);
        // console.log('inside crud');
        return resp;
    }

    async getAll(){
        const resp = await this.model.findAll();
        return resp;
    }

    async get(data){
        const resp = await this.model.findByPk(data);  
        if(!resp){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        return resp;
    }


    async destroy(data){
            const resp = await this.model.destroy({
            where:{
                id:data
            }
        });

        if(!resp){
            throw new AppError('Not able to find the resource to delete',StatusCodes.NOT_FOUND)
        }
        return resp;
    }



    async update(id,data){
        const resp = await this.model.update(data,{
            where:{
                id
            }
        });

        return resp;
    }
}

module.exports=CrudRepostory