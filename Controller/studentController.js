'use strict'

const student=require('../Model/studentModel');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var data={ };
var details={ };
var subjectDetails={ };
var sub={ };
const fs=require('fs')

const  handleFileUpload = async file   => {

    return new  Promise (async(resolve, reject) => {

        const filename  = await file.hapi.file
        
        const data = await file._data
        fs.writeFile('./public/' + filename, data, err => {
            if (err) {
              reject(err)                
            }
            resolve(filename)
          })

    setTimeout(async function(){ 
      fs.rename('./public/undefined','./public/images/'+file.hapi.filename,function(err){
        if(err) throw err;
        console.log('file renamed')
      })

    },2000)
    
    })    
} 
module.exports={
    
     async create(req,h){
        await handleFileUpload(req.payload.image);
        var img=req.payload.image.hapi.filename
        console.log(img)

       student.create({
            name:req.payload.name,
            email:req.payload.email,
            password:req.payload.password,
            standard:req.payload.standard,
            image:img
              
        },(err,saveUser)=>{
            if(err){
                return reply(err).code(500);
            }
            return saveUser
        });
        await  MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("exam_3");
            
           dbo.collection("students").find({}).toArray(function(err, result) {
              data=result;
              if (err) throw err;
              db.close(); 
            });
      
          });
       
        return h.view('addStudent',{data})
       
    },

    async findOne(req, reply) {
        console.log(req.params.id)
        await student.findById(req.params.id, (err,person) => {
            if (err) {
                return reply(err).code(404);
            }
             details=person; 
                 
        })   
        
        return reply.view('editStudent',{id:details.id,name:details.name,email:details.email,password:details.password,standard:details.standard,image:details.image})     
    
    },
   async update(req, reply) {
        if (!req.params.id) {
            return reply({err: 'id is required param'}).code(400);
        }
        await handleFileUpload(req.payload.image);
        var img=req.payload.image.hapi.filename
        console.log("image"+img)
        let attributes = {};
 
        if (req.payload.name) {
            attributes.name = req.payload.name;
        }
        if (req.payload.email) {
            attributes.email = req.payload.email;
        }
        if (req.payload.password) {
            attributes.password = req.payload.password;
        }
        if (req.payload.standard) {
            attributes.standard = req.payload.standard;
        }
        if (img) {
            attributes.image = img;
        }
        
        student.findByIdAndUpdate(req.params.id, attributes, {new: true}, (err, company) => {
            if (err) {
                return reply(err).code(500);
            }
            return reply.response(company);
        })
        return reply.view('addStudent')
    },
    async delete(req, reply) { 
      
        await student.findByIdAndRemove(req.params.id, (err, result) => {
          
            if (err) {
                return reply(err).code(500);
            }
            console.log("deleted")
        })
        return reply.view('addStudent')
    },

    async findName(request,reply){ 
    
        await  MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("exam_3");
          
         dbo.collection("students").find({}).toArray(function(err, result) {
            data=result;
            if (err) throw err;
            db.close(); 
          });
          dbo.collection("subjects").find({}).toArray(function(err, subject) {
            sub=subject;
            if (err) throw err;
            db.close(); 
          });
        });
        return reply.view('addMarks',{data,sub})
    
    },
    async markCreate(req,h){

        marks.create({
             name:req.payload.name,
             subject1:req.payload.subject1,
             mark1:req.payload.mark1, 
             
         },(err,saveUser)=>{
             if(err){
                 return reply(err).code(500);
             }
             return saveUser
         });
         await  MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("examdb");
            
           dbo.collection("marks").find({}).toArray(function(err, result) {
              data=result;
              if (err) throw err;
              db.close(); 
            });
      
          });
                
         return h.view('addMarks',{data})
        
    },

}