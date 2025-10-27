import LogoutButtonNoBrands from '@/app/admin/components/logout-no-brands';
import Navbar from '@/app/admin/components/navbar'
import BannerUpdateObjek from '../../components/banners-update-objek';

export default async function DashboardLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ brandId: string }>
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  return (
    <>
    {params.brandId === 'undefined' ? (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center">
        <p>You have not been assigned to any brands. Please contact administrator.</p>
        <div className='pt-5'>
        <LogoutButtonNoBrands />
        </div>
      </div>
    ):(
      <div className='bg-white'>
      {/* <BannerUpdateObjek /> */}
      <Navbar />
      {children}
      </div>
    )}
    </>
  );
};
