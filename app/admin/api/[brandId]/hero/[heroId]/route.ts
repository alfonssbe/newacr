import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { checkAuth, checkBearerAPI, getSession } from '@/app/admin/actions';
import { Hero_Image } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  const strWithoutSatori = strBeforeSlash.replace(/SATORI/gi, '');
  return strWithoutSatori.toLowerCase()
  .replace(/\+/g, 'plus')
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '');
};

export async function GET(
  req: Request,
  props: { params: Promise<{ brandId: string, heroId: string }> }
) {
  const params = await props.params;
  try {

    if (!params.brandId) {
      return new NextResponse("brand id is required", { status: 400 });
    }

    const products = await prismadb.hero.findMany({
      where: {
        id: params.heroId
      },
      include: {
        hero_img: true
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[SINGLE_HERO_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ heroId: string, brandId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }

    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { hero_img, nameIndo, nameEnglish, featuredDescIndo, featuredDescEnglish, buttonLinkUrl, buttonLinkUrlEnglish, buttonDescIndo, buttonDescEnglish } = body;


    if (!params.heroId) {
      return new NextResponse("Hero id is required", { status: 400 });
    }

    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    if(params.heroId != 'new'){


      //HERO_IMAGE
      const heroImageOld = await prismadb.hero_Image.findMany({
        where: {
          heroId: params.heroId,
        },
      });
      let finalfoundHeroImage : Hero_Image[] = []
      heroImageOld.forEach((val) => {
        const found = hero_img.find((value: Hero_Image) => value.url === val.url);
        
        if (found && !finalfoundHeroImage.some((item) => item.url === found.url)) {
          finalfoundHeroImage.push(found);
        }
      });
      //DELETE HeroImage
      //Delete physical files
      for (const heroImg of heroImageOld) {
        const isInFinal = finalfoundHeroImage.some((item) => item.url === heroImg.url);
        if (isInFinal) continue;

        if (heroImg.url) {
          const heroImgPath = path.join(process.cwd(), heroImg.url);

          try {
            await fs.unlink(heroImgPath);
          } catch (error) {
            console.warn(`Could not delete file ${heroImg.url}:`, error);
          }
        }
      }
      //Delete oldHeroImage records
      await prismadb.hero_Image.deleteMany({
        where: {
          heroId: params.heroId,
          url: {
            notIn: finalfoundHeroImage.map((val) => val.url),
          },
        },
      });
      if (hero_img.length !== 0) {
        const creations = hero_img.map(async (value: Hero_Image) => {
          if(value !== null && value !== undefined){
            const alreadyInDB = finalfoundHeroImage.some((val) => val.url === value.url);
            if (!alreadyInDB && value.url !== '') {
              await prismadb.hero_Image.create({
                data: {
                  heroId: params.heroId,
                  url: value.url,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              });
            }
          }
        });

        await Promise.all(creations);
      }


      await prismadb.hero.update({
        where: {
          id: params.heroId,
        },
        data: {
          nameIndo,
          nameEnglish,
          slugIndo: slugify(nameIndo),
          slugEnglish: slugify(nameEnglish),
          featuredDescIndo,
          featuredDescEnglish,
          buttonDescIndo,
          buttonDescEnglish,
          buttonLinkUrl,
          buttonLinkUrlEnglish,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

     
    }
    else{
      let new_hero = await prismadb.hero.create({
        data: {
          nameIndo,
          nameEnglish,
          slugIndo: slugify(nameIndo),
          slugEnglish: slugify(nameEnglish),
          featuredDescIndo,
          featuredDescEnglish,
          buttonDescIndo,
          buttonDescEnglish,
          buttonLinkUrl,
          buttonLinkUrlEnglish,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      if(hero_img.length!=0){
        let tempImg: Hero_Image[] = []
        hero_img.map(async (value: Hero_Image, index: number) => {
          if(value.url!=''){
            let temp = await prismadb.hero_Image.create({
              data:{
                heroId: new_hero.id,
                url:value.url,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            })
            tempImg.push(temp)
          }
        })
      }
    }

    revalidatePath('')
    revalidatePath('/en')
    return NextResponse.json("success");
  } catch (error) {
    console.log('[HERO_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
  

  export async function DELETE(
    req: Request,
    props: { params: Promise<{ brandId: string, heroId: string }> }
  ) {
    const params = await props.params;
    try {
      const session = await getSession();
  
      if(!session.isLoggedIn){
        return NextResponse.json("expired_session")
      }
  
      if(!(await checkBearerAPI(session))){
        session.destroy();
        return NextResponse.json("invalid_token")
      }
  
      if (!params.heroId) {
        return new NextResponse("Hero id is required", { status: 400 });
      }
      
      if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
        return NextResponse.json("unauthorized");
      }    

      //DELETE HERO IMAGE
      const heroImages = await prismadb.hero_Image.findMany({
        where: {
          heroId: params.heroId,
        },
      });
      //Delete physical files
      for (const image of heroImages) {
        if (image.url) {
          const imagePath = path.join(process.cwd(), image.url);

          try {
            await fs.unlink(imagePath);
          } catch (error) {
            console.warn(`Could not delete file ${image.url}:`, error);
          }
        }
      }
      //Delete hero_Image records
      await prismadb.hero_Image.deleteMany({
        where: {
          heroId: params.heroId,
        },
      });
    
  
      const product = await prismadb.hero.deleteMany({
        where: {
          id: params.heroId
        },
      });

      revalidatePath('')
      revalidatePath('/en')
  
      return NextResponse.json(product);
    } catch (error) {
      console.log('[HERO_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  