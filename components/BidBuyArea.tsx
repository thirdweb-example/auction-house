import { AuctionListing, Marketplace } from "@thirdweb-dev/sdk";
import { useState } from "react";
import styles from "../styles/Theme.module.css";

type Props = {
  listing: AuctionListing;
  marketplace: Marketplace;
};

export default function BidBuyArea({ listing, marketplace }: Props) {
  const [bidAmount, setBidAmount] = useState<string>("");

  async function bidOnListing(id: string) {
    await marketplace.auction.makeBid(id, bidAmount);
  }

  async function buyListing(id: string) {
    await marketplace.auction.buyoutListing(id);
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className={`${styles.textInput} ${styles.noGutter}`}
          style={{ width: "auto", marginRight: 10 }}
        />
        <button
          onClick={() => bidOnListing(listing.id)}
          className={styles.mainButton}
        >
          Bid
        </button>
      </div>
    </div>
  );
}
