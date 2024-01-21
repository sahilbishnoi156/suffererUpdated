import User from "@/models/user";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, userId, emailType }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY_USER") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 2400000,
      });
    } else if (emailType === "RESET_PASSWORD") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 2400000,
      });
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f10de470b892f3",
        pass: "e1eafb4bb3cb92",
      },
    });

    const mailOptions = {
        from: 'sahilbishnoi170@gmail.com',
        to: email,
        subject: emailType === "RESET_PASSWORD" ? "Reset Password" : "Verify User",
        html:`<p> Click <a href="${process.env.NEXTAUTH_URL}/verifyToken?token=${hashedToken}"> verify </a> to ${emailType === "RESET_PASSWORD" ? "Verify Password" : "Verify Email" }</p>`
    }

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error("Error sending mail");
  }
};
