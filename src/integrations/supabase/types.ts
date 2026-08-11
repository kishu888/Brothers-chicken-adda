export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
          reason: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string | null
          business_name: string
          currency: string
          id: boolean
          phone: string | null
          stock_tolerance_kg: number
          target_margin_per_kg: number
          updated_at: string
          variable_cost_per_kg: number
          weight_unit: string
        }
        Insert: {
          address?: string | null
          business_name?: string
          currency?: string
          id?: boolean
          phone?: string | null
          stock_tolerance_kg?: number
          target_margin_per_kg?: number
          updated_at?: string
          variable_cost_per_kg?: number
          weight_unit?: string
        }
        Update: {
          address?: string | null
          business_name?: string
          currency?: string
          id?: boolean
          phone?: string | null
          stock_tolerance_kg?: number
          target_margin_per_kg?: number
          updated_at?: string
          variable_cost_per_kg?: number
          weight_unit?: string
        }
        Relationships: []
      }
      cash_days: {
        Row: {
          actual_cash: number | null
          business_date: string
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          opening_cash: number
          updated_at: string
          verified_online: number | null
        }
        Insert: {
          actual_cash?: number | null
          business_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          opening_cash?: number
          updated_at?: string
          verified_online?: number | null
        }
        Update: {
          actual_cash?: number | null
          business_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          opening_cash?: number
          updated_at?: string
          verified_online?: number | null
        }
        Relationships: []
      }
      chicken_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string
          doc_date: string | null
          file_name: string
          id: string
          invoice_number: string | null
          mime_type: string | null
          related_id: string | null
          related_type: string | null
          size_bytes: number | null
          storage_path: string
          supplier_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          doc_date?: string | null
          file_name: string
          id?: string
          invoice_number?: string | null
          mime_type?: string | null
          related_id?: string | null
          related_type?: string | null
          size_bytes?: number | null
          storage_path: string
          supplier_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          doc_date?: string | null
          file_name?: string
          id?: string
          invoice_number?: string | null
          mime_type?: string | null
          related_id?: string | null
          related_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          supplier_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          kind: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          kind?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          kind?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          business_date: string
          category_id: string | null
          category_name_snapshot: string
          client_key: string | null
          created_at: string
          created_by: string | null
          description: string | null
          document_id: string | null
          id: string
          invoice_number: string | null
          notes: string | null
          payee: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["record_status"]
          supplier_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount: number
          business_date: string
          category_id?: string | null
          category_name_snapshot: string
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payee?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["record_status"]
          supplier_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          business_date?: string
          category_id?: string | null
          category_name_snapshot?: string
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_id?: string | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payee?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["record_status"]
          supplier_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount_paid: number
          business_date: string
          cgst: number | null
          chicken_type_id: string | null
          client_key: string | null
          created_at: string
          created_by: string | null
          discount_per_kg: number
          document_id: string | null
          effective_rate: number | null
          gross_weight_kg: number
          gstin: string | null
          hsn: string | null
          id: string
          igst: number | null
          invoice_number: string | null
          listed_rate: number
          net_weight_kg: number | null
          notes: string | null
          other_charges: number
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          sgst: number | null
          status: Database["public"]["Enums"]["record_status"]
          supplier_id: string | null
          tare_weight_kg: number
          taxable_amount: number | null
          total_cost: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_paid?: number
          business_date: string
          cgst?: number | null
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          discount_per_kg?: number
          document_id?: string | null
          effective_rate?: number | null
          gross_weight_kg?: number
          gstin?: string | null
          hsn?: string | null
          id?: string
          igst?: number | null
          invoice_number?: string | null
          listed_rate?: number
          net_weight_kg?: number | null
          notes?: string | null
          other_charges?: number
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          sgst?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          supplier_id?: string | null
          tare_weight_kg?: number
          taxable_amount?: number | null
          total_cost?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_paid?: number
          business_date?: string
          cgst?: number | null
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          discount_per_kg?: number
          document_id?: string | null
          effective_rate?: number | null
          gross_weight_kg?: number
          gstin?: string | null
          hsn?: string | null
          id?: string
          igst?: number | null
          invoice_number?: string | null
          listed_rate?: number
          net_weight_kg?: number | null
          notes?: string | null
          other_charges?: number
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          sgst?: number | null
          status?: Database["public"]["Enums"]["record_status"]
          supplier_id?: string | null
          tare_weight_kg?: number
          taxable_amount?: number | null
          total_cost?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_chicken_type_id_fkey"
            columns: ["chicken_type_id"]
            isOneToOne: false
            referencedRelation: "chicken_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          business_date: string
          chicken_type_id: string | null
          client_key: string | null
          created_at: string
          created_by: string | null
          customer_name: string | null
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          rate_per_kg: number | null
          reversal_reason: string | null
          sold_at: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          upi_reference: string | null
          weight_kg: number
        }
        Insert: {
          amount: number
          business_date: string
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          rate_per_kg?: number | null
          reversal_reason?: string | null
          sold_at?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          upi_reference?: string | null
          weight_kg: number
        }
        Update: {
          amount?: number
          business_date?: string
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          rate_per_kg?: number | null
          reversal_reason?: string | null
          sold_at?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          upi_reference?: string | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_chicken_type_id_fkey"
            columns: ["chicken_type_id"]
            isOneToOne: false
            referencedRelation: "chicken_types"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_counts: {
        Row: {
          actual_closing_kg: number
          business_date: string
          chicken_type_id: string
          created_at: string
          created_by: string | null
          expected_closing_kg: number | null
          id: string
          note: string | null
          updated_at: string
        }
        Insert: {
          actual_closing_kg: number
          business_date: string
          chicken_type_id: string
          created_at?: string
          created_by?: string | null
          expected_closing_kg?: number | null
          id?: string
          note?: string | null
          updated_at?: string
        }
        Update: {
          actual_closing_kg?: number
          business_date?: string
          chicken_type_id?: string
          created_at?: string
          created_by?: string | null
          expected_closing_kg?: number | null
          id?: string
          note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_counts_chicken_type_id_fkey"
            columns: ["chicken_type_id"]
            isOneToOne: false
            referencedRelation: "chicken_types"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string
          gstin: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wastage: {
        Row: {
          business_date: string
          chicken_type_id: string | null
          client_key: string | null
          created_at: string
          created_by: string | null
          document_id: string | null
          estimated_cost: number
          id: string
          notes: string | null
          reason: string
          status: Database["public"]["Enums"]["record_status"]
          updated_at: string
          updated_by: string | null
          weight_kg: number
        }
        Insert: {
          business_date: string
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          estimated_cost?: number
          id?: string
          notes?: string | null
          reason?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          weight_kg: number
        }
        Update: {
          business_date?: string
          chicken_type_id?: string | null
          client_key?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string | null
          estimated_cost?: number
          id?: string
          notes?: string | null
          reason?: string
          status?: Database["public"]["Enums"]["record_status"]
          updated_at?: string
          updated_by?: string | null
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "wastage_chicken_type_id_fkey"
            columns: ["chicken_type_id"]
            isOneToOne: false
            referencedRelation: "chicken_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wastage_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      payment_method: "cash" | "online"
      record_status: "active" | "reversed" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      payment_method: ["cash", "online"],
      record_status: ["active", "reversed", "archived"],
    },
  },
} as const
