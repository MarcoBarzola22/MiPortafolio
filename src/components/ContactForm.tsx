import React, { useState } from 'react';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Esquema Zod con mensajes traducidos reactivamente
  const contactSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t('contact.errorNameRequired') }),
    email: z
      .string()
      .trim()
      .min(1, { message: t('contact.errorEmailInvalid') })
      .email({ message: t('contact.errorEmailInvalid') }),
    message: z
      .string()
      .trim()
      .min(10, { message: t('contact.errorMessageMin') }),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error al escribir
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);

    // Validación Zod
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);

      // Enfocar primer campo con error para accesibilidad de teclado
      const firstErrorField = Object.keys(fieldErrors)[0];
      const errorElement = document.getElementById(`contact-${firstErrorField}`);
      errorElement?.focus();

      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // Simular transmisión asíncrona segura del despacho
      await new Promise((resolve) => setTimeout(resolve, 600));

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      toast.success(t('contact.successTitle'), {
        description: t('contact.successDesc'),
      });
    } catch {
      toast.error('Error al enviar el despacho. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full border-2 border-rule-bold p-6 md:p-8 bg-paper-card rounded shadow-sm">
      <div className="border-b border-rule-light pb-4 mb-6">
        <span className="font-mono text-mono-sm uppercase tracking-widest text-mint-base font-semibold block mb-1">
          DESPACHO TELEGRÁFICO // CORREO EDITORIAL
        </span>
        <h3 className="font-headline text-h3 font-bold text-ink-headline">
          {t('contact.title')}
        </h3>
        <p className="font-body text-body text-ink-muted mt-1 italic">
          {t('contact.subtitle')}
        </p>
      </div>

      {isSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 border border-mint-base bg-mint-base/10 rounded flex items-start gap-3 text-ink-headline"
        >
          <CheckCircle2 className="w-5 h-5 text-mint-base flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="font-mono text-body font-bold text-ink-headline">
              {t('contact.successTitle')}
            </h4>
            <p className="font-body text-body text-ink-body mt-1">
              {t('contact.successDesc')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Campo: Nombre */}
        <div>
          <label
            htmlFor="contact-name"
            className="block font-mono text-mono-sm uppercase tracking-wider font-semibold text-ink-headline mb-1.5"
          >
            {t('contact.nameLabel')} <span className="text-mint-base" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t('contact.namePlaceholder')}
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={`w-full p-3 bg-paper-base text-ink-body font-body text-body border rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base ${
              errors.name ? 'border-destructive focus-visible:ring-destructive' : 'border-rule-bold hover:border-mint-base'
            }`}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Campo: Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block font-mono text-mono-sm uppercase tracking-wider font-semibold text-ink-headline mb-1.5"
          >
            {t('contact.emailLabel')} <span className="text-mint-base" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t('contact.emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={`w-full p-3 bg-paper-base text-ink-body font-body text-body border rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base ${
              errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-rule-bold hover:border-mint-base'
            }`}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Campo: Mensaje */}
        <div>
          <label
            htmlFor="contact-message"
            className="block font-mono text-mono-sm uppercase tracking-wider font-semibold text-ink-headline mb-1.5"
          >
            {t('contact.messageLabel')} <span className="text-mint-base" aria-hidden="true">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            placeholder={t('contact.messagePlaceholder')}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className={`w-full p-3 bg-paper-base text-ink-body font-body text-body border rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base resize-y ${
              errors.message ? 'border-destructive focus-visible:ring-destructive' : 'border-rule-bold hover:border-mint-base'
            }`}
          />
          {errors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-destructive"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label={isSubmitting ? t('contact.sending') : t('contact.sendButton')}
          className="w-full sm:w-auto px-6 py-3 bg-mint-base text-mint-contrast font-mono text-mono-sm font-semibold uppercase tracking-wider hover:bg-mint-hover transition-colors shadow-md rounded flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>{t('contact.sending')}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{t('contact.sendButton')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
