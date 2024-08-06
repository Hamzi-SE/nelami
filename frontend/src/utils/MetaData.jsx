import React from 'react'
import { Helmet } from 'react-helmet'

const MetaData = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta
        name="description"
        content={
          description
            ? description
            : 'Nelami is a platform where you can buy, sell, auction and bid for vehicles, properties and other items.'
        }
      />
      <meta name="keywords" content="Nelami, Buy, Sell, Auction, Bidding, Vehicles, Properties, Items" />
      <link rel="canonical" href="https://nelami.ihamza.dev/" />
    </Helmet>
  )
}

export default MetaData
