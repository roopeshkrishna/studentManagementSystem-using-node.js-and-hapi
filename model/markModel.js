const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const markSchema= new Schema({
    studentId:{ type:Schema.Types.ObjectId },
    subject:[{
        id:{type:Schema.Types.ObjectId},
        mark:String
    }]

});

module.exports=mongoose.model('marks',markSchema);