import { sendMail } from "@/mailer";

const adminEmail = process.env.NOTIFICATION_EMAIL || "support@thywilluche.com";

export async function notifyNewLike({
  postId,
  postSlug,
  postTitle,
  likerName,
  likerUsername,
}: {
  postId: string;
  postSlug: string;
  postTitle: string;
  likerName: string;
  likerUsername: string;
}) {
  const subject = `New Like on Blog Post - ${postTitle}`;

  const text = `
A new like has been added to a blog post.

Post ID: ${postId}
Post Title: ${postTitle}
Liked by: ${likerName} (@${likerUsername})

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Like on Blog Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Title:</strong> ${postTitle}</p>
        <p><strong>Liked by:</strong> ${likerName} (@${likerUsername})</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your blog platform.
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

    console.log(`New like notification sent for blog post ${postId}`);
  } catch (error) {
    console.error("Failed to send new like notification:", error);
  }
}

export async function notifyNewComment({
  postId,
  postSlug,
  postTitle,
  commentAuthorName,
  commentAuthorUsername,
  commentContent,
}: {
  postId: string;
  postSlug: string;
  postTitle: string;
  commentAuthorName: string;
  commentAuthorUsername: string;
  commentContent: string;
}) {
  const subject = `New Comment on Blog Post - ${postTitle}`;

  const text = `
A new comment has been added to a blog post.

Post ID: ${postId}
Post Title: ${postTitle}
Comment by: ${commentAuthorName} (@${commentAuthorUsername})
Comment: ${commentContent}

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Comment on Blog Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Title:</strong> ${postTitle}</p>
        <p><strong>Comment by:</strong> ${commentAuthorName} (@${commentAuthorUsername})</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3>Comment:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
          ${commentContent}
        </div>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your blog platform.
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

    console.log(`New comment notification sent for blog post ${postId}`);
  } catch (error) {
    console.error("Failed to send new comment notification:", error);
  }
}

export async function notifyNewShare({
  postId,
  postSlug,
  postTitle,
}: {
  postId: string;
  postSlug: string;
  postTitle: string;
}) {
  const subject = `New Share on Blog Post - ${postTitle}`;

  const text = `
A new share has been added to a blog post.

Post ID: ${postId}
Post Title: ${postTitle}

View the post at: ${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Share on Blog Post</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Post ID:</strong> ${postId}</p>
        <p><strong>Post Title:</strong> ${postTitle}</p>
      </div>
      
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog/${postSlug}" 
           style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Post
        </a>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your blog platform.
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

    console.log(`New share notification sent for blog post ${postId}`);
  } catch (error) {
    console.error("Failed to send new share notification:", error);
  }
}
