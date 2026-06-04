import { MainLayout } from "@/components/layout/MainLayout";
import { InboxContainer } from "@/components/inbox/InboxContainer";

const InboxMain = () => {
  return (
    <MainLayout fullHeight>
      <InboxContainer fullHeight />
    </MainLayout>
  );
};

export default InboxMain;
