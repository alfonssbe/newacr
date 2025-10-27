import prismadb from "@/lib/prismadb";
import { HeroForm } from "./components/hero-form";

const HeroPage = async (
  props: {
    params: Promise<{ heroId: string }>
  }
) => {
  const params = await props.params;
  const onehero = await prismadb.hero.findUnique({
    where: {
      id: params.heroId,
    },
    include: {
      hero_img: true
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroForm 
          initialData={onehero}
        />
      </div>
    </div>
  );
}

export default HeroPage;

