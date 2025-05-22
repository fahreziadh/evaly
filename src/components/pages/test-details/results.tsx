import SectionStats from "./results.section-stats";
import SectionProgress from "./results.section-progress";
import SectionLeaderboards from "./results.section-leaderboards";
const Results = () => {
  return (
      <div className="grid grid-cols-6 gap-4">
        <SectionStats className="col-span-6" />
        <SectionProgress className="col-span-4" />
        <SectionLeaderboards className="col-span-2" />
      </div>
    );
};

export default Results;
