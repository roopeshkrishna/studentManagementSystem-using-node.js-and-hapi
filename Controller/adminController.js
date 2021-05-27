'use strict'
const bcrypt=require('bcrypt')

const adminModel=require('../model/admin_Model')

let changePassword=async(pass)=>{
    try{
        const salt= await bcrypt.genSalt(8); 
        const hashedPassword= await bcrypt.hash(pass,salt)
        return hashedPassword
    }catch(error){
        console.log(error)
    }  
};
const account = [
  {
      id: '2133d32a'
  }
];


module.exports={
 
     async create(req,h){
        var pass=req.payload.password;
        var bpassword = await changePassword(pass)

        adminModel.create({
            username:req.payload.username,
            password:bpassword
            
            
        },(err,saveUser)=>{
            if(err){
                return reply(err).code(500);
            }
            return saveUser
        });
        return h.view('index')
       
    },
    async checkLogin(req, h){
        console.log("user : "+req.payload.username)
        console.log("pass : "+req.payload.password)
        try {
          const person = await adminModel.findOne({ username: req.payload.username });
          console.log(person);
          if (person) {
            const cmp = await bcrypt.compare(req.payload.password, person.password);
            if (cmp) {
              req.cookieAuth.set({ id: account.id });
              return h.view('home')
              
            } else {
       
              return h.redirect('/login')
            }
          } else {
            
            return h.redirect('/login')
          }
        } catch (error) {
          console.log(error);
          throw error
        }
    }
}