import { supabase } from "@/lib/supabase";

// Bank registration types
export interface BankRegistration {
  id: string;
  name: string;
  email: string;
  license_number: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string | null;
  address?: string;
  contact_number?: string;
  website?: string;
  document_hash?: string;
  registration_fee?: string;
}

// Transaction types
export interface Transaction {
  id: string;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  value: string;
  gas_used: string;
  transaction_type: 'kyc_verification' | 'loan_creation' | 'loan_repayment' | 'bank_registration';
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  block_number?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

// KYC document types
export interface KYCDocument {
  id: string;
  user_id: string;
  document_hash: string;
  document_type: string;
  transaction_hash?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verified_by?: string[];
  created_at: string;
  updated_at: string | null;
}

// User role types
export interface UserRole {
  id: string;
  user_id: string;
  email: string;
  role: 'user' | 'bank' | 'admin';
  created_at: string;
  full_name?: string;
}

// Database service for bank registrations
export const bankRegistrationService = {
  async getAllBankRegistrations(): Promise<BankRegistration[]> {
    const { data, error } = await supabase
      .from('bank_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching bank registrations:", error);
      throw error;
    }

    return data || [];
  },

  async getBankRegistrationById(id: string): Promise<BankRegistration | null> {
    const { data, error } = await supabase
      .from('bank_registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching bank registration with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async createBankRegistration(bankData: Omit<BankRegistration, 'id' | 'created_at' | 'updated_at'>): Promise<BankRegistration> {
    const { data, error } = await supabase
      .from('bank_registrations')
      .insert([{ ...bankData, status: 'pending' }])
      .select()
      .single();

    if (error) {
      console.error("Error creating bank registration:", error);
      throw error;
    }

    return data;
  },

  async updateBankRegistrationStatus(id: string, status: 'approved' | 'rejected'): Promise<BankRegistration> {
    const { data, error } = await supabase
      .from('bank_registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating bank registration status for id ${id}:`, error);
      throw error;
    }

    return data;
  }
};

// Database service for transactions
export const transactionService = {
  async getAllTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data || [];
  },

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw error;
    }

    return data || [];
  },

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }

    return data;
  },

  async updateTransactionStatus(transactionHash: string, status: 'confirmed' | 'failed', blockNumber?: string): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update({ 
        status, 
        block_number: blockNumber,
        updated_at: new Date().toISOString() 
      })
      .eq('transaction_hash', transactionHash)
      .select()
      .single();

    if (error) {
      console.error(`Error updating transaction status for hash ${transactionHash}:`, error);
      throw error;
    }

    return data;
  }
};

// Database service for KYC documents
export const kycDocumentService = {
  async getAllKYCDocuments(): Promise<KYCDocument[]> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching KYC documents:", error);
      throw error;
    }

    return data || [];
  },

  async getKYCDocumentsByUser(userId: string): Promise<KYCDocument[]> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching KYC documents for user ${userId}:`, error);
      throw error;
    }

    return data || [];
  },

  async createKYCDocument(documentData: Omit<KYCDocument, 'id' | 'created_at' | 'updated_at' | 'verified_by'>): Promise<KYCDocument> {
    const { data, error } = await supabase
      .from('kyc_documents')
      .insert([{ ...documentData, verification_status: 'pending', verified_by: [] }])
      .select()
      .single();

    if (error) {
      console.error("Error creating KYC document:", error);
      throw error;
    }

    return data;
  },

  async updateKYCDocumentStatus(id: string, status: 'verified' | 'rejected', verifier: string): Promise<KYCDocument> {
    const { data: existingDoc } = await supabase
      .from('kyc_documents')
      .select('verified_by')
      .eq('id', id)
      .single();

    let verifiedBy = existingDoc?.verified_by || [];
    if (!verifiedBy.includes(verifier)) {
      verifiedBy.push(verifier);
    }

    const { data, error } = await supabase
      .from('kyc_documents')
      .update({ 
        verification_status: status, 
        verified_by: verifiedBy,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating KYC document status for id ${id}:`, error);
      throw error;
    }

    return data;
  }
};

// Database service for user roles
export const userRoleService = {
  async getAllUserRoles(): Promise<UserRole[]> {
    try {
      // Use a simpler query that doesn't use complex joins which could cause parsing errors
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_role_assignments')
        .select('id, user_id, role, assigned_at')
        .order('assigned_at', { ascending: false });

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        throw rolesError;
      }

      // Get a list of unique user_ids to fetch their profile data
      const userIds = rolesData?.map(role => role.user_id) || [];
      
      if (userIds.length === 0) {
        return [];
      }

      // Fetch profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, name')
        .in('user_id', userIds);

      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        throw profilesError;
      }

      // Create a map for quick lookups
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Combine the data
      return (rolesData || []).map(role => {
        const profile = profileMap.get(role.user_id) || {};
        return {
          id: role.id,
          user_id: role.user_id,
          email: profile.email || '',
          full_name: profile.name || '',
          role: role.role,
          created_at: role.assigned_at
        };
      });
    } catch (error) {
      console.error("Error in getAllUserRoles:", error);
      throw error;
    }
  },

  async getUserRoleById(userId: string): Promise<UserRole | null> {
    try {
      // Fetch role data
      const { data: roleData, error: roleError } = await supabase
        .from('user_role_assignments')
        .select('id, user_id, role, assigned_at')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        if (roleError.code === 'PGRST116') { // No rows returned
          return null;
        }
        console.error(`Error fetching user role for user ${userId}:`, roleError);
        throw roleError;
      }

      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error(`Error fetching profile for user ${userId}:`, profileError);
        throw profileError;
      }

      return {
        id: roleData.id,
        user_id: roleData.user_id,
        email: profileData?.email || '',
        full_name: profileData?.name || '',
        role: roleData.role,
        created_at: roleData.assigned_at
      };
    } catch (error) {
      console.error(`Error in getUserRoleById for ${userId}:`, error);
      throw error;
    }
  },

  async createUserRole(userData: Omit<UserRole, 'id' | 'created_at'>): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .insert([{
        user_id: userData.user_id,
        role: userData.role
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating user role:", error);
      throw error;
    }

    return {
      id: data.id,
      user_id: data.user_id,
      email: userData.email,
      full_name: userData.full_name,
      role: data.role,
      created_at: data.assigned_at
    };
  },

  async updateUserRole(userId: string, role: 'user' | 'bank' | 'admin'): Promise<UserRole> {
    const { data, error } = await supabase
      .from('user_role_assignments')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating role for user ${userId}:`, error);
      throw error;
    }

    // Fetch user email after update
    const { data: profileData } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('user_id', userId)
      .single();

    return {
      id: data.id,
      user_id: data.user_id,
      email: profileData?.email || '',
      full_name: profileData?.name || '',
      role: data.role,
      created_at: data.assigned_at
    };
  }
};
