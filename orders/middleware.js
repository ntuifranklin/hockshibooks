const {verifyLogin } = require('../admin/middleware');
const verifyIfAdminIsLoggedIn =  verifyLogin;
const {verifyCustomerIsLoggedIn} = require('../customer/middleware');

const requestHasOrderIDParameter = [
    (req, res, next) => {
        if(!req.params.id){

            return res.redirect(`/customer/login`)
    
        } ;
        return next();
    },
] ;

const customerIsLoggedInOrAdminUserIsLoggedIn = [
    (req, res, next) => {
        if ( verifyCustomerIsLoggedIn(req, res, next) || verifyIfAdminIsLoggedIn(req, res, next) ) { 
            next();
        } else {
            return res.redirect('/customer/login');
        }
    }
];


module.exports = {
    requestHasOrderIDParameter,
    customerIsLoggedInOrAdminUserIsLoggedIn
} ;




