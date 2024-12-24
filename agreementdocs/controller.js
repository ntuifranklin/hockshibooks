
let customer ;
const policyPage = (req, res) => {
    customer = req.session.customer;
    res.render("../agreementdocs/pages/policy",{
        "pagetitle":"Policy",
        customer:customer
    });
} ;

const termsAndConditionPage = (req, res) => {
    customer = req.session.customer;
    res.render("../agreementdocs/pages/terms-and-conditions",{
        "pagetitle":"Terms and Conditions",
        customer:customer
    });
} ;

const faqPage = (req, res) => {
    customer = req.session.customer;
    res.render("../agreementdocs/pages/faq",{
        "pagetitle":"FAQ",
        customer:customer
    });
}


module.exports = {  
    policyPage,
    termsAndConditionPage,
    faqPage   
};