import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'ACR Page Not Found',
}

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="w-full text-center">
        <div className="text-3xl font-bold text-black pb-3">
          ERROR 404
        </div>
        <Separator className="bg-primary w-56 h-2 mx-auto" />
        <div className="text-base text-black py-3">
          Maaf Halaman ini Rusak, boleh kembali ke homepage dulu ya
        </div>
        <Image
          src="/images/acr/notfoundman.webp"
          alt="ACR Not Found"
          width={500}
          height={500}
          className="w-80 h-full mx-auto"
          priority
        />
        <div className="w-full flex justify-center pt-4">
          <Button
            variant={"outline"}
            className="bg-transparent border-foreground border-4 w-44"
            asChild
          >
            <Link href={"/"}>
              <b>KEMBALI KE ACR</b>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
