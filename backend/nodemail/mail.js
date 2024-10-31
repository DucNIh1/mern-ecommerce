import catchAsync from "../utils/catchAsync.js";
import nodemailer from "nodemailer";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

// Tạo transporter

// Hàm gửi email xác minh
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.PASSWORD_AUTH,
      },
    });

    await transporter.sendMail({
      from: `"ADMIN 👻" <${process.env.EMAIL_AUTH}>`, // Địa chỉ người gửi
      to: `${email}`, // Địa chỉ người nhận
      subject: "Verify your email", // Tiêu đề email
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
  } catch (error) {
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, url) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.PASSWORD_AUTH,
      },
    });

    await transporter.sendMail({
      from: `"ADMIN 👻" <${process.env.EMAIL_AUTH}>`, // Địa chỉ người gửi
      to: `${email}`,
      subject: "RESET YOUR PASSWORD",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
    });
  } catch (error) {
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.PASSWORD_AUTH,
      },
    });

    await transporter.sendMail({
      from: `"ADMIN 👻" <${process.env.EMAIL_AUTH}>`,
      to: `${email}`,
      subject: "RESET YOUR PASSWORD SUCCESS",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
