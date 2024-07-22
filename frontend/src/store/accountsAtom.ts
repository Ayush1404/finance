import { atom } from "recoil"
import { Account } from "../components/tables/accounts/columns";

const accountsAtom = atom<Account[]>({
    key:'Accounts',
    default:[]
})

export default accountsAtom;
