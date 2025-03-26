import express from 'express'
import {
  getCodeBlocks,
  getCodeBlock,
  createCodeBlock,
  updateCodeBlock,
  deleteCodeBlock
} from '../controllers/codeBlockController.js'

const router = express.Router()

// Get all code blocks
router.get('/', getCodeBlocks)

// Get a single code block
router.get('/:id', getCodeBlock)

// Create a new code block
router.post('/', createCodeBlock)

// Update a code block
router.put('/:id', updateCodeBlock)

// Delete a code block
router.delete('/:id', deleteCodeBlock)

export default router 