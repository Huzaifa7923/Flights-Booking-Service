class AppError extends Error{

    constructor(message,statusCode){
        super(message)
        // console.log(3);
        this.statusCode=statusCode?statusCode:500;
        this.explanation=message

    }
} 

module.exports=AppError