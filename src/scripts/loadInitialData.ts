import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { DEFAULT_USER_ID } from '../lib/firebase';

const firebaseConfig = {
  apiKey: "AIzaSyC0Jr9IlurH1-AfStLVaDFMv81IJTh2Btw",
  authDomain: "crmboltapp.firebaseapp.com",
  projectId: "crmboltapp",
  storageBucket: "crmboltapp.appspot.com",
  messagingSenderId: "596047524575",
  appId: "1:596047524575:web:6830f4b95a42c13523ef6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createSampleData = () => ({
  customers: [
    {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      company: 'Tech Corp',
      status: 'active',
      lastContact: '2024-03-10',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      company: 'Design Co',
      status: 'active',
      lastContact: '2024-03-08',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    }
  ],
  products: [
    {
      name: 'Premium Software License',
      price: 299.99,
      category: 'Software',
      stock: 50,
      description: 'Enterprise-grade software solution',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      name: 'Cloud Storage Plan',
      price: 99.99,
      category: 'Services',
      stock: 100,
      description: '1TB cloud storage subscription',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    }
  ],
  tasks: [
    {
      title: 'Follow up with Tech Corp',
      description: 'Schedule demo for new software package and discuss implementation timeline',
      status: 'pending',
      dueDate: '2024-03-15',
      assignedTo: 'John Doe',
      priority: 'high',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      title: 'Update product catalog',
      description: 'Add new cloud services and update pricing for Q2',
      status: 'in-progress',
      dueDate: '2024-03-20',
      assignedTo: 'Jane Smith',
      priority: 'medium',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      title: 'Client presentation',
      description: 'Prepare slides for the quarterly review meeting with Design Co',
      status: 'completed',
      dueDate: '2024-03-12',
      assignedTo: 'Mike Johnson',
      priority: 'high',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      title: 'Security audit',
      description: 'Conduct monthly security review of cloud infrastructure',
      status: 'pending',
      dueDate: '2024-03-25',
      assignedTo: 'Sarah Wilson',
      priority: 'high',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    },
    {
      title: 'Team training',
      description: 'Organize training session for new project management tools',
      status: 'in-progress',
      dueDate: '2024-03-18',
      assignedTo: 'David Brown',
      priority: 'medium',
      createdAt: Timestamp.now(),
      userId: DEFAULT_USER_ID
    }
  ]
});

const checkIfDataExists = async (collectionName: string): Promise<boolean> => {
  const q = query(
    collection(db, collectionName),
    where('userId', '==', DEFAULT_USER_ID)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const loadCollectionData = async (collectionName: string, data: any[]) => {
  console.log(`Loading ${collectionName}...`);
  const dataExists = await checkIfDataExists(collectionName);
  
  if (dataExists) {
    console.log(`${collectionName} collection already has data, skipping...`);
    return;
  }

  const collectionRef = collection(db, collectionName);
  
  for (const item of data) {
    try {
      await addDoc(collectionRef, item);
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }
  
  console.log(`${collectionName} loaded successfully`);
};

const loadInitialData = async () => {
  try {
    console.log('Starting data load...');
    
    const sampleData = createSampleData();
    
    // Load all collections
    await Promise.all([
      loadCollectionData('customers', sampleData.customers),
      loadCollectionData('products', sampleData.products),
      loadCollectionData('tasks', sampleData.tasks)
    ]);

    console.log('All data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
};

loadInitialData();