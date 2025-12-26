import User from "@/models/useModel";
import bcrypt from "bcryptjs";
import { MailtrapTransport } from "mailtrap";
import nodemailer from "nodemailer";

const sendEmail = async ({ email, emailType, userId }:any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    if (!process.env.MAILTRAP_TOKEN) {
      console.log("MAILTRAP_TOKEN => ", process.env.MAILTRAP_TOKEN);
      return;
    }

    console.log("MAILTRAP_TOKEN outside => ", process.env.MAILTRAP_TOKEN);

    const transport = nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAILTRAP_TOKEN,
      })
    );

    const sender = {
      address: "hello@demomailtrap.co",
      name: "Mailtrap Test",
    };

    const recipients = ["harshradadiya9999@gmail.com"];

    const mailOptions = {
      from: sender,
      to: recipients,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",

      html: `
    <p>
      Click 
      <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }?token=${hashedToken}">
        here
      </a>
      to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      <br /><br />
      Or copy and paste the link below in your browser:
      <br />
      ${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }?token=${hashedToken}
    </p>
  `,
    };

    const mailRes = await transport.sendMail(mailOptions);
    return mailRes;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Erorr Occor while send mail: ${errorMessage}`);
  }
};

export default sendEmail;
