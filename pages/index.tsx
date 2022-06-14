import {
  AuctionListing,
  ListingType,
  Marketplace,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import AuctionItem from "../components/AuctionItem";
import styles from "../styles/Theme.module.css";
import initMagic from "../lib/initMagic";
import MainAuction from "../components/MainAuction";

function App() {
  const [marketplace, setMarketplace] = useState<Marketplace | undefined>();
  const [listings, setListings] = useState<AuctionListing[]>([]);

  useEffect(() => {
    (async () => {
      const magic = initMagic();

      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

      const signer = provider?.getSigner();

      const sdk = signer
        ? ThirdwebSDK.fromSigner(signer, "mumbai")
        : new ThirdwebSDK("mumbai");

      const mk = sdk.getMarketplace(
        "0x2f50Dd49dD0b721f08F53b417C58587df5A7188f"
      );

      setMarketplace(mk);

      const x = mk.getAddress();

      const ls = await mk.getActiveListings();

      setListings(
        ls
          .filter((l) => l.type === ListingType.Auction)
          .sort(
            (a, b) =>
              // @ts-ignore
              (a as AuctionListing).endTimeInEpochSeconds.toNumber() -
              // @ts-ignore
              (b as AuctionListing).endTimeInEpochSeconds.toNumber()
          ) as AuctionListing[]
      );
    })();
  }, []);

  if (!marketplace) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <hr />
      <div className={styles.test}>
        <>
          {/* Display the one closest to ending nice and big */}

          {listings.length > 0 && (
            <MainAuction marketplace={marketplace} listing={listings[0]} />
          )}

          <h3 className={styles.subheading}>Upcoming Auctions</h3>

          {
            // Transform each listing to an AuctionItem component listings
            listings
              // remove first item
              .slice(1)
              .map((l) => (
                <div key={l.id}>
                  <AuctionItem listing={l} />
                </div>
              ))
          }
        </>
      </div>
    </div>
  );
}

export default App;
