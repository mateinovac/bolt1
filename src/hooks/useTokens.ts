import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '../utils/toast';

type TokenAmount = number | null;

export function useTokens() {
  const [tokens, setTokens] = useState<TokenAmount>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_tokens')
        .select('tokens')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      // Convert to 2 decimal places for USD display
      setTokens(Number(data.tokens).toFixed(2));
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  return {
    tokens,
    loading,
    refreshTokens: fetchTokens
  };
}
