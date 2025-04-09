export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blockchain_transactions: {
        Row: {
          created_at: string | null
          data_hash: string
          from_address: string
          gas_price: string
          gas_used: string
          hash: string
          id: string
          metadata: Json | null
          timestamp: number
          to_address: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data_hash: string
          from_address: string
          gas_price: string
          gas_used: string
          hash: string
          id?: string
          metadata?: Json | null
          timestamp: number
          to_address: string
          type: string
        }
        Update: {
          created_at?: string | null
          data_hash?: string
          from_address?: string
          gas_price?: string
          gas_used?: string
          hash?: string
          id?: string
          metadata?: Json | null
          timestamp?: number
          to_address?: string
          type?: string
        }
        Relationships: []
      }
      kyc_details: {
        Row: {
          aadhar_number: string
          address: string
          created_at: string | null
          data_hash: string | null
          edit_request: boolean | null
          full_name: string
          id: string
          phone_number: string
          status: string
          transaction_hash: string | null
          trust_score: number | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          aadhar_number: string
          address: string
          created_at?: string | null
          data_hash?: string | null
          edit_request?: boolean | null
          full_name: string
          id?: string
          phone_number: string
          status?: string
          transaction_hash?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          aadhar_number?: string
          address?: string
          created_at?: string | null
          data_hash?: string | null
          edit_request?: boolean | null
          full_name?: string
          id?: string
          phone_number?: string
          status?: string
          transaction_hash?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          status: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          status?: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          status?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          amount: number
          approved_at: string | null
          bank_id: string
          created_at: string | null
          duration: number
          id: string
          purpose: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          bank_id: string
          created_at?: string | null
          duration: number
          id?: string
          purpose: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          bank_id?: string
          created_at?: string | null
          duration?: number
          id?: string
          purpose?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_score_history: {
        Row: {
          blockchain_tx_hash: string | null
          created_at: string
          id: string
          parameters_id: string
          risk_category: string
          trust_score: number
          user_id: string
        }
        Insert: {
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          parameters_id: string
          risk_category: string
          trust_score: number
          user_id: string
        }
        Update: {
          blockchain_tx_hash?: string | null
          created_at?: string
          id?: string
          parameters_id?: string
          risk_category?: string
          trust_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_score_history_parameters_id_fkey"
            columns: ["parameters_id"]
            isOneToOne: false
            referencedRelation: "trust_score_parameters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trust_score_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_score_parameters: {
        Row: {
          cibil_score: number
          created_at: string
          credit_utilization: number
          current_family_income: number
          debt_to_income_ratio: number
          education_level: number
          employment_stability: number
          family_dependents: number
          id: string
          insurance_premium_payments: number
          itr_paid: number
          litigation_history: number
          loan_inquiry_frequency: number
          location_cost_of_living: number
          pending_loans: number
          savings_fixed_deposits: number
          tax_compliance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cibil_score: number
          created_at?: string
          credit_utilization: number
          current_family_income: number
          debt_to_income_ratio: number
          education_level: number
          employment_stability: number
          family_dependents: number
          id?: string
          insurance_premium_payments: number
          itr_paid: number
          litigation_history: number
          loan_inquiry_frequency: number
          location_cost_of_living: number
          pending_loans: number
          savings_fixed_deposits: number
          tax_compliance: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cibil_score?: number
          created_at?: string
          credit_utilization?: number
          current_family_income?: number
          debt_to_income_ratio?: number
          education_level?: number
          employment_stability?: number
          family_dependents?: number
          id?: string
          insurance_premium_payments?: number
          itr_paid?: number
          litigation_history?: number
          loan_inquiry_frequency?: number
          location_cost_of_living?: number
          pending_loans?: number
          savings_fixed_deposits?: number
          tax_compliance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_score_parameters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_metadata: {
        Row: {
          created_at: string | null
          id: string
          is_verified: boolean | null
          role: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_verified?: boolean | null
          role?: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_metadata_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_balances: {
        Row: {
          balance: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "bank_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      bank_users: {
        Row: {
          email: string | null
          id: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          role?: never
        }
        Update: {
          email?: string | null
          id?: string | null
          role?: never
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_trust_score: {
        Args: {
          user_uuid: string
          cibil_score: number
          debt_to_income_ratio: number
          pending_loans: number
          credit_utilization: number
          itr_paid: number
          current_family_income: number
          employment_stability: number
          savings_fixed_deposits: number
          loan_inquiry_frequency: number
          insurance_premium_payments: number
          litigation_history: number
          tax_compliance: number
          education_level: number
          location_cost_of_living: number
          family_dependents: number
        }
        Returns: {
          trust_score: number
          risk_category: string
          parameters_id: string
          history_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
