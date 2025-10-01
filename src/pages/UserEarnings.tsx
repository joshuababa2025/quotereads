import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Clock, Download, Wallet, CreditCard, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface EarningsTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  admin_notes?: string;
  created_at: string;
}

const UserEarnings = () => {
  const { user } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [transactions, setTransactions] = useState<EarningsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [bankAccount, setBankAccount] = useState({ account_name: '', account_number: '', bank_name: '', country: '' });
  const [editingBank, setEditingBank] = useState(false);
  const [savingBank, setSavingBank] = useState(false);

  useEffect(() => {
    if (user) {
      loadEarningsData();
      loadBankAccount();
    }
  }, [user]);

  const loadEarningsData = async () => {
    if (!user) return;
    
    try {
      console.log('🔍 Loading earnings for user:', user.id);
      console.log('🔍 User object:', user);
      
      // Test basic auth first
      const { data: authTest, error: authError } = await supabase.auth.getUser();
      console.log('🔍 Auth test:', authTest, authError);
      
      // Get user earnings summary
      console.log('🔍 Fetching user_earnings...');
      const { data: earnings, error: earningsError } = await supabase
        .from('user_earnings')
        .select('total_earnings, available_balance, pending_balance')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('✅ Earnings data:', earnings);
      console.log('❌ Earnings error:', earningsError);

      // Get earnings transactions history
      console.log('🔍 Fetching user_earnings_transactions...');
      const { data: transactionData, error: transactionError } = await supabase
        .from('user_earnings_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('✅ Transaction data:', transactionData);
      console.log('❌ Transaction error:', transactionError);
      
      // Check completed tasks for comparison
      console.log('🔍 Fetching completed tasks...');
      const { data: completedTasks, error: tasksError } = await supabase
        .from('user_task_completions')
        .select('*, earn_money_tasks(name, reward)')
        .eq('user_id', user.id)
        .eq('status', 'completed');
      
      console.log('✅ Completed tasks:', completedTasks);
      console.log('❌ Tasks error:', tasksError);
      
      // Set transactions data (don't try to create missing ones in frontend)
      setTransactions(transactionData || []);

      setTotalEarnings(earnings?.total_earnings || 0);
      setAvailableBalance(earnings?.available_balance || 0);
    } catch (error) {
      console.error('💥 Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBankAccount = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setBankAccount(data);
      }
    } catch (error) {
      console.error('Error loading bank account:', error);
    }
  };

  const saveBankAccount = async () => {
    if (!user) return;
    setSavingBank(true);
    try {
      const { error } = await supabase
        .from('user_bank_accounts')
        .upsert({
          user_id: user.id,
          ...bankAccount
        });

      if (error) throw error;
      setEditingBank(false);
    } catch (error) {
      console.error('Error saving bank account:', error);
    } finally {
      setSavingBank(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!user || availableBalance <= 0) return;
    
    setWithdrawing(true);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount: availableBalance,
          status: 'pending',
          requested_at: new Date().toISOString()
        });

      if (error) throw error;

      alert(`Withdrawal request for $${availableBalance.toFixed(2)} submitted successfully!`);
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Failed to submit withdrawal request. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'task_completion':
      case 'bonus':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'penalty':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'withdrawal':
        return <Download className="w-4 h-4 text-blue-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'task_completion':
      case 'bonus':
        return 'text-green-600';
      case 'penalty':
        return 'text-red-600';
      case 'withdrawal':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center p-8">
            <p className="text-muted-foreground mb-4">Please sign in to view your earnings.</p>
            <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Earnings</h1>
            <p className="text-muted-foreground">Track your earnings and transaction history</p>
          </div>

          {/* Earnings Summary - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:flex-col md:text-center">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-green-500 flex-shrink-0 md:mx-auto md:mb-2" />
                  <div className="flex-1 md:flex-none min-w-0">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-green-600 truncate">
                      ${totalEarnings.toFixed(2)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-2 sm:gap-3 md:flex-col md:text-center">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-blue-500 flex-shrink-0 md:mx-auto md:mb-2" />
                  <div className="flex-1 md:flex-none min-w-0">
                    <div className="text-lg sm:text-xl md:text-3xl font-bold text-blue-600 truncate">
                      ${availableBalance.toFixed(2)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Available Balance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bank Account Section */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Bank Account
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingBank(!editingBank)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {editingBank ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingBank ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="account_name">Account Name</Label>
                    <Input
                      id="account_name"
                      value={bankAccount.account_name}
                      onChange={(e) => setBankAccount({...bankAccount, account_name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_number">Account Number</Label>
                    <Input
                      id="account_number"
                      value={bankAccount.account_number}
                      onChange={(e) => setBankAccount({...bankAccount, account_number: e.target.value})}
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={bankAccount.bank_name}
                      onChange={(e) => setBankAccount({...bankAccount, bank_name: e.target.value})}
                      placeholder="Chase Bank"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={bankAccount.country}
                      onChange={(e) => setBankAccount({...bankAccount, country: e.target.value})}
                      placeholder="United States"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button 
                      onClick={saveBankAccount}
                      disabled={savingBank}
                      className="w-full sm:w-auto"
                    >
                      {savingBank ? 'Saving...' : 'Save Bank Account'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Name</Label>
                    <p className="text-sm text-muted-foreground">{bankAccount.account_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <p className="text-sm text-muted-foreground">{bankAccount.account_number || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Bank Name</Label>
                    <p className="text-sm text-muted-foreground">{bankAccount.bank_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <p className="text-sm text-muted-foreground">{bankAccount.country || 'Not set'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Withdrawal Button */}
          {availableBalance > 0 && (
            <div className="mb-6">
              <Button 
                onClick={handleWithdrawal}
                disabled={withdrawing || !bankAccount.account_name}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {withdrawing ? 'Processing...' : `Withdraw $${availableBalance.toFixed(2)}`}
              </Button>
              {!bankAccount.account_name && (
                <p className="text-xs text-red-500 mt-2">Please add your bank account details first</p>
              )}
            </div>
          )}

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-gray-500 mt-2">Check console for debugging info</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-start justify-between p-2 sm:p-3 md:p-4 border rounded-lg gap-2 sm:gap-3">
                      <div className="flex items-start gap-1 sm:gap-2 md:gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5">
                          {getTransactionIcon(transaction.transaction_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm md:text-base truncate">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(transaction.created_at)}
                          </div>
                          {transaction.admin_notes && (
                            <div className="text-xs text-orange-600 mt-1 truncate">
                              Admin Note: {transaction.admin_notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-bold text-xs sm:text-sm md:text-base ${getTransactionColor(transaction.transaction_type)}`}>
                          {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1 hidden sm:inline-flex">
                          {transaction.transaction_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserEarnings;