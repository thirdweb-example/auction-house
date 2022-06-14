import { Magic } from "magic-sdk";

export default function initMagic() {
  // Setting network to localhost blockchain
  return new Magic("pk_live_051F0E8562DFCD48", {
    network: {
      rpcUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/5XZxhplSa57M8sBDtVtcQ-zvPzNg4lRN", // Your own node URL
      chainId: 80001, // Your own node's chainId
    },
  });
}
