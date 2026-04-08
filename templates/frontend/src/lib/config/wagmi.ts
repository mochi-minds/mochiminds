import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { etherlinkShadownet, etherlinkMainnet, ETHERLINK } from "./etherlink";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const transports = {
  [etherlinkShadownet.id]: http(etherlinkShadownet.rpcUrls.default.http[0]),
  [etherlinkMainnet.id]: http(etherlinkMainnet.rpcUrls.default.http[0]),
};

export const config = projectId
  ? getDefaultConfig({
      appName: "MochiMinds",
      projectId,
      chains: [ETHERLINK],
      transports,
    })
  : createConfig({
      chains: [ETHERLINK],
      connectors: [injected()],
      transports,
      ssr: true,
    });
