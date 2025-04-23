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
      documents: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_document_submissions: {
        Row: {
          blockchain_tx_hash: string | null
          document_hash: string
          document_type: string
          id: string
          rejection_reason: string | null
          submitted_at: string | null
          user_id: string
          verification_status: string
          verification_tx_hash: string | null
          verified_at: string | null
          verifier_address: string | null
          wallet_address: string | null
        }
        Insert: {
          blockchain_tx_hash?: string | null
          document_hash: string
          document_type: string
          id?: string
          rejection_reason?: string | null
          submitted_at?: string | null
          user_id: string
          verification_status?: string
          verification_tx_hash?: string | null
          verified_at?: string | null
          verifier_address?: string | null
          wallet_address?: string | null
        }
        Update: {
          blockchain_tx_hash?: string | null
          document_hash?: string
          document_type?: string
          id?: string
          rejection_reason?: string | null
          submitted_at?: string | null
          user_id?: string
          verification_status?: string
          verification_tx_hash?: string | null
          verified_at?: string | null
          verifier_address?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_hash: string
          document_type: string
          id: string
          updated_at: string | null
          user_id: string
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          document_hash: string
          document_type: string
          id?: string
          updated_at?: string | null
          user_id: string
          verification_status?: string
        }
        Update: {
          created_at?: string | null
          document_hash?: string
          document_type?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      kyc_verification_consensus: {
        Row: {
          consensus_reached: boolean | null
          id: string
          kyc_submission_id: string | null
          transaction_hash: string | null
          verification_status: string
          verification_timestamp: string | null
          verifier_bank_id: string | null
        }
        Insert: {
          consensus_reached?: boolean | null
          id?: string
          kyc_submission_id?: string | null
          transaction_hash?: string | null
          verification_status?: string
          verification_timestamp?: string | null
          verifier_bank_id?: string | null
        }
        Update: {
          consensus_reached?: boolean | null
          id?: string
          kyc_submission_id?: string | null
          transaction_hash?: string | null
          verification_status?: string
          verification_timestamp?: string | null
          verifier_bank_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verification_consensus_kyc_submission_id_fkey"
            columns: ["kyc_submission_id"]
            isOneToOne: false
            referencedRelation: "kyc_document_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_events: {
        Row: {
          amount: number | null
          created_at: string | null
          event_type: string
          id: string
          loan_id: string | null
          metadata: Json | null
          transaction_hash: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          event_type: string
          id?: string
          loan_id?: string | null
          metadata?: Json | null
          transaction_hash?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          event_type?: string
          id?: string
          loan_id?: string | null
          metadata?: Json | null
          transaction_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_events_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          amount: number
          bank_id: string | null
          blockchain_address: string | null
          created_at: string | null
          id: string
          interest_rate: number
          purpose: string | null
          repaid_amount: number | null
          status: string
          term_months: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_id?: string | null
          blockchain_address?: string | null
          created_at?: string | null
          id?: string
          interest_rate: number
          purpose?: string | null
          repaid_amount?: number | null
          status?: string
          term_months: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_id?: string | null
          blockchain_address?: string | null
          created_at?: string | null
          id?: string
          interest_rate?: number
          purpose?: string | null
          repaid_amount?: number | null
          status?: string
          term_months?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bank_registration_status: string | null
          blockchain_verified: boolean | null
          created_at: string
          email: string | null
          id: string
          kyc_status: string | null
          last_kyc_submission: string | null
          mfa_enabled: boolean | null
          name: string | null
          phone: string | null
          role: string
          trust_score: number | null
          updated_at: string
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          address?: string | null
          bank_registration_status?: string | null
          blockchain_verified?: boolean | null
          created_at?: string
          email?: string | null
          id: string
          kyc_status?: string | null
          last_kyc_submission?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          phone?: string | null
          role: string
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          address?: string | null
          bank_registration_status?: string | null
          blockchain_verified?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          kyc_status?: string | null
          last_kyc_submission?: string | null
          mfa_enabled?: boolean | null
          name?: string | null
          phone?: string | null
          role?: string
          trust_score?: number | null
          updated_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          bank_id: string | null
          created_at: string | null
          from_address: string | null
          id: string
          status: string
          to_address: string | null
          transaction_hash: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          bank_id?: string | null
          created_at?: string | null
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          bank_id?: string | null
          created_at?: string | null
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_function_exists: {
        Args: { function_name: string }
        Returns: boolean
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_helper_functions: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_profile_for_user: {
        Args: {
          user_id_param: string
          email_param: string
          name_param: string
          role_param: string
          mfa_enabled_param: boolean
          kyc_status_param: string
        }
        Returns: Json
      }
      create_table: {
        Args: { table_name: string; table_query: string }
        Returns: boolean
      }
      create_table_helper_functions: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_uuid_extension: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_uuid_extension_function: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      execute_sql: {
        Args: { sql_command: string }
        Returns: boolean
      }
      function_exists: {
        Args: { function_name: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "bank" | "admin"
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
    Enums: {
      user_role: ["user", "bank", "admin"],
    },
  },
} as const
