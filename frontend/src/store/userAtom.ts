import { atom } from "recoil"

const userAtom = atom({
    key:'User',
    default:{
        id:'',
        email:'',
        name:''
    }
})

export default userAtom;
