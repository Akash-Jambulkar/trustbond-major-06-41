
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactForm from '@/components/contact/ContactForm';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ContactForm', () => {
  const renderForm = () => {
    return render(
      <BrowserRouter>
        <ContactForm />
      </BrowserRouter>
    );
  };

  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    renderForm();
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Subject must be at least 5 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('successfully submits form with valid data', async () => {
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Subject/i), {
      target: { value: 'Test Subject' },
    });
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'This is a test message content.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    // After submission, MFA verification should be shown
    await waitFor(() => {
      expect(screen.getByText(/Security Verification/i)).toBeInTheDocument();
    });
  });
});
