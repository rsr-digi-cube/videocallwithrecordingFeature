const Models  =  require('../models/index'),
      DAO     =  require('../DAOManager/queries'),
      fs      =  require('fs-extra'),
      util    =  require('util'),
      AppConstraints     =       require('../config/AppConstraints'),
      ObjectId=  require('mongodb').ObjectId;



exports.createDefaultData = async () => {

    /*-------------------------------------------------------------------------------
     * add admin
     * -----------------------------------------------------------------------------*/
    let admins = [
        {email:"admin@gmail.com",password:"123456",name:"admin",isSuperAdmin:true},
        {email:"rajender@gmail.com",password:"123456",name:"admin",isSuperAdmin:true},
        {email:"kuldeep@gmail.com",password:"123456",name:"admin",isSuperAdmin:true},
    ];

    /*-------------------------------------------------------------------------------
     * add admin defaults
     * -----------------------------------------------------------------------------*/

    try{
        let versioningObject ={
            androidVersion:100,
            androidForceVersion:100,
            iosVersion:100,
            iosForceVersion:100,
            webVersion:100,
            webForceVersion:100
        };


        let defaultRole={
            "roleName":"Admin",
            "accessControle" : [ 
                "{\"properties\":{\"view\":true,\"add\":true,\"edit\":true},\"invoice\":{\"view\":true,\"recieveAsCash\":true},\"request\":{\"view\":true,\"markResolve\":true},\"vacate\":{\"view\":true,\"canAcceptOrReject\":true,\"doVacateRequest\":true},\"tenants\":{\"view\":true},\"withdrawals\":{\"view\":true},\"team\":{\"view\":true},\"bank\":{\"view\":true,\"add\":true},\"reports\":{\"view\":true,\"export\":true}}"
            ]
        }

        const promise = [
            createAdmin(admins),
            checkFolderAlreadyExist(),
            createGuestUser(),
            createAppVersioningDefault(versioningObject),
            createDefaultRole(defaultRole)
        ];


        await Promise.all(promise);
        console.log("info","Bootstrap Completed");
    }
    catch(err){
        console.log("info",{ERROR: err})
    }
}

async function createAdmin (admins) {
    try{
        await admins.map(async(val)=>{
            let isAlreadyEmail = await Models.Admin.findOne({email:val.email});
          //  console.log(isAlreadyEmail,'isAlreadyEmailisAlreadyEmailisAlreadyEmailisAlreadyEmail')
            if(!isAlreadyEmail){
                let admin=new Models.Admin();
                admin.email=val.email;
                admin.password= bcrypt.hashSync(val.password, AppConstraints.SERVER.SALT);
                admin.name=val.name;
                admin.isSuperAdmin=val.isSuperAdmin;
                await admin.save();
            }
        })

    }catch(err){
        console.log(err);
    }
}

function checkFolderAlreadyExist() {

    let _dirPath = "./public/uploads";
    console.log(fs.existsSync(_dirPath));
    if (!fs.existsSync(_dirPath)) {
        const mkdir = util.promisify(fs.mkdir);
        mkdir(_dirPath).then((stats) => {
            console.log('folder created successfully ');
        }).catch((error) => {
            console.log(error);
        });
    } else {
        console.log('folder already exist ');
    }
}


async function createDefaultRole(defaultRole){
    try {
        let getAppVersion = await DAO.getDataOne(Models.UserRole, {"roleName":defaultRole.roleName}, {}, {lean: true});
        if (getAppVersion === null) {
            await DAO.saveData(Models.UserRole, defaultRole);
        }
    }
    catch (err) {
        throw err;
    }
}

function createGuestUser () {
    return new Promise((resolve, reject) => {
        try {
            let userDetails = {
                fullName:"Guest User",
                phoneNumber:"1111111111",
                callingCode:"+91",
                fullNumber: "+911111111111",
                "isDeleted": false,
                "isBlocked": false
            };

            let userData = DAO.findAndUpdate(Models.User,{phoneNumber:"1111111111",callingCode:"+91"}, userDetails, { lean: true, upsert: true, new : true});
            return resolve("USER Added");
        } catch (err) {
            return reject(err);
        }
    });
}

async function createAppVersioningDefault(versioningObject) {
    try {
        let getAppVersion = await DAO.getDataOne(Models.AppVersion, {}, {}, {lean: true});
        if (getAppVersion === null) {
            await DAO.saveData(Models.AppVersion, versioningObject);
        }
    }
    catch (err) {
        throw err;
    }
}

















