import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { useTokens } from '../../../hooks/useTokens';
import { supabase } from '../../../lib/supabase';
import { toast } from '../../../utils/toast';

export function PlanTab() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { tokens, loading: tokensLoading } = useTokens();
  const MIN_AMOUNT = 5;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError(Number(value) < MIN_AMOUNT ? `Minimum top-up amount is $${MIN_AMOUNT}` : '');
  };

  const handleTopUp = async () => {
    if (Number(amount) < MIN_AMOUNT) {
      setError(`Minimum top-up amount is $${MIN_AMOUNT}`);
      return;
    }
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to continue');
      }
      if (!user.email) {
        throw new Error('User email not found');
      }

      const response = await fetch('https://host.vreausacopiez.com/webhook/a36b796e-7a89-4ada-9926-56b649717b9a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth': 'AIzaSyC8TGpIoPwHN9YzDkLQ4D6kubESaXTxZf8'
        },
        body: JSON.stringify({
          amount: Number(amount),
          userId: user.id,
          email: user.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process payment request');
      }

      const data = await response.json();
      if (data.text && typeof data.text === 'string') {
        // Open payment URL in new tab
        window.open(data.text, '_blank');
      } else {
        throw new Error('Invalid payment URL received');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white">Plan Settings</h3>
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <span className="text-sm text-gray-400">Current Balance</span>
              <div className="text-xl font-semibold text-white">
                {tokensLoading ? 'Loading...' : `$${tokens}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 space-y-4 backdrop-blur-sm border border-gray-700/50">
        <div className="space-y-1">
          <h4 className="text-xl font-semibold text-white">Top up now</h4>
          <p className="text-sm text-gray-400">One time payment - No recurring charges</p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`Enter amount (min. $${MIN_AMOUNT})`}
                className="w-full pl-8 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg
                         text-white placeholder-gray-400
                         focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                min={MIN_AMOUNT}
                step="1"
              />
            </div>
            <button
              onClick={handleTopUp}
              disabled={!amount || Number(amount) < MIN_AMOUNT || loading}
              className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 
                       transition-colors flex items-center gap-2 disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Top up</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            *It can take up to 1 min for your credits to show on the balance after the purchase is done
          </p>
        </div>
      </div>
    </div>
  );
}
