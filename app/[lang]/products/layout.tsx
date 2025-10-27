import { Metadata } from "next"
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ lang?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang = 'id' } = await props.params
  const t = await getTranslations({ locale: lang, namespace: 'SEO Metadata JsonLd' });
  return {
    title: `${t('generateMetadata-title-alldrivers')}`,
    description: `${t('generateMetadata-description-alldrivers')}`,
  }
}

export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <>
          {children}
        </>
    )
}