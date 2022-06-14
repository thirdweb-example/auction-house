// This component checks to see if there is a bid already made on the auction.

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { AuctionListing, Marketplace } from "@thirdweb-dev/sdk";

type Props = {
  listing: AuctionListing;
  marketplace: Marketplace;
};

export default function MinimumBidArea({ listing, marketplace }: Props) {
  const [minimumPrice, setMinimumPrice] = useState("");

  useEffect(() => {
    async function calculateLowestBidPrice() {
      const currentWinningBid = await marketplace.auction.getWinningBid(
        listing.id
      );

      if (currentWinningBid) {
        // The percentage higher the new bid must be than the current winning bid
        const bidBufferBps = await marketplace.getBidBufferBps();

        const currentPrice = parseFloat(
          ethers.utils.formatEther(currentWinningBid.pricePerToken)
        );

        const bidBufferMultipler = bidBufferBps.toNumber() / 100 / 100;

        // Take in 0.05 and 0.1 and end up with 0.105
        const bidBuffer = currentPrice * bidBufferMultipler;

        // The new bid must be at least the current winning bid + the bid buffer
        const newBidPrice = currentPrice + bidBuffer;

        setMinimumPrice(newBidPrice.toFixed(6));
      } else {
        setMinimumPrice(listing.reservePriceCurrencyValuePerToken.displayValue);
      }
    }

    calculateLowestBidPrice();
  }, [listing, marketplace]);

  return (
    <p>
      Minimum Bid:{" "}
      <b>
        {minimumPrice} {listing.reservePriceCurrencyValuePerToken.symbol}
      </b>
    </p>
  );
}
