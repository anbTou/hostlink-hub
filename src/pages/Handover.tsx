import { MainLayout } from "@/components/layout/MainLayout";
import { HandoverBoard } from "@/components/handover/HandoverBoard";

const Handover = () => {
  return (
    <MainLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Handover</h1>
        <p className="text-sm text-muted-foreground">
          Everything the next shift needs to know — nothing falls through the cracks.
        </p>
      </div>
      <HandoverBoard />
    </MainLayout>
  );
};

export default Handover;
