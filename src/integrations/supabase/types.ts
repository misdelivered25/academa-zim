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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assignment_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_hours: number | null
          id: string
          subject: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_hours?: number | null
          id?: string
          subject?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_hours?: number | null
          id?: string
          subject?: string | null
          title?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          ai_analysis: Json | null
          course_id: string | null
          created_at: string | null
          description: string | null
          difficulty_rating: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          course_name: string
          created_at: string | null
          id: string
          semester: string | null
          user_id: string | null
        }
        Insert: {
          course_name: string
          created_at?: string | null
          id?: string
          semester?: string | null
          user_id?: string | null
        }
        Update: {
          course_name?: string
          created_at?: string | null
          id?: string
          semester?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          author: string | null
          category: string
          created_at: string | null
          description: string | null
          downloads: number | null
          file_path: string | null
          id: string
          is_public: boolean | null
          subject: string | null
          title: string
          type: string
          university: string | null
          uploaded_by: string | null
          url: string | null
          views: number | null
        }
        Insert: {
          author?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_path?: string | null
          id?: string
          is_public?: boolean | null
          subject?: string | null
          title: string
          type: string
          university?: string | null
          uploaded_by?: string | null
          url?: string | null
          views?: number | null
        }
        Update: {
          author?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_path?: string | null
          id?: string
          is_public?: boolean | null
          subject?: string | null
          title?: string
          type?: string
          university?: string | null
          uploaded_by?: string | null
          url?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "library_items_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          phone_number: string | null
          student_email: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          phone_number?: string | null
          student_email?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          student_email?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          options: Json | null
          points: number | null
          question_text: string
          question_type: string | null
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          options?: Json | null
          points?: number | null
          question_text: string
          question_type?: string | null
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          options?: Json | null
          points?: number | null
          question_text?: string
          question_type?: string | null
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_minutes: number | null
          id: string
          passing_score: number | null
          title: string
          total_questions: number | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          passing_score?: number | null
          title: string
          total_questions?: number | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          passing_score?: number | null
          title?: string
          total_questions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_reminders: {
        Row: {
          assignment_id: string | null
          course_id: string | null
          created_at: string | null
          id: string
          is_sent: boolean | null
          message: string | null
          reminder_time: string
          reminder_type: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          message?: string | null
          reminder_time: string
          reminder_type: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          message?: string | null
          reminder_time?: string
          reminder_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_reminders_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_reminders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          course_id: string | null
          created_at: string | null
          hours: number | null
          id: string
          session_date: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          hours?: number | null
          id?: string
          session_date?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          hours?: number | null
          id?: string
          session_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zim_university_courses: {
        Row: {
          course_code: string | null
          course_name: string
          created_at: string | null
          department: string | null
          description: string | null
          faculty: string | null
          id: string
          level: string | null
          university_name: string
        }
        Insert: {
          course_code?: string | null
          course_name: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          faculty?: string | null
          id?: string
          level?: string | null
          university_name: string
        }
        Update: {
          course_code?: string | null
          course_name?: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          faculty?: string | null
          id?: string
          level?: string | null
          university_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_library_downloads: {
        Args: { item_id: string }
        Returns: undefined
      }
      increment_library_views: {
        Args: { item_id: string }
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
