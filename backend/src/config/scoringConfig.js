/**
 * Lead Scoring Configuration
 * 
 * This module centralizes all magic numbers and thresholds used in lead scoring.
 * Adjust these values to tune the scoring algorithm for your specific use case.
 * 
 * TUNING GUIDANCE:
 * - weights: Total must = 100. Adjust based on what matters most to your sales process.
 * - fundingTiers: Set thresholds based on your target market (enterprise vs SMB).
 * - hiringTiers: Higher hiring counts indicate growth; adjust for company size.
 * - seniorityScores: Weight based on who you typically sell to (C-level vs ICs).
 * - techFitThresholds: Match rate importance depends on technical product fit.
 * - gradeThresholds: Letter grades for segmentation and prioritization.
 */

module.exports = {
  /**
   * Scoring weights (must sum to 100)
   * These determine the relative importance of each scoring factor
   */
  weights: {
    funding: 30,    // Recent funding indicates budget availability
    hiring: 25,     // Active hiring signals growth and pain points
    seniority: 25,  // Higher seniority = decision-making authority
    techFit: 20     // Tech stack alignment indicates product fit
  },

  /**
   * Funding amount tiers (in millions USD)
   * Higher funding typically means more budget and urgency
   */
  fundingTiers: [
    { min: 50, score: 100 },   // Series C+ / Large rounds
    { min: 20, score: 85 },    // Series B range
    { min: 10, score: 70 },    // Series A range
    { min: 5, score: 60 },     // Seed/Early stage
    { min: 0.01, score: 50 },  // Has funding (amount > 0)
    { min: 0, score: 40 }      // Has funding flag but amount unknown
  ],

  /**
   * Hiring activity tiers
   * More open positions = faster growth and more pain points
   */
  hiringTiers: [
    { min: 20, score: 100 },   // Rapid scaling
    { min: 10, score: 85 },    // Strong growth
    { min: 5, score: 70 },     // Moderate growth
    { min: 2, score: 60 },     // Starting to grow
    { min: 1, score: 50 },     // Minimal hiring
    { min: 0, score: 40 }      // Not actively hiring (but isHiring=true)
  ],

  /**
   * Base score when not hiring at all
   */
  notHiringScore: 20,

  /**
   * Seniority level scores
   * Map contact title/role to scoring based on decision-making authority
   */
  seniorityScores: {
    exec: 100,      // C-level, VP - final decision makers
    senior: 80,     // Director, Senior Manager - strong influencers
    mid: 60,        // Manager, Senior IC - influencers
    junior: 40,     // Entry level - users but limited authority
    unknown: 30     // No data available
  },

  /**
   * Tech fit scoring thresholds
   * Based on match rate (matches / targetTech.length)
   */
  techFitThresholds: [
    { minRate: 0.8, score: 100 },  // 80%+ match - excellent fit
    { minRate: 0.6, score: 85 },   // 60-79% match - strong fit
    { minRate: 0.4, score: 70 },   // 40-59% match - good fit
    { minRate: 0.2, score: 55 },   // 20-39% match - partial fit
    { minRate: 0, score: 40 }      // <20% match - weak fit
  ],

  /**
   * Tech fit fallback scores
   */
  techFitFallbacks: {
    noTechStack: 30,      // No tech stack data available
    noRequirements: 50    // No target tech specified
  },

  /**
   * Grade thresholds for lead quality tiers
   * Used for segmentation and prioritization
   */
  gradeThresholds: [
    { min: 90, grade: 'A+' },  // Hot leads - immediate action
    { min: 80, grade: 'A' },   // Very strong - high priority
    { min: 70, grade: 'B+' },  // Strong - good prospects
    { min: 60, grade: 'B' },   // Good - worth pursuing
    { min: 50, grade: 'C+' },  // Moderate - lower priority
    { min: 40, grade: 'C' },   // Fair - nurture/low touch
    { min: 0, grade: 'D' }     // Low priority - consider filtering
  ]
};
