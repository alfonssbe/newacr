import prismadb from "@/lib/prismadb";
import { SeriesForm } from "./components/series-form";


const SeriesPage = async (
  props: {
    params: Promise<{ seriesId: string }>
  }
) => {
  const params = await props.params;
  const series = await prismadb.allCategory.findUnique({
    where: {
      id: params.seriesId,
      type: "Series"
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SeriesForm initialData={series} />
      </div>
    </div>
  );
}

export default SeriesPage;
