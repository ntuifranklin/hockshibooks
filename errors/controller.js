
// Require the necessary modules

const errorsController = (err, req, res, next) => {
    return res.status(500).render("../errors/pages/errorsHappeningOnRoutesHandling",{
        pagetitle:"Oops! Something went wrong",
        msg:req.query.msg?req.query.msg:false,
        errors:req.body.errors?req.body.errors:false,
        Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,
        success:req.query.success?req.query.success:false
    
    });
} ;

module.exports = {
    errorsController
}

