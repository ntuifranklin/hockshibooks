/**
 * Middleware to verify if a user is logged in.
 *
 * This middleware checks if the `user` object is present in the session. If the user is not logged in (i.e., `req.session.user` is `undefined`), it renders a "not allowed" page. If the user is logged in, it allows the request to proceed to the next middleware or route handler.
 *

 */
const verifyLogin=(req,res,next)=>{
    if (req.session.user==undefined){
        res.status(403).render('pages/notAllowedPage')
    }else{

        res.status(200)
        next()
    }

}

module.exports=verifyLogin