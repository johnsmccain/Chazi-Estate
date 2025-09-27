const fs = require('fs');

// Read the current file
let content = fs.readFileSync('src/hooks/useHedera.ts', 'utf8');

// Define the method mappings
const methodMappings = [
  {
    pattern: /const rentProperty = useCallback\(async \(params: RentPropertyParams\) => \{[\s\S]*?try \{[\s\S]*?\/\/ Mock property rental[\s\S]*?setState\(prev => \(\{ \.\.\.prev, isLoading: false \}\)\);[\s\S]*?return \{[\s\S]*?success: true,[\s\S]*?transactionHash: `0x\$\{Math\.random\(\)\.toString\(16\)\.substr\(2, 64\)\}`,[\s\S]*?blockNumber: Math\.floor\(Math\.random\(\) \* 1000000\) \+ 25000000,[\s\S]*?gasUsed: '1000000',[\s\S]*?\};[\s\S]*?\} catch \(error\) \{[\s\S]*?setState\(prev => \(\{[\s\S]*?\.\.\.prev,[\s\S]*?error: 'Failed to rent property',[\s\S]*?isLoading: false,[\s\S]*?\}\);[\s\S]*?return \{ success: false, error: 'Failed to rent property' \};[\s\S]*?\}[\s\S]*?\}, \[\]\);/,
    replacement: `const rentProperty = useCallback(async (params: RentPropertyParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.rentProperty(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to rent property');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to rent property',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to rent property' };
    }
  }, []);`
  },
  {
    pattern: /const createProposal = useCallback\(async \(params: CreateProposalParams\) => \{[\s\S]*?try \{[\s\S]*?\/\/ Mock proposal creation[\s\S]*?setState\(prev => \(\{ \.\.\.prev, isLoading: false \}\)\);[\s\S]*?return \{[\s\S]*?success: true,[\s\S]*?transactionHash: `0x\$\{Math\.random\(\)\.toString\(16\)\.substr\(2, 64\)\}`,[\s\S]*?blockNumber: Math\.floor\(Math\.random\(\) \* 1000000\) \+ 25000000,[\s\S]*?gasUsed: '1500000',[\s\S]*?\};[\s\S]*?\} catch \(error\) \{[\s\S]*?setState\(prev => \(\{[\s\S]*?\.\.\.prev,[\s\S]*?error: 'Failed to create proposal',[\s\S]*?isLoading: false,[\s\S]*?\}\);[\s\S]*?return \{ success: false, error: 'Failed to create proposal' \};[\s\S]*?\}[\s\S]*?\}, \[\]\);/,
    replacement: `const createProposal = useCallback(async (params: CreateProposalParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.createProposal(params);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create proposal');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create proposal',
        isLoading: false,
      }));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create proposal' };
    }
  }, []);`
  }
];

// Apply the replacements
methodMappings.forEach(mapping => {
  content = content.replace(mapping.pattern, mapping.replacement);
});

// Write the updated content back
fs.writeFileSync('src/hooks/useHedera.ts', content);

console.log('Updated useHedera hook with API service calls');
