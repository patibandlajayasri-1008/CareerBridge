import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must be linked to a registered student'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must be linked to an active job posting'],
    },
    resumeSnapshot: {
      fileName: {
        type: String,
        required: [true, 'Resume snapshot file name is required'],
      },
      originalName: {
        type: String,
        required: [true, 'Original resume name is required'],
      },
      size: {
        type: Number,
      },
      mimeType: {
        type: String,
        default: 'application/pdf',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'],
        message: '{VALUE} is not a valid recruitment stage',
      },
      default: 'Applied',
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    adminNotes: {
      type: String,
      trim: true,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL ATOMIC CONSTRAINT:
// A student may only submit ONE application per job drive.
// The compound unique index guarantees zero duplicates at the MongoDB engine level.
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

// Query Optimization Indexes
applicationSchema.index({ student: 1, appliedAt: -1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
