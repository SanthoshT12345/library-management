const nodemailer = require("nodemailer");

// Create reusable transporter
const getTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    console.log("No SMTP credentials provided in .env. Using Ethereal test inbox.");
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

const sendEmailWrapper = async (options) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"Library Admin" <admin@library.com>',
      ...options
    });
    console.log("Email sent to %s: %s", options.to, info.messageId);
    if (!process.env.EMAIL_USER) {
      console.log("Ethereal Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false; // Handle failures gracefully
  }
};

const sendBorrowEmail = async (email, bookTitle, issueDate, dueDate) => {
  const options = {
    to: email,
    subject: "Book Borrowed Successfully",
    text: `You have successfully borrowed "${bookTitle}". Issue Date: ${new Date(issueDate).toDateString()}. Due Date: ${new Date(dueDate).toDateString()}.`,
    html: `<h3>Library Notification</h3><p>You have successfully borrowed <b>"${bookTitle}"</b>.</p><p><b>Issue Date:</b> ${new Date(issueDate).toDateString()}</p><p><b>Due Date:</b> ${new Date(dueDate).toDateString()}</p><p>Please return it by the due date to avoid fines.</p>`
  };
  return sendEmailWrapper(options);
};

const sendReminderEmail = async (email, bookTitle, dueDate) => {
  const options = {
    to: email,
    subject: "Reminder: Book Due Tomorrow",
    text: `Reminder: Tomorrow is the last day to return your book "${bookTitle}" (Due: ${new Date(dueDate).toDateString()}).`,
    html: `<h3>Library Reminder</h3><p>Reminder: Tomorrow is the last day to return your book <b>"${bookTitle}"</b>.</p><p><b>Due Date:</b> ${new Date(dueDate).toDateString()}</p>`
  };
  return sendEmailWrapper(options);
};

const sendOverdueEmail = async (email, bookTitle, lateDays, fineAmount) => {
  const options = {
    to: email,
    subject: "OVERDUE: Return Your Library Book",
    text: `Your borrowed book "${bookTitle}" is overdue by ${lateDays} days. Current fine: ₹${fineAmount}. Please return it immediately.`,
    html: `<h3>Overdue Notice</h3><p>Your borrowed book <b>"${bookTitle}"</b> is overdue.</p><p><b>Late Days:</b> ${lateDays}</p><p><b>Current Fine Amount:</b> ₹${fineAmount}</p><p>Please return it immediately to stop the fine accumulation.</p>`
  };
  return sendEmailWrapper(options);
};

module.exports = { sendBorrowEmail, sendReminderEmail, sendOverdueEmail };
