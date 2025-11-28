import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FAQ } from '@/components/FAQ';
export function ModalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <Image 
        src="/modal/rectangle.svg"
        alt="Rectangle"
        width={0}
        height={0}
        className="size-auto absolute top-0 w-full"
      />
      <Image 
        src="/modal/ellipse.svg"
        alt="Ellipse"
        width={0}
        height={0}
        className="size-auto absolute top-0 w-full"
      />

      <div className='flex flex-row px-3.5 py-5 z-10 items-center'>
        <Link href="/dashboard" className='text-white cursor-pointer'>
          <ArrowLeft className='size-6'/>
        </Link>

        <p className='text-2xl text-white ml-7'>
          Modal
        </p>
      </div>

      <div className='z-10 mt-8 px-4'>
        <p className='text-2xl text-white font-bold text-center'>
          Nominal tinggi, <br /> bisa diambil berkali-kali
        </p>

        <p className='text-sm font-medium text-center text-white mt-4'>
          Sekarang, pinjaman bisa diambil sesuai kebutuhan, <br />tidak perlu sekaligus
        </p>

        <Image
          src="/modal/money-icon.svg"
          alt="Money Icon"
          width={0}
          height={0}
          className="size-auto mx-auto my-2"
        />

        <div className='bg-white p-3 flex flex-col gap-4 rounded-[20px] drop-shadow-xl mt-16'>
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Keuntungan mengajukan Modal
          </p>

          <div className="flex flex-col gap-5">
            <div className='flex flex-row gap-4 items-center'>
              <Image
                src="/modal/time-slot-icon.svg"
                alt="Time Slot Icon"
                width={45}
                height={45}
              />
              <div className='flex flex-col text-[#853491]'>
                <p className='text-sm font-bold tracking-[.2px]'>
                  Pinjaman cepat diberikan
                </p>
                <p className='text-xs tracking-[.2px]'>
                  Dana akan dikirim dalam 1 hari kerja sejak pengajuan disetujui.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className='flex flex-row gap-4 items-center'>
              <Image
                src="/modal/calendar-icon.svg"
                alt="Calendar Icon"
                width={45}
                height={45}
              />
              <div className='flex flex-col text-[#853491]'>
                <p className='text-sm font-bold tracking-[.2px]'>
                  Pembayaran aman sesuai kemampuan
                </p>
                <p className='text-xs tracking-[.2px]'>
                  Baik tunai atau cicilan, pinjaman bisa Anda bayarsecara otomatis lewat Poket.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col gap-2 items-center my-4'> 
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Syarat Pengajuan
          </p>

          <div className='border border-[#49DA21] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px rgba(73, 218, 33, 0.5)' }}>
            <p className='text-xs text-[#853491]'>
              Perempuan
            </p>
          </div>
          <div className='border border-[#49DA21] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px rgba(73, 218, 33, 0.5)' }}>
            <p className='text-xs text-[#853491]'>
              Umur 18-58
            </p>
          </div>
          <div className='border border-[#49DA21] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px rgba(73, 218, 33, 0.5)' }}>
            <p className='text-xs text-[#853491]'>
              WNI
            </p>
          </div>
        </div>

        <div className='bg-white p-3 flex flex-col gap-4 rounded-[20px] drop-shadow-xl'>
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Sering Ditanyakan
          </p>

          <FAQ type="modal" />
        </div>

        <p className='text-[#126295] font-bold text-center my-12'>
          Mau tahu caranya? <br /> Minta undangan pengajuan dari karyawan <br /> Amartha terdekat
        </p>
      </div>
    </div>
  );
}
