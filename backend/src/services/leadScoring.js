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

    this.fundingTiers = [...config.fundingTiers].sort((a, b) => b.min - a.min);
    this.hiringTiers = [...config.hiringTiers].sort((a, b) => b.min - a.min);
    this.techFitThresholds = [...config.techFitThresholds].sort((a, b) => b.minRate - a.minRate);
    this.gradeThresholds = [...config.gradeThresholds].sort((a, b) => b.min - a.min);

    if (this.fundingTiers.length === 0) {
      throw new Error('LeadScoringService: fundingTiers must not be empty');
    }
    if (this.hiringTiers.length === 0) {
      throw new Error('LeadScoringService: hiringTiers must not be empty');
    }
    if (this.techFitThresholds.length === 0) {
      throw new Error('LeadScoringService: techFitThresholds must not be empty');
    }
    if (this.gradeThresholds.length === 0) {
      throw new Error('LeadScoringService: gradeThresholds must not be empty');
    }
    if (typeof config.seniorityScores?.unknown !== 'number') {
      throw new Error('LeadScoringService: seniorityScores.unknown must be a number');
    }
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
    for (const tier of this.fundingTiers) {
      if (amount >= tier.min) {
        return tier.score;
      }
    }
    return this.fundingTiers[this.fundingTiers.length - 1].score;
  }

  scoreHiring(isHiring, count) {
    if (!isHiring) return config.notHiringScore;
    
    // Score based on number of open positions using config tiers
    for (const tier of this.hiringTiers) {
      if (count >= tier.min) {
        return tier.score;
      }
    }
    return this.hiringTiers[this.hiringTiers.length - 1].score;
  }

  scoreSeniority(level) {
    const normalizedLevel = typeof level === 'string' ? level.toLowerCase() : 'unknown';
    return config.seniorityScores[normalizedLevel] ?? config.seniorityScores.unknown;
  }

  scoreTechFit(techStack, targetTech) {
    if (!Array.isArray(techStack) || techStack.length === 0) return config.techFitFallbacks.noTechStack;
    if (!Array.isArray(targetTech) || targetTech.length === 0) return config.techFitFallbacks.noRequirements;

    const normalizedTechStack = techStack
      .filter((tech) => typeof tech === 'string' && tech.trim())
      .map((tech) => tech.toLowerCase());

    const normalizedTargetTech = targetTech
      .filter((tech) => typeof tech === 'string' && tech.trim())
      .map((tech) => tech.toLowerCase());

    if (normalizedTechStack.length === 0) return config.techFitFallbacks.noTechStack;
    if (normalizedTargetTech.length === 0) return config.techFitFallbacks.noRequirements;
    
    // Calculate match percentage
    const matches = normalizedTechStack.filter((tech) =>
      normalizedTargetTech.some((target) =>
        tech.includes(target) ||
        target.includes(tech)
      )
    ).length;
    
    const matchRate = matches / normalizedTargetTech.length;
    
    // Find appropriate score using config thresholds
    for (const threshold of this.techFitThresholds) {
      if (matchRate >= threshold.minRate) {
        return threshold.score;
      }
    }
    return this.techFitThresholds[this.techFitThresholds.length - 1].score;
  }

  getGrade(score) {
    for (const threshold of this.gradeThresholds) {
      if (score >= threshold.min) {
        return threshold.grade;
      }
    }
    return this.gradeThresholds[this.gradeThresholds.length - 1].grade;
  }
}

module.exports = new LeadScoringService();
