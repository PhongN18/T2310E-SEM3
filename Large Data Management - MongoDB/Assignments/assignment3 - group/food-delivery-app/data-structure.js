async function initializeData() {
    console.log("Inserting data...");

    // Xóa dữ liệu cũ nếu có
    await menuCollection.deleteMany({})
    await storageCollection.deleteMany({})
    await ordersCollection.deleteMany({})
    // Sinh dữ liệu mẫu

    const storageData = []
    for (let i = 1; i <= 100; i++) {
        storageData.push({
            _id: `I0${String(i).padStart(3, "0")}`,
            name: `Ingredient_${i}`,
            inStock: Math.round(Math.random() * 200)
        })
    }
    await storageCollection.insertMany(storageData)
    console.log("Storage data inserted.")

    const menuData = [];
    const categories = ['Fast Food', 'Beverage', 'Vietnamese', 'Chinese', 'Italian']
    for (let i = 1; i <= 100; i++) {
        const noOfIngredients = Math.round(Math.random() * 9) + 1
        const ingredients = Array.from({ length: noOfIngredients }, () => {
            const randomIndex = Math.floor(Math.random() * storageData.length);
            return storageData[randomIndex]._id;
        })
        menuData.push({
            _id: `MI0${String(i).padStart(3, "0")}`,
            name: `Menu_item_${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            price: (Math.floor(Math.random() * 200) + 50) * 1000,
            ingredients: ingredients
        })
    }
    await menuCollection.insertMany(menuData);
    console.log("Menu data inserted.");
    
    const ordersData = []
    for (let i = 1; i <= 1000000; i++) {
        const noOfItems = Math.round(Math.random() * 4) + 1
        const items = Array.from({ length: noOfItems }, () => {
            const randomIndex = Math.floor(Math.random() * menuData.length);
            return {
                itemId: menuData[randomIndex]._id,
                quantity: Math.round(Math.random() * 4) + 1 // Random quantity between 1 and 5
            };
        })

        const total = items.reduce((total, item) => {
            const menuItem = menuData.find(menu => menu._id === item.itemId)
            return total + (menuItem.price * item.quantity)
        }, 0)

        ordersData.push({
            _id: 'ORD' + String(i).padStart(9, '0'),
            items: items,
            total: total,
            address: `Address_${i}`,
            createdAt: randomDate(startDate, endDate)
        })
    }
    await ordersCollection.insertMany(ordersData)
    console.log("Orders data inserted.")
}