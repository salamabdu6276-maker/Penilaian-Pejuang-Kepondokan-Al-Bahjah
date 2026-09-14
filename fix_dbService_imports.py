import re

with open('src/services/dbService.ts', 'r') as f:
    content = f.read()

content = content.replace(
"""import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";""",
"""import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";"""
)

with open('src/services/dbService.ts', 'w') as f:
    f.write(content)
