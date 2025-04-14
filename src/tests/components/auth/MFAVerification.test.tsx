
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MFAVerification from '@/components/auth/MFAVerification';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MFAVerification', () => {
  const mockOnVerify = vi.fn();
  const mockOnCancel = vi.fn();
  const testEmail = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders verification UI correctly', () => {
    render(
      <MFAVerification
        email={testEmail}
        onVerify={mockOnVerify}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Security Verification/i)).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter 6-digit code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
  });

  it('handles invalid code submission', () => {
    render(
      <MFAVerification
        email={testEmail}
        onVerify={mockOnVerify}
        onCancel={mockOnCancel}
      />
    );

    const verifyButton = screen.getByRole('button', { name: /Verify/i });
    fireEvent.click(verifyButton);

    expect(toast.error).toHaveBeenCalledWith('Please enter the verification code');
  });

  it('validates code format', () => {
    render(
      <MFAVerification
        email={testEmail}
        onVerify={mockOnVerify}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText(/Enter 6-digit code/i);
    fireEvent.change(input, { target: { value: '12345' } });

    const verifyButton = screen.getByRole('button', { name: /Verify/i });
    fireEvent.click(verifyButton);

    expect(toast.error).toHaveBeenCalledWith('Verification code must be 6 digits');
  });

  it('handles successful verification', () => {
    render(
      <MFAVerification
        email={testEmail}
        onVerify={mockOnVerify}
        onCancel={mockOnCancel}
      />
    );

    const input = screen.getByPlaceholderText(/Enter 6-digit code/i);
    fireEvent.change(input, { target: { value: '123456' } });

    const verifyButton = screen.getByRole('button', { name: /Verify/i });
    fireEvent.click(verifyButton);

    expect(toast.success).toHaveBeenCalledWith('Verification successful!');
    expect(mockOnVerify).toHaveBeenCalled();
  });
});
