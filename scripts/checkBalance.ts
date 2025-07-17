import { JsonRpcPublicProvider, Mas } from '@massalabs/massa-web3';

/**
 * Network types for Massa blockchain
 */
export type MassaNetwork = 'mainnet' | 'testnet';

/**
 * Check the balance of a Massa address
 * @param address - The Massa address to check balance for
 * @param network - The network to use ('mainnet' or 'testnet')
 * @param final - Whether to get finalized balance (default: true)
 * @returns Promise that resolves to balance information
 */
export async function checkBalance(address: string, network: MassaNetwork = 'mainnet', final: boolean = true) {
  try {
    // Create provider based on network
    const provider = network === 'mainnet' 
      ? JsonRpcPublicProvider.mainnet()
      : JsonRpcPublicProvider.buildnet();
    
    // Get balance for the address
    const balances = await provider.balanceOf([address], final);
    
    if (balances.length === 0) {
      throw new Error('No balance information found for the address');
    }
    
    const balanceInfo = balances[0];
    
    // Convert balance to readable format (MAS)
    const readableBalance = Mas.toString(balanceInfo.balance, 9);
    
    return {
      address: balanceInfo.address,
      balance: balanceInfo.balance, // Raw balance in nano massa
      balanceInMas: readableBalance, // Human-readable balance in MAS
      network: network,
      final: final
    };
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
}

/**
 * Main function to demonstrate balance checking on both networks
 */
async function main() {
  // Example usage - replace with actual address
  const testAddress = "AU12LaXgRv4CATEd3h8XnFQJmnxwvCB75nsf979tUU6mSoKUmsc4m";
  
  console.log('=== Massa Balance Checker ===');
  console.log('Address:', testAddress);
  
  // Check balance on mainnet
  try {
    console.log('\n🌐 Checking balance on MAINNET...');
    const mainnetResult = await checkBalance(testAddress, 'mainnet');
    
    console.log('✅ Mainnet Balance Information:');
    console.log('  Network:', mainnetResult.network);
    console.log('  Address:', mainnetResult.address);
    console.log('  Balance (raw nano massa):', mainnetResult.balance.toString());
    console.log('  Balance (MAS):', mainnetResult.balanceInMas);
    console.log('  Final balance:', mainnetResult.final);
  } catch (error) {
    console.error('❌ Failed to check mainnet balance:', error.message);
  }
  
  // Check balance on testnet (buildnet)
  try {
    console.log('\n🧪 Checking balance on TESTNET (Buildnet)...');
    const testnetResult = await checkBalance(testAddress, 'testnet');
    
    console.log('✅ Testnet Balance Information:');
    console.log('  Network:', testnetResult.network);
    console.log('  Address:', testnetResult.address);
    console.log('  Balance (raw nano massa):', testnetResult.balance.toString());
    console.log('  Balance (MAS):', testnetResult.balanceInMas);
    console.log('  Final balance:', testnetResult.final);
  } catch (error) {
    console.error('❌ Failed to check testnet balance:', error.message);
  }
  
  console.log('\n=== Balance Check Complete ===');
}

// Run main function if this script is executed directly
if (import.meta.main) {
  main();
}