import { adminDb, adminAuth } from '@/lib/firebaseAdmin';

export const POST = async (req) => {
    try {
        const { parentUid, childId } = await req.json();

        if (!parentUid || !childId) {
            return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
        }

        const parentDoc = await adminDb.collection("users").doc(parentUid).get();
        const childDoc = await adminDb.collection("users").doc(parentUid).collection("children").doc(childId).get();

        if (!parentDoc.exists) {
            return new Response(JSON.stringify({ error: `Parent profile not found for UID: ${parentUid}` }), { status: 404 });
        }
        if (!childDoc.exists) {
            return new Response(JSON.stringify({ error: `Child profile not found for ID: ${childId} under parent: ${parentUid}` }), { status: 404 });
        }

        // Re-checked on every learning-zone page load (this endpoint is what
        // ChildProvider calls to restore a session), not just at login — a
        // kid already mid-session loses access the moment their parent's
        // verification status is checked again, same policy either way.
        if (adminAuth) {
            try {
                const parentRecord = await adminAuth.getUser(parentUid);
                if (!parentRecord.emailVerified) {
                    return new Response(JSON.stringify({
                        error: "Parent email not verified.",
                        code: "PARENT_EMAIL_NOT_VERIFIED",
                    }), { status: 403 });
                }
            } catch (err) {
                console.error(`Child Profile API: failed to check email verification for parent ${parentUid}`, err);
                // Fail open on a transient Admin Auth error — see child-login route.
            }
        }

        const { password: _password, ...childDataWithoutPassword } = childDoc.data();

        return new Response(JSON.stringify({
            parentData: parentDoc.data(),
            childData: childDataWithoutPassword
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Child Profile API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
