import { sendMail } from "@/mailer";

const adminEmail = process.env.NOTIFICATION_EMAIL || "support@thywilluche.com";

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

export async function notifyNewLike({
  postId,
  authorName,
  authorUsername,
  likerName,
  likerUsername,
}: {
  postId: string;
  authorName: string;
  authorUsername: string;
  likerName: string;
  likerUsername: string;
}) {
  const subject = `New Like on Post - ${authorUsername}`;

  const text = `
A new like has been added to a post.

Post ID: ${postId}
Post Author: ${authorName} (@${authorUsername})
Liked by: ${likerName} (@${likerUsername})

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Like on Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Author:</strong> ${authorName} (@${authorUsername})</p>
        <p><strong>Liked by:</strong> ${likerName} (@${likerUsername})</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
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

    console.log(`New like notification sent for post ${postId}`);
  } catch (error) {
    console.error("Failed to send new like notification:", error);
  }
}

export async function notifyNewComment({
  postId,
  commentId,
  postAuthorName,
  postAuthorUsername,
  commentAuthorName,
  commentAuthorUsername,
  commentContent,
}: {
  postId: string;
  commentId: string;
  postAuthorName: string;
  postAuthorUsername: string;
  commentAuthorName: string;
  commentAuthorUsername: string;
  commentContent: string;
}) {
  const subject = `New Comment on Post - ${postAuthorUsername}`;

  const text = `
A new comment has been added to a post.

Post ID: ${postId}
Post Author: ${postAuthorName} (@${postAuthorUsername})
Comment ID: ${commentId}
Comment by: ${commentAuthorName} (@${commentAuthorUsername})
Comment: ${commentContent}

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Comment on Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Author:</strong> ${postAuthorName} (@${postAuthorUsername})</p>
        <p><strong>Comment ID:</strong> ${commentId}</p>
        <p><strong>Comment by:</strong> ${commentAuthorName} (@${commentAuthorUsername})</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Comment:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
          ${commentContent}
        </div>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
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

    console.log(`New comment notification sent for post ${postId}`);
  } catch (error) {
    console.error("Failed to send new comment notification:", error);
  }
}

export async function notifyNewShare({
  postId,
  authorName,
  authorUsername,
  sharerName,
  sharerUsername,
}: {
  postId: string;
  authorName: string;
  authorUsername: string;
  sharerName: string;
  sharerUsername: string;
}) {
  const subject = `New Share on Post - ${authorUsername}`;

  const text = `
A new share has been added to a post.

Post ID: ${postId}
Post Author: ${authorName} (@${authorUsername})
Shared by: ${sharerName} (@${sharerUsername})

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Share on Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Author:</strong> ${authorName} (@${authorUsername})</p>
        <p><strong>Shared by:</strong> ${sharerName} (@${sharerUsername})</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/community/home/posts/${postId}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
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

    console.log(`New share notification sent for post ${postId}`);
  } catch (error) {
    console.error("Failed to send new share notification:", error);
  }
}
