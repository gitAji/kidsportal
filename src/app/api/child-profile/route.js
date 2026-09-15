import { adminDb } from '@/lib/firebaseAdmin';

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
