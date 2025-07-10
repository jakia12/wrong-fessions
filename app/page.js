export const dynamic = "force-dynamic";

import { revalidatePath } from "next/cache";
import Image from "next/image";
import CommentReplyToggle from "./comment-reply-toggle";
import { TrollFession } from "./models";
import { dbConnect } from "./mongoose";
import TrollFessionForm from "./troll-fession-form";
import VoteButtons from "./vote-buttons";

import bg from "@/public/bg.jpg";
import AutoRefresh from "./auto-refresh";

// Server Action: Create a new troll-fession
async function createTrollFession(formData) {
  "use server";
  const content = formData.get("content");
  if (
    !content ||
    typeof content !== "string" ||
    content.length === 0 ||
    content.length > 500
  )
    return;
  await dbConnect();
  await TrollFession.create({ content });
  revalidatePath("/");
}

// Server Action: Like/dislike a troll-fession
async function voteTrollFession(id, type) {
  "use server";
  await dbConnect();
  const update =
    type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
  await TrollFession.findByIdAndUpdate(id, update);
  revalidatePath("/");
}

// Server Action: Reply to a troll-fession
async function replyTrollFession(id, formData) {
  "use server";
  const content = formData.get("reply");
  if (
    !content ||
    typeof content !== "string" ||
    content.length === 0 ||
    content.length > 500
  )
    return;
  await dbConnect();
  await TrollFession.findByIdAndUpdate(id, {
    $push: { replies: { content } },
  });
  revalidatePath("/");
}

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

export default async function Page() {
  const trollFessions = await getTrollFessions();
  const { top3, recent } = getTop3AndRecent(trollFessions);
  return (
    <div className="relative">
      <AutoRefresh />
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
            cannot be verified. Troll at your own risk.
          </p>
          <p className="text-xs [color:var(--color-secondary)] mt-1">
            Our website updates every 15 seconds to show the latest
            wrong-fessions.
          </p>
        </header>

        <TrollFessionForm createTrollFession={createTrollFession} />
        {/* TOP 3 SECTION */}
        <section className="w-full max-w-2xl mb-10 ">
          <h2 className="text-2xl font-bold text-center mb-6 [color:var(--color-primary)] flex items-center justify-center gap-3">
            {/* Trophy icon left */}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--color-secondary)" }}
              >
                <g>
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5zM7 5H5a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2h-2"
                  />
                </g>
              </svg>
            </span>
            TOP 3 WRONG-FESSIONS OF THE DAY
            {/* Trophy icon right */}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--color-secondary)" }}
              >
                <g>
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 21h8M12 17v4M17 5V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a5 5 0 0 0 5 5 5 5 0 0 0 5-5zM7 5H5a2 2 0 0 0-2 2v2a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V7a2 2 0 0 0-2-2h-2"
                  />
                </g>
              </svg>
            </span>
          </h2>
          <div className="flex flex-col gap-6">
            {top3.length === 0 && (
              <div className="text-center text-[#aaa]">
                No top wrong-fessions yet.
              </div>
            )}
            {top3.map((troll, idx) => (
              <div
                key={troll._id}
                className="bg-[#00000080] border-2 border-[color:var(--color-primary)] rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="[color:var(--color-secondary)] font-bold flex items-center gap-2">
                    {/* Icon for top 1, 2, 3 */}
                    {idx === 0 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#f9b923" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                        />
                      </svg>
                    )}
                    {idx === 1 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#b0b0b0" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#b0b0b0"
                          fontWeight="bold"
                        >
                          2
                        </text>
                      </svg>
                    )}
                    {idx === 2 && (
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: "#cd7f32" }}
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <text
                          x="12"
                          y="16"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#cd7f32"
                          fontWeight="bold"
                        >
                          3
                        </text>
                      </svg>
                    )}
                    ANONYMOUS WRONG #{idx + 1}
                  </span>
                  <span className="text-xs text-[#aaa]">
                    {new Date(troll.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-lg mb-3 [color:var(--color-primary)] whitespace-pre-line">
                  {troll.content}
                </div>
                <VoteButtons
                  id={troll._id}
                  likes={troll.likes}
                  dislikes={troll.dislikes}
                />
                <CommentReplyToggle
                  postId={troll._id.toString()}
                  replies={troll.replies}
                />
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-[#aaa] mt-4">
            Most upvoted confessions from the past 24 hours • Updates daily from
            Supabase.
          </div>
        </section>

        {/* RECENT SECTION */}
        <section className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-6 [color:var(--color-primary)]">
            RECENT WRONG-FESSIONS (100)
          </h2>
          <div className="flex flex-col gap-6">
            {recent.length === 0 && (
              <div className="text-center text-[#aaa]">
                No recent wrong-fessions yet.
              </div>
            )}
            {recent.map((troll, idx) => (
              <div
                key={troll._id}
                className="bg-[#00000080] border-2 border-[color:var(--color-primary)] rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="[color:var(--color-secondary)] font-bold">
                    ANONYMOUS WRONG #{idx + 1 + top3.length}
                  </span>
                  <span className="text-xs text-[#aaa]">
                    {new Date(troll.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-lg mb-3 [color:var(--color-primary)] whitespace-pre-line">
                  {troll.content}
                </div>
                <VoteButtons
                  id={troll._id}
                  likes={troll.likes}
                  dislikes={troll.dislikes}
                />
                <CommentReplyToggle
                  postId={troll._id.toString()}
                  replies={troll.replies}
                />
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-[#aaa] mt-4">
            Showing 100 most recent wrong-fessions from Supabase
            <br />
            Auto-refreshes every 30 seconds • Data persists permanently in
            database
            <br />
            All posts and comments are stored permanently and never disappear
          </div>
        </section>

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
                Share your thoughts, confessions, or troll moments anonymously
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
