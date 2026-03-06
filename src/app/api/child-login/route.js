import { getFirestore } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebaseAdmin';

export const POST = async (req) => {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return new Response(JSON.stringify({ error: "Username and password required" }), { status: 400 });
        }

        const usernameDoc = await adminDb.collection("child_usernames").doc(username.toLowerCase()).get();

        if (!usernameDoc.exists) {
            return new Response(JSON.stringify({ error: "Invalid username or password." }), { status: 401 });
        }

        const { parentUid, childId } = usernameDoc.data();
        const childDoc = await adminDb.collection("users").doc(parentUid).collection("children").doc(childId).get();

        if (!childDoc.exists) {
            return new Response(JSON.stringify({ error: `Child profile document missing (ID: ${childId})` }), { status: 404 });
        }

        const childData = childDoc.data();

        // Verify Password
        if (childData.password !== password) {
            return new Response(JSON.stringify({ error: "Invalid username or password." }), { status: 401 });
        }

        if (childData.loginEnabled === false) {
            return new Response(JSON.stringify({ error: "Your account is currently disabled. Please ask your parent to enable it." }), { status: 403 });
        }

        const foundChild = { id: childDoc.id, ...childData, parentUid };

        return new Response(JSON.stringify({ child: foundChild }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Child Login API Error:", error);
        return new Response(JSON.stringify({ error: "An error occurred during login." }), { status: 500 });
    }
};
