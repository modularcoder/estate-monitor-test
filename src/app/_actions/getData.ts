import { getISOWeek, getMonth, startOfMonth, endOfMonth, sub, subMonths, format } from 'date-fns'
import { type District } from '@/_types'
import { prisma } from '@/db'

type DataItemRent = {
  district: District,
  countRentItems: number,
  rentPricePerMeterUsd: number,
  rentPricePerMeterAmd: number,
}

type DataItemSell = {
  district: District,
  countSellItems: number,
  sellPricePerMeterUsd: number
  sellPricePerMeterAmd: number,
}

type DataItem = DataItemRent & DataItemSell

type Data = {
  startDate: Date,
  endDate: Date,
  countRentItems: number,
  countSellItems: number,
  items: DataItem[]
}

export async function getData() : Promise<Data> {
  'use server';

  const todayDate = new Date().getDate()

  let startDate = startOfMonth(new Date());
  let endDate = endOfMonth(new Date());

  // Month just started, show previous months
  if (todayDate < 7) {
    startDate = subMonths(startDate, 1)
    endDate = subMonths(endDate, 1)
  }

  const rentData: DataItemRent[] = await prisma.$queryRaw`
    SELECT
      ListingApartment.district,
      COUNT(*) as countRentItems,
      AVG(ListingApartment.statPricePerMeterUsd) as rentPricePerMeterUsd,
      AVG(ListingApartment.statPricePerMeterAmd) as rentPricePerMeterAmd
    FROM
      ListingApartment
    WHERE
      ListingApartment.type= 'RENT' AND
      ListingApartment.createdAt >= ${startDate} AND
      ListingApartment.createdAt <= ${endDate}
    GROUP BY
      ListingApartment.district
    `

  console.log('rendData', rentData)

  const sellData: DataItemSell[] = await prisma.$queryRaw`
    SELECT
      ListingApartment.district,
      COUNT(*) as countSellItems,
      AVG(ListingApartment.statPricePerMeterUsd) as sellPricePerMeterUsd,
      AVG(ListingApartment.statPricePerMeterAmd) as sellPricePerMeterAmd
    FROM
      ListingApartment
    WHERE
      ListingApartment.type= 'SELL' AND
      ListingApartment.createdAt >= ${startDate} AND
      ListingApartment.createdAt <= ${endDate}
    GROUP BY
      ListingApartment.district
    `

  let countRentItems = 0;
  let countSellItems = 0;

  const rentDataByDistrict = rentData.reduce((agg: { [key: string]: DataItemRent }, item) => {
    item.countRentItems = Number(item.countRentItems)
    agg[item.district] = item

    countRentItems +=  Number(item.countRentItems);

    return agg;
  }, {})

  const sellDataByDistrict = sellData.reduce((agg: { [key: string]: DataItemSell }, item) => {
    item.countSellItems = Number(item.countSellItems)
    agg[item.district] = item

    countSellItems += Number(item.countSellItems);

    return agg;
  }, {})


  const items = Object.keys(rentDataByDistrict).map(key => {
    return {
      ...rentDataByDistrict[key],
      ...sellDataByDistrict[key]
    }
  })


  return {
    startDate,
    endDate,
    countRentItems,
    countSellItems,
    items,
  } as Data
}
