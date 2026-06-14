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
      announcements: {
        Row: {
          audience: string
          body: string
          course_id: string | null
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          published_at: string
          title: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          audience?: string
          body: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          title: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          audience?: string
          body?: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          published_at?: string
          title?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      api_limits: {
        Row: {
          endpoint: string
          last_request: string | null
          request_count: number | null
          user_id: string
        }
        Insert: {
          endpoint: string
          last_request?: string | null
          request_count?: number | null
          user_id: string
        }
        Update: {
          endpoint?: string
          last_request?: string | null
          request_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      app_data: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assignment_attachments: {
        Row: {
          assignment_id: string
          created_at: string
          external_url: string | null
          id: string
          label: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          external_url?: string | null
          id?: string
          label: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          external_url?: string | null
          id?: string
          label?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_attachments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_checklist_items: {
        Row: {
          assignment_id: string
          completed: boolean
          created_at: string
          id: string
          label: string
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          completed?: boolean
          created_at?: string
          id?: string
          label: string
          position?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          completed?: boolean
          created_at?: string
          id?: string
          label?: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_checklist_items_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_progress: {
        Row: {
          assignment_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_progress_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
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
          file_name: string | null
          file_path: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_rating?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          file_name?: string | null
          file_path?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
      campus_buildings: {
        Row: {
          category: string | null
          contact: string | null
          created_at: string
          description: string | null
          hours: string | null
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          name: string
          university_id: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          university_id: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact?: string | null
          created_at?: string
          description?: string | null
          hours?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campus_buildings_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          community_type: string
          course_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_private: boolean
          name: string
          slug: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          community_type?: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean
          name: string
          slug: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          community_type?: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_private?: boolean
          name?: string
          slug?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communities_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          member_role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          member_role?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          member_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_replies: {
        Row: {
          author_id: string
          body: string
          community_id: string
          created_at: string
          id: string
          parent_reply_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          community_id: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          community_id?: string
          created_at?: string
          id?: string
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_replies_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "community_post_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          body: string | null
          community_id: string
          created_at: string
          id: string
          is_locked: boolean
          is_pinned: boolean
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body?: string | null
          community_id: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string | null
          community_id?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          is_pinned?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      content_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
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
      library_bookmarks: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_bookmarks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "library_resources"
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
      library_resources: {
        Row: {
          access_type: string | null
          course_tag: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_broken: boolean
          is_open_access: boolean
          is_verified: boolean
          last_checked_at: string | null
          resource_type: string | null
          subject: string | null
          thumbnail_url: string | null
          title: string
          university_id: string | null
          updated_at: string
          url: string
        }
        Insert: {
          access_type?: string | null
          course_tag?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_broken?: boolean
          is_open_access?: boolean
          is_verified?: boolean
          last_checked_at?: string | null
          resource_type?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title: string
          university_id?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          access_type?: string | null
          course_tag?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_broken?: boolean
          is_open_access?: boolean
          is_verified?: boolean
          last_checked_at?: string | null
          resource_type?: string | null
          subject?: string | null
          thumbnail_url?: string | null
          title?: string
          university_id?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_resources_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          amount: string | null
          apply_url: string | null
          contact_email: string | null
          created_at: string
          deadline: string | null
          description: string | null
          eligibility: string | null
          id: string
          is_active: boolean
          location: string | null
          opportunity_type: string
          organization: string | null
          posted_by: string | null
          program: string | null
          title: string
          university_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: string | null
          apply_url?: string | null
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          opportunity_type: string
          organization?: string | null
          posted_by?: string | null
          program?: string | null
          title: string
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: string | null
          apply_url?: string | null
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          opportunity_type?: string
          organization?: string | null
          posted_by?: string | null
          program?: string | null
          title?: string
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_bookmarks: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          remind_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          remind_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          remind_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_bookmarks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
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
          is_admin: boolean
          phone_number: string | null
          student_email: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_admin?: boolean
          phone_number?: string | null
          student_email?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_admin?: boolean
          phone_number?: string | null
          student_email?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string | null
          id: string
          quiz_id: string
          score: number | null
          started_at: string | null
          status: string
          time_spent_minutes: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          quiz_id: string
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_minutes?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          quiz_id?: string
          score?: number | null
          started_at?: string | null
          status?: string
          time_spent_minutes?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
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
      security_audit_log: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          operation: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          operation: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          operation?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      study_plan_items: {
        Row: {
          assignment_id: string | null
          completed: boolean
          completed_at: string | null
          course_id: string | null
          created_at: string
          day_of_week: number
          description: string | null
          duration_minutes: number
          id: string
          plan_id: string
          position: number
          start_time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_id?: string | null
          completed?: boolean
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          day_of_week: number
          description?: string | null
          duration_minutes?: number
          id?: string
          plan_id: string
          position?: number
          start_time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string | null
          completed?: boolean
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          duration_minutes?: number
          id?: string
          plan_id?: string
          position?: number
          start_time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_items_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_items_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "study_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          ai_summary: string | null
          created_at: string
          id: string
          source_model: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          source_model?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          source_model?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
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
      universities: {
        Row: {
          city: string | null
          code: string
          created_at: string
          emergency_number: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          short_name: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          code: string
          created_at?: string
          emergency_number?: string | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          code?: string
          created_at?: string
          emergency_number?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          short_name?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      check_rate_limit: {
        Args: { max_requests: number; window_minutes: number }
        Returns: boolean
      }
      community_member_role: {
        Args: { _community: string; _user: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_library_downloads: {
        Args: { item_id: string }
        Returns: undefined
      }
      increment_library_views: { Args: { item_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_community_member: {
        Args: { _community: string; _user: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
