/**
 * Lead Scoring Service Tests
 * 
 * Tests all scoring logic boundaries and weighted total calculations
 */

const leadScoring = require('../leadScoring');
const config = require('../../config/scoringConfig');

describe('LeadScoringService', () => {
  describe('Funding Tier Boundaries', () => {
    it('should return 0 when hasFunding is false', () => {
      const result = leadScoring.calculateScore({
        hasFunding: false,
        fundingAmount: 100
      });
      expect(result.scores.funding).toBe(0);
    });

    it('should score 50 for funding amount > 0 but < 5', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 3
      });
      expect(result.scores.funding).toBe(50);
    });

    it('should score 60 at funding tier boundary (5M)', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 5
      });
      expect(result.scores.funding).toBe(60);
    });

    it('should score 70 at funding tier boundary (10M)', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 10
      });
      expect(result.scores.funding).toBe(70);
    });

    it('should score 85 at funding tier boundary (20M)', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 20
      });
      expect(result.scores.funding).toBe(85);
    });

    it('should score 100 at funding tier boundary (50M)', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 50
      });
      expect(result.scores.funding).toBe(100);
    });

    it('should score 100 for funding above 50M', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 100
      });
      expect(result.scores.funding).toBe(100);
    });

    it('should score 40 when has funding but amount is 0 (unknown)', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 0
      });
      expect(result.scores.funding).toBe(40);
    });
  });

  describe('Hiring Tier Boundaries', () => {
    it('should return notHiringScore (20) when isHiring is false', () => {
      const result = leadScoring.calculateScore({
        isHiring: false,
        hiringCount: 100
      });
      expect(result.scores.hiring).toBe(config.notHiringScore);
    });

    it('should score 40 when hiring with 0 count', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 0
      });
      expect(result.scores.hiring).toBe(40);
    });

    it('should score 50 at hiring tier boundary (1 position)', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 1
      });
      expect(result.scores.hiring).toBe(50);
    });

    it('should score 60 at hiring tier boundary (2 positions)', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 2
      });
      expect(result.scores.hiring).toBe(60);
    });

    it('should score 70 at hiring tier boundary (5 positions)', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 5
      });
      expect(result.scores.hiring).toBe(70);
    });

    it('should score 85 at hiring tier boundary (10 positions)', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 10
      });
      expect(result.scores.hiring).toBe(85);
    });

    it('should score 100 at hiring tier boundary (20 positions)', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 20
      });
      expect(result.scores.hiring).toBe(100);
    });

    it('should score 100 for hiring above 20 positions', () => {
      const result = leadScoring.calculateScore({
        isHiring: true,
        hiringCount: 50
      });
      expect(result.scores.hiring).toBe(100);
    });
  });

  describe('Seniority Mapping', () => {
    it('should score 40 for junior level', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'junior'
      });
      expect(result.scores.seniority).toBe(40);
    });

    it('should score 60 for mid level', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'mid'
      });
      expect(result.scores.seniority).toBe(60);
    });

    it('should score 80 for senior level', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'senior'
      });
      expect(result.scores.seniority).toBe(80);
    });

    it('should score 100 for exec level', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'exec'
      });
      expect(result.scores.seniority).toBe(100);
    });

    it('should score 30 for unknown level', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'unknown'
      });
      expect(result.scores.seniority).toBe(30);
    });

    it('should be case-insensitive', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'EXEC'
      });
      expect(result.scores.seniority).toBe(100);
    });

    it('should default to unknown for unrecognized levels', () => {
      const result = leadScoring.calculateScore({
        seniorityLevel: 'invalid'
      });
      expect(result.scores.seniority).toBe(30);
    });
  });

  describe('TechFit Match Thresholds', () => {
    it('should return 30 when techStack is empty', () => {
      const result = leadScoring.calculateScore({
        techStack: [],
        targetTech: ['React', 'Node.js']
      });
      expect(result.scores.techFit).toBe(30);
    });

    it('should return 50 when targetTech is empty', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Node.js'],
        targetTech: []
      });
      expect(result.scores.techFit).toBe(50);
    });

    it('should score 40 for 0% match (match rate < 0.2)', () => {
      const result = leadScoring.calculateScore({
        techStack: ['Python', 'Django'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      expect(result.scores.techFit).toBe(40);
    });

    it('should score 55 at 20% match threshold (1 out of 5)', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Python', 'Django'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      // 1 match out of 5 = 0.2 = 20%
      expect(result.scores.techFit).toBe(55);
    });

    it('should score 70 at 40% match threshold (2 out of 5)', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Node.js', 'Python', 'Django'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      // 2 matches out of 5 = 0.4 = 40%
      expect(result.scores.techFit).toBe(70);
    });

    it('should score 85 at 60% match threshold (3 out of 5)', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Node.js', 'AWS', 'Python'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      // 3 matches out of 5 = 0.6 = 60%
      expect(result.scores.techFit).toBe(85);
    });

    it('should score 100 at 80% match threshold (4 out of 5)', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'Python'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      // 4 matches out of 5 = 0.8 = 80%
      expect(result.scores.techFit).toBe(100);
    });

    it('should score 100 for 100% match', () => {
      const result = leadScoring.calculateScore({
        techStack: ['React', 'Node.js', 'TypeScript'],
        targetTech: ['React', 'Node.js', 'TypeScript']
      });
      expect(result.scores.techFit).toBe(100);
    });

    it('should handle partial string matching', () => {
      const result = leadScoring.calculateScore({
        techStack: ['ReactJS', 'NodeJS'],
        targetTech: ['React', 'Node']
      });
      // Both should match due to substring matching
      expect(result.scores.techFit).toBe(100);
    });
  });

  describe('Grade Threshold Boundaries', () => {
    it('should assign grade D for score < 40', () => {
      const result = leadScoring.calculateScore({
        hasFunding: false,
        isHiring: false,
        seniorityLevel: 'unknown',
        techStack: []
      });
      // Score: 0*0.3 + 20*0.25 + 30*0.25 + 30*0.2 = 18.5 = 19 rounded
      expect(result.grade).toBe('D');
    });

    it('should assign grade C for score at boundary (40)', () => {
      // Manual calculation: Need total = 40
      // funding:0, hiring:20, seniority:60, techFit:100
      // 0*0.3 + 20*0.25 + 60*0.25 + 100*0.2 = 0 + 5 + 15 + 20 = 40
      const result = leadScoring.calculateScore({
        hasFunding: false,
        isHiring: false,
        seniorityLevel: 'mid',
        techStack: ['React', 'Node.js'],
        targetTech: ['React', 'Node.js']
      });
      expect(result.total).toBe(40);
      expect(result.grade).toBe('C');
    });

    it('should assign grade C+ for score at boundary (50)', () => {
      // funding:40, hiring:50, seniority:60, techFit:50
      // 40*0.3 + 50*0.25 + 60*0.25 + 50*0.2 = 12 + 12.5 + 15 + 10 = 49.5 = 50
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 0,
        isHiring: true,
        hiringCount: 1,
        seniorityLevel: 'mid',
        techStack: ['React'],
        targetTech: []
      });
      expect(result.total).toBe(50);
      expect(result.grade).toBe('C+');
    });

    it('should assign grade B for score at boundary (60)', () => {
      // Need exact 60. Try: funding:70, hiring:60, seniority:60, techFit:40
      // 70*0.3 + 60*0.25 + 60*0.25 + 40*0.2 = 21 + 15 + 15 + 8 = 59
      // Try: funding:60, hiring:70, seniority:60, techFit:40
      // 60*0.3 + 70*0.25 + 60*0.25 + 40*0.2 = 18 + 17.5 + 15 + 8 = 58.5 = 59
      // Try: funding:70, hiring:60, seniority:60, techFit:50
      // 70*0.3 + 60*0.25 + 60*0.25 + 50*0.2 = 21 + 15 + 15 + 10 = 61
      // Try: funding:60, hiring:60, seniority:80, techFit:40
      // 60*0.3 + 60*0.25 + 80*0.25 + 40*0.2 = 18 + 15 + 20 + 8 = 61
      // Try: funding:50, hiring:70, seniority:80, techFit:40
      // 50*0.3 + 70*0.25 + 80*0.25 + 40*0.2 = 15 + 17.5 + 20 + 8 = 60.5 = 61
      // Try: funding:50, hiring:60, seniority:80, techFit:50
      // 50*0.3 + 60*0.25 + 80*0.25 + 50*0.2 = 15 + 15 + 20 + 10 = 60
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 3,
        isHiring: true,
        hiringCount: 2,
        seniorityLevel: 'senior',
        techStack: ['React'],
        targetTech: []
      });
      expect(result.total).toBe(60);
      expect(result.grade).toBe('B');
    });

    it('should assign grade B+ for score at boundary (70)', () => {
      // Need exact 70. Try: funding:70, hiring:70, seniority:80, techFit:55
      // 70*0.3 + 70*0.25 + 80*0.25 + 55*0.2 = 21 + 17.5 + 20 + 11 = 69.5 = 70
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'senior',
        techStack: ['React', 'Python'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      expect(result.total).toBe(70);
      expect(result.grade).toBe('B+');
    });

    it('should assign grade A for score at boundary (80)', () => {
      // funding:85, hiring:85, seniority:80, techFit:70
      // 85*0.3 + 85*0.25 + 80*0.25 + 70*0.2 = 25.5 + 21.25 + 20 + 14 = 80.75 = 81
      // Try: funding:85, hiring:70, seniority:80, techFit:85
      // 85*0.3 + 70*0.25 + 80*0.25 + 85*0.2 = 25.5 + 17.5 + 20 + 17 = 80
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 20,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'senior',
        techStack: ['React', 'Node.js', 'AWS'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      expect(result.total).toBe(80);
      expect(result.grade).toBe('A');
    });

    it('should assign grade A+ for score at boundary (90)', () => {
      // funding:100, hiring:100, seniority:80, techFit:85
      // 100*0.3 + 100*0.25 + 80*0.25 + 85*0.2 = 30 + 25 + 20 + 17 = 92
      // Try: funding:100, hiring:85, seniority:80, techFit:100
      // 100*0.3 + 85*0.25 + 80*0.25 + 100*0.2 = 30 + 21.25 + 20 + 20 = 91.25 = 91
      // Try: funding:100, hiring:100, seniority:60, techFit:100
      // 100*0.3 + 100*0.25 + 60*0.25 + 100*0.2 = 30 + 25 + 15 + 20 = 90
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 50,
        isHiring: true,
        hiringCount: 20,
        seniorityLevel: 'mid',
        techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
        targetTech: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      expect(result.total).toBe(90);
      expect(result.grade).toBe('A+');
    });
  });

  describe('Weighted Total Correctness', () => {
    it('should calculate weighted total correctly', () => {
      const data = {
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'senior',
        techStack: ['React', 'Node.js'],
        targetTech: ['React', 'Node.js', 'TypeScript']
      };
      
      const result = leadScoring.calculateScore(data);
      
      // Manual calculation:
      // funding: 70, hiring: 70, seniority: 80, techFit: 85 (2/3 matches = 66.67% >= 0.6)
      // total = 70*0.3 + 70*0.25 + 80*0.25 + 85*0.2
      //       = 21 + 17.5 + 20 + 17
      //       = 75.5 = 76 (rounded)
      
      expect(result.scores.funding).toBe(70);
      expect(result.scores.hiring).toBe(70);
      expect(result.scores.seniority).toBe(80);
      expect(result.scores.techFit).toBe(85);
      
      const expectedTotal = Math.round(
        result.scores.funding * config.weights.funding / 100 +
        result.scores.hiring * config.weights.hiring / 100 +
        result.scores.seniority * config.weights.seniority / 100 +
        result.scores.techFit * config.weights.techFit / 100
      );
      
      expect(result.total).toBe(expectedTotal);
      expect(result.total).toBe(76);
    });

    it('should verify weights sum to 100', () => {
      const totalWeight = Object.values(config.weights).reduce((sum, w) => sum + w, 0);
      expect(totalWeight).toBe(100);
    });

    it('should handle all zeros correctly', () => {
      const result = leadScoring.calculateScore({
        hasFunding: false,
        isHiring: false,
        seniorityLevel: 'unknown',
        techStack: []
      });
      
      // funding: 0, hiring: 20, seniority: 30, techFit: 30
      // total = 0*0.3 + 20*0.25 + 30*0.25 + 30*0.2 = 0 + 5 + 7.5 + 6 = 18.5 = 19
      expect(result.total).toBe(19);
    });

    it('should handle perfect score correctly', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 100,
        isHiring: true,
        hiringCount: 50,
        seniorityLevel: 'exec',
        techStack: ['React', 'Node.js'],
        targetTech: ['React', 'Node.js']
      });
      
      // All 100s: 100*0.3 + 100*0.25 + 100*0.25 + 100*0.2 = 100
      expect(result.total).toBe(100);
      expect(result.grade).toBe('A+');
    });
  });

  describe('Output Format', () => {
    it('should return correct output structure', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'mid',
        techStack: ['React'],
        targetTech: ['React', 'Node.js']
      });
      
      expect(result).toHaveProperty('scores');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('grade');
      
      expect(result.scores).toHaveProperty('funding');
      expect(result.scores).toHaveProperty('hiring');
      expect(result.scores).toHaveProperty('seniority');
      expect(result.scores).toHaveProperty('techFit');
      
      expect(typeof result.total).toBe('number');
      expect(typeof result.grade).toBe('string');
    });

    it('should round total to nearest integer', () => {
      const result = leadScoring.calculateScore({
        hasFunding: true,
        fundingAmount: 5,
        isHiring: true,
        hiringCount: 1,
        seniorityLevel: 'mid',
        techStack: ['React'],
        targetTech: []
      });
      
      // 60*0.3 + 50*0.25 + 60*0.25 + 50*0.2 = 18 + 12.5 + 15 + 10 = 55.5
      expect(result.total).toBe(56);
    });
  });
});
