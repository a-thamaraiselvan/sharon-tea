import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitContactEnquiry } from '@/services/contactService';
import { BrandButton } from '@/components/ui/BrandButton';
import { CheckCircle2, Send, AlertCircle, Phone, Mail, User, MessageSquare } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Please enter your name (at least 2 characters)' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' })
    .max(15, { message: 'Phone number is too long' }),
  message: z.string().min(5, { message: 'Please enter your message (at least 5 characters)' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitContactEnquiry(data);
      if (response.success) {
        setIsSuccess(true);
        reset();
      } else {
        setErrorMessage(response.message || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Submission failed. Please check your network or try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form-section" className="py-16 md:py-24 bg-white border-t border-neutral-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-cream/60 rounded-3xl p-8 sm:p-12 border border-neutral-200/90 shadow-warm-lg">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-leaf-green bg-brand-green/10 px-3.5 py-1 rounded-full border border-brand-green/20">
              Get In Touch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-black mt-3">
              Send Us a Message
            </h2>
            <p className="text-neutral-600 text-sm mt-2">
              Have questions regarding our outlets, bulk catering, tea supply, or feedback? Send us a message and our team will get back to you promptly.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="mb-8 p-6 bg-brand-green/10 border border-brand-green/30 rounded-2xl flex items-start gap-3.5 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-brand-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display text-lg font-bold text-brand-green">
                  Message Sent Successfully!
                </h4>
                <p className="text-sm text-neutral-700 mt-1">
                  Thank you for reaching out to Sharon Tea and Coffee. We have received your enquiry and our support team will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 text-xs font-semibold text-brand-leaf-green hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Your Full Name <span className="text-brand-burgundy">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      {...register('name')}
                      className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-brand-black placeholder-neutral-400 focus:outline-none transition-all shadow-xs ${
                        errors.name
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                      }`}
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Email Address <span className="text-brand-burgundy">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      {...register('email')}
                      className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-brand-black placeholder-neutral-400 focus:outline-none transition-all shadow-xs ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="md:col-span-2">
                  <label htmlFor="contact-phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Phone / Mobile Number <span className="text-brand-burgundy">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      {...register('phone')}
                      className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-brand-black placeholder-neutral-400 focus:outline-none transition-all shadow-xs ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                    Message / Enquiry Details <span className="text-brand-burgundy">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      rows={4}
                      placeholder="Write your message, queries, feedback, or catering requirements here..."
                      {...register('message')}
                      className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-brand-black placeholder-neutral-400 focus:outline-none transition-all shadow-xs resize-y ${
                        errors.message
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-neutral-300 focus:border-brand-green focus:ring-1 focus:ring-brand-green'
                      }`}
                    />
                    <MessageSquare className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto px-8"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Enquiry
                </BrandButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
