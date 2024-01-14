# Scripts Folder

This folder contains scripts that are used for various tasks in this project.

## initializeFirebase.js

Initializes the Firestore database with mock data.
To run this script, navigate to the scripts folder and use the following command:

```bash
node ./initializeFirebase.js
```

## addAdminUser.js

Initializes the Firebase Admin SDK with service account credentials and assigns custom claims to a specific user to grant them admin privileges.
To use this script, replace '<admin@user.email>' with the email address of the user you want to grant admin privileges to within your Firebase project, then run the script with

```bash
node ./addAdminUser.js
```

to apply changes
