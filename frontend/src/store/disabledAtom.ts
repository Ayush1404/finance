import { atom } from "recoil"

const disabledAtom = atom<boolean>({
    key:'disabled',
    default:false
})

export default disabledAtom;
