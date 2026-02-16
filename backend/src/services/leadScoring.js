/**
 * Lead Scoring Service
 * Computes a lead score based on various triggers:
 * - Funding events
 * - Hiring activity
 * - Role seniority
 * - Tech fit
 */

const config = require('../config/scoringConfig');

class LeadScoringService {
  constructor() {
    this.weights = config.weights;
  }

  /**
   * Calculate lead score for a contact/company
   * @param {Object} data - Contact and company data
   * @returns {Object} Score breakdown and total
   */
  calculateScore(data) {
    const {
      hasFunding = false,
      fundingAmount = 0,
      isHiring = false,
      hiringCount = 0,
      seniorityLevel = 'mid', // junior, mid, senior, exec
      techStack = [],
      targetTech = []
    } = data;

    const scores = {
      funding: this.scoreFunding(hasFunding, fundingAmount),
      hiring: this.scoreHiring(isHiring, hiringCount),
      seniority: this.scoreSeniority(seniorityLevel),
      techFit: this.scoreTechFit(techStack, targetTech)
    };

    const total = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * this.weights[key] / 100);
    }, 0);

    const roundedTotal = Math.round(total);

    return {
      scores,
      total: roundedTotal,
      grade: this.getGrade(roundedTotal)
    };
  }

  scoreFunding(hasFunding, amount) {
    if (!hasFunding) return 0;
    
    // Score based on funding amount (in millions) using config tiers
    for (const tier of config.fundingTiers) {
      if (amount >= tier.min) {
        return tier.score;
      }
    }
    return 40; // Fallback (shouldn't reach here)
  }

  scoreHiring(isHiring, count) {
    if (!isHiring) return config.notHiringScore;
    
    // Score based on number of open positions using config tiers
    for (const tier of config.hiringTiers) {
      if (count >= tier.min) {
        return tier.score;
      }
    }
    return 40; // Fallback (shouldn't reach here)
  }

  scoreSeniority(level) {
    const normalizedLevel = level.toLowerCase();
    return config.seniorityScores[normalizedLevel] || config.seniorityScores['unknown'];
  }

  scoreTechFit(techStack, targetTech) {
    if (!techStack || techStack.length === 0) return config.techFitFallbacks.noTechStack;
    if (!targetTech || targetTech.length === 0) return config.techFitFallbacks.noRequirements;
    
    // Calculate match percentage
    const matches = techStack.filter(tech => 
      targetTech.some(target => 
        tech.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(tech.toLowerCase())
      )
    ).length;
    
    const matchRate = matches / targetTech.length;
    
    // Find appropriate score using config thresholds
    for (const threshold of config.techFitThresholds) {
      if (matchRate >= threshold.minRate) {
        return threshold.score;
      }
    }
    return 40; // Fallback (shouldn't reach here)
  }

  getGrade(score) {
    for (const threshold of config.gradeThresholds) {
      if (score >= threshold.min) {
        return threshold.grade;
      }
    }
    return 'D'; // Fallback (shouldn't reach here)
  }
}

module.exports = new LeadScoringService();
