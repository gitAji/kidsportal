/**
 * Firestore service for Learning Zone
 *
 * Collections:
 *   levels/{gradeId}_{subjectId}_{levelId}  → level doc with embedded tasks[]
 *   achievements/{childId}_{achievementId}  → achievement records
 *   childStats/{childId}                    → aggregate stats doc
 */
import {
    collection, doc, getDoc, getDocs, setDoc, addDoc,
    updateDoc, deleteDoc, query, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase/config';

// ── LEVELS ──────────────────────────────────────────────────────────────────

/** Fetch a single level document */
export async function getLevel(gradeId, subjectId, levelId) {
    const id = `${gradeId}_${subjectId}_${levelId}`;
    const snap = await getDoc(doc(db, 'levels', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Fetch all levels for a subject/grade */
export async function getLevelsForSubject(gradeId, subjectId) {
    const q = query(
        collection(db, 'levels'),
        where('gradeId', '==', gradeId),
        where('subjectId', '==', subjectId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Create or overwrite a level document */
export async function saveLevel(gradeId, subjectId, levelId, levelData) {
    const id = `${gradeId}_${subjectId}_${levelId}`;
    await setDoc(doc(db, 'levels', id), {
        gradeId, subjectId, levelId,
        ...levelData,
        updatedAt: serverTimestamp(),
    }, { merge: true });
    return id;
}

/** Delete a level */
export async function deleteLevel(gradeId, subjectId, levelId) {
    const id = `${gradeId}_${subjectId}_${levelId}`;
    await deleteDoc(doc(db, 'levels', id));
}

// ── CHILD STATS & ACHIEVEMENTS ────────────────────────────────────────────

/** Save a child's stats object to Firestore */
export async function saveChildStats(childId, stats) {
    await setDoc(doc(db, 'childStats', childId), {
        ...stats,
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

/** Get a child's stats from Firestore */
export async function getChildStats(childId) {
    const snap = await getDoc(doc(db, 'childStats', childId));
    return snap.exists() ? snap.data() : {};
}

/** Record a newly unlocked achievement for a child */
export async function recordAchievement(childId, achievement) {
    const id = `${childId}_${achievement.id}`;
    await setDoc(doc(db, 'achievements', id), {
        childId,
        achievementId: achievement.id,
        name: achievement.name,
        emoji: achievement.emoji,
        unlockedAt: serverTimestamp(),
    });
}

/** Get all achievements for a child */
export async function getChildAchievements(childId) {
    const q = query(collection(db, 'achievements'), where('childId', '==', childId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
}
