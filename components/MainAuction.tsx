import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { AuctionListing, Marketplace } from "@thirdweb-dev/sdk";
import React from "react";
import BidBuyArea from "./BidBuyArea";
import CurrentHighestBidArea from "./CurrentHighestBidArea";
import MinimumBidArea from "./MinimumBidArea";
import TimeRemainingArea from "./TimeRemainingArea";
import styles from "../styles/Theme.module.css";
import truncateAddress from "../lib/truncateAddress";

type Props = {
  marketplace: Marketplace;
  listing: AuctionListing;
};

export default function MainAuction({ marketplace, listing }: Props) {
  return (
    <div className={styles.mainAuctionContainer}>
      <div>
        {/* Image */}
        <ThirdwebNftMedia metadata={listing.asset} width={"200"} />

        {/* Name */}
        <h1>{listing.asset.name}</h1>

        <p>Sold by: {truncateAddress(listing.sellerAddress)}</p>
      </div>

      <div>
        {/* Seller */}

        {/* Buyout Price */}
        <h3>
          Buyout Price: {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
          {listing.buyoutCurrencyValuePerToken.symbol}
        </h3>

        {/* Minimum Price */}
        <MinimumBidArea listing={listing} marketplace={marketplace} />

        {/* Current Highest Bid */}
        <CurrentHighestBidArea listing={listing} marketplace={marketplace} />

        {/* Time remaining */}
        <TimeRemainingArea
          // @ts-ignore
          endTime={listing.endTimeInEpochSeconds.toNumber() * 1000}
        />

        {/* Bid and Buy Buttons */}
        <BidBuyArea listing={listing} marketplace={marketplace} />
      </div>
    </div>
  );
}
