import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0Jr9IlurH1-AfStLVaDFMv81IJTh2Btw",
  authDomain: "crmboltapp.firebaseapp.com",
  projectId: "crmboltapp",
  storageBucket: "crmboltapp.firebasestorage.app",
  messagingSenderId: "596047524575",
  appId: "1:596047524575:web:6830f4b95a42c13523ef6a",
  measurementId: "G-FLW4MFYJGG"
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
      createdAt: Timestamp.now()
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 987-6543',
      company: 'Design Co',
      status: 'active',
      lastContact: '2024-03-08',
      createdAt: Timestamp.now()
    },
    {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '(555) 456-7890',
      company: 'Old Corp',
      status: 'inactive',
      lastContact: '2024-01-15',
      createdAt: Timestamp.now()
    },
    {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '(555) 234-5678',
      company: 'Past LLC',
      status: 'inactive',
      lastContact: '2024-02-01',
      createdAt: Timestamp.now()
    }
  ],
  products: [
    {
      name: 'Premium Software License',
      price: 299.99,
      category: 'Software',
      stock: 50,
      description: 'Enterprise-grade software solution',
      createdAt: Timestamp.now()
    },
    {
      name: 'Cloud Storage Plan',
      price: 99.99,
      category: 'Services',
      stock: 100,
      description: '1TB cloud storage subscription',
      createdAt: Timestamp.now()
    }
  ],
  tasks: [
    {
      title: 'Follow up with Tech Corp',
      description: 'Schedule demo for new software',
      status: 'pending',
      dueDate: '2024-03-15',
      assignedTo: 'John Doe',
      priority: 'high',
      createdAt: Timestamp.now()
    },
    {
      title: 'Update product catalog',
      description: 'Add new cloud services',
      status: 'in-progress',
      dueDate: '2024-03-20',
      assignedTo: 'Jane Smith',
      priority: 'medium',
      createdAt: Timestamp.now()
    },
    {
      title: 'Client presentation',
      description: 'Prepare slides for the quarterly review',
      status: 'completed',
      dueDate: '2024-03-12',
      assignedTo: 'Mike Johnson',
      priority: 'high',
      createdAt: Timestamp.now()
    }
  ]
});

const loadInitialData = async () => {
  try {
    console.log('Starting data load...');
    
    const sampleData = createSampleData();

    // Load customers
    console.log('Loading customers...');
    for (const customer of sampleData.customers) {
      await addDoc(collection(db, 'customers'), customer);
    }
    console.log('Customers loaded successfully');

    // Load products
    console.log('Loading products...');
    for (const product of sampleData.products) {
      await addDoc(collection(db, 'products'), product);
    }
    console.log('Products loaded successfully');

    // Load tasks
    console.log('Loading tasks...');
    for (const task of sampleData.tasks) {
      await addDoc(collection(db, 'tasks'), task);
    }
    console.log('Tasks loaded successfully');

    console.log('All data loaded successfully!');
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    process.exit(0);
  }
};

loadInitialData();