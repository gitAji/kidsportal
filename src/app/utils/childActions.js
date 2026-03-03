import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "@/firebase/config"; 
export const updateChildData = async (parentUid, childId, newData) => { 
try { 
const childRef = doc(db, "users", parentUid, "children", childId); 
await updateDoc(childRef, newData);
return { success: true };
} catch (error) {
console.error("Error updating child data:", error);
return { error: error.message };
}
};
