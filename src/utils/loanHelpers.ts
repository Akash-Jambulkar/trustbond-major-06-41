
import { supabase } from '@/lib/supabaseClient';
import { loansTable, profilesTable } from './supabase-helper';

export interface Loan {
  id: string;
  user_id: string;
  bank_id?: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  repaid_amount?: number;
  created_at: string;
  updated_at: string;
  blockchain_address?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'defaulted';
  purpose?: string;
  borrower?: {
    name?: string;
    email?: string;
    kyc_status?: string;
    trust_score?: number;
  };
}

/**
 * Fetch loans with enhanced borrower information
 */
export async function fetchLoansWithBorrowerInfo(): Promise<Loan[]> {
  try {
    // First, fetch all loans
    const { data: loans, error: loansError } = await loansTable()
      .select('*')
      .order('created_at', { ascending: false });

    if (loansError) {
      console.error('Error fetching loans:', loansError);
      throw loansError;
    }

    if (!loans || loans.length === 0) {
      return [];
    }

    // Then, enhance loans with borrower information
    const enhancedLoans = await Promise.all(
      loans.map(async (loan) => {
        if (loan.user_id) {
          // Fetch borrower profile
          const { data: profile, error: profileError } = await profilesTable()
            .select('name, email, kyc_status, trust_score')
            .eq('id', loan.user_id)
            .maybeSingle();

          if (!profileError && profile) {
            return {
              ...loan,
              borrower: {
                name: profile.name,
                email: profile.email,
                kyc_status: profile.kyc_status,
                trust_score: profile.trust_score
              }
            } as Loan;
          }
        }
        
        // Return the loan without borrower info if we couldn't fetch it
        return {
          ...loan,
          borrower: {
            name: 'Unknown Borrower',
            email: 'No email'
          }
        } as Loan;
      })
    );

    return enhancedLoans;
  } catch (error) {
    console.error('Exception in fetchLoansWithBorrowerInfo:', error);
    throw error;
  }
}

/**
 * Fetch loans for a specific user
 */
export async function fetchUserLoans(userId: string): Promise<Loan[]> {
  try {
    const { data: loans, error } = await loansTable()
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user loans:', error);
      throw error;
    }

    return loans || [];
  } catch (error) {
    console.error('Exception in fetchUserLoans:', error);
    throw error;
  }
}

/**
 * Fetch loans for a specific bank
 */
export async function fetchBankLoans(bankId: string): Promise<Loan[]> {
  try {
    // First, fetch all loans for this bank
    const { data: loans, error: loansError } = await loansTable()
      .select('*')
      .eq('bank_id', bankId)
      .order('created_at', { ascending: false });

    if (loansError) {
      console.error('Error fetching bank loans:', loansError);
      throw loansError;
    }

    if (!loans || loans.length === 0) {
      return [];
    }

    // Enhance loans with borrower information
    const enhancedLoans = await Promise.all(
      loans.map(async (loan) => {
        if (loan.user_id) {
          // Fetch borrower profile
          const { data: profile, error: profileError } = await profilesTable()
            .select('name, email, kyc_status, trust_score')
            .eq('id', loan.user_id)
            .maybeSingle();

          if (!profileError && profile) {
            return {
              ...loan,
              borrower: {
                name: profile.name,
                email: profile.email,
                kyc_status: profile.kyc_status,
                trust_score: profile.trust_score
              }
            } as Loan;
          }
        }
        
        // Return the loan without borrower info if we couldn't fetch it
        return {
          ...loan,
          borrower: {
            name: 'Unknown Borrower',
            email: 'No email'
          }
        } as Loan;
      })
    );

    return enhancedLoans;
  } catch (error) {
    console.error('Exception in fetchBankLoans:', error);
    throw error;
  }
}

/**
 * Get loan statistics 
 */
export function getLoanStatistics(loans: Loan[]) {
  const totalLoans = loans.length;
  const totalAmount = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
  const averageInterestRate = loans.length > 0 
    ? loans.reduce((sum, loan) => sum + Number(loan.interest_rate || 0), 0) / loans.length 
    : 0;
  
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  const activeLoans = loans.filter(loan => loan.status === 'active').length;
  const completedLoans = loans.filter(loan => loan.status === 'completed').length;
  
  return {
    totalLoans,
    totalAmount,
    averageInterestRate,
    pendingLoans,
    activeLoans,
    completedLoans
  };
}
