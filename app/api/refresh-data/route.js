import { TrollFession } from "../../models";
import { dbConnect } from "../../mongoose";

// Fetch all troll-fessions
async function getTrollFessions() {
  await dbConnect();
  return TrollFession.find().sort({ likes: -1, createdAt: -1 }).lean();
}

function getTop3AndRecent(trollFessions) {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  // Only consider posts from last 24h for top 3
  const recent24h = trollFessions.filter(
    (t) => now - new Date(t.createdAt).getTime() < DAY
  );
  // Sort by (likes + replies.length)
  const sorted = [...recent24h].sort(
    (a, b) =>
      b.likes + (b.replies?.length || 0) - (a.likes + (a.replies?.length || 0))
  );
  const top3 = sorted.slice(0, 3);
  // Exclude top3 from recent
  const top3Ids = new Set(top3.map((t) => t._id.toString()));
  const recent = trollFessions
    .filter((t) => !top3Ids.has(t._id.toString()))
    .slice(0, 100);
  return { top3, recent };
}

export async function GET() {
  try {
    const trollFessions = await getTrollFessions();
    const { top3, recent } = getTop3AndRecent(trollFessions);

    return Response.json({
      success: true,
      data: {
        top3,
        recent,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
