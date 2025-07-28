import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './firebase';

// Collection names
const COLLECTIONS = {
  ENTRIES: 'internship_entries',
  SPRINT_GOALS: 'sprint_goals',
  IMAGES: 'images'
};

// Entries CRUD operations
export const firebaseService = {
  // Get all entries
  async getEntries() {
    try {
      const q = query(
        collection(db, COLLECTIONS.ENTRIES), 
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, entries };
    } catch (error) {
      console.error('Error getting entries:', error);
      return { success: false, error: error.message };
    }
  },

  // Add new entry
  async addEntry(entry) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.ENTRIES), {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id, entry };
    } catch (error) {
      console.error('Error adding entry:', error);
      return { success: false, error: error.message };
    }
  },

  // Update entry
  async updateEntry(entryId, entry) {
    try {
      const docRef = doc(db, COLLECTIONS.ENTRIES, entryId);
      await updateDoc(docRef, {
        ...entry,
        updatedAt: serverTimestamp()
      });
      return { success: true, entry };
    } catch (error) {
      console.error('Error updating entry:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete entry
  async deleteEntry(entryId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ENTRIES, entryId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting entry:', error);
      return { success: false, error: error.message };
    }
  },

  // Get sprint goals
  async getSprintGoals() {
    try {
      const q = query(
        collection(db, COLLECTIONS.SPRINT_GOALS), 
        orderBy('startDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const sprintGoals = [];
      querySnapshot.forEach((doc) => {
        sprintGoals.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, sprintGoals };
    } catch (error) {
      console.error('Error getting sprint goals:', error);
      return { success: false, error: error.message };
    }
  },

  // Update sprint goals
  async updateSprintGoals(sprintGoals) {
    try {
      // Delete existing sprint goals
      const existingQuery = query(collection(db, COLLECTIONS.SPRINT_GOALS));
      const existingSnapshot = await getDocs(existingQuery);
      const deletePromises = existingSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Add new sprint goals
      const addPromises = sprintGoals.map(sprint => 
        addDoc(collection(db, COLLECTIONS.SPRINT_GOALS), {
          ...sprint,
          createdAt: serverTimestamp()
        })
      );
      await Promise.all(addPromises);

      return { success: true };
    } catch (error) {
      console.error('Error updating sprint goals:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload image
  async uploadImage(file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `images/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { success: true, imageUrl: downloadURL, fileName };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }
  }
}; 