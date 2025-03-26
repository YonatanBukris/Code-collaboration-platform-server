import mongoose from 'mongoose'

const codeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  initialCode: {
    type: String,
    required: true
  },
  solutionCode: {
    type: String,
    required: true
  },
  // Session related fields
  isActive: {
    type: Boolean,
    default: false
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  mentorConnected: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema)

export default CodeBlock 