import {
  firebaseConfig,
  initializeApp,
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  onValue,
} from "./db-firebase.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function getUserById(userId) {
  const snapshot = await get(ref(db, "users/" + userId));

  if (!snapshot.exists()) {
    return { data: null, error: "User not found" };
  }
  return { data: snapshot.val(), error: null };
}

async function getUsers() {
  const snapshot = await get(ref(db, "users"));

  if (!snapshot.exists()) {
    return { data: null, error: "No users found" };
  }

  return { data: snapshot.val(), error: null };
}

async function createUser(username, password) {
  const newUserRef = push(ref(db, "users"));
  try {
    set(newUserRef, {
      username,
      password,
      score: 0,
    });
    return { success: true, data: newUserRef.key };
  } catch (error) {
    return { success: false, data: null };
  }
}

async function updateUserScore(userId, newScore) {
  try {
    const { data } = await getUserById(userId);

    if (newScore > (data?.score || 0)) {
      await update(ref(db, "users/" + userId), { score: newScore });
      return { success: true, data: "New High Score!" };
    }
    return { success: true, data: "Score not improved" };
  } catch (error) {
    return { success: false, data: "Error updating score" };
  }
}

export { getUserById, getUsers, updateUserScore };
export { createUser };
