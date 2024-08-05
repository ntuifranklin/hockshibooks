const verifyLogin=(req,res,next)=>{
    if (req.session.customer) { // or any other authentication check
        return next();
    } else {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ redirectUrl: '/askGeust' });
        } else {
            return res.redirect('/askGeust');
        }
    }

}

module.exports=verifyLogin