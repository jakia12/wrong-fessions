export const dynamic = "force-dynamic";

import Image from "next/image";
import { TrollFession } from "./models";
import { dbConnect } from "./mongoose";

import bg from "@/public/bg.jpg";
import DynamicContent from "./dynamic-content";
import Link from "next/link";

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

  // Calculate engagement score (likes + comments) for each post
  const postsWithScore = recent24h.map((post) => ({
    ...post,
    engagementScore: (post.likes || 0) + (post.replies?.length || 0),
  }));

  // Sort by engagement score (likes + comments), then by likes, then by creation date
  const sorted = postsWithScore.sort((a, b) => {
    // First sort by total engagement score
    if (b.engagementScore !== a.engagementScore) {
      return b.engagementScore - a.engagementScore;
    }
    // If engagement is equal, sort by likes
    if (b.likes !== a.likes) {
      return b.likes - a.likes;
    }
    // If likes are equal, sort by creation date (newer first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const top3 = sorted.slice(0, 3);

  // Exclude top3 from recent
  const top3Ids = new Set(top3.map((t) => t._id.toString()));
  const recent = trollFessions
    .filter((t) => !top3Ids.has(t._id.toString()))
    .slice(0, 100);

  return { top3, recent };
}

// Serialize MongoDB objects to plain objects
function serializeData(data) {
  return JSON.parse(JSON.stringify(data));
}

export default async function Page() {
  const trollFessions = await getTrollFessions();
  const { top3, recent } = getTop3AndRecent(trollFessions);

  // Serialize the data before passing to client components
  const serializedTop3 = serializeData(top3);
  const serializedRecent = serializeData(recent);

  return (
    <div className="relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src={bg}
            alt="Background"
            className="object-cover"
            fill
            priority
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgb(0 20 27 / 82%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        ></div>
      </div>
      {/* Content */}
      <div className="z-50  relative min-h-screen text-[color:var(--color-primary)] font-mono flex flex-col items-center py-8 px-2">
        <header className="mb-8 text-center">
          <h1
            className="text-4xl font-extrabold tracking-widest mb-2"
            style={{ textShadow: "0 0 8px var(--color-secondary)" }}
          >
            WRONG-FESSIONS
          </h1>
          <p className="text-lg [color:var(--color-secondary)] mb-1">
            ANONYMOUS CONFESSIONS FROM THE WRONG COMMUNITY
          </p>
          <p className="text-xs text-[#aaa]">
            Warning: Everything posted on this message board is anonymous and
            cannot be verified. Wrong-fession at your own risk.
          </p>
          <p className="text-xs [color:var(--color-secondary)] mt-1">
            Our website updates every 15 seconds to show the latest
            wrong-fessions.
          </p>
        </header>

        <DynamicContent
          initialTop3={serializedTop3}
          initialRecent={serializedRecent}
        />

        {/* HOW IT WORKS SECTION */}
        <section className="w-full max-w-4xl my-10">
          <h2
            className="text-3xl font-extrabold text-center mb-6 tracking-widest"
            style={{ textShadow: "0 0 8px #00ff00" }}
          >
            HOW IT WORKS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="border border-[#d6ff00] rounded p-4 text-center">
              <span className="text-[#00ff00] font-bold">1. WRITE</span>
              <div className="mt-2 text-white">
                Share your thoughts, confessions, or wrong moments anonymously
              </div>
            </div>
            <div className="border border-[#d6ff00] rounded p-4 text-center">
              <span className="text-[#00ff00] font-bold">2. VOTE</span>
              <div className="mt-2 text-white">
                Upvote or downvote posts you like or dislike (one vote per post)
              </div>
            </div>
            <div className="border border-[#d6ff00] rounded p-4 text-center">
              <span className="text-[#00ff00] font-bold">3. COMMENT</span>
              <div className="mt-2 text-white">
                Reply to any confession with anonymous comments
              </div>
            </div>
            <div className="border border-[#d6ff00] rounded p-4 text-center">
              <span className="text-[#00ff00] font-bold">4. PERMANENT</span>
              <div className="mt-2 text-white">
                All posts and comments are stored permanently in the database
              </div>
            </div>
          </div>
        </section>

        

        <footer className="mt-16 text-xs text-[#aaa] text-center">
          &copy; {new Date().getFullYear()} WRONG-FESSIONS. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
