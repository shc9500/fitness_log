export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          type: string;
          minutes: number;
          intensity: 1 | 2 | 3;
          memo: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          type: string;
          minutes: number;
          intensity: 1 | 2 | 3;
          memo?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          type?: string;
          minutes?: number;
          intensity?: 1 | 2 | 3;
          memo?: string | null;
          created_at?: string;
        };
      };
      exercise_types: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          default_intensity: 1 | 2 | 3;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          default_intensity: 1 | 2 | 3;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          default_intensity?: 1 | 2 | 3;
          created_at?: string;
        };
      };
    };
  };
}

export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type ExerciseInsert = Database['public']['Tables']['exercises']['Insert'];
export type ExerciseUpdate = Database['public']['Tables']['exercises']['Update'];

export type ExerciseType = Database['public']['Tables']['exercise_types']['Row'];
export type ExerciseTypeInsert = Database['public']['Tables']['exercise_types']['Insert'];
export type ExerciseTypeUpdate = Database['public']['Tables']['exercise_types']['Update'];