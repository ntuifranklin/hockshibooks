/* 
 * will contain a few scripts to test 
 * the sending of emails using the new created local file
 * /utilities/email.js
 */

const {Email, generateOTP, OTP_CODE_SIZE} = require('./email');
const otp = generateOTP();
const em = new Email();
const email = "info@email.bashballoonsrentals.com";
var mailOptions = {
            
            to: `${email}`,
            subject: `Your One-Time Password (OTP)`,
            html:
            `<html>
                <body>
                    <p>
                        Hi There!\n <br/>
                        Here is your one time password (OTP) :<h3>${otp}</h3>\n
                        It expires in 15 minutes.
                        <br/>\n
                    </p>
                </body>
            </html>`,
};
        try{

            em.sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html).
            then(
                (result) => {
                    console.log(`OTP Email sent: ${JSON.stringify(result)}`);
                    
                }
            ).catch(err => {
                console.log(`Error sending OTP email: ${err}`);
                
            });
        } catch(err) {
            console.log(`Error sending email: ${err.message}`);

        }
