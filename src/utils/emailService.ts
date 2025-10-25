// Email service for sending reports
// This is a client-side implementation for demo purposes
// In production, you would use a backend service

export interface EmailData {
  to: string;
  subject: string;
  content: string;
  fromName: string;
}

export class EmailService {
  // Real email sending via backend API
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      console.log('📧 Email Service - Preparing to send email...');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('From:', emailData.fromName);
      console.log('Content length:', emailData.content.length);
      
      // Send to backend email server
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          content: emailData.content
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Email sent successfully via backend');
        return true;
      } else {
        console.error('❌ Backend email sending failed:', result.error);
        return false;
      }
      
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.log('💡 Make sure the email server is running: node email-server.js');
      return false;
    }
  }
  
  // Method to open user's default email client with pre-filled content
  static openEmailClient(emailData: EmailData): void {
    const subject = encodeURIComponent(emailData.subject);
    const body = encodeURIComponent(emailData.content);
    const mailtoUrl = `mailto:${emailData.to}?subject=${subject}&body=${body}`;
    
    console.log('📧 Opening email client with pre-filled content...');
    console.log('Mailto URL:', mailtoUrl);
    
    // Open the user's default email client
    window.open(mailtoUrl, '_blank');
  }
  
  // Method to copy email content to clipboard
  static async copyToClipboard(content: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        console.log('📋 Content copied to clipboard');
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          console.log('📋 Content copied to clipboard (fallback method)');
          return true;
        } else {
          console.log('❌ Failed to copy to clipboard');
          return false;
        }
      }
    } catch (error) {
      console.error('❌ Clipboard error:', error);
      return false;
    }
  }
}
