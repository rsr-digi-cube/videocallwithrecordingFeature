const express             =   require('express'),
      bodyParse           =   require('body-parser'),
      compression         =   require('compression'),
      mongoose            =   require('mongoose'),
      app                 =   express(),
      swaggerUi           =   require('swagger-ui-express'),
      methodOverride      =   require('method-override'),
      timeout             =   require('connect-timeout'),
      swaggerDocument     =   require('./app/config/swagger.json'),
      server              =   require('http').Server(app),
      tokenVerification   =   require('./app/Lib/TokenManager'),
      user                =   require('./app/controllers/userControllers'),
      cors                =   require('cors');
                              require('dotenv').config();
global.Joi                =   require('joi');
global.path               =   require('path');
global.ObjectId = mongoose.Types.ObjectId;
global.jwt = require('jsonwebtoken');
global.bcrypt = require('bcrypt');
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 400
});
app.use(express.static('public'));
app.use('/scripts', express.static(`${__dirname}/node_modules/`));
app.use(cors({credentials: true, origin: true}));
app.use(bodyParse.json({limit:'100mb'}));
app.use(bodyParse.urlencoded({limit:'100mb',extended:true}));
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(methodOverride());
app.use(compression());
app.use(limiter);
app.use(timeout(3*60*1000));
app.use((err, req, res, next) => {
    console.log(err, "********** ERROR GLOBALLY ***************");
    res.status(500).json();
});
app.post('/user/register',user.register);
app.post('/user/login',user.login);
app.set('port',process.env.PORT);
app.use(tokenVerification)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.URL,{ useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on('error',function(err){
  console.log(" mongo db connection terminate "+ err);
  process.exit();
});
mongoose.connection.once('open',function(){
  console.log('Successfully connected to database');
});
require('./app/routes/userRoutes')(app);
server.listen(app.get('port'),function(req) {
  console.log('Node app is running on port', app.get('port'));
});