require('dotenv').config()
const admin = require('firebase-admin')
const { Storage } = require('@google-cloud/storage')
const fs = require('fs')
const path = require('path')

const serviceAccount = require('../config/serviceAccountKey.json')
const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: serviceAccount,
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET_URL)

async function uploadImageAndGetURL(imagePath, destination) {
    await bucket.upload(imagePath, { destination: destination })
    return `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
    }/o/${encodeURIComponent(destination)}?alt=media`
}

async function addData() {
    // Departments
    const departments = [
        {
            name: 'Electronics',
            description: 'Electronic devices and accessories',
        },
        { name: 'PC Hardware', description: 'All components for your PC' },
        {
            name: 'Peripherals',
            description: 'External devices and peripherals',
        },
    ]

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
        { name: 'Headphones', departmentName: 'Electronics' },
    ]

    // Products
    const products = [
        {
            name: 'RTX 3080',
            category: 'Graphics Cards',
            price: 699.99,
            description:
                'The GeForce RTX™ 3080 delivers the ultra performance that gamers crave, powered by Ampere—NVIDIA’s 2nd gen RTX architecture. It’s built with enhanced RT Cores and Tensor Cores, new streaming multiprocessors, and superfast G6X memory for an amazing gaming experience.',
            stock: 20,
            stripePriceId: 'price_1OVLJVBDqOJUyBhUjscf36J3',
        },
        {
            name: 'Ryzen 7 5800X',
            category: 'Processors',
            price: 449.99,
            description:
                'CPU Manufacturer 	AMD\nCPU Model 	AMD Ryzen 7\nCPU Speed 	4.7 GHz\nCPU Socket 	Socket AM4',
            stock: 15,
            stripePriceId: 'price_1OVLLdBDqOJUyBhU2RdF9ZIU',
        },
        // ... Add more products as needed ...
    ]

    // Adding Departments
    for (const dept of departments) {
        await db.collection('departments').add(dept)
    }

    // Adding Categories
    for (const cat of categories) {
        const deptRef = await db
            .collection('departments')
            .where('name', '==', cat.departmentName)
            .get()
        if (!deptRef.empty) {
            await db.collection('categories').add({
                name: cat.name,
                departmentId: deptRef.docs[0].id,
                description: cat.name + ' description',
            })
        }
    }

    // Adding Products
    for (const prod of products) {
        const catRef = await db
            .collection('categories')
            .where('name', '==', prod.category)
            .get()
        if (!catRef.empty) {
            const imageName = prod.name.replace(/\s/g, '_') + '.jpg' // Assuming image name matches product name
            const imagePath = path.join(__dirname, '../src/assets', imageName)

            if (fs.existsSync(imagePath)) {
                const imageUrl = await uploadImageAndGetURL(
                    imagePath,
                    `products/${imageName}`
                )
                await db.collection('products').add({
                    name: prod.name,
                    categoryId: catRef.docs[0].id,
                    price: prod.price,
                    stock: prod.stock,
                    description: prod.description,
                    image: imageUrl,
                    stripePriceId: prod.stripePriceId,
                })
            } else {
                console.log(`Image not found for ${prod.name}`)
            }
        }
    }

    console.log('Data added successfully')
}

addData().catch(console.error)
