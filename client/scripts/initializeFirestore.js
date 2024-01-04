const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addData() {
  // Departments
  const departments = [
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'PC Hardware', description: 'All components for your PC' },
    { name: 'Peripherals', description: 'External devices and peripherals' }
  ];

  // Categories
  const categories = [
    { name: 'Graphics Cards', departmentName: 'PC Hardware' },
    { name: 'Processors', departmentName: 'PC Hardware' },
    { name: 'Memory', departmentName: 'PC Hardware' },
    { name: 'Monitors', departmentName: 'Peripherals' },
    { name: 'Keyboards', departmentName: 'Peripherals' },
    { name: 'Mice', departmentName: 'Peripherals' },
    { name: 'Smartphones', departmentName: 'Electronics' },
    { name: 'Tablets', departmentName: 'Electronics' },
    { name: 'Headphones', departmentName: 'Electronics' }
  ];

  // Products
  const products = [
    { name: 'RTX 3080', category: 'Graphics Cards', price: 699.99, stock: 20 },
    { name: 'Ryzen 7 5800X', category: 'Processors', price: 449.99, stock: 15 },
    // ... Add more products as needed ...
  ];

  // Adding Departments
  for (const dept of departments) {
    await db.collection('departments').add(dept);
  }

  // Adding Categories
  for (const cat of categories) {
    const deptRef = await db.collection('departments').where('name', '==', cat.departmentName).get();
    if (!deptRef.empty) {
      await db.collection('categories').add({
        name: cat.name,
        departmentId: deptRef.docs[0].id,
        description: cat.name + ' description'
      });
    }
  }

  // Adding Products
  for (const prod of products) {
    const catRef = await db.collection('categories').where('name', '==', prod.category).get();
    if (!catRef.empty) {
      await db.collection('products').add({
        name: prod.name,
        categoryId: catRef.docs[0].id,
        price: prod.price,
        stock: prod.stock,
        // Add more product fields as needed
      });
    }
  }

  console.log('Data added successfully');
}

addData().catch(console.error);
