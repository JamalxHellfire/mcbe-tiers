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
      admin_sessions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          session_token: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          session_token: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          hashed_pin: string
          id: string
          last_login: string | null
          locked_until: string | null
          login_attempts: number | null
        }
        Insert: {
          created_at?: string | null
          hashed_pin: string
          id?: string
          last_login?: string | null
          locked_until?: string | null
          login_attempts?: number | null
        }
        Update: {
          created_at?: string | null
          hashed_pin?: string
          id?: string
          last_login?: string | null
          locked_until?: string | null
          login_attempts?: number | null
        }
        Relationships: []
      }
      banned_players: {
        Row: {
          banned_at: string | null
          id: string
          ign: string
          player_id: string | null
        }
        Insert: {
          banned_at?: string | null
          id?: string
          ign: string
          player_id?: string | null
        }
        Update: {
          banned_at?: string | null
          id?: string
          ign?: string
          player_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banned_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banned_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      gamemode_scores: {
        Row: {
          created_at: string | null
          display_tier: Database["public"]["Enums"]["tier_level"]
          gamemode: Database["public"]["Enums"]["game_mode"]
          id: string
          internal_tier: Database["public"]["Enums"]["tier_level"]
          player_id: string | null
          score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_tier: Database["public"]["Enums"]["tier_level"]
          gamemode: Database["public"]["Enums"]["game_mode"]
          id?: string
          internal_tier: Database["public"]["Enums"]["tier_level"]
          player_id?: string | null
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_tier?: Database["public"]["Enums"]["tier_level"]
          gamemode?: Database["public"]["Enums"]["game_mode"]
          id?: string
          internal_tier?: Database["public"]["Enums"]["tier_level"]
          player_id?: string | null
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gamemode_scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamemode_scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      player_index: {
        Row: {
          avatar_url: string | null
          device: Database["public"]["Enums"]["device_type"] | null
          global_points: number | null
          ign: string
          last_updated: string | null
          overall_rank: number | null
          player_id: string
          region: Database["public"]["Enums"]["player_region"] | null
          security_checksum: string | null
          tier_data: Json | null
        }
        Insert: {
          avatar_url?: string | null
          device?: Database["public"]["Enums"]["device_type"] | null
          global_points?: number | null
          ign: string
          last_updated?: string | null
          overall_rank?: number | null
          player_id: string
          region?: Database["public"]["Enums"]["player_region"] | null
          security_checksum?: string | null
          tier_data?: Json | null
        }
        Update: {
          avatar_url?: string | null
          device?: Database["public"]["Enums"]["device_type"] | null
          global_points?: number | null
          ign?: string
          last_updated?: string | null
          overall_rank?: number | null
          player_id?: string
          region?: Database["public"]["Enums"]["player_region"] | null
          security_checksum?: string | null
          tier_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "player_index_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "leaderboard_cache"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_index_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar_url: string | null
          banned: boolean | null
          created_at: string | null
          device: Database["public"]["Enums"]["device_type"] | null
          global_points: number | null
          id: string
          ign: string
          java_username: string | null
          overall_rank: number | null
          region: Database["public"]["Enums"]["player_region"] | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          avatar_url?: string | null
          banned?: boolean | null
          created_at?: string | null
          device?: Database["public"]["Enums"]["device_type"] | null
          global_points?: number | null
          id?: string
          ign: string
          java_username?: string | null
          overall_rank?: number | null
          region?: Database["public"]["Enums"]["player_region"] | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          avatar_url?: string | null
          banned?: boolean | null
          created_at?: string | null
          device?: Database["public"]["Enums"]["device_type"] | null
          global_points?: number | null
          id?: string
          ign?: string
          java_username?: string | null
          overall_rank?: number | null
          region?: Database["public"]["Enums"]["player_region"] | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_cache: {
        Row: {
          avatar_url: string | null
          banned: boolean | null
          created_at: string | null
          device: Database["public"]["Enums"]["device_type"] | null
          global_points: number | null
          id: string | null
          ign: string | null
          java_username: string | null
          overall_rank: number | null
          region: Database["public"]["Enums"]["player_region"] | null
          tier_data: Json | null
          updated_at: string | null
          uuid: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_assign_tier: {
        Args: {
          player_id: string
          game_mode: Database["public"]["Enums"]["game_mode"]
          tier_level: Database["public"]["Enums"]["tier_level"]
          tier_score: number
        }
        Returns: undefined
      }
      admin_ban_player: {
        Args: { player_id: string; player_ign: string }
        Returns: undefined
      }
      admin_create_player: {
        Args: {
          player_ign: string
          player_java_username?: string
          player_uuid?: string
          player_region?: Database["public"]["Enums"]["player_region"]
          player_device?: Database["public"]["Enums"]["device_type"]
          player_avatar_url?: string
        }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          overall_rank: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_delete_player: {
        Args: { player_id: string }
        Returns: undefined
      }
      admin_get_player_by_id: {
        Args: { player_id: string }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          overall_rank: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_player_by_ign: {
        Args: { player_ign: string }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          overall_rank: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      admin_get_player_tiers: {
        Args: { player_id: string }
        Returns: {
          id: string
          gamemode: Database["public"]["Enums"]["game_mode"]
          score: number
          internal_tier: Database["public"]["Enums"]["tier_level"]
          display_tier: Database["public"]["Enums"]["tier_level"]
          created_at: string
          updated_at: string
        }[]
      }
      admin_update_global_points: {
        Args: { player_id: string }
        Returns: undefined
      }
      admin_update_player: {
        Args: {
          player_id: string
          player_java_username?: string
          player_uuid?: string
          player_region?: Database["public"]["Enums"]["player_region"]
          player_device?: Database["public"]["Enums"]["device_type"]
          player_avatar_url?: string
        }
        Returns: undefined
      }
      assign_player_tier: {
        Args: {
          player_id: string
          game_mode: Database["public"]["Enums"]["game_mode"]
          tier_level: Database["public"]["Enums"]["tier_level"]
        }
        Returns: number
      }
      check_user_auth: {
        Args: { required_role?: string }
        Returns: boolean
      }
      generate_security_checksum: {
        Args: { player_data: Json }
        Returns: string
      }
      get_client_ip: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_gamemode_leaderboard: {
        Args: { game_mode: Database["public"]["Enums"]["game_mode"] }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          tier: Database["public"]["Enums"]["tier_level"]
          score: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_player_by_ign: {
        Args: { player_ign: string }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          overall_rank: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_players_by_gamemode: {
        Args: { game_mode: Database["public"]["Enums"]["game_mode"] }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          overall_rank: number
          banned: boolean
          created_at: string
          updated_at: string
          tier: Database["public"]["Enums"]["tier_level"]
          score: number
        }[]
      }
      get_ranked_leaderboard: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          ign: string
          java_username: string
          uuid: string
          avatar_url: string
          region: Database["public"]["Enums"]["player_region"]
          device: Database["public"]["Enums"]["device_type"]
          global_points: number
          player_rank: number
          banned: boolean
          created_at: string
          updated_at: string
        }[]
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      recalculate_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_leaderboard_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_player_info: {
        Args: {
          player_id: string
          player_java_username?: string
          player_uuid?: string
          player_region?: Database["public"]["Enums"]["player_region"]
          player_device?: Database["public"]["Enums"]["device_type"]
          player_avatar_url?: string
        }
        Returns: undefined
      }
      verify_admin_pin: {
        Args: { input_pin: string }
        Returns: {
          admin_id: string
          session_token: string
        }[]
      }
    }
    Enums: {
      device_type: "Mobile" | "PC" | "Console"
      game_mode:
        | "Crystal"
        | "Sword"
        | "SMP"
        | "UHC"
        | "Axe"
        | "NethPot"
        | "Bedwars"
        | "Mace"
      player_region: "NA" | "EU" | "ASIA" | "OCE" | "SA" | "AF"
      tier_level:
        | "LT5"
        | "HT5"
        | "LT4"
        | "HT4"
        | "LT3"
        | "HT3"
        | "LT2"
        | "HT2"
        | "LT1"
        | "HT1"
        | "Retired"
        | "Crystal1"
        | "Crystal2"
        | "Crystal3"
        | "Crystal4"
        | "Crystal5"
        | "Crystal6"
        | "Crystal7"
        | "Crystal8"
        | "Crystal9"
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
      device_type: ["Mobile", "PC", "Console"],
      game_mode: [
        "Crystal",
        "Sword",
        "SMP",
        "UHC",
        "Axe",
        "NethPot",
        "Bedwars",
        "Mace",
      ],
      player_region: ["NA", "EU", "ASIA", "OCE", "SA", "AF"],
      tier_level: [
        "LT5",
        "HT5",
        "LT4",
        "HT4",
        "LT3",
        "HT3",
        "LT2",
        "HT2",
        "LT1",
        "HT1",
        "Retired",
        "Crystal1",
        "Crystal2",
        "Crystal3",
        "Crystal4",
        "Crystal5",
        "Crystal6",
        "Crystal7",
        "Crystal8",
        "Crystal9",
      ],
    },
  },
} as const
