import { sendMail } from "@/mailer";

export const sendChampionshipRegistrationConfirmationEmail = async (
  userEmail: string,
  userName: string | null,
  registrationId: string
) => {
  try {
    const greetingName = userName || "there";
    const registrationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/championship/registration`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          Championship Registration Received
        </h2>
        
        <p>Hey ${greetingName},</p>
        
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">Registration Status: Pending</h3>
          <p style="color: #856404; margin: 0;">
            Thank you for registering for <strong>Thywill's Champion's League</strong>! Your registration has been received and is currently pending review.
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">What Happens Next?</h3>
          <p>Our team will review your registration and payment receipt. You will receive an email notification once your registration has been approved or if we need any additional information.</p>
          <p>Please note that processing may take a few business days. We appreciate your patience!</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #495057;">
            <strong>Registration ID:</strong> ${registrationId}
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${registrationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #800000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Registration Status
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Questions?</strong> If you have any questions about your registration, please contact us at <a href="mailto:support@thywilluche.com" style="color: #0051a5;">support@thywilluche.com</a>.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          Team Thywill
        </p>
      </div>
    `;

    const text = `
Championship Registration Received

Hey ${greetingName},

Thank you for registering for Thywill's Champion's League! Your registration has been received and is currently pending review.

Registration Status: Pending

What Happens Next?
Our team will review your registration and payment receipt. You will receive an email notification once your registration has been approved or if we need any additional information.

Please note that processing may take a few business days. We appreciate your patience!

Registration ID: ${registrationId}

View Registration Status: ${registrationUrl}

Questions? If you have any questions about your registration, please contact us at support@thywilluche.com.

Best regards,
Team Thywill
    `.trim();

    await sendMail({
      to: userEmail,
      subject: "Championship Registration Received - Pending Review",
      text,
      html,
    });

    console.log(
      `Championship registration confirmation email sent to ${userEmail}`
    );
  } catch (error) {
    console.error(
      "Error sending championship registration confirmation email:",
      error
    );
    throw new Error(
      "Failed to send championship registration confirmation email: " + error
    );
  }
};

export const sendChampionshipRegistrationNotificationToAdmin = async (
  adminEmail: string,
  userName: string,
  userEmail: string,
  phoneNumber: string,
  country: string,
  state: string,
  city: string,
  address: string,
  registrationId: string,
  receiptUrl: string | null
) => {
  try {
    const adminUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/admin/championship`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          New Championship Registration Received
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Registration Information</h3>
          <p><strong>Registration ID:</strong> ${registrationId}</p>
          <p><strong>User Name:</strong> ${userName}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Location Details</h3>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Address:</strong> ${address}</p>
        </div>

        ${
          receiptUrl
            ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            <strong>Payment Receipt:</strong> <a href="${receiptUrl}" style="color: #0051a5;" target="_blank">View Receipt</a>
          </p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminUrl}" style="display: inline-block; padding: 12px 30px; background-color: #800000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Review Registration
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Action Required:</strong> Please review this registration and approve or reject it.
          </p>
        </div>
      </div>
    `;

    const text = `
New Championship Registration Received

Registration Information:
- Registration ID: ${registrationId}
- User Name: ${userName}
- User Email: ${userEmail}
- Phone Number: ${phoneNumber}

Location Details:
- Country: ${country}
- State: ${state}
- City: ${city}
- Address: ${address}

${receiptUrl ? `Payment Receipt: ${receiptUrl}\n` : ""}

Review Registration: ${adminUrl}

Action Required: Please review this registration and approve or reject it.
    `.trim();

    await sendMail({
      to: adminEmail,
      subject: `New Championship Registration - ${userName}`,
      text,
      html,
    });

    console.log(
      `Championship registration notification sent to admin: ${adminEmail}`
    );
  } catch (error) {
    console.error(
      "Error sending championship registration notification to admin:",
      error
    );
    throw new Error(
      "Failed to send championship registration notification to admin: " + error
    );
  }
};

