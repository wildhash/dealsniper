const leadScoring = require('../leadScoring');
const config = require('../../config/scoringConfig');

function buildTechCase({ total = 10, matches = 0 }) {
  const targetTech = Array.from({ length: total }, (_, i) => `tech-${i}`);
  const techStack = targetTech.slice(0, matches);
  return { techStack, targetTech };
}

describe('LeadScoringService', () => {
  describe('scoreFunding', () => {
    it('returns 0 when hasFunding is false', () => {
      expect(leadScoring.scoreFunding(false, 100)).toBe(0);
    });

    it('maps tier minimums to configured scores', () => {
      for (const tier of config.fundingTiers) {
        expect(leadScoring.scoreFunding(true, tier.min)).toBe(tier.score);
      }
    });

    it('selects the correct tier between boundaries', () => {
      const sorted = [...config.fundingTiers].sort((a, b) => b.min - a.min);

      for (let i = 0; i < sorted.length - 1; i += 1) {
        const upper = sorted[i];
        const lower = sorted[i + 1];
        const amount = (upper.min + lower.min) / 2;
        expect(leadScoring.scoreFunding(true, amount)).toBe(lower.score);
      }
    });

    it('uses the lowest-tier score for amounts below the smallest min', () => {
      const sorted = [...config.fundingTiers].sort((a, b) => a.min - b.min);
      const lowest = sorted[0];
      expect(leadScoring.scoreFunding(true, lowest.min - 0.01)).toBe(lowest.score);
    });
  });

  describe('scoreHiring', () => {
    it('returns configured base score when isHiring is false', () => {
      expect(leadScoring.scoreHiring(false, 100)).toBe(config.notHiringScore);
    });

    it('maps tier minimums to configured scores', () => {
      for (const tier of config.hiringTiers) {
        expect(leadScoring.scoreHiring(true, tier.min)).toBe(tier.score);
      }
    });

    it('selects the correct tier between boundaries', () => {
      const sorted = [...config.hiringTiers].sort((a, b) => b.min - a.min);

      for (let i = 0; i < sorted.length - 1; i += 1) {
        const upper = sorted[i];
        const lower = sorted[i + 1];
        const count = (upper.min + lower.min) / 2;
        expect(leadScoring.scoreHiring(true, count)).toBe(lower.score);
      }
    });

    it('uses the lowest-tier score for counts below the smallest min when hiring', () => {
      const sorted = [...config.hiringTiers].sort((a, b) => a.min - b.min);
      const lowest = sorted[0];
      expect(leadScoring.scoreHiring(true, lowest.min - 1)).toBe(lowest.score);
    });
  });

  describe('scoreSeniority', () => {
    it('maps configured levels (case-insensitive)', () => {
      for (const [level, score] of Object.entries(config.seniorityScores)) {
        expect(leadScoring.scoreSeniority(level)).toBe(score);
        expect(leadScoring.scoreSeniority(level.toUpperCase())).toBe(score);
      }
    });

    it('defaults to unknown for missing/non-string levels', () => {
      expect(leadScoring.scoreSeniority(undefined)).toBe(config.seniorityScores.unknown);
      expect(leadScoring.scoreSeniority(null)).toBe(config.seniorityScores.unknown);
      expect(leadScoring.scoreSeniority(123)).toBe(config.seniorityScores.unknown);
    });

    it('defaults to unknown for unrecognized levels', () => {
      expect(leadScoring.scoreSeniority('not-a-level')).toBe(config.seniorityScores.unknown);
    });
  });

  describe('scoreTechFit', () => {
    it('uses configured fallback scores', () => {
      expect(leadScoring.scoreTechFit([], ['React'])).toBe(config.techFitFallbacks.noTechStack);
      expect(leadScoring.scoreTechFit(['React'], [])).toBe(config.techFitFallbacks.noRequirements);
    });

    it('maps match rates to configured thresholds', () => {
      const sorted = [...config.techFitThresholds].sort((a, b) => b.minRate - a.minRate);
      const total = 1000;

      for (let i = 0; i < sorted.length; i += 1) {
        const threshold = sorted[i];
        const upperBound = i === 0 ? 1 : sorted[i - 1].minRate;

        const minMatches = Math.ceil(threshold.minRate * total);
        const maxMatches = i === 0 ? total : Math.floor(upperBound * total) - 1;
        expect(minMatches).toBeLessThanOrEqual(maxMatches);

        const matches = Math.max(0, Math.min(total, minMatches));
        const base = buildTechCase({ total, matches });
        const techStack = matches === 0 ? ['no-match'] : base.techStack;

        expect(leadScoring.scoreTechFit(techStack, base.targetTech)).toBe(threshold.score);
      }
    });

    it('uses the lowest threshold when match rate is 0 with non-empty inputs', () => {
      const sorted = [...config.techFitThresholds].sort((a, b) => a.minRate - b.minRate);
      const lowest = sorted[0];
      expect(leadScoring.scoreTechFit(['no-match'], ['target'])).toBe(lowest.score);
    });

    it('handles partial string matching', () => {
      const sorted = [...config.techFitThresholds].sort((a, b) => b.minRate - a.minRate);
      expect(leadScoring.scoreTechFit(['ReactJS', 'NodeJS'], ['React', 'Node'])).toBe(sorted[0].score);
    });
  });

  describe('getGrade', () => {
    it('maps grade threshold boundaries from config', () => {
      for (const threshold of config.gradeThresholds) {
        expect(leadScoring.getGrade(threshold.min)).toBe(threshold.grade);
      }
    });

    it('uses the lowest grade below the smallest min', () => {
      const sorted = [...config.gradeThresholds].sort((a, b) => a.min - b.min);
      const lowest = sorted[0];
      expect(leadScoring.getGrade(lowest.min - 1)).toBe(lowest.grade);
    });

  });

  describe('calculateScore', () => {
    it('verifies weights sum to 100', () => {
      const totalWeight = Object.values(config.weights).reduce((sum, w) => sum + w, 0);
      expect(totalWeight).toBe(100);
    });

    it('computes weighted totals from component scores and rounds to an integer', () => {
      const data = {
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'senior',
        ...buildTechCase({ total: 5, matches: 3 })
      };

      const result = leadScoring.calculateScore(data);

      const rawTotal =
        result.scores.funding * config.weights.funding / 100 +
        result.scores.hiring * config.weights.hiring / 100 +
        result.scores.seniority * config.weights.seniority / 100 +
        result.scores.techFit * config.weights.techFit / 100;

      expect(result.total).toBe(Math.round(rawTotal));
      expect(Number.isInteger(result.total)).toBe(true);
    });

    it('uses the rounded total when grading', () => {
      const data = {
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 20,
        seniorityLevel: 'unknown',
        techStack: [],
        targetTech: ['React']
      };

      const spy = jest.spyOn(leadScoring, 'getGrade');
      const result = leadScoring.calculateScore(data);
      const rawTotal =
        result.scores.funding * config.weights.funding / 100 +
        result.scores.hiring * config.weights.hiring / 100 +
        result.scores.seniority * config.weights.seniority / 100 +
        result.scores.techFit * config.weights.techFit / 100;

      expect(Number.isInteger(rawTotal)).toBe(false);
      expect(result.total).toBe(Math.round(rawTotal));

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(result.total);
      expect(spy).toHaveBeenCalledWith(Math.round(rawTotal));
      spy.mockRestore();
    });

    it('returns a stable output shape', () => {
      const data = {
        hasFunding: true,
        fundingAmount: 10,
        isHiring: true,
        hiringCount: 5,
        seniorityLevel: 'mid',
        ...buildTechCase({ total: 5, matches: 2 })
      };

      const result = leadScoring.calculateScore(data);

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
  });

});
