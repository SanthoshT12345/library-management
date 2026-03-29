const cron = require("node-cron");
const Borrow = require("../models/Borrow");
const { sendReminderEmail, sendOverdueEmail } = require("../utils/emailService");

const TIMEZONE = "Asia/Kolkata";

const runNotificationJob = async () => {
  console.log(`[${new Date().toISOString()}] Running Daily Notification Job...`);
  
  try {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // ============================================
    // 1. REMINDER JOB (Due tomorrow)
    // ============================================
    const upcomingBorrows = await Borrow.find({
      status: "issued",
      reminderSent: false,
      dueDate: { $gt: now, $lte: oneDayFromNow }
    }).populate("bookId", "title");

    if (upcomingBorrows.length > 0) {
      console.log(`Found ${upcomingBorrows.length} books due tomorrow. Sending reminders...`);
      for (const borrow of upcomingBorrows) {
        if (borrow.studentEmail && borrow.bookId) {
          const success = await sendReminderEmail(borrow.studentEmail, borrow.bookId.title, borrow.dueDate);
          if (success) {
            borrow.reminderSent = true;
            await borrow.save();
          }
        }
      }
    }

    // ============================================
    // 2. OVERDUE JOB (Past due date)
    // ============================================
    const overdueBorrows = await Borrow.find({
      status: { $in: ["issued", "overdue"] },
      dueDate: { $lt: now }
    }).populate("bookId", "title");

    if (overdueBorrows.length > 0) {
      console.log(`Found ${overdueBorrows.length} overdue books. Processing penalties...`);
      for (const borrow of overdueBorrows) {
        borrow.status = "overdue";

        // Calculate late days
        const msLate = now.getTime() - borrow.dueDate.getTime();
        const lateDays = Math.max(1, Math.floor(msLate / (1000 * 60 * 60 * 24)));
        
        // Fine is ₹10 per day late
        borrow.fine = lateDays * 10;

        // Check 24-hour limit for sending overdue emails
        let shouldSendEmail = false;
        if (!borrow.lastOverdueEmailSent) {
          shouldSendEmail = true;
        } else {
          const msSinceLastEmail = now.getTime() - borrow.lastOverdueEmailSent.getTime();
          const hoursSinceLastEmail = msSinceLastEmail / (1000 * 60 * 60);
          if (hoursSinceLastEmail >= 24) {
             shouldSendEmail = true;
          }
        }

        if (shouldSendEmail && borrow.studentEmail && borrow.bookId) {
          const success = await sendOverdueEmail(borrow.studentEmail, borrow.bookId.title, lateDays, borrow.fine);
          if (success) {
            borrow.lastOverdueEmailSent = now;
          }
        }

        await borrow.save();
      }
    }

  } catch (err) {
    console.error("Cron Notification Job Error:", err);
  }
};

// Schedule it to run daily at 8:00 AM specific to the required timezone
cron.schedule("0 8 * * *", runNotificationJob, { timezone: TIMEZONE });

module.exports = { runNotificationJob };