export const sendChampionshipRegistrationApprovedEmail = async (
  userEmail: string,
  userName: string | null
) => {
  try {
    const greetingName = userName || "there";
    const registrationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/championship/registration`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          Championship Registration Approved! 🎉
        </h2>
        
        <p>Hey ${greetingName},</p>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <h3 style="color: #155724; margin-top: 0;">Congratulations!</h3>
          <p style="color: #155724; margin: 0;">
            Your registration for <strong>Thywill's Champion's League</strong> has been approved!
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">What's Next?</h3>
          <p>You're all set! We'll be in touch with further details about the championship and upcoming events.</p>
          <p>Stay tuned for updates and make sure to check your registration status page for any announcements.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${registrationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #800000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Registration Status
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Questions?</strong> Feel free to contact us at <a href="mailto:support@thywilluche.com" style="color: #0051a5;">support@thywilluche.com</a> if you have any questions.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          Team Thywill
        </p>
      </div>
    `;

    const text = `
Championship Registration Approved!

Hey ${greetingName},

Congratulations! Your registration for Thywill's Champion's League has been approved!

What's Next?
You're all set! We'll be in touch with further details about the championship and upcoming events.

Stay tuned for updates and make sure to check your registration status page for any announcements.

View Registration Status: ${registrationUrl}

Questions? Feel free to contact us at support@thywilluche.com if you have any questions.

Best regards,
Team Thywill
    `.trim();

    await sendMail({
      to: userEmail,
      subject:
        "Championship Registration Approved - Thywill's Champion's League",
      text,
      html,
    });

    console.log(`Championship approval email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending championship approval email:", error);
    throw new Error("Failed to send championship approval email: " + error);
  }
};

export const sendChampionshipRegistrationRejectedEmail = async (
  userEmail: string,
  userName: string | null
) => {
  try {
    const greetingName = userName || "there";
    const registrationUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/championship/registration`;
    const supportEmail = "support@thywilluche.com";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          Championship Registration Update
        </h2>
        
        <p>Hey ${greetingName},</p>
        
        <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #721c24; margin-top: 0;">Registration Status Update</h3>
          <p style="color: #721c24; margin: 0;">
            Unfortunately, your registration for <strong>Thywill's Champion's League</strong> could not be approved at this time.
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">What This Means</h3>
          <p>We appreciate your interest in participating in the championship. However, after reviewing your registration, we were unable to approve it at this time.</p>
          <p>If you believe this is an error or would like more information about the decision, please don't hesitate to reach out to us.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${registrationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #800000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Registration Status
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Need Help?</strong> If you have questions or would like to discuss this decision, please contact us at <a href="mailto:${supportEmail}" style="color: #0051a5;">${supportEmail}</a>. We're here to help!
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          Best regards,<br>
          Team Thywill
        </p>
      </div>
    `;

    const text = `
Championship Registration Update

Hey ${greetingName},

Unfortunately, your registration for Thywill's Champion's League could not be approved at this time.

What This Means
We appreciate your interest in participating in the championship. However, after reviewing your registration, we were unable to approve it at this time.

If you believe this is an error or would like more information about the decision, please don't hesitate to reach out to us.

View Registration Status: ${registrationUrl}

Need Help? If you have questions or would like to discuss this decision, please contact us at ${supportEmail}. We're here to help!

Best regards,
Team Thywill
    `.trim();

    await sendMail({
      to: userEmail,
      subject: "Championship Registration Update - Thywill's Champion's League",
      text,
      html,
    });

    console.log(`Championship rejection email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending championship rejection email:", error);
    throw new Error("Failed to send championship rejection email: " + error);
  }
};

export const sendChampionshipReviewSubmissionNotificationToAdmin = async (
  adminEmail: string,
  userName: string,
  userEmail: string,
  reviewId: string,
  hasTextReview: boolean,
  hasDocument: boolean
) => {
  try {
    const adminUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/admin/championship/reviews/${reviewId}`;

    const submissionTypes = [];
    if (hasTextReview) submissionTypes.push("Text Review");
    if (hasDocument) submissionTypes.push("Document");
    const submissionTypeText = submissionTypes.join(" and ");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
          New Review Submission Received
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #495057; margin-top: 0;">Submission Information</h3>
          <p><strong>Review ID:</strong> ${reviewId}</p>
          <p><strong>User Name:</strong> ${userName}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Submission Type:</strong> ${submissionTypeText}</p>
        </div>

        <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724;">
            <strong>New Review Submitted:</strong> A participant has submitted their review for the championship.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${adminUrl}" style="display: inline-block; padding: 12px 30px; background-color: #800000; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            View Review
          </a>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0051a5;">
            <strong>Action Required:</strong> Please review this submission to evaluate the participant's work.
          </p>
        </div>
      </div>
    `;

    const text = `
New Review Submission Received

Submission Information:
- Review ID: ${reviewId}
- User Name: ${userName}
- User Email: ${userEmail}
- Submission Type: ${submissionTypeText}

New Review Submitted: A participant has submitted their review for the championship.

View Review: ${adminUrl}

Action Required: Please review this submission to evaluate the participant's work.
    `.trim();

    await sendMail({
      to: adminEmail,
      subject: `New Review Submission - ${userName}`,
      text,
      html,
    });

    console.log(
      `Championship review submission notification sent to admin: ${adminEmail}`
    );
  } catch (error) {
    console.error(
      "Error sending championship review submission notification to admin:",
      error
    );
    throw new Error(
      "Failed to send championship review submission notification to admin: " +
        error
    );
  }
};
