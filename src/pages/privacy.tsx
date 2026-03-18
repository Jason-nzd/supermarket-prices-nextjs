import StandardPageLayout from "@/components/layout/StandardPageLayout";
import { DBGetMostRecentDate } from "@/lib/db/cosmos";

interface Props {
  lastChecked: string;
}

export default function Privacy({ lastChecked }: Props) {
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      {/* Page Title */}
      <div className="grid-title">Privacy & Cookie Policy</div>
      <div className="max-w-3xl mx-auto min-h-[calc(100vh-20em)] px-2">
        <p>
          Each user can choose favourite categories to appear at the top menu.
          These categories are saved as a cookie with session expiry. The
          website can still fully function if cookies are disabled.
        </p>
        <p className="mt-2">No other information is stored or collected.</p>
      </div>
    </StandardPageLayout>
  );
}

export async function getStaticProps() {
  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      lastChecked,
    },
  };
}
