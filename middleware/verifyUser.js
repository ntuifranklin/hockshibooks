const verifyLogin=(req,res,next)=>{
    /**
 * Verifies if a user is logged in and redirects them to the guest page if not.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function in the stack.
 * @return {void}
 */
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