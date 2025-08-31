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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_replies: {
        Row: {
          comment_id: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_reply_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_replies_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "comment_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          quote_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          quote_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          quote_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorited_quotes: {
        Row: {
          created_at: string
          id: string
          quote_author: string | null
          quote_category: string | null
          quote_content: string
          quote_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quote_author?: string | null
          quote_category?: string | null
          quote_content: string
          quote_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quote_author?: string | null
          quote_category?: string | null
          quote_content?: string
          quote_id?: string
          user_id?: string
        }
        Relationships: []
      }
      liked_quotes: {
        Row: {
          created_at: string
          id: string
          interaction_type: string
          quote_author: string | null
          quote_category: string | null
          quote_content: string
          quote_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interaction_type: string
          quote_author?: string | null
          quote_category?: string | null
          quote_content: string
          quote_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interaction_type?: string
          quote_author?: string | null
          quote_category?: string | null
          quote_content?: string
          quote_id?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          is_hidden: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reply_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "comment_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          id: string
          quotes_favorited: number | null
          quotes_liked: number | null
          quotes_loved: number | null
          quotes_posted: number | null
          quotes_shared: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          quotes_favorited?: number | null
          quotes_liked?: number | null
          quotes_loved?: number | null
          quotes_posted?: number | null
          quotes_shared?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          quotes_favorited?: number | null
          quotes_liked?: number | null
          quotes_loved?: number | null
          quotes_posted?: number | null
          quotes_shared?: number | null
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
      increment_user_stat: {
        Args: { stat_name: string; user_id_param: string }
        Returns: undefined
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
    Enums: {},
  },
} as const
