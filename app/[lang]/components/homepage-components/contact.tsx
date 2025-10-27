import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Contact: React.FC = () => {
  const t = useTranslations('contact Home');
  return (
    <div className="relative w-full h-fit bg-white">
     <div className="container mx-auto xl:px-24 lg:px-16 px-10 py-4 h-fit block items-center">
          <h2 className='md:text-base text-sm text-black pb-4 justify-center flex text-center'>
            {t('contact-placeholder')}
          </h2>
          <div className='pb-4 justify-center flex'>
            <Button variant="outline" size={"lg"} asChild className='rounded-full'>
              <Link href={"https://wa.me/6281231833504?text=Halo,%20saya%20mau%20bertanya%20mengenai%20produk%20ACR."} target="_blank">
                <div className='bg-primary rounded-full p-1.5 mr-2'>
                  <Phone size={20} className='text-transparent fill-background'/>
                </div>
                <h3>+62 812-3183-3504</h3>
              </Link>
            </Button>
          </div>
      </div>
    </div>
  );
}

export default Contact;