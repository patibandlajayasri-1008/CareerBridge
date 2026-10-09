import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full legal name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Never return password hash in database projections by default
    },
    role: {
      type: String,
      enum: {
        values: ['student', 'admin'],
        message: '{VALUE} is not an authorized role',
      },
      default: 'student',
    },
    // Academic & Placement Details (Student specific)
    college: {
      type: String,
      trim: true,
      default: '',
    },
    degree: {
      type: String,
      trim: true,
      default: 'B.Tech / B.E.',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
      min: [2020, 'Graduation year cannot be earlier than 2020'],
      max: [2035, 'Graduation year cannot exceed 2035'],
      default: 2026,
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    preferredRoles: [
      {
        type: String,
        trim: true,
      },
    ],
    summary: {
      type: String,
      trim: true,
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
      default: '',
    },
    resume: {
      originalName: { type: String, default: null },
      fileName: { type: String, default: null },
      mimeType: { type: String, default: null },
      size: { type: Number, default: null },
      uploadedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Automatic Password Hashing Hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method: Compare candidate password with stored bcrypt hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Query Performance Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ graduationYear: 1 });

const User = mongoose.model('User', userSchema);

export default User;
