# 🏠 CHAZI ESTATE

**Democratizing Real Estate Investment Through Blockchain Technology**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hedera](https://img.shields.io/badge/Blockchain-Hedera-purple)](https://hedera.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org/)

## 🚀 **What is CHAZI ESTATE?**

CHAZI ESTATE transforms real estate investment by enabling **fractional property ownership** starting from just **$100**. Built on Hedera blockchain, our platform makes real estate investment accessible, liquid, and transparent for everyone.

### **Key Features**
- 🏘️ **Fractional Ownership**: Buy shares of properties from $100
- 💰 **Passive Income**: Automated rental income distribution
- 🔄 **Instant Liquidity**: Trade shares 24/7 like stocks
- 🗳️ **DAO Governance**: Vote on property decisions
- 🌍 **Global Access**: Invest in properties worldwide
- 🔒 **Blockchain Security**: Hedera-powered smart contracts

## 📊 **Live Demo**

### **Smart Contracts (Hedera Testnet)**
- **PropertyFactory**: `0x670782a6158782157bd0DD251152c075f767689D`
- **PropertyToken**: `0x0636b2c3241e32Be3dD768C063D278d9ba7bbcB1`
- **Explorer**: [HashScan Testnet](https://hashscan.io/testnet)

### **Platform Status**
- ✅ **Frontend**: React app with wallet integration
- ✅ **Backend**: Node.js API with Hedera SDK
- ✅ **Smart Contracts**: 6 contracts deployed and verified
- ✅ **Testing**: 30+ tests passed, 4000+ fuzz tests

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 16+
- npm or yarn

### **Installation**
```bash
# Clone repository
git clone https://github.com/yourusername/chazi-estate.git
cd chazi-estate

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start the platform
./start-app.sh
```

### **Access Points**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Test**: http://localhost:5173/backend-test

## 🏗️ **Architecture**

### **Smart Contracts**
```
PropertyFactory (Main) → PropertyToken (ERC-1155) → PropertyDeed (ERC-721)
                      → DeedDAO (Governance) → RevenueDistributor → LoanManager
```

### **Tech Stack**
- **Blockchain**: Hedera Hashgraph
- **Smart Contracts**: Solidity 0.8.28
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Wallet**: HashPack, RainbowKit

## 💡 **How It Works**

1. **Property Tokenization**: Real estate → 10,000 ERC-1155 shares
2. **Fractional Investment**: Users buy shares starting from $100
3. **Automated Income**: Smart contracts distribute rental payments
4. **Democratic Governance**: Shareholders vote on property decisions
5. **Instant Trading**: Buy/sell shares on secondary market

## 🧪 **Testing**

```bash
# Run frontend tests
npm test

# Run smart contract tests
cd smartcontract
forge test

# Run backend tests
cd backend
npm test
```

## 📈 **Roadmap**

### **Phase 1: MVP** ✅
- [x] Smart contract deployment
- [x] Frontend application
- [x] Wallet integration
- [x] Basic trading functionality

### **Phase 2: Production**
- [ ] Hedera Mainnet deployment
- [ ] First property listings
- [ ] User onboarding
- [ ] Mobile app

### **Phase 3: Scale**
- [ ] Multi-chain support
- [ ] International markets
- [ ] Institutional tools
- [ ] Advanced AI features

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 **Links**

- **Website**: [Coming Soon]
- **Documentation**: [docs/](docs/)
- **Smart Contracts**: [Hedera Testnet](https://hashscan.io/testnet)
- **Support**: support@chaziestate.com

## 🏆 **Built With**

- [Hedera Hashgraph](https://hedera.com/) - Enterprise blockchain
- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [Foundry](https://getfoundry.sh/) - Smart contract development
- [Supabase](https://supabase.com/) - Database and auth

---

**CHAZI ESTATE - Making Real Estate Investment Accessible to Everyone** 🏠✨