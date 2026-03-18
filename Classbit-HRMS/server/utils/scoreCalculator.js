/**
 * Calculates the Total Performance Score based on KPIs and OKRs.
 * 
 * Logic:
 * 1. KPIs are typically evaluated as (actual / target) * 100.
 * 2. OKRs have intrinsic "completion" percentages and "weightage" percentages.
 * 3. Total Score = Weighted sum of OKRs + Average completion of KPIs (normalized to 100).
 *    (Assuming OKRs constitute a portion of the score or we just return an aggregate object).
 * 
 * Example Input JSON:
 * {
 *   "kpis": [
 *     { "name": "Sales Target", "actual": 120000, "target": 100000 },
 *     { "name": "Customer Satisfaction", "actual": 4.5, "target": 4.8 }
 *   ],
 *   "okrs": [
 *     { "title": "Launch New Product", "completion": 80, "weightage": 60 },
 *     { "title": "Reduce Churn", "completion": 95, "weightage": 40 }
 *   ]
 * }
 * 
 * Example Output JSON:
 * {
 *   "kpiScore": 106.87,
 *   "okrScore": 86.00,
 *   "totalPerformanceScore": 96.44
 * }
 */

const calculatePerformanceScore = (kpis = [], okrs = []) => {
    // 1. Calculate KPI Score (Average of all KPI achievements)
    let kpiScore = 0;
    if (kpis.length > 0) {
        const totalKpiAchievement = kpis.reduce((sum, kpi) => {
            // Cap overachievement at 150% to prevent extreme outliers, 
            // or just use standard (actual / target)
            const achievement = (kpi.actual / kpi.target) * 100;
            return sum + achievement;
        }, 0);
        kpiScore = totalKpiAchievement / kpis.length;
    }

    // 2. Calculate OKR Score (Weighted average of OKR completions)
    let okrScore = 0;
    if (okrs.length > 0) {
        let totalWeight = 0;
        const weightedSum = okrs.reduce((sum, okr) => {
            totalWeight += okr.weightage;
            return sum + (okr.completion * (okr.weightage / 100));
        }, 0);
        
        // Normalize if total weights don't exactly equal 100%
        okrScore = totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : 0;
    }

    // 3. Blended Total Score (Assuming 50/50 split between KPIs and OKRs for the final score, 
    // customizable based on business logic)
    let totalPerformanceScore = 0;
    if (kpis.length > 0 && okrs.length > 0) {
        totalPerformanceScore = (kpiScore * 0.5) + (okrScore * 0.5);
    } else if (kpis.length > 0) {
        totalPerformanceScore = kpiScore;
    } else if (okrs.length > 0) {
        totalPerformanceScore = okrScore;
    }

    return {
        kpiScore: Number(kpiScore.toFixed(2)),
        okrScore: Number(okrScore.toFixed(2)),
        totalPerformanceScore: Number(totalPerformanceScore.toFixed(2))
    };
};

module.exports = { calculatePerformanceScore };
