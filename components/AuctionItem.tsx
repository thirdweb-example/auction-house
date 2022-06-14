import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { AuctionListing, Marketplace } from "@thirdweb-dev/sdk";
import styles from "../styles/Theme.module.css";

type Props = {
  listing: AuctionListing;
};

export default function AuctionItem({ listing }: Props) {
  return (
    <div className={styles.auction}>
      {/* Image */}
      <ThirdwebNftMedia metadata={listing.asset} width={"25%"} />

      {/* Name */}
      <h3>{listing.asset.name}</h3>

      <div>
        <p>Buyout Price</p>
        {/* Buyout Price */}
        <h4>
          {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
          {listing.buyoutCurrencyValuePerToken.symbol}
        </h4>
      </div>
    </div>
  );
}
