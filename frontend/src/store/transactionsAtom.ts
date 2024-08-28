import { atom } from "recoil"
import { Transaction } from "../components/tables/transactions/columns";

const transactionsAtom = atom<Transaction[]>({
    key:'Transactions',
    default:[]
})

export default transactionsAtom;
