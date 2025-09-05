# Firebase Authentication & Firestore Setup Guide

## Overview
Your HandyElite website now has a complete Firebase Authentication and Firestore integration system. This guide will help you set up your Firebase project and configure the authentication system.

## Features Implemented

### ✅ Authentication Features
- **User Sign Up**: Email and password registration with user data storage
- **User Login**: Email and password authentication
- **User Logout**: Secure logout functionality
- **Password Change**: Users can change their passwords
- **Profile Management**: Users can update their profile information

### ✅ Data Management Features
- **User Data Storage**: Store user information in Firestore
- **Booking Management**: Store and retrieve user bookings
- **Real-time Updates**: Authentication state management
- **User Dashboard**: Complete dashboard with profile, bookings, and settings

### ✅ UI/UX Features
- **Responsive Design**: Mobile-friendly authentication forms
- **Loading States**: Visual feedback during operations
- **Error Handling**: Comprehensive error messages
- **Modal System**: Clean modal-based authentication flow

## Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `handyelite-services`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 3: Set up Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### Step 4: Get Firebase Configuration
1. In Firebase Console, go to "Project Settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</> icon)
4. Register your app with a nickname: `handyelite-web`
5. Copy the Firebase configuration object

### Step 5: Update Configuration in Your Code
Replace the placeholder configuration in `index.html` (lines 20-27) with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-actual-sender-id",
    appId: "your-actual-app-id"
};
```

## Firestore Security Rules

### Step 6: Configure Firestore Security Rules
1. In Firebase Console, go to "Firestore Database"
2. Click on "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

4. Click "Publish"

## Testing the Integration

### Step 7: Test Authentication Flow
1. Open your website in a browser
2. Click "Sign Up" in the navigation
3. Fill out the registration form
4. Check Firebase Console > Authentication to see the new user
5. Check Firestore Database to see user data stored
6. Test login/logout functionality
7. Test booking a service (requires login)

### Step 8: Test User Dashboard
1. After logging in, click on your username in the navigation
2. Select "Dashboard" from the dropdown
3. Verify profile information is displayed
4. Test the "Bookings" tab
5. Test the "Settings" tab for profile updates

## Data Structure

### Users Collection
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  createdAt: timestamp,
  updatedAt: timestamp,
  totalBookings: 0,
  averageRating: 5.0
}
```

### Bookings Collection
```javascript
{
  userId: "user-uid",
  service: "Electrician",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  preferredDate: "2024-01-15",
  preferredTime: "morning",
  serviceDescription: "Fix electrical outlet",
  paymentMethod: "cash",
  status: "pending",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Customization Options

### Adding New User Fields
To add new fields to user profiles:

1. Update the signup form in `index.html`
2. Update the `storeUserData` function in `script.js`
3. Update the `updateUserDashboard` function to display new fields
4. Update the settings form to allow editing new fields

### Adding New Booking Fields
To add new fields to bookings:

1. Update the booking form in `index.html`
2. Update the `storeBookingData` function in `script.js`
3. Update the `displayUserBookings` function to show new fields

### Styling Customization
All authentication and dashboard styles are in `styles.css`:
- `.auth-form` - Authentication form styles
- `.user-dropdown` - User menu styles
- `.dashboard-content` - Dashboard styles
- `.tab-btn` - Tab button styles

## Security Considerations

### Production Deployment
Before going live:

1. **Update Firestore Rules**: Implement more restrictive rules for production
2. **Enable App Check**: Add App Check for additional security
3. **Configure CORS**: Set up proper CORS policies
4. **Monitor Usage**: Set up Firebase monitoring and alerts

### Recommended Production Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true;
    }
    
    // Bookings with additional validation
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId
        && request.auth.token.email_verified == true;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId
        && request.auth.token.email_verified == true
        && request.resource.data.keys().hasAll(['service', 'firstName', 'lastName', 'email']);
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Firebase not initializing**: Check browser console for configuration errors
2. **Authentication not working**: Verify Firebase project settings and API keys
3. **Firestore permission denied**: Check security rules and user authentication status
4. **Forms not submitting**: Check browser console for JavaScript errors

### Debug Mode
Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('firebase:debug', '*');
```

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Firebase project configuration
3. Ensure all required Firebase services are enabled
4. Check Firestore security rules

## Next Steps

Consider implementing:
- Email verification for new users
- Password reset functionality
- Social authentication (Google, Facebook)
- Admin dashboard for managing bookings
- Real-time notifications
- Payment integration
- Service provider management

Your Firebase Authentication and Firestore integration is now complete and ready for use!
