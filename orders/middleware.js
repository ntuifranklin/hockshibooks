const {adminIsLoggedInTrueOrFalse } = require('../admin/middleware');

const {customerIsLoggedInTrueOrFalse} = require('../customer/middleware');

const requestHasOrderIDParameter = [
    (req, res, next) => {
        if(!req.params.id){

            return res.redirect(`/customer/login`)
    
        } ;
        return next();
    },
] ;

const customerIsLoggedInOrAdminUserIsLoggedIn = [
    async (req, res, next) => {
        if ( await customerIsLoggedInTrueOrFalse(req, res, next) || await adminIsLoggedInTrueOrFalse(req, res, next) ) { 
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




