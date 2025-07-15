# DeedAI – Technical Documentation

## Overview
DeedAI is an AI-powered, blockchain-based RWA platform that enables users to buy, sell, rent, loan, and co-own real estate properties via fractional shares. It integrates Supabase for real-time backend operations and smart contracts for asset ownership and governance.

---

## Architecture

### Frontend
- Built with [Bolt.new](https://bolt.new)
- Responsive, mobile-first UI
- Supabase integration for real-time updates
- ElevenLabs and Tavus for AI voice/video

### Backend
- **Supabase**:
  - `properties`: metadata for listed properties
  - `ownerships`: tracks shares per user
  - `transactions`: buy/sell/rent/loan logs
  - `users`: user profiles
- Auth: wallet + email
- RLS for secure data isolation

### Smart Contracts (Solidity)
- `PropertyFactory`: deploys new property token contracts
- `FractionalShares`: ERC20-based fractional ownership
- `RevenueDistributor`: handles rent revenue distribution
- `LoanManager`: manages loan rules (50% threshold)
- `DeedDAO`: DAO for property-level governance (voting, proposals)

---

## Key Features
- 🏠 Fractionalized property buying & selling
- 💸 Smart loans with ≥50% down payment
- 🔐 On-chain deed minting (NFT simulation)
- 🗳 DAO governance for property decisions
- 🎙️ Voice-guided deed creation (ElevenLabs)
- 🤖 AI deed generation & verification

---

## Smart Contract Repo
> 🔗 [GitHub Repo for Contracts](https://github.com/johnsmccain/Chazi-Estate)  


## Deployment
- Frontend deployed via Netlify with Supabase + Bolt.new
- Smart contract interaction via Viem or wagmi (on testnet)

---

## Team
- Chazi (Frontend, Contracts, Architecture)
- AI Tools: Bolt, ElevenLabs, Tavus
- Blockchain: Algorand + Solidity
