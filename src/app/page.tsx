import Head from 'next/head'
import { format } from 'date-fns'
import { getData } from './_actions/getData'
import { getDistrictName } from '@/_services/localeService'

const formatPrice = (price: number) => {
  const divider = price >= 100000 ? 1000 : 100

  const priceRounded = Math.round(price / divider) * divider

  return priceRounded
}

export default async function Home() {
  const data = await getData()

  return (
    <>
      <Head>
        <title>Estate Monitor - Երևանում անշարժ գույքի գների մոնիթորինգ</title>
        <meta name="description" content="Անշարժ գույքի գներ Երևանում" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container mx-auto px-4 py-16 ">
          <header className="mb-8 text-white">
            <h1 className="mb-8 text-4xl leading-10 tracking-tight text-white">
              Բնակարանների վաճառքի և վարձակալության միջին գները{' '}
              <span className="text-primary">Երևանում</span>
            </h1>
            <div className="flex flex-row justify-between">
              <h2 className="text-xl">
                {format(data.startDate, 'dd.MM.yyyy')} -{' '}
                {format(data.endDate, 'dd.MM.yyyy')}
              </h2>
            </div>
          </header>
          <section className="w-full text-white">
            <div className="overflow-hidden rounded bg-white text-gray-600 shadow-md">
              <table className="w-full divide-y divide-gray-300 text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500">
                      Վարչական շրջան
                    </th>
                    <th className="w-1/4 px-4 py-3.5 text-right text-xs font-semibold text-gray-500">
                      <div>Միջին վաճառքի գին</div>
                      Դրամ/1քմ
                    </th>
                    <th className="w-1/4 px-4 py-3.5 text-right text-xs font-semibold text-gray-500 ">
                      <div>Միջին վարձակալության գին</div>
                      Դրամ/1քմ
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 ">
                      <div>Վաճառքի հայտարարությունների քանակ</div>
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-gray-500 ">
                      <div>Վարձակալության հայտարարությունների քանակ</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data.items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? undefined : 'bg-gray-100'}
                    >
                      <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                        {getDistrictName(item.district)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right text-sm text-gray-500">
                        {formatPrice(item.sellPricePerMeterAmd)} AMD
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right text-sm text-gray-500">
                        {formatPrice(item.rentPricePerMeterAmd)} AMD
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right text-sm text-gray-500">
                        {item.countSellItems}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right text-sm text-gray-500">
                        {item.countRentItems}
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500 text-right">
                          { Math.round(10000 * (item.rentPricePerMeterAmd / item.sellPricePerMeterAmd)) / 10000}
                        </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="bg-slate-50  p-4 text-xs text-slate-400 ">
                {format(data.startDate, 'dd.MM.yyyy')} -{' '}
                {format(data.endDate, 'dd.MM.yyyy')} տվյալները հիմնված են{' '}
                {data.countRentItems} վարձակալության և {data.countSellItems}{' '}
                վաճառքի հայտարարություն վրա բաց աղբյուրներից տեղադրված այս
                ժամանակահատվածում
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
