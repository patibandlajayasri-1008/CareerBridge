import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Job title cannot exceed 120 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    companyCode: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: {
        values: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
        message: '{VALUE} is not a valid employment type',
      },
      default: 'Full-Time',
    },
    salaryRange: {
      type: String,
      required: [true, 'Salary or stipend range is required'],
      trim: true,
      default: 'Not Disclosed',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    eligibilityCriteria: {
      minGraduationYear: {
        type: Number,
        default: 2026,
      },
      minCgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: 6.0,
      },
      allowedDegrees: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Published', 'Draft', 'Closed'],
        message: '{VALUE} is not a valid job status',
      },
      default: 'Published',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A job listing must be associated with an administrator account'],
    },
  },
  {
    timestamps: true,
  }
);

// Search & Filtering Indexes
jobSchema.index({ title: 'text', company: 'text', requiredSkills: 'text' });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
