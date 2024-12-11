

const policyPage = (req, res) => {
    res.render("../agreementdocs/pages/policy",{
        "pagetitle":"Policy"
    });
} ;

const termsAndConditionPage = (req, res) => {
    res.render("../agreementdocs/pages/terms-and-conditions",{
        "pagetitle":"Terms and Conditions"
    });
} ;


module.exports = {  
    policyPage,
    termsAndConditionPage   
};