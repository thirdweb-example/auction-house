import {
  ThirdwebNftMedia,
  useNetwork,
  useNetworkMismatch,
  useNFTDrop,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import {
  Marketplace,
  NATIVE_TOKEN_ADDRESS,
  ThirdwebSDK,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import initMagic from "../lib/initMagic";
import { ethers } from "ethers";
import styles from "../styles/Theme.module.css";

const nftDropAddress = "0x322067594DBCE69A9a9711BC393440aA5e3Aaca1";

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [marketplace, setMarketplace] = useState<Marketplace | undefined>();
  const [address, setAddress] = useState<string>(); // State to hold the address the user entered.

  console.log(address);

  const nftDrop = useNFTDrop(nftDropAddress);

  const { data: ownedNfts, isLoading } = useOwnedNFTs(nftDrop, address);

  useEffect(() => {
    (async () => {
      const magic = initMagic();
      const isLoggedIn = await magic.user.isLoggedIn();

      const magicAddress = isLoggedIn
        ? (await magic.user.getMetadata()).publicAddress
        : undefined;

      setAddress(magicAddress || undefined);

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
    })();
  }, []);

  async function createAuctionListing(
    contractAddress: string,
    tokenId: string
  ) {
    // Ensure user is on the correct network
    if (networkMismatch) {
      switchNetwork && switchNetwork(80001);
      return;
    }

    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: 1, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 14, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      router.push(`/`);
    } catch (error) {
      console.error(error);
    }
  }

  async function mint() {
    const magic = initMagic();
    const isLoggedIn = await magic.user.isLoggedIn();

    const magicAddress = isLoggedIn
      ? (await magic.user.getMetadata()).publicAddress
      : undefined;

    if (!magicAddress) {
      alert("Sign in to continue");
      return;
    }

    setAddress(magicAddress || undefined);

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);

    const signer = provider?.getSigner();

    const sdk = signer
      ? ThirdwebSDK.fromSigner(signer, "mumbai")
      : new ThirdwebSDK("mumbai");

    const nftDrop = sdk.getNFTDrop(
      "0x322067594DBCE69A9a9711BC393440aA5e3Aaca1"
    );

    console.log(nftDrop);

    const m = await nftDrop.claim(1);
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : // @ts-ignore
      ownedNfts?.length > 0 ? (
        <div className={styles.nftBoxGrid}>
          {ownedNfts?.map((nft) => (
            <div className={styles.nftBox} key={nft.metadata.id.toString()}>
              <ThirdwebNftMedia
                metadata={nft.metadata}
                className={styles.nftMedia}
              />
              <h3>{nft.metadata.name}</h3>
              <button
                className={styles.mainButton}
                onClick={() =>
                  createAuctionListing(
                    nftDropAddress,
                    nft.metadata.id.toString()
                  )
                }
              >
                List for Auction
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Looks like you don&apos;t have any NFTs.</p>
          <button onClick={() => mint()}>Mint NFT</button>
        </div>
      )}
    </div>
  );
};

export default Create;
