import mongoose from 'mongoose';

const formDefinitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    fields: { type: Array, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    version: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

formDefinitionSchema.index({ name: 1, createdBy: 1 });

export default mongoose.model('FormDefinition', formDefinitionSchema);
