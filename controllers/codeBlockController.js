import CodeBlock from '../models/CodeBlock.js'

// Get all code blocks
export const getCodeBlocks = async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find().sort({ createdAt: -1 })
    res.json(codeBlocks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single code block
export const getCodeBlock = async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id)
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' })
    }
    res.json(codeBlock)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new code block
export const createCodeBlock = async (req, res) => {
  const codeBlock = new CodeBlock({
    title: req.body.title,
    initialCode: req.body.initialCode,
    solutionCode: req.body.solutionCode
  })

  try {
    const newCodeBlock = await codeBlock.save()
    res.status(201).json(newCodeBlock)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update a code block
export const updateCodeBlock = async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id)
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' })
    }

    if (req.body.title) codeBlock.title = req.body.title
    if (req.body.initialCode) codeBlock.initialCode = req.body.initialCode
    if (req.body.solutionCode) codeBlock.solutionCode = req.body.solutionCode

    const updatedCodeBlock = await codeBlock.save()
    res.json(updatedCodeBlock)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a code block
export const deleteCodeBlock = async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findByIdAndDelete(req.params.id)
    if (!codeBlock) {
      return res.status(404).json({ message: 'Code block not found' })
    }
    res.json({ message: 'Code block deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 