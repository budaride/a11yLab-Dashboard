import mongoose, { Schema, Document } from 'mongoose'

export interface IFix {
  css: string
  js: string
  appliedAt: Date
}

export interface IAudit extends Document {
  userId: mongoose.Types.ObjectId
  url: string
  axeViolations: number
  htmlcsErrors: number
  contrastErrors: number
  incompleteCount: number
  violations: Array<{
    id: string
    impact: string
    description: string
    nodes: number
  }>
  fixes: IFix[]
  createdAt: Date
  updatedAt: Date
}

const FixSchema = new Schema<IFix>(
  {
    css: { type: String, default: '' },
    js: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const AuditSchema = new Schema<IAudit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    axeViolations: { type: Number, default: 0 },
    htmlcsErrors: { type: Number, default: 0 },
    contrastErrors: { type: Number, default: 0 },
    incompleteCount: { type: Number, default: 0 },
    violations: [
      {
        id: String,
        impact: String,
        description: String,
        nodes: Number,
      },
    ],
    fixes: [FixSchema],
  },
  { timestamps: true }
)

export default mongoose.models.Audit || mongoose.model<IAudit>('Audit', AuditSchema)
