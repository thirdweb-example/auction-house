import { AuctionListing, Marketplace, Offer } from "@thirdweb-dev/sdk";
import { useState, useEffect } from "react";
import truncateAddress from "../lib/truncateAddress";

type Props = {
  listing: AuctionListing;
  marketplace: Marketplace;
};

export default function CurrentHighestBidArea({ listing, marketplace }: Props) {
  const [loadingHighestBid, setLoadingHighestBid] = useState(true);
  const [highestBid, setHighestBid] = useState<Offer>();

  useEffect(() => {
    async function checkHighestBid() {
      const currentWinningBid = await marketplace.auction.getWinningBid(
        listing.id
      );

      if (currentWinningBid) {
        setHighestBid(currentWinningBid);
      }

      setLoadingHighestBid(false);
    }

    checkHighestBid();
  }, [listing, marketplace]);

  if (loadingHighestBid) {
    return <p>Loading highest bid...</p>;
  }

  if (!highestBid) {
    return <p>No bids yet.</p>;
  }

  return (
    <p>
      Highest Bid:{" "}
      <b>
        {highestBid?.currencyValue?.displayValue}{" "}
        {highestBid?.currencyValue?.symbol}
      </b>
      {highestBid ? " by " : ""}
      <b>{truncateAddress(highestBid?.buyerAddress)}</b>
    </p>
  );
}
