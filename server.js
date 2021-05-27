const Hapi = require("@hapi/hapi");
const Routes=require('./Routes/userRouter')
const mongoose = require('mongoose');
const Path=require('path')
const mongoDbUri = 'mongodb://localhost:27017/exam_3';


mongoose.connect(mongoDbUri, {
    useMongoClient: true
});
mongoose.connection.on('connected', () => {
    console.log(`app is connected to ${mongoDbUri}`);
});
mongoose.connection.on('error', err => {
    console.log('error while connecting to mongodb', err);
});
const users = [
    {
        id: '2133d32a'
    }
];


const init = async () => {
  const server = Hapi.Server({ 
      port:4000,
      host:'localhost',

     });
     await server.register(require('@hapi/cookie'));

     server.auth.strategy('session', 'cookie', {
      cookie: {
          name: 'sid-example',
          password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
          isSecure: false
      },
      redirectTo: '/login',
      validateFunc: async (req, session) => {

          const account = await users.find(
              (user) => (user.id === session.id)
          );

          if (!account) {

              return { valid: false };
          }

          return { valid: true, credentials: account };
      }
     });
     server.auth.default('session');
     await server.register({
        plugin: require('@hapi/inert')
      })
     await server.register(require('@hapi/vision'));
     server.views({
         engines:{
             html:require('handlebars')
             
         },

         relativeTo:__dirname,
         path:'Views',


     })

     server.route(Routes);

    await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};


process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});



init();