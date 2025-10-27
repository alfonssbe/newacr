import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const blackLogos: string[] = [
    'https://mail.google.com/mail/?view=cm&fs=1&to=legacyspeaker01@gmail.com'
  ,
    'https://www.facebook.com/acrspeakers/?locale=id_ID'
  ,
    'https://wa.me/6281231833504?text='
  ,
    'https://www.instagram.com/acrspeaker?igsh=dW9pdjBrYnUzbHlh'
  ,
    'https://youtube.com/@acrspeaker-rhymeproaudio?si=jABUOuZOZV6axnPt'
];

const blackLogosImage: string[] = [
  ''
,
  '/images/acr/findus/facebook_black_bg.webp'
,
  '/images/acr/findus/whatsapp_black_bg.webp'
,
  '/images/acr/findus/instagram_black_bg.webp'
,
  '/images/acr/findus/youtube_black_bg.webp'
];

const whiteLogos: string[] = [
    'https://mail.google.com/mail/?view=cm&fs=1&to=legacyspeaker01@gmail.com'
  ,
    'https://www.facebook.com/acrspeakers/?locale=id_ID'
  ,
    'https://wa.me/6281231833504?text='
  ,
    'https://www.instagram.com/acrspeaker?igsh=dW9pdjBrYnUzbHlh'
  ,
    'https://youtube.com/@acrspeaker-rhymeproaudio?si=jABUOuZOZV6axnPt'
  ,
];

const whiteLogosImage: string[] = [
  ''
,
  '/images/acr/findus/facebook_white_bg.webp'
,
  '/images/acr/findus/whatsapp_white_bg.webp'
,
  '/images/acr/findus/instagram_white_bg.webp'
,
  '/images/acr/findus/youtube_white_bg.webp'
];

type PropType = {
  scrolled: boolean
  type: string
}

export const FindUs: React.FC<PropType> = (props) => {
  const { scrolled, type } = props
  const t = useTranslations('Distributors Home');

  return (
    <>
      <div className={`flex gap-6 items-center ${type==="footer" ?'justify-end' :'justify-start'} `}>
        {!scrolled?
        blackLogos.map((logo, index) => (
          (index!=0) &&
          <div key={index}>
            <Link target='_blank' href={index === 2 ? logo.concat(t('distributors-whatsapp-placeholder')) : logo} className={`flex items-center`}>
            <Image src={blackLogosImage[index].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${blackLogosImage[index]}` : blackLogosImage[index]} alt={index.toString()} width={30} height={30}/> 
            {/* {index==0 ? 
                <>
                  <MailIcon size={30} className='text-background hover:text-primary'/>
                </> 
              : 
              index==1 ?  
                <>
                  <FacebookIcon size={30} className='text-background hover:text-primary'/>
                </>
              : 
              index==2 ?  
                <>
                  <Image src={blackLogosImage[index].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${blackLogosImage[index]}` : blackLogosImage[index]} alt="Facebook" width={30} height={30}/> 
                </> 
              : 
              index==3 ? 
                <>
                  <InstagramIcon size={30} className='text-background hover:text-primary'/>
                </>  
              : 
              index==4 ? 
                <>
                  <YoutubeIcon size={30} className='text-background hover:text-primary'/>
                </>  
              : 
                <></>} */}
            </Link>
          </div>
        ))
        :
        whiteLogos.map((logo, index) => (
          (index!=0) &&
          <div key={index}>
            <Link 
              target="_blank" 
              href={index === 2 ? logo.concat(t('distributors-whatsapp-placeholder')) : logo}
              className="flex items-center"
            >
            <Image src={whiteLogosImage[index].startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${whiteLogosImage[index]}` : whiteLogosImage[index]} alt={index.toString()} width={30} height={30}/> 
              {/* {index==0 ? 
                <>
                  <MailIcon size={30} className='text-black hover:text-primary'/>
                </> 
              : 
              index==1 ?  
                <>
                  <FacebookIcon size={30} className='text-black hover:text-primary'/>
                </>
              : 
              index==2 ?  
                <>
                  <PhoneIcon size={30} className='text-black hover:text-primary'/>
                </> 
              : 
              index==3 ? 
                <>
                  <InstagramIcon size={30} className='text-black hover:text-primary'/>
                </>  
              : 
              index==4 ? 
                <>
                  <YoutubeIcon size={30} className='text-black hover:text-primary'/>
                </>  
              : 
                <></>
                } */}
            </Link>
          </div>
        ))       
      }
      </div>
    </>
  );
}
