import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
export const sendEmail = async ({ email, emailType, userId }) => {
    const hashedToken=await bcryptjs.hash(userId.toString(),10);
    try{
    if(emailType==="VERIFY"){
        await User.findByIdAndUpdate(userId,{verifyToken:hashedToken,verifyTokenExpiry:Date.now()+3600000})
}else if(emailType==="RESET"){
   
        await User.findByIdAndUpdate(userId,{$set:{ForgotPasswordToken:hashedToken,FrogotPasswordTokenExpiry:Date.now()+3600000}})
}}catch(err){
console.log(err)
}
  try {
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "101c7baa435594",
    pass: "f7f9e638bdf5bd"
  }
});
    const mailOptions = {
      from: "nk0402246@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:`<P>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</></p> to ${emailType==="VERIFY"?"verify your email":"reset your password"} or copy and paster the link below in your browser.
      <br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </P>
      `
    };
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (err) {
    throw new Error(err.message);
  }
};
