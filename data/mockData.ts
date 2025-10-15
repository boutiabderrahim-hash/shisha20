import { Waiter, Category, MenuItem, InventoryItem, Table, RestaurantSettings } from '../types';

export const mockWaiters: Waiter[] = [
  { id: '1', name: 'نبيل', pin: '1111', role: 'MANAGER' },
  { id: '2', name: 'شاهد', pin: '0000', role: 'MANAGER' },
  { id: '3', name: 'مسؤول', pin: '4714', role: 'ADMIN' },
];

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Appetizers' },
  { id: 'cat2', name: 'Main Courses' },
  { id: 'cat3', name: 'Desserts' },
  { id: 'cat4', name: 'Beverages' },
];

export const mockInventory: InventoryItem[] = [
    { id: 'inv1', name: 'Burger Patty', quantity: 100, unit: 'pcs', lowStockThreshold: 20 },
    { id: 'inv2', name: 'Pizza Dough', quantity: 50, unit: 'pcs', lowStockThreshold: 10 },
    { id: 'inv3', name: 'Cola Can', quantity: 200, unit: 'pcs', lowStockThreshold: 50 },
    { id: 'inv4', name: 'Coffee Beans', quantity: 10, unit: 'kg', lowStockThreshold: 2 },
    { id: 'inv5', name: 'Pasta', quantity: 20, unit: 'kg', lowStockThreshold: 5 },
    { id: 'inv6', name: 'Salmon Fillet', quantity: 30, unit: 'pcs', lowStockThreshold: 8 },
    { id: 'inv7', name: 'Steak', quantity: 25, unit: 'pcs', lowStockThreshold: 6 },
    { id: 'inv8', name: 'Oranges', quantity: 50, unit: 'pcs', lowStockThreshold: 15 },
    { id: 'inv9', name: 'Bread', quantity: 40, unit: 'loaves', lowStockThreshold: 10 },
    { id: 'inv10', name: 'Chicken Wings', quantity: 10, unit: 'kg', lowStockThreshold: 3 },
    { id: 'inv11', name: 'Tiramisu Portion', quantity: 20, unit: 'pcs', lowStockThreshold: 5 },
];

