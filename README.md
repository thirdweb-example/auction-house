# Auction House with thirdweb Marketplace

## Introduction

This example uses the thirdweb [Marketplace contract](https://portal.thirdweb.com/pre-built-contracts/marketplace) to create an **auction house**.

This allows us to list NFTs for [Auction Listing](https://portal.thirdweb.com/pre-built-contracts/marketplace#creating-listings) on the marketplace
and enables others users to [place bids](https://portal.thirdweb.com/pre-built-contracts/marketplace#auction-listings) or [buyout](https://portal.thirdweb.com/pre-built-contracts/marketplace#buying-an-nft-from-a-listing) the listed NFTs.

**Check out the Demo here**: https://auction-house.thirdweb-example.com

## Tools

- [**Marketplace**](https://portal.thirdweb.com/pre-built-contracts/marketplace): List our NFTs for auction on the marketplace.
- [**React SDK**](https://docs.thirdweb.com/react): Connect to our marketplace contract using [useMarketplace](https://portal.thirdweb.com/react/react.usemarketplace) and read all the listings easily with hooks like [useActiveListings](https://docs.thirdweb.com/react.useactivelistings), then enable users to connect their wallets to make bids with [useMetamask](https://docs.thirdweb.com/react.usemetamask).

## Using This Repo

- Create a copy of this repo by running the below command:

```bash
npx thirdweb create --example auction-house
```

- Deploy your own marketplace via the [thirdweb dashboard](https://thirdweb.com/contracts)

- Configure the network you deployed in [`_app.tsx`](./pages/_app.tsx):

```jsx
// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;
```

- Run the project locally:

```bash
npm run start
```

## Guide

In this section, we'll dive into the code and explain how it works.

### Connecting to the Marketplace Smart Contract

We use the [useMarketplace](https://portal.thirdweb.com/react/react.usemarketplace) hook to connect to our marketplace smart contract with just one line of code:

```jsx
const marketplace = useMarketplace(
  "0x2f50Dd49dD0b721f08F53b417C58587df5A7188f" // your marketplace contract address here
);
```

### Reading All the Listings

We then use the [useActiveListings](https://docs.thirdweb.com/react.useactivelistings) hook to read all the listings from the marketplace.

```jsx
const { data: listings, isLoading: loadingListings } =
  useActiveListings(marketplace);
```

### Displaying Listings

On the UI, we sort the `listings` so we have the one closest to ending at the top, and map each listing into an `AuctionItem` component, with some styling for the nearest one.

```jsx
// Transform each listing to an AuctionItem component listings
listings
  .sort(
    (a, b) =>
      a.endTimeInEpochSeconds.toNumber() - b.endTimeInEpochSeconds.toNumber()
  )
  // remove first item
  .slice(1)
  .map((l) => (
    <div key={l.id}>
      <AuctionItem listing={l} marketplace={marketplace} />
    </div>
  ));
```

### Displaying Listing NFT Metadata

In the `AuctionItem` component, we render a bunch more components that we've created alongside the NFT that has been listed's metadata.

For the media of the NFT, we use the [ThirdwebNftMedia](https://portal.thirdweb.com/react/react.thirdwebnftmedia) component to render the media asset:

```jsx
<ThirdwebNftMedia metadata={listing.asset} />
```

We can get all kinds of information from the listing, like name, seller, price, etc.

```jsx
<h1>{listing.asset.name}</h1>

<p>Seller: {listing.sellerAddress}</p>

<h3>
  Buyout Price: {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
  {listing.buyoutCurrencyValuePerToken.symbol}
</h3>
```

### Showing Highest Current Bid

Inside the [CurrentHighestBidArea](./components/CurrentHighestBidArea.tsx) we check the current highest bid on the auction using [.getWinningBid](https://portal.thirdweb.com/pre-built-contracts/marketplace#winning-bid)

```jsx
const currentWinningBid = await marketplace.auction.getWinningBid(listing.id);
```

### Showing Next Minimum Bid

The way thirdweb's auctions work at a smart contract level is:

- Bids must be a certain percentage higher than the current highest bid.
- Bids that get outbid are automatically refunded to the bidder.

For example, if somebody bid `1 ETH` on an auction, and the configured [bid buffer](https://portal.thirdweb.com/pre-built-contracts/marketplace#set-bid-buffer) is `5%`, the next highest bid must be at minimum `1.05 ETH`.

We calculate this inside the [MinimumBidArea](./components/MinimumBidArea.tsx) component:

_Note: This logic will be easily accessible in the thirdweb SDK soon, so we won't have to do this complexity here._

```jsx
async function calculateLowestBidPrice() {
  const currentWinningBid = await marketplace.auction.getWinningBid(listing.id);

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
```

### Bidding

In the [BidBuyArea](./components/BidBuyArea.tsx) we handle the logic for bidding and buying the NFTs from the listings.

**Buying:**

```jsx
async function buyListing(id) {
  await marketplace.auction.buyoutListing(id, 1);
}
```

**Bidding:**

```jsx
async function bidOnListing(id) {
  await marketplace.auction.makeBid(id, bidAmount);
}
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
