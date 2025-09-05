# EmailJS Setup Guide for Handy Elite

This guide will help you set up EmailJS to enable real email functionality for the contact form on your Handy Elite website.

## 🚀 What is EmailJS?

EmailJS allows you to send emails directly from your website without a backend server. It integrates with popular email services like Gmail, Outlook, and others.

## 📋 Prerequisites

- A Gmail, Outlook, or other email service account
- Access to the EmailJS dashboard

## 🔧 Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Add Email Service

1. **Login to EmailJS Dashboard**
   - Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)

2. **Add Email Service**
   - Click "Email Services" in the left sidebar
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the authentication steps
   - **Note down your Service ID** (you'll need this later)

### 3. Create Email Template

1. **Go to Email Templates**
   - Click "Email Templates" in the left sidebar
   - Click "Create New Template"

2. **Template Configuration**
   - **Template Name**: `Handy Elite Contact Form`
   - **Subject**: `New Service Inquiry from {{from_name}}`
   - **Content**: Use the template below

3. **Email Template Content**
```html
<!DOCTYPE html>
<html>
<head>
    <title>New Service Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366f1;">New Service Inquiry - Handy Elite</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> {{from_name}}</p>
            <p><strong>Email:</strong> {{from_email}}</p>
            <p><strong>Phone:</strong> {{from_phone}}</p>
            <p><strong>Service Requested:</strong> {{service_type}}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Service Description</h3>
            <p>{{message}}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #64748b; font-size: 14px;">
                This inquiry was submitted through the Handy Elite website contact form.
            </p>
        </div>
    </div>
</body>
</html>
```

4. **Save Template**
   - Click "Save" to create the template
   - **Note down your Template ID** (you'll need this later)

### 4. Get Your Public Key

1. **Go to Account Settings**
   - Click your profile icon in the top right
   - Select "Account" or "API Keys"

2. **Copy Public Key**
   - Find your "Public Key"
   - Copy it (you'll need this for the website)

### 5. Update Website Code

Now you need to replace the placeholder values in your code with your actual EmailJS credentials:

#### Update `script.js`:

```javascript
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
emailjs.init('YOUR_PUBLIC_KEY');

// In the handleContactSubmission function, replace:
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
```

**Example with real values:**
```javascript
emailjs.init('user_a1b2c3d4e5f6g7h8i9j0');

emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

## 🔑 Required Values Summary

You need to replace these placeholders in your code:

| Placeholder | What to Replace | Example |
|-------------|-----------------|---------|
| `YOUR_PUBLIC_KEY` | Your EmailJS public key | `user_a1b2c3d4e5f6g7h8i9j0` |
| `YOUR_SERVICE_ID` | Your email service ID | `service_abc123` |
| `YOUR_TEMPLATE_ID` | Your email template ID | `template_xyz789` |

## 📧 How It Works

1. **User fills out contact form** on your website
2. **Form data is collected** and formatted for EmailJS
3. **EmailJS sends email** using your configured email service
4. **You receive email** with all the inquiry details
5. **User gets confirmation** that their message was sent

## 🧪 Testing

1. **Fill out the contact form** on your website
2. **Click "Send Message"**
3. **Check your email** for the inquiry
4. **Check browser console** for success/error messages

## ⚠️ Important Notes

- **Free Plan Limits**: EmailJS free plan allows 200 emails/month
- **Rate Limiting**: Don't spam the form - there are rate limits
- **Email Delivery**: Emails may go to spam folder initially
- **Template Variables**: Make sure template variables match your code

## 🆘 Troubleshooting

### Common Issues:

1. **"EmailJS is not defined"**
   - Check if EmailJS CDN is loaded properly
   - Verify the script tag is in your HTML

2. **"Service ID not found"**
   - Verify your Service ID is correct
   - Make sure the email service is active

3. **"Template ID not found"**
   - Verify your Template ID is correct
   - Make sure the template is published

4. **Emails not received**
   - Check spam folder
   - Verify email service configuration
   - Check EmailJS dashboard for errors

### Debug Steps:

1. **Check Browser Console** for error messages
2. **Verify EmailJS Dashboard** for service status
3. **Test with simple template** first
4. **Check email service** authentication

## 🚀 Next Steps

Once EmailJS is working:

1. **Customize email template** with your branding
2. **Add email notifications** for different services
3. **Set up auto-replies** to customers
4. **Monitor email delivery** in EmailJS dashboard

## 📞 Support

- **EmailJS Support**: [support@emailjs.com](mailto:support@emailjs.com)
- **Documentation**: [EmailJS Docs](https://www.emailjs.com/docs/)
- **Community**: [EmailJS Community](https://community.emailjs.com/)

---

**Your Handy Elite website will now send real emails when customers submit inquiries!** 🎉
