import { AbiItem } from "web3-utils";
import { web3 } from "../web3";


const ABI = [
] as AbiItem[];
const ADDRESS = "e295cDE8F1fb4922598Ee8667D2fFc60A42bbdA1";

export const contract = new web3.eth.Contract(ABI, ADDRESS);