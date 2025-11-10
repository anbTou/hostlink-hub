import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FilterOptions } from "@/types/inbox";
import { useToast } from "@/hooks/use-toast";

export interface SavedView {
  id: string;
  name: string;
  icon?: string;
  filters: FilterOptions;
  created_at: string;
  updated_at: string;
}

export const useSavedViews = () => {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSavedViews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSavedViews([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_saved_views')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast filters from Json to FilterOptions
      const typedData = (data || []).map(view => ({
        ...view,
        filters: view.filters as unknown as FilterOptions
      }));

      setSavedViews(typedData);
    } catch (error) {
      console.error('Error fetching saved views:', error);
      toast({
        title: "Error",
        description: "Failed to load saved views",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSavedView = async (name: string, filters: FilterOptions, icon?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_saved_views')
        .insert({
          user_id: user.id,
          name,
          filters: filters as any,
          icon: icon || 'Bookmark',
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        filters: data.filters as unknown as FilterOptions
      };

      setSavedViews(prev => [typedData, ...prev]);
      toast({
        title: "Success",
        description: "Saved view created successfully",
      });

      return typedData;
    } catch (error: any) {
      console.error('Error creating saved view:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create saved view",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSavedView = async (id: string, updates: Partial<Pick<SavedView, 'name' | 'filters' | 'icon'>>) => {
    try {
      const { data, error } = await supabase
        .from('user_saved_views')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        filters: data.filters as unknown as FilterOptions
      };

      setSavedViews(prev => prev.map(view => view.id === id ? typedData : view));
      toast({
        title: "Success",
        description: "Saved view updated successfully",
      });

      return typedData;
    } catch (error: any) {
      console.error('Error updating saved view:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update saved view",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteSavedView = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_saved_views')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedViews(prev => prev.filter(view => view.id !== id));
      toast({
        title: "Success",
        description: "Saved view deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting saved view:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete saved view",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSavedViews();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('user_saved_views_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_saved_views',
        },
        () => {
          fetchSavedViews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    savedViews,
    loading,
    createSavedView,
    updateSavedView,
    deleteSavedView,
    refetch: fetchSavedViews,
  };
};
