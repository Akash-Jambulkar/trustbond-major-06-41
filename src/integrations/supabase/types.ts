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
          created_at: string
          email: string | null
          id: string
          kyc_status: string | null
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
          created_at?: string
          email?: string | null
          id: string
          kyc_status?: string | null
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
          created_at?: string
          email?: string | null
          id?: string
          kyc_status?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
