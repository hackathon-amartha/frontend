import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FAQ } from '@/components/FAQ';
import { Button } from '@/components/ui/button';

export function AmarthaLinkPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <Image 
        src="/amartha-link/rectangle.svg"
        alt="Rectangle"
        width={0}
        height={0}
        className="size-auto absolute top-0 w-full"
      />
      <Image 
        src="/amartha-link/ellipse.svg"
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
          Amartha Link
        </p>
      </div>

      <div className='z-10 mt-8 px-4'>
        <p className='text-2xl text-white font-bold text-center'>
          Semua bisa jualan, <br /> untungnya sampai jutaan
        </p>

        <p className='text-sm font-medium text-center text-white mt-4'>
          Dapatkan keuntungan <br />dengan menjual produk digital
        </p>

        <Image
          src="/amartha-link/user-home.svg"
          alt="Money Icon"
          width={0}
          height={0}
          className="size-auto mx-auto my-5"
        />

        <div className='bg-white p-3 flex flex-col gap-4 rounded-[20px] drop-shadow-xl mt-16'>
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Keuntungan menjadi AmarthaLink:
          </p>

          <div className="flex flex-col gap-5">
            <div className='flex flex-row gap-4 items-center'>
              <Image
                src="/amartha-link/money-icon.svg"
                alt="Hands Icon"
                width={45}
                height={45}
              />
              <div className='flex flex-col text-[#853491]'>
                <p className='text-sm font-bold tracking-[.2px]'>
                  Kesempatan untung jutaan
                </p>
                <p className='text-xs tracking-[.2px]'>
                  Dapatkan komisi hingga jutaan per bulan dengan berjualan produk digital.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className='flex flex-row gap-4 items-center'>
              <Image
                src="/amartha-link/money-bulb-icon.svg"
                alt="Money Bulb Icon"
                width={45}
                height={45}
              />
              <div className='flex flex-col text-[#853491]'>
                <p className='text-sm font-bold tracking-[.2px]'>
                  Harga produk digital murah
                </p>
                <p className='text-xs tracking-[.2px]'>
                  Semua produk tersedia dengan harga murah, sehingga menarik banyak pembeli.
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col gap-4 items-center my-4'> 
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Produk Yang Tersedia
          </p>

          <div className='border border-[#853491] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px #853491' }}>
            <p className='text-xs text-[#853491]'>
              Pulsa & Paket Data
            </p>
          </div>
          <div className='border border-[#853491] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px #853491' }}>
            <p className='text-xs text-[#853491]'>
              Bayar Tagihan dan Pascabayar
            </p>
          </div>
          <div className='border border-[#853491] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px #853491' }}>
            <p className='text-xs text-[#853491]'>
              Token Listrik
            </p>
          </div>
          <div className='border border-[#853491] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px #853491' }}>
            <p className='text-xs text-[#853491]'>
              Token Listrik
            </p>
          </div>
          <div className='border border-[#853491] rounded-[20px] text-center flex items-center justify-center py-1 w-56' style={{ boxShadow: '0px 0px 10px 0.5px #853491' }}>
            <p className='text-xs text-[#853491]'>
              Top Up E-wallet & E-money
            </p>
          </div>
        </div>

        <div className='bg-white p-3 flex flex-col gap-4 rounded-[20px] drop-shadow-xl mt-4'>
          <p className='text-sm text-[#853491] font-bold tracking-[.2px]'>
            Sering ditanyakan
          </p>

          <FAQ type="amarthalink" />
        </div>

        <div className="mt-6 mb-8">
          <Button
            className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium w-full"
          >
            Lanjut Investasi di Celengan
          </Button>
        </div>
      </div>
    </div>
  );
}
