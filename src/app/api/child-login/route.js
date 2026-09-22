import { adminDb } from '@/lib/firebaseAdmin';

export const POST = async (req) => {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return new Response(JSON.stringify({ error: "Username and password required" }), { status: 400 });
        }

        if (!adminDb) {
            console.error("Child login failed: adminDb is not initialized — check FIREBASE_ADMIN_* env vars.");
            return new Response(JSON.stringify({ error: "An error occurred during login." }), { status: 500 });
        }

        const usernameKey = username.toLowerCase();
        const usernameDoc = await adminDb.collection("child_usernames").doc(usernameKey).get();

        if (!usernameDoc.exists) {
            // Not a leak to the client (still a generic 401), but this is the exact
            // symptom of a stale/missing child_usernames registry entry — see
            // scripts/migrateUsernames.js to repair it.
            console.warn(`Child login: no child_usernames entry for "${usernameKey}".`);
            return new Response(JSON.stringify({ error: "Invalid username or password." }), { status: 401 });
        }

        const { parentUid, childId } = usernameDoc.data();
        const childDoc = await adminDb.collection("users").doc(parentUid).collection("children").doc(childId).get();

        if (!childDoc.exists) {
            console.error(`Child login: child_usernames/${usernameKey} points at a missing child doc (parent ${parentUid}, child ${childId}).`);
            return new Response(JSON.stringify({ error: `Child profile document missing (ID: ${childId})` }), { status: 404 });
        }

        const childData = childDoc.data();

        // Verify Password
        if (childData.password !== password) {
            console.warn(`Child login: wrong password for "${usernameKey}".`);
            return new Response(JSON.stringify({ error: "Invalid username or password." }), { status: 401 });
        }

        if (childData.loginEnabled === false) {
            return new Response(JSON.stringify({ error: "Your account is currently disabled. Please ask your parent to enable it." }), { status: 403 });
        }

        const { password: _password, ...childDataWithoutPassword } = childData;
        const foundChild = { id: childDoc.id, ...childDataWithoutPassword, parentUid };

        return new Response(JSON.stringify({ child: foundChild }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Child Login API Error:", error);
        return new Response(JSON.stringify({ error: "An error occurred during login." }), { status: 500 });
    }
};
