import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { I18nProvider } from '@/context/I18nContext';
import ContactForm from '@/components/ContactForm';

describe('ContactForm Component (Zod validation & a11y)', () => {
  it('renderiza todos los campos de formulario y botones en español por defecto', () => {
    render(
      <I18nProvider initialLanguage="es">
        <ContactForm />
      </I18nProvider>
    );

    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje o Propuesta/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transmitir Despacho/i })).toBeInTheDocument();
  });

  it('renderiza los textos en inglés cuando el idioma activo es inglés', () => {
    render(
      <I18nProvider initialLanguage="en">
        <ContactForm />
      </I18nProvider>
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message or Proposal/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Transmit Dispatch/i })).toBeInTheDocument();
  });

  it('valida con Zod y muestra mensajes de error accesibles cuando los campos están vacíos', async () => {
    render(
      <I18nProvider initialLanguage="es">
        <ContactForm />
      </I18nProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /Transmitir Despacho/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/Por favor ingresa un correo electrónico con formato válido/i)).toBeInTheDocument();
      expect(screen.getByText(/El mensaje debe tener al menos 10 caracteres/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'contact-name-error');
  });

  it('valida formato de email incorrecto y longitud mínima de mensaje', async () => {
    render(
      <I18nProvider initialLanguage="es">
        <ContactForm />
      </I18nProvider>
    );

    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const messageInput = screen.getByLabelText(/Mensaje o Propuesta/i);
    const submitBtn = screen.getByRole('button', { name: /Transmitir Despacho/i });

    fireEvent.change(nameInput, { target: { value: 'Marco Barzola' } });
    fireEvent.change(emailInput, { target: { value: 'correo-invalido' } });
    fireEvent.change(messageInput, { target: { value: 'Corto' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/El nombre es obligatorio/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Por favor ingresa un correo electrónico con formato válido/i)).toBeInTheDocument();
      expect(screen.getByText(/El mensaje debe tener al menos 10 caracteres/i)).toBeInTheDocument();
    });
  });

  it('procesa el envío correctamente con datos válidos y limpia el formulario', async () => {
    render(
      <I18nProvider initialLanguage="es">
        <ContactForm />
      </I18nProvider>
    );

    const nameInput = screen.getByLabelText(/Nombre Completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Correo Electrónico/i) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/Mensaje o Propuesta/i) as HTMLTextAreaElement;
    const submitBtn = screen.getByRole('button', { name: /Transmitir Despacho/i });

    fireEvent.change(nameInput, { target: { value: 'Juan Perez' } });
    fireEvent.change(emailInput, { target: { value: 'juan.perez@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola Marco, nos interesa coordinar una entrevista técnica.' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/¡Despacho Recibido!/i)).toBeInTheDocument();
    });

    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(messageInput.value).toBe('');
  });

  it('cumple con las pautas de accesibilidad WCAG 2.1 AA (axe-core)', async () => {
    const { container } = render(
      <I18nProvider initialLanguage="es">
        <ContactForm />
      </I18nProvider>
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});
