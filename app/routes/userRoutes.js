const user = require('../controllers/userControllers')
module.exports = (app) => {
    app.post('/user/addItem',user.addItem);
    app.get('/user/getItem',user.getItem);
}