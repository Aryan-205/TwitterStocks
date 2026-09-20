// Worker: GH Archive ingester, hot-tier poller, index computer, IPO settler, liquidator, daily settlement
// Build behind EngagementSource interface; simulated feed first.

export interface EngagementSource {
  fetchDeltas(creatorIds: string[]): Promise<Map<string, { deltaStars:number; deltaFollowers:number; mergedPRs:number; commits:number; releases:number; issuesClosed:number }>>;
}

export class SimulatedFeed implements EngagementSource {
  async fetchDeltas(ids: string[]) {
    const m = new Map();
    for (const id of ids) m.set(id, { deltaStars: Math.floor(Math.random()*5), deltaFollowers: Math.floor(Math.random()*2), mergedPRs: Math.random()<0.1?1:0, commits: Math.floor(Math.random()*3), releases: 0, issuesClosed: Math.floor(Math.random()*2) });
    return m;
  }
}

console.log("worker placeholder — implement GH Archive + hot-tier poller per spec");
