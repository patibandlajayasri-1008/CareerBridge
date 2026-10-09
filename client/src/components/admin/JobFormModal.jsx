import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Briefcase, Building, MapPin, DollarSign, Calendar, Users, Award } from 'lucide-react';

export default function JobFormModal({ isOpen, onClose, onSubmit, initialJob = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyCode: '',
    location: '',
    employmentType: 'Full-Time',
    salaryRange: '',
    experienceLevel: 'Entry Level',
    openings: 1,
    deadline: '',
    minCgpa: 6.5,
    skills: '',
    description: '',
    status: 'Published',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialJob) {
      setFormData({
        title: initialJob.title || '',
        company: initialJob.company || '',
        companyCode: initialJob.companyCode || '',
        location: initialJob.location || '',
        employmentType: initialJob.employmentType || 'Full-Time',
        salaryRange: initialJob.salaryRange || '',
        experienceLevel: initialJob.experienceLevel || 'Entry Level',
        openings: initialJob.openings || 1,
        deadline: initialJob.deadline ? initialJob.deadline.split('T')[0] : '',
        minCgpa: initialJob.eligibilityCriteria?.minCgpa || 6.5,
        skills: Array.isArray(initialJob.requiredSkills) ? initialJob.requiredSkills.join(', ') : '',
        description: initialJob.description || '',
        status: initialJob.status || 'Published',
      });
    } else {
      // Default initial state for new drive
      const defaultDeadline = new Date();
      defaultDeadline.setDate(defaultDeadline.getDate() + 30);
      setFormData({
        title: '',
        company: '',
        companyCode: '',
        location: 'Bangalore / Hybrid',
        employmentType: 'Full-Time',
        salaryRange: '₹8.0 LPA - ₹12.0 LPA',
        experienceLevel: 'Entry Level',
        openings: 5,
        deadline: defaultDeadline.toISOString().split('T')[0],
        minCgpa: 6.5,
        skills: 'React, Node.js, MongoDB, JavaScript',
        description: 'We are seeking passionate campus graduates to join our product engineering team.',
        status: 'Published',
      });
    }
    setErrors({});
  }, [initialJob, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Job location is required';
    if (!formData.salaryRange.trim()) newErrors.salaryRange = 'Compensation / CTC is required';
    if (!formData.deadline) newErrors.deadline = 'Application deadline is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const skillsArray = formData.skills
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      companyCode: formData.companyCode.trim() || formData.company.trim().substring(0, 3).toUpperCase(),
      location: formData.location.trim(),
      employmentType: formData.employmentType,
      salaryRange: formData.salaryRange.trim(),
      experienceLevel: formData.experienceLevel,
      openings: Number(formData.openings) || 1,
      deadline: formData.deadline,
      description: formData.description.trim(),
      requiredSkills: skillsArray,
      eligibilityCriteria: {
        minCgpa: Number(formData.minCgpa) || 6.0,
        allowedBatches: [2025, 2026],
        allowedDegrees: ['B.Tech / B.E.', 'MCA', 'M.Tech'],
      },
      status: formData.status,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialJob ? 'Edit Placement Opportunity' : 'Publish New Campus Placement Drive'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Job Role Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Associate Software Engineer"
            icon={Briefcase}
            error={errors.title}
            required
          />

          <Input
            label="Hiring Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Cisco Systems"
            icon={Building}
            error={errors.company}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Bangalore / Hybrid"
            icon={MapPin}
            error={errors.location}
            required
          />

          <Select
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={[
              { value: 'Full-Time', label: 'Full-Time' },
              { value: 'Internship', label: 'Internship' },
              { value: 'Part-Time', label: 'Part-Time' },
              { value: 'Contract', label: 'Contract' },
            ]}
          />

          <Input
            label="Compensation (CTC)"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            placeholder="e.g. ₹9.0 LPA - ₹12.5 LPA"
            icon={DollarSign}
            error={errors.salaryRange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Openings Count"
            name="openings"
            type="number"
            min="1"
            value={formData.openings}
            onChange={handleChange}
            placeholder="e.g. 10"
            icon={Users}
          />

          <Input
            label="Minimum CGPA"
            name="minCgpa"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.minCgpa}
            onChange={handleChange}
            placeholder="e.g. 7.0"
            icon={Award}
          />

          <Input
            label="Application Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            icon={Calendar}
            error={errors.deadline}
            required
          />
        </div>

        <Input
          label="Required Skills (Comma Separated)"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g. Java, Spring Boot, MySQL, REST APIs"
          helperText="Separate multiple technical competencies with commas"
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#172033]">
            Job Description & Eligibility Summary <span className="text-[#C2414B]">*</span>
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter key role details, campus eligibility rules, and selection rounds..."
            className={`w-full p-3 text-xs rounded-xl border ${
              errors.description ? 'border-[#C2414B]' : 'border-[#E4E8F0]'
            } bg-white text-[#172033] focus:border-[#3157D5] focus:ring-1 focus:ring-[#3157D5] outline-none transition-all`}
          />
          {errors.description && (
            <p className="text-[11px] text-[#C2414B]">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
          <Select
            label=""
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'Published', label: 'Status: Published' },
              { value: 'Draft', label: 'Status: Draft' },
              { value: 'Closed', label: 'Status: Closed' },
            ]}
          />

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
              {initialJob ? 'Save Changes' : 'Publish Opportunity'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
