const verifyLogin=(req,res,next)=>{
    if (req.session.customer) { // or any other authentication check
        return next();
    } else {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ redirectUrl: '/login' });
        } else {
            return res.redirect('/login');
        }
    }

}

module.exports=verifyLogin