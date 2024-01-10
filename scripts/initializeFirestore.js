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
    ]

    // Categories
    const categories = [
        { name: 'Graphics Cards', departmentName: 'PC Hardware' },
        { name: 'Processors', departmentName: 'PC Hardware' },
        { name: 'Smartphones', departmentName: 'Electronics' },
        { name: 'Headphones', departmentName: 'Electronics' },
    ]
    const graphicsCardsProducts = [
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
            name: 'GTX 1660 Ti',
            category: 'Graphics Cards',
            price: 299.99,
            description:
                'The GeForce GTX 1660 Ti is a powerful graphics card that offers great performance for gaming and content creation.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'RX 6900 XT',
            category: 'Graphics Cards',
            price: 999.99,
            description:
                'The AMD Radeon RX 6900 XT is a high-end graphics card designed for gamers and enthusiasts.',
            stock: 10,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'GTX 3060',
            category: 'Graphics Cards',
            price: 399.99,
            description:
                'The GeForce GTX 3060 is a mid-range graphics card that offers excellent performance for budget-conscious gamers.',
            stock: 30,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'RTX 3070 Ti',
            category: 'Graphics Cards',
            price: 699.99,
            description:
                'The GeForce RTX 3070 Ti is a high-performance graphics card with ray tracing capabilities for realistic gaming experiences.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'RX 6700 XT',
            category: 'Graphics Cards',
            price: 499.99,
            description:
                'The AMD Radeon RX 6700 XT is a gaming-oriented graphics card with excellent performance at 1080p and 1440p resolutions.',
            stock: 15,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'GTX 1650 Super',
            category: 'Graphics Cards',
            price: 249.99,
            description:
                'The GeForce GTX 1650 Super is an entry-level graphics card that offers good performance for budget gaming PCs.',
            stock: 40,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'RX 6800',
            category: 'Graphics Cards',
            price: 799.99,
            description:
                'The AMD Radeon RX 6800 is a high-end graphics card designed for 4K gaming and content creation.',
            stock: 10,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'GTX 3080 Ti',
            category: 'Graphics Cards',
            price: 1099.99,
            description:
                'The GeForce GTX 3080 Ti is a flagship graphics card with incredible gaming and ray tracing performance.',
            stock: 5,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
    ]
    // Additional Products for Processors
    const processorsProducts = [
        {
            name: 'Ryzen 7 5800X',
            category: 'Processors',
            price: 449.99,
            description:
                'CPU Manufacturer 	AMD\nCPU Model 	AMD Ryzen 7\nCPU Speed 	4.7 GHz\nCPU Socket 	Socket AM4',
            stock: 15,
            stripePriceId: 'price_1OVLLdBDqOJUyBhU2RdF9ZIU',
        },
        {
            name: 'Intel Core i9-10900K',
            category: 'Processors',
            price: 599.99,
            description:
                'The Intel Core i9-10900K is a high-performance CPU for gaming and multitasking.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'AMD Ryzen 9 5950X',
            category: 'Processors',
            price: 749.99,
            description:
                'The AMD Ryzen 9 5950X is a top-of-the-line CPU with excellent performance and multitasking capabilities.',
            stock: 15,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Intel Core i5-11600K',
            category: 'Processors',
            price: 299.99,
            description:
                'The Intel Core i5-11600K is a mid-range CPU with strong gaming performance and overclocking potential.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'AMD Ryzen 7 5800X',
            category: 'Processors',
            price: 449.99,
            description:
                'The AMD Ryzen 7 5800X is a high-performance CPU designed for gaming and content creation.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Intel Core i3-10100',
            category: 'Processors',
            price: 149.99,
            description:
                'The Intel Core i3-10100 is an entry-level CPU suitable for budget gaming and office tasks.',
            stock: 30,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'AMD Ryzen 5 5600X',
            category: 'Processors',
            price: 299.99,
            description:
                'The AMD Ryzen 5 5600X is a mid-range CPU with excellent single-threaded performance.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Intel Core i7-11700K',
            category: 'Processors',
            price: 449.99,
            description:
                'The Intel Core i7-11700K is a high-performance CPU with 8 cores and strong gaming performance.',
            stock: 15,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'AMD Ryzen Threadripper 3990X',
            category: 'Processors',
            price: 1999.99,
            description:
                'The AMD Ryzen Threadripper 3990X is a high-end desktop CPU with 64 cores and exceptional multi-threaded performance.',
            stock: 5,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
    ]
    // Additional Products for Smartphones
    const smartphonesProducts = [
        {
            name: 'iPhone 13 Pro',
            category: 'Smartphones',
            price: 999.99,
            description:
                "The iPhone 13 Pro is Apple's flagship smartphone with a stunning display and powerful features.",
            stock: 30,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Samsung Galaxy S21 Ultra',
            category: 'Smartphones',
            price: 1199.99,
            description:
                'The Samsung Galaxy S21 Ultra is a premium Android smartphone with a versatile camera system.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Google Pixel 6 Pro',
            category: 'Smartphones',
            price: 899.99,
            description:
                'The Google Pixel 6 Pro offers a pure Android experience and impressive camera capabilities.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'OnePlus 9 Pro',
            category: 'Smartphones',
            price: 799.99,
            description:
                'The OnePlus 9 Pro is known for its fast performance and clean OxygenOS user interface.',
            stock: 15,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Xiaomi Mi 11',
            category: 'Smartphones',
            price: 599.99,
            description:
                'The Xiaomi Mi 11 offers flagship-level features at a more affordable price point.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Sony Xperia 1 III',
            category: 'Smartphones',
            price: 1099.99,
            description:
                'The Sony Xperia 1 III is a multimedia powerhouse with a 4K display and exceptional audio quality.',
            stock: 10,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'LG Velvet 5G',
            category: 'Smartphones',
            price: 499.99,
            description:
                'The LG Velvet 5G offers 5G connectivity and a sleek design with a waterdrop notch display.',
            stock: 30,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Asus ROG Phone 5',
            category: 'Smartphones',
            price: 799.99,
            description:
                'The Asus ROG Phone 5 is a gaming-focused smartphone with a high-refresh-rate AMOLED display.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
    ]
    // Additional Products for Headphones
    const headphonesProducts = [
        {
            name: 'Sony WH-1000XM4',
            category: 'Headphones',
            price: 349.99,
            description:
                'The Sony WH-1000XM4 are premium noise-canceling headphones with excellent sound quality.',
            stock: 40,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Bose QuietComfort 35 II',
            category: 'Headphones',
            price: 299.99,
            description:
                'The Bose QuietComfort 35 II are comfortable and effective noise-canceling headphones.',
            stock: 35,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Sennheiser HD 660 S',
            category: 'Headphones',
            price: 499.99,
            description:
                'The Sennheiser HD 660 S are open-back headphones with a focus on audiophile-grade sound quality.',
            stock: 20,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Beats Studio3 Wireless',
            category: 'Headphones',
            price: 349.99,
            description:
                'The Beats Studio3 Wireless headphones offer a stylish design and powerful bass-driven sound.',
            stock: 30,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Audio-Technica ATH-M50x',
            category: 'Headphones',
            price: 149.99,
            description:
                'The Audio-Technica ATH-M50x are studio-quality headphones known for their accuracy and comfort.',
            stock: 50,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'JBL Quantum 800',
            category: 'Headphones',
            price: 199.99,
            description:
                'The JBL Quantum 800 are gaming headphones with active noise cancellation and a detachable microphone.',
            stock: 25,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Beyerdynamic DT 990 Pro',
            category: 'Headphones',
            price: 179.99,
            description:
                'The Beyerdynamic DT 990 Pro are open-back headphones favored by professionals for mixing and mastering.',
            stock: 15,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
        {
            name: 'Skullcandy Crusher Evo',
            category: 'Headphones',
            price: 129.99,
            description:
                'The Skullcandy Crusher Evo headphones offer adjustable bass and long-lasting battery life.',
            stock: 35,
            stripePriceId: 'price_1OVMFdBDqOJUyBhU8qMn4SgK',
        },
    ]

    // Products
    const products = [
        ...graphicsCardsProducts,
        ...processorsProducts,
        ...smartphonesProducts,
        ...headphonesProducts,
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
            const imagePath = path.join(__dirname, './assets', imageName)

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