export const mockMenuItems: MenuItem[] = [
    // Appetizers (cat1)
    {
        id: 'item4',
        name: 'Spring Rolls',
        price: 8.00,
        categoryId: 'cat1',
        imageUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Rolls',
        ingredients: ['Wrapper', 'Cabbage', 'Carrot'],
        stockItemId: 'inv1', // placeholder
        stockConsumption: 0.2,
    },
    {
        id: 'item6',
        name: 'Garlic Bread',
        price: 5.50,
        categoryId: 'cat1',
        imageUrl: 'https://via.placeholder.com/150/FFEB3B/000000?Text=Garlic+Bread',
        ingredients: ['Bread', 'Garlic', 'Butter'],
        stockItemId: 'inv9',
        stockConsumption: 0.25,
    },
    {
        id: 'item7',
        name: 'Chicken Wings',
        price: 9.00,
        categoryId: 'cat1',
        imageUrl: 'https://via.placeholder.com/150/E65100/FFFFFF?Text=Wings',
        ingredients: ['Chicken', 'BBQ Sauce'],
        stockItemId: 'inv10',
        stockConsumption: 0.5,
    },
    // Main Courses (cat2)
    {
        id: 'item1',
        name: 'Classic Burger',
        price: 12.50,
        categoryId: 'cat2',
        imageUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Burger',
        ingredients: ['Bun', 'Patty', 'Lettuce', 'Tomato', 'Onion'],
        customizations: [
            {
                id: 'cust1', name: 'Add Cheese', type: 'multiple',
                options: [
                    { id: 'opt1', name: 'Cheddar', priceModifier: 1.00 },
                    { id: 'opt2', name: 'Swiss', priceModifier: 1.50 },
                ]
            },
            {
                id: 'cust2', name: 'Cooking', type: 'single',
                options: [
                    { id: 'opt3', name: 'Medium Rare', priceModifier: 0 },
                    { id: 'opt4', name: 'Medium', priceModifier: 0 },
                    { id: 'opt5', name: 'Well Done', priceModifier: 0 },
                ]
            }
        ],
        stockItemId: 'inv1',
        stockConsumption: 1,
    },
    {
        id: 'item2',
        name: 'Margherita Pizza',
        price: 15.00,
        categoryId: 'cat2',
        imageUrl: 'https://via.placeholder.com/150/F44336/FFFFFF?Text=Pizza',
        ingredients: ['Dough', 'Tomato Sauce', 'Cheese', 'Basil'],
        stockItemId: 'inv2',
        stockConsumption: 1,
    },
    {
        id: 'item8',
        name: 'Spaghetti Carbonara',
        price: 14.00,
        categoryId: 'cat2',
        imageUrl: 'https://via.placeholder.com/150/9E9E9E/000000?Text=Pasta',
        ingredients: ['Spaghetti', 'Eggs', 'Cheese', 'Bacon'],
        stockItemId: 'inv5',
        stockConsumption: 0.2,
    },
    {
        id: 'item9',
        name: 'Grilled Salmon',
        price: 18.50,
        categoryId: 'cat2',
        imageUrl: 'https://via.placeholder.com/150/00BCD4/FFFFFF?Text=Salmon',
        ingredients: ['Salmon', 'Lemon', 'Asparagus'],
        stockItemId: 'inv6',
        stockConsumption: 1,
    },
    // Desserts (cat3)
    {
        id: 'item5',
        name: 'Chocolate Cake',
        price: 7.50,
        categoryId: 'cat3',
        imageUrl: 'https://via.placeholder.com/150/795548/FFFFFF?Text=Cake',
        ingredients: ['Flour', 'Sugar', 'Cocoa'],
        stockItemId: 'inv1', // placeholder
        stockConsumption: 0,
    },
    {
        id: 'item10',
        name: 'Tiramisu',
        price: 8.00,
        categoryId: 'cat3',
        imageUrl: 'https://via.placeholder.com/150/8D6E63/FFFFFF?Text=Tiramisu',
        ingredients: ['Ladyfingers', 'Mascarpone', 'Coffee'],
        stockItemId: 'inv11',
        stockConsumption: 1,
    },
    // Beverages (cat4)
    {
        id: 'item3',
        name: 'Cola',
        price: 2.50,
        categoryId: 'cat4',
        imageUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?Text=Cola',
        ingredients: [],
        stockItemId: 'inv3',
        stockConsumption: 1,
    },
    {
        id: 'item11',
        name: 'Orange Juice',
        price: 4.00,
        categoryId: 'cat4',
        imageUrl: 'https://via.placeholder.com/150/FF9800/FFFFFF?Text=Juice',
        ingredients: [],
        stockItemId: 'inv8',
        stockConsumption: 3,
    },
    {
        id: 'item12',
        name: 'Espresso',
        price: 2.00,
        categoryId: 'cat4',
        imageUrl: 'https://via.placeholder.com/150/3E2723/FFFFFF?Text=Espresso',
        ingredients: [],
        stockItemId: 'inv4',
        stockConsumption: 0.01,
    },
];

export const mockTables: Table[] = [
    // Bar Area
    { id: 't1', number: 1, area: 'Bar', shape: 'square', x: 10, y: 10, width: 12, height: 12 },
    { id: 't2', number: 2, area: 'Bar', shape: 'square', x: 30, y: 10, width: 12, height: 12 },
    { id: 't3', number: 3, area: 'Bar', shape: 'circle', x: 50, y: 15, width: 15, height: 15 },
    { id: 'fixture1', number: 0, area: 'Bar', shape: 'fixture', x: 5, y: 40, width: 60, height: 20 },
    // VIP Area
    { id: 't4', number: 101, area: 'VIP', shape: 'rectangle', x: 20, y: 20, width: 20, height: 12 },
    { id: 't5', number: 102, area: 'VIP', shape: 'rectangle', x: 50, y: 20, width: 20, height: 12 },
];

export const mockRestaurantSettings: RestaurantSettings = {
    name: "Restro POS",
    address: "123 Foodie Lane, Flavor Town",
    phone: "555-123-4567",
    footer: "Thank you for dining with us!"
};