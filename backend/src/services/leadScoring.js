/**
 * Lead Scoring Service
 * Computes a lead score based on various triggers:
 * - Funding events
 * - Hiring activity
 * - Role seniority
 * - Tech fit
 */

class LeadScoringService {
  constructor() {
    this.weights = {
      funding: 30,
      hiring: 25,
      seniority: 25,
      techFit: 20
    };
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

    return {
      scores,
      total: Math.round(total),
      grade: this.getGrade(total)
    };
  }

  scoreFunding(hasFunding, amount) {
    if (!hasFunding) return 0;
    
    // Score based on funding amount (in millions)
    if (amount >= 50) return 100;
    if (amount >= 20) return 85;
    if (amount >= 10) return 70;
    if (amount >= 5) return 60;
    if (amount > 0) return 50;
    return 40; // Has funding but amount unknown
  }

  scoreHiring(isHiring, count) {
    if (!isHiring) return 20; // Base score
    
    // Score based on number of open positions
    if (count >= 20) return 100;
    if (count >= 10) return 85;
    if (count >= 5) return 70;
    if (count >= 2) return 60;
    if (count >= 1) return 50;
    return 40;
  }

  scoreSeniority(level) {
    const seniorityScores = {
      'exec': 100,      // C-level, VP
      'senior': 80,     // Director, Senior Manager
      'mid': 60,        // Manager, Senior IC
      'junior': 40,     // Entry level
      'unknown': 30
    };
    return seniorityScores[level.toLowerCase()] || seniorityScores['unknown'];
  }

  scoreTechFit(techStack, targetTech) {
    if (!techStack || techStack.length === 0) return 30; // No data
    if (!targetTech || targetTech.length === 0) return 50; // No requirements
    
    // Calculate match percentage
    const matches = techStack.filter(tech => 
      targetTech.some(target => 
        tech.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(tech.toLowerCase())
      )
    ).length;
    
    const matchRate = matches / targetTech.length;
    
    if (matchRate >= 0.8) return 100;
    if (matchRate >= 0.6) return 85;
    if (matchRate >= 0.4) return 70;
    if (matchRate >= 0.2) return 55;
    return 40;
  }

  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  }
}

module.exports = new LeadScoringService();
