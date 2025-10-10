import { sendMail } from "@/mailer";

export const sendVerificationEmail = async (email: string, url: string) => {
  console.log('sendVerificationEmail', email, url);
  try {
    await sendMail({
      to: email,
      subject: "Verify your email for Thywilluche community",
      text: `Click the link to verify your email: ${url}`,
      html: `Click the link to verify your email: <a href="${url}">${url}</a>`,
    });
  } catch (error) {
    console.log('Failed to send verification email: ' + error);
    throw new Error("Failed to send verification email: " + error);
  }
};
