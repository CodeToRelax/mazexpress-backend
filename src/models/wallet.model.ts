import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      required: true,
    },
    currency: {
      type: String,
      default: 'LYD',
      enum: ['LYD', 'USD'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Wallet', WalletSchema);
