import Report from "../models/report.model.js";

export const getWardAnalytics = async (req, res) => {
  try {
    
    const reports = await Report.find();


//     const wardStats = await Report.aggregate([
//   {
//     $group: {
//       _id: "$ward",
//       total: { $sum: 1 },
//       pending: {
//         $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
//       },
//       progress: {
//         $sum: { $cond: [{ $eq: ["$status", "progress"] }, 1, 0] }
//       },
//       cleaned: {
//         $sum: { $cond: [{ $eq: ["$status", "cleaned"] }, 1, 0] }
//       }
//     }
//   }
// ]);



    const wardMap = {};
    reports.forEach((r) => {
      const ward = r.ward || 0;
      if (!wardMap[ward]) {
        wardMap[ward] = {
          ward,
          total: 0,
          pending: 0,
          progress: 0,
          cleaned: 0,
        };
      }
      wardMap[ward].total++;

      if (r.status === "pending") wardMap[ward].pending++;
      if (r.status === "progress") wardMap[ward].progress++;
      if (r.status === "cleaned") wardMap[ward].cleaned++;
    });
    const wardStats = Object.values(wardMap);

    // find most problematic ward (highest total reports)
    let mostProblematicWard = null;
    let max = 0;
    wardStats.forEach((w) => {
      if (w.total > max) {
        max = w.total;
        mostProblematicWard = w.ward;
      }
    });
    res.json({
      wardStats,
      mostProblematicWard,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
