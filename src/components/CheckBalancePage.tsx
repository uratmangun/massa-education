import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useState } from "react";
import { Wallet, ArrowLeft, Loader2 } from "lucide-react";

interface BalanceResult {
  address: string;
  network: string;
  balance: {
    raw: string;
    formatted: string;
  };
}

interface NetworkBalance {
  mainnet: BalanceResult | null;
  buildnet: BalanceResult | null;
}

export function CheckBalancePage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState<NetworkBalance>({ mainnet: null, buildnet: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkBalance = async (network: 'mainnet' | 'buildnet') => {
    if (!address.trim()) {
      setError('Please enter a Massa address');
      return null;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration not found');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/check-massa-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ 
          message: address.trim(),
          network: network
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to check balance');
      }
    } catch (error) {
      console.error(`Error checking ${network} balance:`, error);
      throw error;
    }
  };

  const handleCheckBalance = async () => {
    if (!address.trim()) {
      setError('Please enter a Massa address');
      return;
    }

    setLoading(true);
    setError('');
    setBalances({ mainnet: null, buildnet: null });

    try {
      // Check both mainnet and buildnet balances
      const [mainnetBalance, buildnetBalance] = await Promise.allSettled([
        checkBalance('mainnet'),
        checkBalance('buildnet')
      ]);
      
      setBalances({
        mainnet: mainnetBalance.status === 'fulfilled' ? mainnetBalance.value : null,
        buildnet: buildnetBalance.status === 'fulfilled' ? buildnetBalance.value : null
      });

      // If both failed, show error
      if (mainnetBalance.status === 'rejected' && buildnetBalance.status === 'rejected') {
        setError('Failed to check balance on both networks');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to check balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
          <div className="w-full px-8 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="mb-6 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Home
                </Button>
                <div className="text-center">
                  <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Check Massa Balance
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    Check your Massa wallet balance on mainnet and buildnet
                  </p>
                </div>
              </div>

              {/* Balance Checker */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet size={24} />
                    Balance Checker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Massa Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your Massa address (e.g., AU12...)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleCheckBalance}
                    disabled={loading || !address.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={16} />
                        Checking Balance...
                      </>
                    ) : (
                      'Check Balance'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Balance Results */}
              {(balances.mainnet || balances.buildnet) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mainnet Balance */}
                  <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border-green-400/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        Mainnet Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {balances.mainnet ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-300 text-sm">Address:</p>
                            <p className="text-white font-mono text-xs break-all">
                              {balances.mainnet.address}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm">Balance:</p>
                            <p className="text-2xl font-bold text-green-400">
                              {balances.mainnet.balance.formatted}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Raw: {balances.mainnet.balance.raw} nano MAS
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400">No mainnet balance data</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Buildnet Balance */}
                  <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm border-orange-400/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        Buildnet Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {balances.buildnet ? (
                        <div className="space-y-3">
                          <div>
                            <p className="text-gray-300 text-sm">Address:</p>
                            <p className="text-white font-mono text-xs break-all">
                              {balances.buildnet.address}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm">Balance:</p>
                            <p className="text-2xl font-bold text-orange-400">
                              {balances.buildnet.balance.formatted}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Raw: {balances.buildnet.balance.raw} nano MAS
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400 mb-2">No buildnet balance data</p>
                          <p className="text-gray-500 text-sm">
                            {loading ? 'Checking buildnet...' : 'Failed to retrieve buildnet balance'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Info Card */}
              <Card className="bg-blue-600/10 backdrop-blur-sm border-blue-400/30 mt-8">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-3">ℹ️ Information</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• Enter a valid Massa address starting with "AU"</li>
                    <li>• Mainnet shows your real MAS token balance</li>
                    <li>• Buildnet is the test network for development and testing</li>
                    <li>• Both networks are checked simultaneously</li>
                    <li>• Balance is shown in both MAS and nano MAS units</li>
                    <li>• 1 MAS = 1,000,000,000 nano MAS</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-white mb-8">You must be signed in to check balances.</p>
            <SignInButton mode="modal">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Sign In</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}
