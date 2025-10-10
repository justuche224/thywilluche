import { sendMail } from "@/mailer";

export const sendForgotPasswordEmail = async (email: string, url: string) => {
  try {
    await sendMail({
      to: email,
      subject: "Reset your password for Thywilluche community",
      text: `Click the link to reset your password: ${url}`,
      html: `Click the link to reset your password: <a href="${url}">${url}</a>`,
    });
  } catch (error) {
    throw new Error("Failed to send forgot password email: " + error);
  }
};
