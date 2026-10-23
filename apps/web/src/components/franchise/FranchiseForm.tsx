import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitFranchiseEnquiry } from '@/services/franchiseService';
import { BrandButton } from '@/components/ui/BrandButton';
import { CheckCircle2, Send, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

const franchiseSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Please enter your full name (at least 2 characters)' }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210)' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  city: z.string().min(2, { message: 'Please specify your target city or area' }),
  investmentBudget: z.string().min(1, { message: 'Please select an investment range' }),
  message: z.string().optional(),
});

type FranchiseFormValues = z.infer<typeof franchiseSchema>;

export const FranchiseForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FranchiseFormValues>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      city: '',
      investmentBudget: '',
      message: '',
    },
  });

  const onSubmit = async (data: FranchiseFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitFranchiseEnquiry(data);
      if (response.success) {
        setIsSuccess(true);
        reset();
      } else {
        setErrorMessage(response.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Submission failed. Please check your network or contact us via WhatsApp.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="franchise-form-section" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-cream/60 rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-warm-lg reveal-up">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-burgundy bg-brand-burgundy/10 px-3 py-1 rounded-full border border-brand-burgundy/20">
              Apply Now
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-black mt-3">
              Start Your Sharon Franchise
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              Fill in your details below and our Franchise Expansion Director will contact you within 24 business hours.
            </p>
          </div>

          {/* Success Message Banner */}
          {isSuccess && (
            <div className="mb-8 p-6 bg-brand-green/10 border border-brand-green/30 rounded-2xl flex items-start gap-3.5 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display text-lg font-bold text-brand-green">
                  Application Submitted Successfully!
                </h4>
                <p className="text-sm text-neutral-700 mt-1">
                  Thank you for your interest in Sharon Tea and Coffee. Our franchise onboarding team will review your location details and connect via phone shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 text-xs font-semibold text-brand-burgundy hover:underline"
                >
                  Submit another application
                </button>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                  Full Name <span className="text-brand-burgundy">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  {...register('fullName')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-colors ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 focus:border-brand-green'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                  Mobile Number (10 digits) <span className="text-brand-burgundy">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-semibold text-neutral-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    {...register('phone', {
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      },
                    })}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-colors font-medium tracking-wide ${
                      errors.phone ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 focus:border-brand-green'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                  Email Address <span className="text-brand-burgundy">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  {...register('email')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 focus:border-brand-green'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* City / Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                  Target City / Area <span className="text-brand-burgundy">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore / Anna Nagar, Chennai"
                  {...register('city')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-colors ${
                    errors.city ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 focus:border-brand-green'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Investment Budget Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                Investment Budget <span className="text-brand-burgundy">*</span>
              </label>
              <select
                {...register('investmentBudget')}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-colors ${
                  errors.investmentBudget ? 'border-red-500 bg-red-50/20' : 'border-neutral-300 focus:border-brand-green'
                }`}
              >
                <option value="">Select your planned budget range</option>
                <option value="₹15 Lakhs - ₹20 Lakhs (Sharon Cafe Model)">
                  ₹15 Lakhs – ₹20 Lakhs (Sharon Cafe Model)
                </option>
                <option value="₹25 Lakhs - ₹30 Lakhs (Sharon Master Franchise)">
                  ₹25 Lakhs – ₹30 Lakhs (Sharon Master Franchise)
                </option>
                <option value="Above ₹30 Lakhs (Multi-Unit Expansion)">
                  Above ₹30 Lakhs (Multi-Unit Expansion)
                </option>
              </select>
              {errors.investmentBudget && (
                <p className="text-xs text-red-500 mt-1">{errors.investmentBudget.message}</p>
              )}
            </div>

            {/* Message / Additional Information */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-black mb-1.5">
                Additional Comments / Preferred Commercial Space (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Share any details about your preferred location, business background, or site availability..."
                {...register('message')}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 text-center">
              <BrandButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                icon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto px-10"
              >
                Submit Franchise Application
              </BrandButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FranchiseForm;
