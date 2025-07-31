import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { DAOProposal, daoService, propertyService, formatCurrency } from '../lib/supabase';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Vote,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Heart,
  Sparkles,
  Building,
  DollarSign,
  Calendar,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Shield,
  PieChart
} from 'lucide-react';

export const DAODashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<DAOProposal[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<DAOProposal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      setIsLoading(true);
      const data = await daoService.getProposals();
      setProposals(data);

      // Load user votes for each proposal
      if (user?.id) {
        const votes: Record<string, any> = {};
        for (const proposal of data) {
          const vote = await daoService.getUserVote(proposal.id, user.id);
          if (vote) {
            votes[proposal.id] = vote;
          }
        }
        setUserVotes(votes);
      }
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against', votingPower: number) => {
    if (!user?.id) return;

    try {
      setIsVoting(true);
      await daoService.vote(proposalId, user.id, vote, votingPower);
      
      // Refresh proposals and votes
      await loadProposals();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'passed':
        return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30';
      case 'rejected':
        return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'expired':
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
      default:
        return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return Clock;
      case 'passed':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'expired':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getProposalTypeIcon = (type: string) => {
    switch (type) {
      case 'rent_change':
        return DollarSign;
      case 'sale':
        return TrendingUp;
      case 'price_change':
        return DollarSign;
      case 'maintenance':
        return Building;
      default:
        return Vote;
    }
  };

  const calculateVotePercentage = (votesFor: number, votesAgainst: number, totalVotingPower: number) => {
    if (totalVotingPower === 0) return { forPercentage: 0, againstPercentage: 0 };
    
    const forPercentage = (votesFor / totalVotingPower) * 100;
    const againstPercentage = (votesAgainst / totalVotingPower) * 100;
    
    return { forPercentage, againstPercentage };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner message="Loading DAO proposals..." size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Vote className="h-8 w-8 text-blue-400" />
          <span>DAO Governance</span>
          <Heart className="h-6 w-6 text-pink-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Participate in property governance decisions. Your ownership gives you voting power! ✨
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            label: 'Active Proposals',
            value: proposals.filter(p => p.status === 'active').length,
            icon: Clock,
            color: 'from-blue-400 to-purple-500'
          },
          {
            label: 'Total Proposals',
            value: proposals.length,
            icon: Vote,
            color: 'from-emerald-400 to-blue-500'
          },
          {
            label: 'Your Votes',
            value: Object.keys(userVotes).length,
            icon: ThumbsUp,
            color: 'from-purple-400 to-pink-500'
          },
          {
            label: 'Passed Proposals',
            value: proposals.filter(p => p.status === 'passed').length,
            icon: CheckCircle,
            color: 'from-amber-400 to-orange-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Proposal Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Proposal</span>
        </motion.button>
      </motion.div>

      {/* Proposals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        {proposals.map((proposal, index) => {
          const StatusIcon = getStatusIcon(proposal.status);
          const TypeIcon = getProposalTypeIcon(proposal.proposal_type);
          const { forPercentage, againstPercentage } = calculateVotePercentage(
            proposal.votes_for,
            proposal.votes_against,
            proposal.total_voting_power
          );
          const userVote = userVotes[proposal.id];
          const isExpired = new Date(proposal.voting_deadline) < new Date();

          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-linear-to-br from-blue-400 to-purple-500 shadow-lg">
                    <TypeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-3">{proposal.description}</p>
                    
                    {proposal.property && (
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        {proposal.property.title} - {proposal.property.city}, {proposal.property.state}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(proposal.voting_deadline).toLocaleDateString()}</span>
                      </div>
                      {proposal.proposer && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>By: {proposal.proposer.full_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  <span className="capitalize">{proposal.status}</span>
                </div>
              </div>

              {/* Proposal Details */}
              {(proposal.current_value || proposal.proposed_value) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {proposal.current_value && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 text-sm">Current Value:</span>
                      <p className="text-white font-semibold">{proposal.current_value}</p>
                    </div>
                  )}
                  {proposal.proposed_value && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <span className="text-gray-400 text-sm">Proposed Value:</span>
                      <p className="text-emerald-400 font-semibold">{proposal.proposed_value}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Voting Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Voting Progress</span>
                  <span>{proposal.votes_for + proposal.votes_against} / {proposal.total_voting_power} votes</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 text-sm font-medium">For</span>
                      <span className="text-emerald-400 font-bold">{proposal.votes_for}</span>
                    </div>
                    <div className="w-full bg-emerald-900/30 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${forPercentage}%` }}
                      />
                    </div>
                    <p className="text-emerald-400 text-xs mt-1">{forPercentage.toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-red-500/10 rounded-lg p-3 border border-red-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-300 text-sm font-medium">Against</span>
                      <span className="text-red-400 font-bold">{proposal.votes_against}</span>
                    </div>
                    <div className="w-full bg-red-900/30 rounded-full h-2">
                      <div 
                        className="bg-red-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${againstPercentage}%` }}
                      />
                    </div>
                    <p className="text-red-400 text-xs mt-1">{againstPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Voting Actions */}
              {proposal.status === 'active' && !isExpired && user && (
                <div className="flex items-center justify-between">
                  {userVote ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        You voted {userVote.vote} with {userVote.voting_power} voting power
                      </span>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVote(proposal.id, 'for', 10)} // Mock voting power
                        disabled={isVoting}
                        className="bg-linear-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Vote For</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVote(proposal.id, 'against', 10)} // Mock voting power
                        disabled={isVoting}
                        className="bg-linear-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Vote Against</span>
                      </motion.button>
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProposal(proposal)}
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              )}

              {isExpired && proposal.status === 'active' && (
                <div className="flex items-center space-x-2 text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Voting period has expired</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {proposals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Vote className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-3">No proposals yet</h3>
          <p className="text-gray-300 text-lg mb-6">
            Be the first to create a proposal for property governance! 💫
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-linear-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create First Proposal</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};