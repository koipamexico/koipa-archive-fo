import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDgKU8yJJOp8EmNe_evowm8Al3_GSCDzJw',
  authDomain: 'koipa-archive.firebaseapp.com',
  projectId: 'koipa-archive',
  storageBucket: 'koipa-archive.firebasestorage.app',
  messagingSenderId: '813001393430',
  appId: '1:813001393430:web:3e95e809e18f0643697c37',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
