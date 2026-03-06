import { adminDb } from '@/lib/firebaseAdmin';

export const POST = async (req) => {
    try {
        const { parentUid, childId } = await req.json();

        if (!parentUid || !childId) {
            return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
        }

        const parentDoc = await adminDb.collection("users").doc(parentUid).get();
        const childDoc = await adminDb.collection("users").doc(parentUid).collection("children").doc(childId).get();

        if (!parentDoc.exists || !childDoc.exists) {
            return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({
            parentData: parentDoc.data(),
            childData: childDoc.data()
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Child Profile API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
