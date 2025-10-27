"use client"

import axios, { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Specification } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/app/admin/components/ui/heading"
import { Label } from "@/app/admin/components/ui/label"
import { Textarea } from "@/app/admin/components/ui/textarea"
import Link from "next/link"


interface SpecFormProps {
  initialData: Specification | null,
  product_name: string,
  product_isSparepart: boolean
};

export const SpecForm: React.FC<SpecFormProps> = ({
  initialData, product_name, product_isSparepart
}) => {
  const [spec, setSpec] = useState<Specification>();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit specification (Do not add units)' : 'Create specification (Do not add units)';
  const description = initialData ? `For ${product_name}` : 'Add a new specification';
  const toastMessage = initialData ? 'Specification updated.' : 'Specification created.';
  const action = initialData ? 'Save changes' : 'Create';


  useEffect(() => {
    if(initialData){
      setSpec(initialData)
    }
   } , [initialData]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const temp : Specification = {
      id: "",
      // @ts-ignore
      diameter_speaker: event.target[0].value,
      // @ts-ignore
      daya_maksimum: event.target[1].value,
      // @ts-ignore
      lebar_daerah_frekuensi: event.target[2].value,
      // @ts-ignore
      spl: event.target[3].value,
      // @ts-ignore
      medan_magnet: event.target[4].value,
      // @ts-ignore
      berat_magnet: event.target[5].value,
      // @ts-ignore
      voice_coil_diameter: event.target[6].value,
      // @ts-ignore
      impedansi: event.target[7].value,
      // @ts-ignore
      nominal_power_handling: event.target[8].value,
      // @ts-ignore
      program_power: event.target[9].value,
      // @ts-ignore
      voice_coil_material: event.target[10].value,
      // @ts-ignore
      berat_speaker: event.target[11].value,
      // @ts-ignore
      diameter_throat: event.target[12].value,
      // @ts-ignore
      dc_resistance: event.target[13].value,
      // @ts-ignore
      former_material: event.target[14].value,
      // @ts-ignore
      diaphragm_material: event.target[15].value,
      // @ts-ignore
      bahan_magnet: event.target[16].value,
      // @ts-ignore
      recommended_crossover: event.target[17].value,
      // @ts-ignore
      diameter_cone_efektif: event.target[18].value,
      // @ts-ignore
      custom_note: event.target[19].value,
      // @ts-ignore
      deskripsi_sparepart: event.target[20].value,
      // @ts-ignore
      isi_per_dus_sparepart: event.target[21].value,
      productId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    try {
      setLoading(true);
      let response: AxiosResponse;
      if (initialData) {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_UPDATE_SPECIFICATION}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        const API_EDITED3 = API_EDITED2.replace('{id}', initialData.id)
        response = await axios.patch(API_EDITED3, temp);
      } else {
        const API=`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}${process.env.NEXT_PUBLIC_ADMIN_ADD_SPECIFICATION}`;
        //@ts-ignore
        const API_EDITED = API.replace('{brandId}', params.brandId)
        //@ts-ignore
        const API_EDITED2 = API_EDITED.replace('{productId}', params.productId)
        response = await axios.post(API_EDITED2, temp);
      }
      if(response.data === 'expired_session'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Session expired, please login again");
      }
      else if(response.data === 'invalid_token'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("API Token Invalid, please login again");
      }
      else if(response.data === 'unauthorized'){
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/`);
        router.refresh();
        toast.error("Unauthorized!");
      }
      else{
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_FOLDER_URL}/${params.brandId}/products`);
        router.refresh();
        toast.success(toastMessage);
      }
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
        <form onSubmit={onSubmit} className="space-y-4 w-full">
          <div className="grid md:grid-cols-3 grid-cols-1 md:gap-8 gap-4 border rounded-lg p-4 shadow-lg">
            <div>
            <Label htmlFor="diameter_speaker" className="font-bold">Diameter speaker (inch/mm)</Label>
            <Input disabled={loading} id="diameter_speaker" placeholder="Diameter Speaker" defaultValue={spec?.diameter_speaker? spec.diameter_speaker : ""} />
            </div>
            <div>
            <Label htmlFor="daya_maksimum" className="font-bold">Daya maksimum (Watt)</Label>
            <Input disabled={loading} id="daya_maksimum" placeholder="Daya maksimum" defaultValue={spec?.daya_maksimum? spec.daya_maksimum : ""} />
            </div>
            <div>
            <Label htmlFor="lebar_daerah_frekuensi" className="font-bold">Lebar frekuensi (Hz)</Label>
            <Input disabled={loading} id="lebar_daerah_frekuensi" placeholder="Lebar frekuensi" defaultValue={spec?.lebar_daerah_frekuensi? spec.lebar_daerah_frekuensi : ""} />
            </div>
            <div>
            <Label htmlFor="spl" className="font-bold">SPL (2.83 V / 1 m) (dB)</Label>
            <Input disabled={loading} id="spl" placeholder="SPL (2.83 V / 1 m)" defaultValue={spec?.spl? spec.spl : ""} />
            </div>
            <div>
            <Label htmlFor="medan_magnet" className="font-bold">Medan magnet (T)</Label>
            <Input disabled={loading} id="medan_magnet" placeholder="Medan magnet" defaultValue={spec?.medan_magnet? spec.medan_magnet : ""} />
            </div>
            <div>
            <Label htmlFor="berat_magnet" className="font-bold">Berat magnet (Kg/Oz)</Label>
            <Input disabled={loading} id="berat_magnet" placeholder="Berat magnet" defaultValue={spec?.berat_magnet? spec.berat_magnet : ""} />
            </div>
            <div>
            <Label htmlFor="voice_coil_diameter" className="font-bold">Voice coil diameter (mm)</Label>
            <Input disabled={loading} id="voice_coil_diameter" placeholder="Voice coil diameter" defaultValue={spec?.voice_coil_diameter? spec.voice_coil_diameter : ""} />
            </div>
            <div>
            <Label htmlFor="impedansi" className="font-bold">Impedansi (Ω)</Label>
            <Input disabled={loading} id="impedansi" placeholder="Impedansi" defaultValue={spec?.impedansi? spec.impedansi : ""} />
            </div>
            <div>
            <Label htmlFor="nominal_power_handling" className="font-bold">Nominal power handling (Watt)</Label>
            <Input disabled={loading} id="nominal_power_handling" placeholder="Nominal power handling" defaultValue={spec?.nominal_power_handling? spec.nominal_power_handling : ""} />
            </div>
            <div>
            <Label htmlFor="program_power" className="font-bold">Program power (Watt)</Label>
            <Input disabled={loading} id="program_power" placeholder="Program power" defaultValue={spec?.program_power? spec.program_power : ""} />
            </div>
            <div>
            <Label htmlFor="voice_coil_material" className="font-bold">Voice coil material</Label>
            <Input disabled={loading} id="voice_coil_material" placeholder="Voice coil material" defaultValue={spec?.voice_coil_material? spec.voice_coil_material : ""} />
            </div>
            <div>
            <Label htmlFor="berat_speaker" className="font-bold">Berat speaker (system) (Kg)</Label>
            <Input disabled={loading} id="berat_speaker" placeholder="Berat speaker" defaultValue={spec?.berat_speaker? spec.berat_speaker : ""} />
            </div>
            

            <div>
            <Label htmlFor="diameter_throat" className="font-bold">Diameter Throat (inch)</Label>
            <Input disabled={loading} id="diameter_throat" placeholder="Diameter Throat" defaultValue={spec?.diameter_throat? spec.diameter_throat : ""} />
            </div>
            <div>
            <Label htmlFor="dc_resistance" className="font-bold">DC Resistance, Re (Ω)</Label>
            <Input disabled={loading} id="dc_resistance" placeholder="DC Resistance" defaultValue={spec?.dc_resistance? spec.dc_resistance : ""} />
            </div>
            <div>
            <Label htmlFor="former_material" className="font-bold">Former Material</Label>
            <Input disabled={loading} id="former_material" placeholder="Former Material" defaultValue={spec?.former_material? spec.former_material : ""} />
            </div>
            <div>
            <Label htmlFor="diaphragm_material" className="font-bold">Diaphragm Material</Label>
            <Input disabled={loading} id="diaphragm_material" placeholder="Diaphragm Material" defaultValue={spec?.diaphragm_material? spec.diaphragm_material : ""} />
            </div>
            <div>
            <Label htmlFor="bahan_magnet" className="font-bold">Bahan Magnet</Label>
            <Input disabled={loading} id="bahan_magnet" placeholder="Bahan Magnet" defaultValue={spec?.bahan_magnet? spec.bahan_magnet : ""} />
            </div>
            <div>
            <Label htmlFor="recommended_crossover" className="font-bold">Recommended Crossover (Hz)</Label>
            <Input disabled={loading} id="recommended_crossover" placeholder="Recommended Crossover" defaultValue={spec?.recommended_crossover? spec.recommended_crossover : ""} />
            </div>
            <div>
            <Label htmlFor="diameter_cone_efektif" className="font-bold">Diameter Cone Efektif</Label>
            <Input disabled={loading} id="diameter_cone_efektif" placeholder="Diameter Cone Efektif" defaultValue={spec?.diameter_cone_efektif? spec.diameter_cone_efektif : ""} />
            </div>


            <div>
              <Label htmlFor="custom_note" className="font-bold">
                Custom Note{" "}
                <Link
                  href="/images/admin/custom-note.png"
                  target="_blank"
                  className="text-primary hover:underline font-normal"
                >
                  Click here for placement.
                </Link>
              </Label>
              <Textarea
                disabled={loading}
                id="custom_note"
                placeholder="custom note"
                defaultValue={spec?.custom_note ?? ""}
              />
            </div>

            <div>
            <Label htmlFor="deskripsi_sparepart" className="font-bold">Deskripsi (
              Khusus Sparepart)</Label>
            <Input disabled={loading || !product_isSparepart} id="deskripsi_sparepart" placeholder="deskripsi (khusus sparepart)" defaultValue={spec?.deskripsi_sparepart? spec.deskripsi_sparepart : ""} />
            </div>
            <div>
            <Label htmlFor="isi_per_dus_sparepart" className="font-bold">Isi / dus (Khusus Sparepart)</Label>
            <Input disabled={loading || !product_isSparepart} id="isi_per_dus_sparepart" placeholder="Isi per dus (khusus sparepart)" defaultValue={spec?.isi_per_dus_sparepart? spec.isi_per_dus_sparepart : ""} />
            </div>

            </div>
          <Button disabled={loading} className="w-full flex gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors" type="submit" variant={'secondary'}>
            {action}
          </Button>
        </form>
    </>
  );
};
