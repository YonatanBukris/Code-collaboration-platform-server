import mongoose from 'mongoose'
import dotenv from 'dotenv'
import CodeBlock from './models/CodeBlock.js'

dotenv.config()

const codeBlocks = [
  {
    title: "Double Array Numbers",
    initialCode: "// Write a function that doubles each number in the array\nconst numbers = [1, 2, 3, 4, 5];\n\nfunction doubleNumbers(arr) {\n  // Your code here\n}\n",
    solutionCode: "const numbers = [1, 2, 3, 4, 5];\n\nfunction doubleNumbers(arr) {\n  return arr.map(num => num * 2);\n}\n"
  },
  {
    title: "Find Max Number",
    initialCode: "// Write a function that finds the maximum number in the array\nconst numbers = [12, 5, 23, 8, 16];\n\nfunction findMax(arr) {\n  // Your code here\n}\n",
    solutionCode: "const numbers = [12, 5, 23, 8, 16];\n\nfunction findMax(arr) {\n  return Math.max(...arr);\n}\n"
  },
  {
    title: "Reverse String",
    initialCode: "// Write a function that reverses a string and log it with 'hello'\nfunction reverseString(str) {\n  // Your code here\n}\n",
    solutionCode: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('hello')); // 'olleh'"
  },
  {
    title: "Hello World",
    initialCode: "// Write a function that prints 'Hello, World!' to the console\n\nfunction sayHello() {\n  // Your code here\n}\n",
    solutionCode: "function sayHello() {\n  console.log('Hello, World!');\n}\n"
  }
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await CodeBlock.deleteMany({})
    console.log('Cleared existing data')

    // Insert new data
    const insertedBlocks = await CodeBlock.insertMany(codeBlocks)
    console.log('Inserted new code blocks:', insertedBlocks)

    console.log('Database seeding completed')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 