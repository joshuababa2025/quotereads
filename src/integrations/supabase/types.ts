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
      blog_posts: {
        Row: {
          additional_images: string[] | null
          author: string | null
          category: string | null
          comments: number | null
          content: string
          created_at: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          status: string | null
          title: string
          views: number | null
        }
        Insert: {
          additional_images?: string[] | null
          author?: string | null
          category?: string | null
          comments?: number | null
          content: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title: string
          views?: number | null
        }
        Update: {
          additional_images?: string[] | null
          author?: string | null
          category?: string | null
          comments?: number | null
          content?: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title?: string
          views?: number | null
        }
        Relationships: []
      }
      book_reviews: {
        Row: {
          book_id: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          review_text: string | null
          reviewer_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          book_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          amazon_link: string | null
          author: string
          buy_link: string | null
          categories: string | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          id: string
          is_on_sale: boolean | null
          isbn: string | null
          language: string | null
          pages: number | null
          price: number | null
          product_link: string | null
          published_date: string | null
          rating: number | null
          rating_count: number | null
          review_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          amazon_link?: string | null
          author: string
          buy_link?: string | null
          categories?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_on_sale?: boolean | null
          isbn?: string | null
          language?: string | null
          pages?: number | null
          price?: number | null
          product_link?: string | null
          published_date?: string | null
          rating?: number | null
          rating_count?: number | null
          review_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          amazon_link?: string | null
          author?: string
          buy_link?: string | null
          categories?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_on_sale?: boolean | null
          isbn?: string | null
          language?: string | null
          pages?: number | null
          price?: number | null
          product_link?: string | null
          published_date?: string | null
          rating?: number | null
          rating_count?: number | null
          review_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          call_to_action: string | null
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          call_to_action?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          call_to_action?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      category_images: {
        Row: {
          category: string
          created_at: string | null
          file_size: number | null
          id: string
          image_name: string | null
          image_url: string
          is_active: boolean | null
          mime_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_name?: string | null
          image_url: string
          is_active?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_name?: string | null
          image_url?: string
          is_active?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          author: string
          book_id: string | null
          category: string
          content: string | null
          cover_image: string | null
          created_at: string | null
          description: string
          id: string
          is_featured: boolean | null
          published_date: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author: string
          book_id?: string | null
          category: string
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_featured?: boolean | null
          published_date?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author?: string
          book_id?: string | null
          category?: string
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_featured?: boolean | null
          published_date?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
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
      community_post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_name: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_flagged: boolean | null
          post_type: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          post_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          post_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discussion_comments: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      earn_money_tasks: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          reward_amount: number
          task_name: string
          task_type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          reward_amount: number
          task_name: string
          task_type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          reward_amount?: number
          task_name?: string
          task_type?: string
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
      giveaway_packages: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_discussions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          comments_count: number | null
          content: string
          created_at: string | null
          group_id: string
          id: string
          image_urls: string[] | null
          likes_count: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_urls: string[] | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          comments_count?: number | null
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          image_urls?: string[] | null
          likes_count?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_urls?: string[] | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          image_urls?: string[] | null
          likes_count?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "group_discussions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_meetings: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          end_time: string | null
          google_maps_link: string | null
          group_id: string
          id: string
          meeting_link: string | null
          meeting_type: string
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          google_maps_link?: string | null
          group_id: string
          id?: string
          meeting_link?: string | null
          meeting_type: string
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          google_maps_link?: string | null
          group_id?: string
          id?: string
          meeting_link?: string | null
          meeting_type?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_meetings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_notifications: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          group_id: string
          id: string
          message: string
          read: boolean | null
          sender_id: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          group_id: string
          id?: string
          message: string
          read?: boolean | null
          sender_id: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          group_id?: string
          id?: string
          message?: string
          read?: boolean | null
          sender_id?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_notifications_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "group_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_notifications_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          auto_approve_posts: boolean | null
          bio: string | null
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          profile_image: string | null
          require_post_approval: boolean | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          auto_approve_posts?: boolean | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          profile_image?: string | null
          require_post_approval?: boolean | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          auto_approve_posts?: boolean | null
          bio?: string | null
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          profile_image?: string | null
          require_post_approval?: boolean | null
          tags?: string[] | null
          type?: string | null
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
      meeting_attendance: {
        Row: {
          created_at: string
          id: string
          meeting_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string
          status?: string
          updated_at?: string
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
      most_read: {
        Row: {
          author: string
          chapter_id: string | null
          created_at: string | null
          id: string
          title: string
          view_count: number | null
          week_start: string | null
        }
        Insert: {
          author: string
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          title: string
          view_count?: number | null
          week_start?: string | null
        }
        Update: {
          author?: string
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          title?: string
          view_count?: number | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "most_read_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
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
      package_addons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          package_id: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          package_id: string
          price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          package_id?: string
          price?: number
        }
        Relationships: []
      }
      package_orders: {
        Row: {
          created_at: string
          id: string
          package_id: string
          personal_info: Json
          reason: string
          selected_addons: string[] | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id: string
          personal_info: Json
          reason: string
          selected_addons?: string[] | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string
          personal_info?: Json
          reason?: string
          selected_addons?: string[] | null
          status?: string
          total_amount?: number
          updated_at?: string
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
      quote_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          quote_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_comments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_likes: {
        Row: {
          created_at: string | null
          id: string
          quote_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_likes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author: string | null
          background_image: string | null
          category: string | null
          comments: number | null
          content: string
          created_at: string
          id: string
          is_hidden: boolean | null
          is_quote_of_day: boolean | null
          likes: number | null
          quote_of_day_date: string | null
          shares: number | null
          special_collection: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author?: string | null
          background_image?: string | null
          category?: string | null
          comments?: number | null
          content: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          is_quote_of_day?: boolean | null
          likes?: number | null
          quote_of_day_date?: string | null
          shares?: number | null
          special_collection?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author?: string | null
          background_image?: string | null
          category?: string | null
          comments?: number | null
          content?: string
          created_at?: string
          id?: string
          is_hidden?: boolean | null
          is_quote_of_day?: boolean | null
          likes?: number | null
          quote_of_day_date?: string | null
          shares?: number | null
          special_collection?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
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
      shop_products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          featured_image: string | null
          id: string
          images: string[] | null
          launch_date: string | null
          name: string
          price: number
          status: string | null
          stock: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          launch_date?: string | null
          name: string
          price: number
          status?: string | null
          stock?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          id?: string
          images?: string[] | null
          launch_date?: string | null
          name?: string
          price?: number
          status?: string | null
          stock?: number | null
        }
        Relationships: []
      }
      signups: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
        }
        Relationships: []
      }
      support_options: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean | null
          option_name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          option_name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          option_name?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          category_path: string
          color_class: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category_path: string
          color_class: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category_path?: string
          color_class?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      user_earnings: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          money_earned: number
          points_earned: number
          status: string
          task_id: string
          task_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          money_earned?: number
          points_earned?: number
          status?: string
          task_id: string
          task_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          money_earned?: number
          points_earned?: number
          status?: string
          task_id?: string
          task_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          id: string
          points: number
          rank_level: Database["public"]["Enums"]["rank_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          points?: number
          rank_level?: Database["public"]["Enums"]["rank_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          points?: number
          rank_level?: Database["public"]["Enums"]["rank_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_stories: {
        Row: {
          author_name: string | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_anonymous: boolean | null
          is_approved: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string | null
          id: string
          reward_earned: number
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          reward_earned: number
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          reward_earned?: number
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_username: {
        Args: { base_name: string }
        Returns: string
      }
      get_category_images: {
        Args: { category_name: string }
        Returns: {
          created_at: string
          id: string
          image_name: string
          image_url: string
        }[]
      }
      get_random_category_image: {
        Args: { category_name: string }
        Returns: {
          id: string
          image_name: string
          image_url: string
        }[]
      }
      increment_chapter_views: {
        Args: { chapter_uuid: string }
        Returns: undefined
      }
      increment_user_stat: {
        Args: { stat_name: string; user_id_param: string }
        Returns: undefined
      }
      update_most_read: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      rank_level: "silver" | "gold" | "platinum"
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
      rank_level: ["silver", "gold", "platinum"],
    },
  },
} as const
