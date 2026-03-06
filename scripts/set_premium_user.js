const admin = require('firebase-admin');

const serviceAccount = {
    projectId: "kidsportal-afc7a",
    clientEmail: "firebase-adminsdk-fbsvc@kidsportal-afc7a.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUpr8SqzwT7GoG\nC7C4Ym3srdvTwtsKtRL+Z1kXhbW5yvDZAx+OB7rvmK3s/kNrCpbmgUbnh86eV0SW\naTw8sL9eSoyyS5qnAKGQKH/UuS+ACrJD37F56xa0l9wQQQSM3Wb0U9DtoXbBI0WN\nzu1/ts1rMe0x6NWJCn0SMfHOXzpes7NOIIEuQe8nByz+6mRAevWdhb4jkxaQUom1\n0/fyi+uMm6v5lOyLgoQTVoE4xhnxwu9SlAqK5sKYWMaAw2TMGL3XLInlnuihvtxB\n0RpW0ttOrn2LuGX7MvfD7Y7w3c7+xFaWWk0nPlxRBmshY2NYULekvcp5ornCu0Zu\nHdVvN8XbAgMBAAECggEACwzwkvoeW3QGp8fFvYndPSu6Z7e8MENBTcJ1yRjOsm1P\nCh1Kb362rSrEUbN+MhAmeqtZ0ZWncWexjcDBkO8nvVunEhYxtDSpMKzvb6Yr8hMc\nORYPyqPNK0H/p+yTsvTycQdGAoNIgOLiA2uEa1rxiSeFXvmYLHtEt+8BKitIBOcT\nXx5G9IudqmLaFmwCljldsG9vCebq+2X5xY/GCN/FIRXNK0xV200zy1iGHWEw3/fd\n6R64BbDiixlsD+bVSLGpdKlouFmG82HJMAnFZaqkdb772KZODlZaRUwdYpijV42x\niMzeFfhed+Wusblg0qfJMHYpS6eXvtMoTrDK7ovDyQKBgQD/fKyOrwqJ2UHfgQD1\nhi5wi9TF55wK4Voi0VBqoC6f9uMFDv1iGHEgKrLbn78y5sH2y4B+qjlqwIR67lvx\n9t/vLlJk342Y5IWkSTXEwUtjHJmvXKU/J0Q9E7mErDMyafSEezfoOXWq8k5eK6fG\nuXBfEbquFWqKDQrhCWmKs4/JLwKBgQDVFA3JixM/q0q97IC/KnRQ0Q/Y436b28yX\nPGU21DIZFRABD7ZmBRdr74fmZopnXokpKbHEH4zgrTYNe6+YwOfDld6gRMPQnETt\ XeMpuk8O7hhk3/X1Sx6dv+J0p2LuJm+sVYkO8qkqBWHJmmWz66DKNgB/jZIbu8j3\nYfcyDVzLFQKBgQDTbH74DM6xyMKEjSMYC5R+upi3tbUiI98NlR3xPuGWqx6vXvo8\npXFoZy1gJlB5dRDqhPmu2HtvZiW7/WjFUcF7E2BH7eAluGcHzzXZvwP93vsnbYmq\nO3py+NG7gy1S+O/KepWHbZV8g8xqjcHn6Cmf4vITgdGKsMRh+gIHMBU7LQKBgD5W\nKJZu5om47hvUJfJHVFIUZ4N3QqIMUrVoCOBagfGOlOkKlL0R/kEoiWShWRpWsN/m\n/8e1xzwv0GFvbvbMcMFqhf/zPio4nX2n+v5JMDnY9DAGyWkiuelCqtif47RycDdF\nqtxBp7XQb0RQtDJH2/lshQbL/xO4A1pEQdJV0HDlAoGBAIUstdrWts4EZBN0Tytu\njQfNChdRTBiYNmU4XnOqgwD7PVR000Sn6As1gp6FMfi4ZN4v0kgI9nWRaQl/6Fjn\nJ+GdZ812CBJtBTCdtsw4crNtqliJAUpRpWg4bR4C3IJzocLHUKzxnq0KKxWsiLzs\nOD0gfnw2b9aVO3A/BV5AK12a\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n')
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function setPremium() {
    const email = "kontaktaone@gmail.com";
    console.log(`Searching for user with email: ${email}`);

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
        console.log('No matching user found.');
        return;
    }

    snapshot.forEach(async doc => {
        console.log(`Found user: ${doc.id}`);
        await usersRef.doc(doc.id).update({
            plan: "premium",
            isPremium: true,
            status: "active"
        });
        console.log(`Updated user ${doc.id} to premium.`);
    });
}

setPremium().catch(console.error);
