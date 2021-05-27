const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const subjectSchema=new Schema({
    subject:String, 
  });

module.exports=mongoose.model('subject',subjectSchema);