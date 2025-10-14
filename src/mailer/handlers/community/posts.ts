import { sendMail } from "@/mailer";

const adminEmail = "support@thywilluche.com";

export async function notifyNewPost({
  postId,
  content,
  excerpt,
  authorName,
  authorUsername,
  groupName,
}: {
  postId: string;
  content: string;
  excerpt: string;
  authorName: string;
  authorUsername: string;
  groupName?: string;
}) {
  const subject = `New Post Pending Approval - ${authorUsername}`;

  const text = `
A new post has been submitted and is pending approval.

Post ID: ${postId}
Author: ${authorName} (@${authorUsername})
Group: ${groupName || "General Forum"}
Content: ${excerpt}
Full Content: ${content}

Please review and approve at: ${
    process.env.NEXT_PUBLIC_APP_URL
  }/admin/community/posts?status=pending
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Post Pending Approval</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Author:</strong> ${authorName} (@${authorUsername})</p>
        <p><strong>Group:</strong> ${groupName || "General Forum"}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Content Preview:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
          ${excerpt}
        </div>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL
        }/admin/community/posts?status=pending" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Review & Approve Post
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your community platform.
      </p>
    </div>
  `;

  try {
    await sendMail({
      to: adminEmail,
      subject,
      text,
      html,
    });

    console.log(`New post notification sent for post ${postId}`);
  } catch (error) {
    console.error("Failed to send new post notification:", error);
  }
}
